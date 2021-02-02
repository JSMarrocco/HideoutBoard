import * as RNFS from "react-native-fs";


export function deleteFile(filepath: string): Promise<void> {
    return new Promise((resolve, reject) =>
    {
        RNFS.exists(filepath)
            .then( (result) => {

                if(result) {
                    RNFS.unlink(filepath)
                        .then(() => {
                            console.log(`FILE ${filepath} DELETED`);
                            resolve();
                        })
                        .catch((err) => {
                            reject(err.message);
                        });
                }

            })
            .catch((err) => {
                reject(err.message);
            });
    });
}

export function readFile(fileName: string): Promise<undefined | string> {

    const filepath = `file://${RNFS.DocumentDirectoryPath}/${fileName}`;

    return new Promise((resolve, reject) =>
    {
        RNFS.exists(filepath)
            .then( (result): void  => {

                if (!result) resolve(undefined);

                RNFS.readFile(filepath, "ascii")
                    .then( (res) => resolve(res) )
                    .catch( err => {reject(err.message);} ) ;

            })
            .catch((err) => {
                reject(err.message);
            });
    });
}

export function writeFile(fileName: string, json: string): Promise<void> {

    const filepath = `file://${RNFS.DocumentDirectoryPath}/${fileName}`;

    return new Promise((resolve, reject) =>
    {

        RNFS.exists(filepath)
            .then( async (result)  => {

                // Override file
                if (result) await deleteFile(filepath);

                RNFS.writeFile(filepath, json, "ascii")
                    .then( (res) => resolve(res) )
                    .catch( err => {reject(err.message);} ) ;
            })
            .catch((err) => {
                reject(err.message);
            });
    });
}

