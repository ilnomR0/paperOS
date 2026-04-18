import { FileSystem } from "./FileSystem.js";

export class File {
    /**
     * @param {FileSystem} self 
     * @param {String} location the location of the given file
     * @param {String} name the name of the file
     */
    constructor(self, location, name) {

        /** @type {FileSystem}*/
        this.parent = self;
        /** @type {string} The location of the file that this file object wishes to retrieve from */
        this.location = location;
        /** @type {name} The name of the file that this file object wishes to retrieve */
        this.name = name;
        /** @type {FileSystemFileHandle} The handle reference to the file */
        this.handle;
        /** @type {FileSystemDirectoryHandle} The directory that this file exists in */
        this.parentHandle;
    }
    /**
    * This  function constructs A whole file object based off of the full path. No need to separate the location from the name.
    * @param {File} self
    * @param {String} locationFull this is where the full path goes
    */
    static constructFromFull(self, locationFull){
        let path = FileSystem.formatLocation(locationFull).split("/");
        let name = path.pop();
        path = path.join("/");
        console.log(path, name); 
        return new File(self, path, name); 
    }
    /**
    * initializes the whole File class to become useable for reading, writing, and info purposes.
    * @param {{ create: boolean; }} [fgetOptions={create:false}] These options are the same as the OPFS getHandle functions.  
    */
    async init(fgetOptions = {create:false}){
            const path = FileSystem.formatLocation(this.location).replace(/^\//gm, "").split("/");
            path.push("");
            let selectedFolder = this.parent.rootDirectory;


            for(const loc of path){
                console.log("folder to select", loc);
                try{
                if(loc != ""){
                    selectedFolder = await selectedFolder.getDirectoryHandle(loc); 
                    console.log("selected folder: ", selectedFolder);
                }
                }catch(err){
                    window.reportError(err);
                }
            }

            this.parentHandle = selectedFolder;
            this.handle = await selectedFolder.getFileHandle(this.name, fgetOptions);
            
    }
    /**
    * writes data to the file only after you have initialized the given file.
    * @param {*} data the information to write to the disk. See https://developer.mozilla.org/en-US/docs/Web/API/FileSystemWritableFileStream/write for more info on what can go here
    * @param {{}} [options={}] The options that the writing handle is to use
    */
    async writeData(data, options = {}) {
        /** @type {FileSystemWritableFileStream} The writing stream for writing to the file */
        const writeHandle = await this.handle.createWritable();
        this.blob = data;
        console.log(this.writeHandle);
        await writeHandle.write(data, options);
        await writeHandle.close();
    }

    /**
    * reads the data of the given file in the form of a response object
    */
    async readData() {
        let data = await this.handle.getFile();
        return new Response(data, {
            headers:{"Content-Type": data.type || "application/octet-stream"}
        });
    }
    /**
    * Deletes the entire file from the disk
    */
    async delete() {
        await this.writeHandle.close();
        this.parentHandle.removeEntry(this.name);
    }
}
