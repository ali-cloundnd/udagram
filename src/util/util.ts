import fs from 'fs';
import Jimp = require('jimp');
import { spawn } from 'child_process';
import Debug from 'debug';

const filterDebug = Debug('util:filter');
const cannyDebug = Debug('util:canny');
const deleteDebug = Debug('util:delete');

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
            filterDebug(`Reading img from URL ${inputURL}`);
            const photo = await Jimp.read(inputURL);
            filterDebug(`Finished reading img from URL`);
            const outpath = '/tmp/filtered.'+Math.floor(Math.random() * 2000)+'.jpg';
            filterDebug(`Output path will be ${outpath}`);
            filterDebug("Processing the image...resize...quality...greyscale...");
            await photo
            .resize(256, 256) // resize
            .quality(60) // set JPEG quality
            .greyscale() // set greyscale
            .write(__dirname+outpath, (img)=>{
                filterDebug(`Processing over... Image is written to file ${__dirname+outpath}`);
                filterDebug(`Resolve the promise!`);
                resolve(__dirname+outpath);
            });
        } catch (err) {
            let msg: string = "Failed to read the prepare the image for edge detection!";
            cannyDebug(`Reject the promise: ${msg}`);
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
        cannyDebug("Going to spawn a child process to run python script...");
        const pythonProcess = spawn('python', ["src/util/script.py ", inputIMG]);
        pythonProcess.stdout.on('data', (data) => { 
            cannyDebug("Received data from stdout...");
            let path: string = data.toString();
            cannyDebug(`Python says ${data.toString()}`);
            if (path.substr(-2) === "\r\n") { // happens when using print() in Python
                cannyDebug("Trim the ending \\r\\n");
                path = path.substr(0, path.length-2);
            }
            if (path === "ERROR") {
                let msg: string = "Python process ended with error!";
                cannyDebug(`Reject the promise: ${msg}`);
                reject(new Error(msg))
            } else {
                cannyDebug(`Resolve the promise!`);
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
    deleteDebug("Going to delete files...");
    for( let file of files) {
        deleteDebug("Delete: " + file);
        fs.unlinkSync(file);
    }
    deleteDebug("Finished deleting.");
}