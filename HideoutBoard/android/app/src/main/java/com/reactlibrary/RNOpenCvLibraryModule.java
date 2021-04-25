package com.reactlibrary;

import android.content.res.AssetManager;
import android.os.Build;
import android.util.Log;

import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.google.gson.Gson;

import org.opencv.core.Core;
import org.opencv.core.Mat;
import org.opencv.core.MatOfFloat;
import org.opencv.core.MatOfInt;
import org.opencv.core.MatOfPoint;
import org.opencv.core.MatOfRect2d;
import org.opencv.core.Point;
import org.opencv.core.Rect2d;
import org.opencv.core.Scalar;
import org.opencv.core.Size;
import org.opencv.dnn.Dnn;
import org.opencv.dnn.Net;
import org.opencv.imgcodecs.Imgcodecs;
import org.opencv.imgproc.Imgproc;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class RNOpenCvLibraryModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public RNOpenCvLibraryModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;

        copyAssets();

    }

    @Override
    public String getName() {
        return "RNOpenCvLibrary";
    }

    @RequiresApi(api = Build.VERSION_CODES.N)
    @ReactMethod
    public void processWall(String imageBase64, String imageUri, Callback errorCallback, Callback successCallback) {
        try {

            String cfgFile = this.reactContext.getDataDir()+ "/yolov3_testing.cfg";
            String weightsFile =this.reactContext.getDataDir() + "/yolov3_training_last_2.weights";

            // Load Yolo Model
            Net net = Dnn.readNetFromDarknet(cfgFile, weightsFile);
            List<String> layerNames = net.getLayerNames();
            MatOfInt unConnectedLayers =  net.getUnconnectedOutLayers();
            List<java.lang.String> output_layers= new ArrayList<String>();

            for (int i : unConnectedLayers.toList()) {
                output_layers.add(layerNames.get(i - 1));
            }

            Mat imgMat =  Imgcodecs.imread(imageUri);

            Mat resizedImgMat = new Mat();
            Imgproc.resize(imgMat, resizedImgMat,  new Size(imgMat.size().width, imgMat.size().width * 4/3) , 1, 1);

            Size s = resizedImgMat.size();
            double height = s.height;
            double width = s.width;


            // Detecting objects
            System.out.println("[DEBUG] : Detecting objects Started");

            resizedImgMat = applyBrightnessContrast(resizedImgMat, 64, 64);

            Mat blob = Dnn.blobFromImage(resizedImgMat,0.00392, new Size(416, 416), new Scalar(0,0,0), true, false);

            List<Mat> outs = new ArrayList<Mat>();

            net.setInput(blob);

            net.forward(outs, output_layers);

            net = null;
            blob = null;

            List<Rect2d>  boxes= new ArrayList<Rect2d>();
            List<Float>  confidences= new ArrayList<Float>();

            for ( Mat out : outs) {
                for (int i = 0; i < out.rows(); i++)
                {
                    double confidence = out.get(i,5)[0];


                    if (confidence > 0.2) {

                        double centerX = (double) (out.get(i,0)[0] * width);
                        double centerY = (double) (out.get(i,1)[0] * height);
                        double w = (double)(out.get(i,2)[0] * width);
                        double h =(double) (out.get(i,3)[0] * height);

                        double x = (double)(centerX - (w / 2));
                        double y = (double)(centerY - (h / 2));

                        boxes.add(new Rect2d(x,  y, w ,h));
                        confidences.add((float)confidence);

                    }

                }
            }

            MatOfRect2d matBoxes = new MatOfRect2d();
            matBoxes.fromList(boxes);
            MatOfFloat matConfidences = new MatOfFloat();
            MatOfInt mnsIndexes = new MatOfInt();
            matConfidences.fromList(confidences);

            Dnn.NMSBoxes(matBoxes, matConfidences, (float)0.5, (float)0.4, mnsIndexes);

            confidences = null;
            matConfidences = null;

            List<Double[]> holds= new ArrayList<Double[]>();
            List<List<Point>> holdsContours = new ArrayList<List<Point>>();
            int step = 100;
            double maxArea = 0.0;
            int x;
            int y;
            int w;
            int h;



            for(int i: mnsIndexes.toList()) {
//                int i =  mnsIndexes.toList().get(3);
                System.gc();
                System.runFinalization();

                x = (int)boxes.get(i).x;
                y = (int)boxes.get(i).y;
                w = (int)boxes.get(i).width;
                h = (int)boxes.get(i).height;

                Mat frame;
                try{
                    frame = resizedImgMat.submat(y, y + h, x, x + w);
                }
                catch (Exception e) {
                    continue;
                }

                // TODO: Add brightness contrast
//                frame = applyBrightnessContrast(frame, 64, 64);
                System.gc();
                System.runFinalization();

                Imgproc.GaussianBlur(frame, frame, new Size(5,5), 0);
                Imgproc.cvtColor(frame, frame, Imgproc.COLOR_BGR2HSV);

                Mat color_frame = frame.submat(h/4, h - (h/4), w/4, w - (w/4));
                Scalar avgColor = Core.mean(color_frame);
                color_frame.release();

                Mat mask = new Mat();
                Scalar lower = new Scalar(avgColor.val[0] - step, avgColor.val[1] - step, avgColor.val[2] - step, avgColor.val[3]);
                Scalar upper = new Scalar(avgColor.val[0] + step, avgColor.val[1] + step, avgColor.val[2] + step, avgColor.val[3]);
                Core.inRange(frame, lower, upper, mask);
                frame.release();

                List<MatOfPoint> contours = new ArrayList<>();
                Mat hierarchy = new Mat();
                Imgproc.findContours(mask, contours, hierarchy, Imgproc.RETR_TREE, Imgproc.CHAIN_APPROX_NONE);
                mask.release();

                MatOfPoint maxContour = new MatOfPoint();
                maxContour.fromArray(new Point(x,y), new Point(x+w,y), new Point(x+w,y+h), new Point(x,y+h));

                maxArea = 0.0;
                for (MatOfPoint contour: contours) {
                    double area = Imgproc.contourArea(contour);
                    if  (area > maxArea && area <= ( w*h*0.98 ) && area >= (w*h*0.1)) {
                        maxArea = area;
                        maxContour = contour;
                    }
                }

//                List<Point> maxContourToList = maxContour.toList();
//                maxContour = null;
//                smooth_step = maxContourToList.size() / 16;
//                List<Point> smooth_contour = new ArrayList<Point>();
//                for (int batch = 0; batch < maxContourToList.size(); batch+=smooth_step ) {
//                    Point point = maxContourToList.get(batch);
//                    point.x += x;
//                    point.y += y;
//                    smooth_contour.add(point);
//                }
//                maxContourToList = null;

                List<Point> maxContourToList = maxContour.toList();
                maxContour  = null;
                int skip = 12;
                List<Point> smooth_contour = maxContourToList;
                if (maxContourToList.size() >= skip) {
                    int smooth_step = maxContourToList.size() / skip;
                    int limit = maxContourToList.size() / smooth_step + Math.min(maxContourToList.size() % smooth_step, 1);
                    smooth_contour = Stream.iterate(0, j -> j + smooth_step)
                            .limit(limit)
                            .map(maxContourToList::get)
                            .collect(Collectors.toList());
                    maxContourToList = null;
                }

                for( Point p: smooth_contour){
                    p.x += x;
                    p.y += y;
                }


                holdsContours.add(smooth_contour);
                smooth_contour = null;
                holds.add(new Double[] {boxes.get(i).x, boxes.get(i).y, boxes.get(i).width, boxes.get(i).height});

            }


            successCallback.invoke(new Gson().toJson(holds), new Gson().toJson(holdsContours));

        }
        catch (Exception e) {
            errorCallback.invoke(e.getMessage());
        }
    }


    @RequiresApi(api = Build.VERSION_CODES.N)
    private void copyAssets() {
        AssetManager assetManager = this.reactContext.getAssets();
        String[] files = null;
        try {
            files = assetManager.list("yolo");
        } catch (IOException e) {
            Log.e("tag", "Failed to get asset file list.", e);
        }

        for(String filename : files) {
            InputStream in = null;
            OutputStream out = null;
            try {
                in = assetManager.open("yolo/" + filename);
                File outFile = new File(this.reactContext.getDataDir() +"/", filename);
                if(outFile.exists()) {
                    System.out.println("[DEBUG] file " + this.reactContext.getDataDir() +"/" + filename + "already existe");
                    continue;
                }
                out = new FileOutputStream(outFile);
                copyFile(in, out);
                in.close();
                in = null;
                out.flush();
                out.close();
                out = null;
            } catch(IOException e) {
                Log.e("tag", "Failed to copy asset file: " + filename, e);
            }
        }

        System.out.println("[DEBUG] Finished coping assets to chache");
    }

    private Mat applyBrightnessContrast(Mat inputImg, int brightness, int contrast) {
        Mat buf = new Mat();
        if (contrast != 0) {
            int highlight = 255;
            int shadow = brightness;
            if (brightness < 0) {
                highlight += brightness;
                shadow = 0;
            }
            float alpha_b = (highlight - shadow) / 255;
            float gamma_b = shadow;
            Core.addWeighted(inputImg, alpha_b, inputImg, 0, gamma_b, buf);
        }
        else {
            buf= inputImg;
        }

        if (contrast != 0) {
            float f = 131*(contrast + 127)/(127*(131-contrast));
            float alpha_c = f;
            float gamma_c = 127*(1-f);

            Core.addWeighted(buf,  alpha_c, buf, 0, gamma_c, buf);
        }

        return inputImg;

    }

    private void copyFile(InputStream in, OutputStream out) throws IOException {
        byte[] buffer = new byte[1024];
        int read;
        while((read = in.read(buffer)) != -1){
            out.write(buffer, 0, read);
        }
    }
}
