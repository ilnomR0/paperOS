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
    async init(fgetOptions = {create:true}){
        const path = this.location.split("/").reverse();
        let selectedFolder = await this.parent.rootDirectory.getDirectoryHandle(path.pop());
        path.forEach(async ()=>{
            selectedFolder = await selectedFolder.getDirectoryHandle(path.pop()); 
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
                
        this.writeHandle.write(res);
                
        /*let children = [];
        await new Promise((resolve, reject)=>{
            console.log("parent node", this.parent);
            let objStore = this.parent.PFS.transaction(this.parent.name, "readwrite").objectStore(this.parent.name);
            let folder = objStore.get(this.location);

            console.log(folder);

            folder.onerror = ()=>{
                reject(new Error(folder.error));
            }

            folder.onsuccess = async (e)=>{
                if(!folder.result && FileSystem.formatLocation(this.location) != "/"){
                    let err = new Error(`ERROR: path "${this.location}/" does not exist\nwriting to ${this.parent.name} from ${this.name}`);
                    window.reportError(err)//should exist in the vterm
                    reject(err);
                }
                this.blob = data;
                const res = new Response(this.blob, {
                    headers: { "Content-Type": this.blob.type || "application/octet-stream" }
                });
                await this.parent.cacheFS.put(FileSystem.formatLocation(this.location + "/" + this.name), res);
                //update the children
                children = e.target.result.children;
                if(!children.includes({"name":this.name, "type":"File"})){
                    children.push({"name":this.name, "type":"File"});
                }
                resolve(folder.result);
            }
        });
            let objStore = this.parent.PFS.transaction(this.parent.name, "readwrite").objectStore(this.parent.name);
            objStore.put({location:this.location, children})*/ 

        
    }

    async readData() {
        let res = await caches.match(FileSystem.formatLocation(this.location + "/" + this.name));
        return res;
    }

    async delete() {
        this.parent.cacheFS.delete(this.location + "/" + this.name);
    }
}
