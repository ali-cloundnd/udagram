import fs from 'fs';
import Jimp = require('jimp');
import { spawn } from 'child_process';

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string>{
    return new Promise( async (resolve, reject) => {
        try {
            const photo = await Jimp.read(inputURL);
            const outpath = '/tmp/filtered.'+Math.floor(Math.random() * 2000)+'.jpg';
            await photo
            .resize(256, 256) // resize
            .quality(60) // set JPEG quality
            .greyscale() // set greyscale
            .write(__dirname+outpath, (img)=>{
                resolve(__dirname+outpath);
            });
        } catch (err) {
            let msg: string = "Failed to read the prepare the image for edge detection!";
            reject(new Error(msg))
        }
    });
}

// runCannyEdgeDetector
// helper function to spawn a child-process to run a python script 
//    which runs the OpenCV2 Canny Edge detector
// returns the absolute path to the local image of edges
// INPUTS
//    inputURL: string - an absolute path to a filtered image locally saved file
// RETURNS
//    an absolute path to a the edge image locally saved file
export async function runCannyEdgeDetector(inputIMG: string): Promise<string>{
    return new Promise( async (resolve, reject) => {
        const pythonProcess = spawn('python', [__dirname + "/script.py ", inputIMG]);
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