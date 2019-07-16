import fs from 'fs';
import { spawn } from 'child_process';

// runCannyEdgeDetector
// helper function to spawn a child-process to run a python script 
//    which runs the OpenCV2 Canny Edge detector
// returns the absolute path to the local image of edges
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a the edge image locally saved file
export async function runCannyEdgeDetector(inputURL: string): Promise<string>{
    return new Promise( async (resolve, reject) => {
        const pythonProcess = spawn('python', [__dirname + "/script.py ", inputURL, __dirname], { shell: true });
        pythonProcess.stdout.on('data', (data) => { 
            let path: string = data.toString();
            if (path === "ERROR") {
                let msg: string = "Python process ended with error!";
                reject(new Error(msg))
            } else {
                resolve(path);
            }
        });
    });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files:Array<string>){
    for( let file of files) {
        fs.unlinkSync(file);
    }
}