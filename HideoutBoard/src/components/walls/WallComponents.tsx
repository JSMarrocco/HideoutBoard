
export enum HoldType {
    neutral,
    start,
    hand,
    foot,
    top
}

export class Hold {
    id = 0;
    contour: [{x: number; y:number}] = [{x:0, y:0}];
    box: {x: number; y:number; w:number; h:number}  = {x:0, y:0, w:0, h:0};
    type: HoldType = HoldType.neutral;
}

export type routeDifficulty = "V0" | "V1" | "V2" | "V3" | "V4" | "V5" | "V6" | "V7" | "V8" | "V9" | "V10" | "V11" | "V12";

export class Route {
    id = "";
    name = "";
    difficulty: routeDifficulty = "V0";
    holds: Hold[] = [];
}

export class Wall {
    id = "";
    name = "";
    description = "";
    holds: Hold[] = [];
    routes: Route[] = [];
    picture: WallPicture = {width: 0, height: 0, uri: ""}
}

export interface WallPicture {
    width: number;
    height: number;
    uri: string;
  }