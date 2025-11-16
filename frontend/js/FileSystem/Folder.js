import { FileSystem } from "./FileSystem.js";

export class Folder {

    constructor(parent, location, name) {
        /**
         * @type {FileSystem}
         */
        this.parent = parent;
        this.location = location;
        this.name = name;
        this.contains = [];
        console.log(`attaching ${this.location}/${this.name}/ to ${this.parent.name}`);
    }

    async init(){
        let children = [];
        await new Promise((resolve, reject)=>{
            /**
             *@type {IDBTransaction}
             */
            console.log("file system", this.parent.name, this.parent);
            let objTransaction = this.parent.PFS.transaction(this.parent.name, "readwrite");
            let folder = objTransaction.objectStore(this.parent.name).get(this.location);

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
                objTransaction.objectStore(this.parent.name).add({children:[],location:FileSystem.formatLocation(`${this.location}/${this.name}`)});
                if(this.name != "/"){
                    children = e.target.result.children;
                    if(!children.includes(this.name)){
                        children.push(this.name);
                    }
                    resolve(folder.result);
                }
            }
        });
        let objStore = this.parent.PFS.transaction(this.parent.name, "readwrite").objectStore(this.parent.name);
        objStore.put({location:this.location, children}) 
    }
    async readChildren(){
        return await new Promise((resolve, reject)=>{
            let objTransaction = this.parent.PFS.transaction(this.parent.name, "readwrite");
            let folder = objTransaction.objectStore(this.parent.name).get(this.location + "/" + this.name);

            console.log(this.name);

            folder.onsuccess = e => resolve(e.target.result?.children);
            folder.onerror = e => reject(e.target.message?.error);
        });
    }
}
