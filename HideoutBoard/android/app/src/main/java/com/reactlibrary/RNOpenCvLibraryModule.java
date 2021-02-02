package com.reactlibrary;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.google.gson.Gson;


import android.content.Context;
import android.content.res.AssetManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;

import org.opencv.core.CvType;
import org.opencv.core.Mat;

import org.opencv.android.Utils;
import org.opencv.core.MatOfByte;
import org.opencv.core.MatOfFloat;
import org.opencv.core.MatOfInt;
import org.opencv.core.MatOfRect2d;
import org.opencv.core.Rect;
import org.opencv.core.Rect2d;
import org.opencv.core.Scalar;
import org.opencv.core.Size;
import org.opencv.dnn.Net;
import org.opencv.imgproc.Imgproc;
import org.opencv.imgcodecs.Imgcodecs;
import org.opencv.dnn.Dnn;

import android.os.Build;
import android.util.Base64;
import android.util.Log;

import androidx.annotation.RequiresApi;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;

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

    @ReactMethod
    public void checkForBlurryImage(String imageAsBase64, Callback errorCallback, Callback successCallback) {
        try {
            BitmapFactory.Options options = new BitmapFactory.Options();
            options.inDither = true;
            options.inPreferredConfig = Bitmap.Config.ARGB_8888;

            byte[] decodedString = Base64.decode(imageAsBase64, Base64.DEFAULT);
            Bitmap image = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.length);


//      Bitmap image = decodeSampledBitmapFromFile(imageurl, 2000, 2000);
            int l = CvType.CV_8UC1; //8-bit grey scale image
            Mat matImage = new Mat();
            Utils.bitmapToMat(image, matImage);
            Mat matImageGrey = new Mat();
            Imgproc.cvtColor(matImage, matImageGrey, Imgproc.COLOR_BGR2GRAY);

            Bitmap destImage;
            destImage = Bitmap.createBitmap(image);
            Mat dst2 = new Mat();
            Utils.bitmapToMat(destImage, dst2);
            Mat laplacianImage = new Mat();
            dst2.convertTo(laplacianImage, l);
            Imgproc.Laplacian(matImageGrey, laplacianImage, CvType.CV_8U);
            Mat laplacianImage8bit = new Mat();
            laplacianImage.convertTo(laplacianImage8bit, l);

            Bitmap bmp = Bitmap.createBitmap(laplacianImage8bit.cols(), laplacianImage8bit.rows(), Bitmap.Config.ARGB_8888);
            Utils.matToBitmap(laplacianImage8bit, bmp);
            int[] pixels = new int[bmp.getHeight() * bmp.getWidth()];
            bmp.getPixels(pixels, 0, bmp.getWidth(), 0, 0, bmp.getWidth(), bmp.getHeight());
            int maxLap = -16777216; // 16m
            for (int pixel : pixels) {
                if (pixel > maxLap)
                    maxLap = pixel;
            }

//            int soglia = -6118750;
            int soglia = -8118750;
            if (maxLap <= soglia) {
                System.out.println("is blur image");
            }

            successCallback.invoke(maxLap <= soglia);
        } catch (Exception e) {
            errorCallback.invoke(e.getMessage());
        }
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

            Mat blob = Dnn.blobFromImage(resizedImgMat,0.00392, new Size(416, 416), new Scalar(0,0,0), true, false);

            List<Mat> outs = new ArrayList<Mat>();

            net.setInput(blob);

            net.forward(outs, output_layers);

            System.out.println("[DEBUG] : Detecting objects Done");

            List<Rect2d>  boxes= new ArrayList<Rect2d>();
            List<Float>  confidences= new ArrayList<Float>();

            for ( Mat out : outs) {
                for (int i = 0; i < out.rows(); i++)
                {
                    double confidence = out.get(i,5)[0];


                    if (confidence > 0.1) {

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

            List<Double[]> holds= new ArrayList<Double[]>();
            for(int i: mnsIndexes.toList()) {
                holds.add(new Double[] {boxes.get(i).x, boxes.get(i).y, boxes.get(i).width, boxes.get(i).height});
            }


            successCallback.invoke(new Gson().toJson(holds));

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


    private void copyFile(InputStream in, OutputStream out) throws IOException {
        byte[] buffer = new byte[1024];
        int read;
        while((read = in.read(buffer)) != -1){
            out.write(buffer, 0, read);
        }
    }
}
