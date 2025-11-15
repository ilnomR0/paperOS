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
        await new Promise((resolve, reject)=>{
            /**
             *@type {IDBTransaction}
             */
            let objTransaction = this.parent.PFS.transaction(this.parent.name, "readwrite");
            let folder = objTransaction.objectStore(this.parent.name).get(this.location);

            console.log(folder);

            folder.onerror = ()=>{
                reject(new Error(folder.error));
            }

            folder.onsuccess = async ()=>{
                if(!folder.result && FileSystem.formatLocation(this.location) != "/"){
                    let err = new Error(`ERROR: path "${this.location}/" does not exist\nwriting to ${this.parent.name} from ${this.name}`);
                    window.reportError(err)//should exist in the vterm
                    reject(err);
                }
                objTransaction.objectStore(this.parent.name).add({children:"",location:FileSystem.formatLocation(`${this.location}/${this.name}`)});

                resolve(folder.result);
            }
        });
    }

}
