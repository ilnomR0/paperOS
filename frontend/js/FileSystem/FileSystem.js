import * as fflate from "https://cdn.skypack.dev/fflate@0.8.2?min";
import { File } from "./File.js";
import { Folder } from "./Folder.js";

/** This class is for managing files and folders within the given OPFS System*/
export class FileSystem {

    /**
     * Constructs the fileSystem with a given name. (For example SDA, SDB, etc etc).
     * @param {string} name the name of the given filesystem 
     */
    constructor(name) {
        const self = this;
        this.Folder = class extends Folder {
            constructor(location, name) {
                super(self, location, name);
            }
        }
        this.File = class extends File {
            constructor(location, name) {
                super(self, location, name);
            }
            static constructFromFull(locationFull){
                return File.constructFromFull(self, locationFull);
            }
        }

        this.name = name;
        /**
         * @type {IDBDatabase}
         */
        this.PFS;
        //create and/or open a cache system
        /**
         *@type {FileSystemDirectoryHandle}
         */
        this.rootDirectory;
    }
    /**
     *set's up the OPFS file system for the POK Kernel
     */
    async initFS(){

        this.rootDirectory = await navigator.storage.getDirectory();
        this.size = await navigator.storage.estimate();


    }
    /**
     *  Fetches something from the given URL and gives out a formatted progress system of how it is going
     *  @param {URLPattern} URL the URL that you wish to source from
     *  @param {(received: any, total: any, percentage: any, prevPercentage: any) => void} [prgUse] The callback that get's called as it reads the file
     *  @param {() => void} [prgDone] The callback that get's called when it has finished reading the file
     */
    static async progressFetch(URL, prgUse = (received, total, percentage, prevPercentage) => {
        if (prevPercentage != percentage) {
            console.log(` | reading [${received} / ${total}]     ${Math.round(percentage)}%`)
        }
    }, prgDone = () => {
        console.log(" | stream complete");
    }) {

        console.log(`progress on ${URL}:`);
        const response = await fetch(URL);
        const finalResponse = response.clone();

        if (!response.ok) {
            throw new Error(` | ERROR: ${response.status}`);
        }
        const contentLen = response.headers.get("content-length");
        if (!contentLen) {
            console.warn(" | WARNING: no content length supplied. Progress indicator *may* be ineraccurate");
        }

        const reader = response.body.getReader();
        const total = parseInt(contentLen, 10);
        let received = 0;
        let percentage = 0;
        let prevPercentage = 0;
        let data;
        let result;
        await reader.read().then(function progressTxt({ done, value }) {

            prevPercentage = percentage;
            percentage = (received / total) * 100;


            prgUse(received, total, percentage, prevPercentage, data, result)
            if (done) {
                prgDone(received, total, percentage, prevPercentage, data, result);
                data = value;
                return;
            }
            received += value.length;
            const chunk = value;
            result += chunk;
            return reader.read().then(progressTxt);
        })
        return finalResponse;

    }
    /**
     *Formats a given location down to be the true path
     *@param {string} location The given location to format
     @example let's say you wish to get the true location of "/usr/bin/../..". Call this function, and you get "/"
     */
    static formatLocation(location) {
        location = String(location).replace(/(.*\/)\//gm, "/");
            const parts = location.split("/");

            const stack = [];

            for (let i = 0; i < parts.length; i++) {

                if ((parts[i] === "" && i != parts.length - 1) || parts[i] === ".") {
                    continue;
                } else if (parts[i] === "..") {
                    if (stack.length > 0) stack.pop();
                } else {
                    stack.push(parts[i]);
                }
            }

            return "/" + stack.join("/");
        }

    /**
     *Creates a new FileSystem object from a simple zip file.
     * @param {string} location the URL to be unzipping from
     *  @param {(received: any, total: any, percentage: any, prevPercentage: any) => void} [prgUseFetch] The callback that get's called as it reads the file
     *  @param {() => void} [prgDoneFetch] The callback that get's called when it has finished reading the file
     * @param {(zipLocations: any, fileNum: any) => void} [prgWrite] 
     */
    static async fromZipFile(location, prgUseFetch, prgDoneFetch, prgWrite = (zipLocations, fileNum) => {
        console.log(`writing to indexedDB ${zipLocations[fileNum]}   [${fileNum}/${zipLocations.length}]`);
    }) {

        let zipFile = await FileSystem.progressFetch(location, prgUseFetch, prgDoneFetch).then((resolve) => {
            return resolve.arrayBuffer();
        });



        console.log(zipFile);

        /**
         *@type {Array}
         */
        zipFile = await fflate.unzipSync(new Uint8Array(zipFile));
        let zipLocations = Object.keys(zipFile);

        Object.keys(zipFile).forEach((file) => {
            let data = zipFile[file];
            let type;
            if (file.endsWith("/")) {
                type = "folder";
            } else {
                type = "file";
            }

            zipFile[file] = { data, type };
        });

        console.log(`zip file ${location}'s data: `, zipFile);

        let newFileSys = new FileSystem("sda");
        await newFileSys.initFS()
            .then(async ()=>{

                let creationTasks = [];
                let writeTasks = [];
                for (let fileNum = 0; fileNum < zipLocations.length; fileNum++) {
                    await new Promise(requestAnimationFrame);
                    prgWrite(zipLocations, fileNum, zipFile);
                    let file = zipFile[zipLocations[fileNum]];

                    let fileLocation = zipLocations[fileNum].replace(/\/$/, "").split("/");
                    let fileName = fileLocation.pop();
                    fileLocation = FileSystem.formatLocation(fileLocation.join("/"));

                    console.log(`writing ${fileName} to ${fileLocation}`);
                    
                    //creation of folders
                    if (file.type == "folder") {
                        file = new newFileSys.Folder(fileLocation, fileName);
                        creationTasks.push(file.init({create:true}));

                        
                        //creation of files
                    } else if (file.type == "file") {
                        file = new newFileSys.File(fileLocation, fileName);

                        const task = file.init({create:true}).then(async ()=>{
                            const zipDat = zipFile[zipLocations[fileNum]].data;
                            const blob = new Blob([zipDat]);

                            return file.writeData(blob);
                    });
                    creationTasks.push(task);
                    }
                }
                await Promise.all(creationTasks);
            });
        return newFileSys;
    }
}

