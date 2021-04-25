import { useState, useEffect, useRef } from "react";
import { Hold, HoldType } from "../components/walls/WallComponents";
import {Path2D}  from "react-native-canvas";

export const useCanvas = (): [
    React.Dispatch<React.SetStateAction<{width: number;height: number;}>>,
    React.Dispatch<React.SetStateAction<number>>,
    React.Dispatch<React.SetStateAction<Hold[]>>,
    // eslint-disable-next-line no-unused-vars
    (hold: Hold) => void,
    React.MutableRefObject<null>
] =>  {
    const canvasRef = useRef(null);
    const [canvasWidth, SetCanvasWidth] = useState<number>(0);
    const [imageDim, SetImageDim] = useState<{width: number, height: number}>({width: 0, height: 0});
    const [canvasHolds, setCanvasHolds] = useState<Hold[]>([]);


    // eslint-disable-next-line max-len
    let ctx: { clearRect: (arg0: number, arg1: number, arg2: any, arg3: any) => void; fillStyle: string; fill: (arg0: any) => void; beginPath: () => void; closePath: () => void; };
    // eslint-disable-next-line max-len
    let canvas: { width: number; height: number; getContext: (arg0: string) => { clearRect: (arg0: number, arg1: number, arg2: any, arg3: any) => void; fillStyle: string; fill: (arg0: any) => void; beginPath: () => void; closePath: () => void; }; } | null;

    useEffect(()=>{
        canvas = canvasRef.current;
        if (!canvas || canvasHolds.length === 0 || canvasWidth === 0) return;
        canvas.width = canvasWidth;
        canvas.height = canvasWidth * (4/3);

        ctx = canvas.getContext("2d");
        // clear the canvas area before rendering the coordinates held in state
        ctx.clearRect( 0, 0, canvas.width, canvas.height );

        ctx.fillStyle = "rgba(0, 0, 0, .5";
        const rectPath = new Path2D(canvas);
        rectPath.rect(0, 0, canvas.width, canvas.height);
        ctx.fill(rectPath);

        const contours: Path2D[] = [];

        canvasHolds.forEach((hold: Hold) => {
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
            contours.push(contour);

        });

        contours.forEach((c, i) => {
            const hold = canvasHolds.find(h => h.id === i);
            if (!hold) return;
            drawStroke(ctx, c, hold);
        });

    }, [canvasWidth, imageDim, canvasHolds]);

    const updateHoldStroke = (hold: Hold) => {

        const contour = new Path2D(canvas);


        hold.contour.forEach((point: { x: number; y: number; }, i: number) => {
            const nextX = canvas.width * point.x / (imageDim.height);
            const nextY = canvas.height * point.y / (imageDim.width);
            (i == 0) ? contour.moveTo(nextX, nextY) : contour.lineTo(nextX, nextY);
        });
        contour.lineTo(canvas.width * hold.contour[0].x / (imageDim.height),
            canvas.height * hold.contour[0].y / (imageDim.width));

        ctx.closePath();

        drawStroke(ctx, contour, hold);
    };

    return [ SetImageDim, SetCanvasWidth, setCanvasHolds, updateHoldStroke, canvasRef];
};

function drawStroke(ctx: any, c: Path2D, hold: Hold) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.fill(c);
    ctx.stroke(c);
    ctx.globalCompositeOperation = "source-over";
    ctx.lineWidth = 2;

    switch (hold.type) {
    case HoldType.top:
        ctx.strokeStyle = "rgba(224, 87, 255)";
        break;
    case HoldType.foot:
        ctx.strokeStyle = "rgba(255, 133, 51)";
        break;
    case HoldType.hand:
        ctx.strokeStyle = "rgba(52, 195, 235)";
        break;
    case HoldType.start:
        ctx.strokeStyle = "rgba(52, 235, 107)";
        break;
    case HoldType.neutral:
    default:
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(255, 255, 255, .6)";
        break;
    }

    ctx.stroke(c);
}

