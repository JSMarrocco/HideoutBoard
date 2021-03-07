
export class Hold {
    contour: [{x: number; y:number}] = [{x:0, y:0}];
    box: {x: number; y:number; w:number; h:number}  = {x:0, y:0, w:0, h:0};
}

export class Wall {
    id = "";
    name = "";
    description = "";
    holds: Hold[] = [];
    routes?: string[] = [];
    imageUri = "";
}