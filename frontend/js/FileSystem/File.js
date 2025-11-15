import { FileSystem } from "./FileSystem.js";

export class File {
    constructor(self, location, name) {

        /**
         *@type {FileSystem}
         */
        this.parent = self;
        this.location = location;
        this.parsedLocation = location.split("/");
        this.parsedLocation.pop();
        this.name = name;
    }
    async writeData(data) {
        await new Promise((resolve, reject)=>{
            console.log(this.parent);
            let objTransaction = this.parent.PFS.transaction(this.parent.name, "readwrite");
            let folder = objTransaction.objectStore(this.parent.name).get(this.location);
            console.log(folder);

            folder.onerror = ()=>{
                reject(new Error(folder.error));
            }

            folder.onsuccess = async ()=>{
                if(!folder.result){
                    let err = new Error(`ERROR: path "${this.location}/" does not exist\nwriting to ${this.parent.name} from ${this.name}`);
                    window.reportError(err)//should exist in the vterm
                    reject(err);
                }
                this.blob = data;
                const res = new Response(this.blob, {
                    headers: { "Content-Type": this.blob.type || "application/octet-stream" }
                });
                await this.parent.cacheFS.put(this.location + "/" + this.name, res);
                resolve(folder.result);
            }
        });
    }

    async readData() {
        let res = await caches.match(this.location + "/" + this.name);
        return res;
    }

    async delete() {
        this.parent.cacheFS.delete(this.location + "/" + this.name);
    }
}
