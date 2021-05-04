import React, { createContext, useEffect, useState } from "react";
import { Wall } from "../components/walls/WallComponents";
import { WALLS_DATA_FILE_NAME } from "../constants/Constants";
import { readFile, writeFile } from "../helpers/FileManaging";

export const WallsContext = createContext<{walls: Wall[], setWalls: React.Dispatch<React.SetStateAction<Wall[]>>}>({
    walls: [],
    setWalls: () => {return;}
});

export const  WallsProvider= (props: Readonly<{children?: React.ReactNode;}>): JSX.Element => {

    const [walls, setWalls] = useState<Wall[]>([]);

    useEffect(() => {
        readFile(WALLS_DATA_FILE_NAME)
            .then( (res : undefined | string ) => {
                const incomingWalls: Wall[] = (res) ? JSON.parse(res) : [];
                setWalls(incomingWalls);
            })
            .catch( (err) => console.error(err));
    }, [] );

    useEffect(() => {

        const stringifyWallsFile = JSON.stringify(walls);

        writeFile(WALLS_DATA_FILE_NAME, stringifyWallsFile)
            .then( () =>  console.log("Wall Updated"))
            .catch( (err) => console.error(err));

    }, [walls] );

    const value = {walls, setWalls};


    return (
        <WallsContext.Provider value={value}>
            {props.children}
        </WallsContext.Provider>
    );
};
