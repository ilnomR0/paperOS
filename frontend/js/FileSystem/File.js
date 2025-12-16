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

        const path = this.location.replace(/^\//gm, "").split("/").reverse();

            let selectedFolder = this.parent.rootDirectory;
            path.forEach(async (e)=>{
                if(e!=""){
                    selectedFolder = await selectedFolder.getDirectoryHandle(e); 
                }
            });

            this.parentHandle = selectedFolder;
            this.handle = await selectedFolder.getFileHandle(this.name, fgetOptions);
            this.writeHandle = await this.handle.createWritable();
        }
    async writeData(data) {

        this.blob = data;
        const res = new Response(this.blob, {
            headers: { "Content-Type": this.blob.type || "application/octet-stream" }
        });
        console.log(this.writeHandle);
        await this.writeHandle.write(data);
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
