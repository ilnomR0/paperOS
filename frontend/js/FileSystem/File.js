import { FileSystem } from "./FileSystem.js";

export class File {
    constructor(self, location, name) {

        /**
         *@type {FileSystem}
         */
        this.parent = self;
        this.location = location;
        this.name = name;
        this.handle;
        this.parentHandle;
        this.writeHandle;
    }
    static constructFromFull(self, locationFull){
        let path = FileSystem.formatLocation(locationFull).split("/");
        let name = path.pop();
        path = path.join("/");
        console.log(path, name); 
        return new File(self, path, name); 
    }
    //creates a new file handle to mess around with
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
            this.writeHandle = await this.handle.createWritable();
            
    }
    async writeData(data, options = {}) {

        this.blob = data;
        console.log(this.writeHandle);
        await this.writeHandle.write(data, options);
        await this.writeHandle.close();
    }

    async readData() {
        let data = await this.handle.getFile();
        return new Response(data, {
            headers:{"Content-Type": data.type || "application/octet-stream"}
        });
    }

    async delete() {
        this.parent.cacheFS.delete(this.location + "/" + this.name);
    }
}
