import { useState, useEffect, useRef } from "react";
import { Hold } from "../components/walls/WallComponents";
import {Path2D}  from "react-native-canvas";

export const useCanvas = (): [
    React.Dispatch<React.SetStateAction<{width: number;height: number;}>>,
    React.Dispatch<React.SetStateAction<number>>,
    React.Dispatch<React.SetStateAction<Hold[]>>,
    React.MutableRefObject<null>
] =>  {
    const canvasRef = useRef(null);
    const [canvasWidth, SetCanvasWidth] = useState<number>(0);
    const [imageDim, SetImageDim] = useState<{width: number, height: number}>({width: 0, height: 0});
    const [canvasHolds, setCanvasHolds] = useState<Hold[]>([]);

    useEffect(()=>{
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = canvasWidth;
        canvas.height = canvasWidth * (4/3);

        const ctx = canvas.getContext("2d");
        // clear the canvas area before rendering the coordinates held in state
        ctx.clearRect( 0, 0, canvas.width, canvas.height );

        ctx.fillStyle = "rgba(0, 0, 0, .5";
        const rectPath = new Path2D(canvas);
        rectPath.rect(0, 0, canvas.width, canvas.height);
        ctx.fill(rectPath);

        canvasHolds.forEach((hold: Hold) => {
            ctx.globalCompositeOperation = "destination-out";
            if (!hold.contour) return;
            ctx.beginPath();
            const contour = new Path2D(canvas);

            hold.contour.forEach((point: { x: number; y: number; }, i: number) => {
                const nextX = canvas.width * point.x / (imageDim.height);
                const nextY = canvas.height * point.y / (imageDim.width);
                (i == 0) ? contour.moveTo(nextX, nextY) : contour.lineTo(nextX, nextY);
            });
            contour.lineTo(canvas.width * hold.contour[0].x / (imageDim.height),
                canvas.height * hold.contour[0].y / (imageDim.width));

            ctx.closePath();
            ctx.fill(contour);
            ctx.globalCompositeOperation = "source-over";
            ctx.lineWidth = 1;
            ctx.strokeStyle = "rgba(255, 255, 255, .6)";
            ctx.stroke(contour);

        });

    });

    return [ SetImageDim, SetCanvasWidth, setCanvasHolds, canvasRef];
};
