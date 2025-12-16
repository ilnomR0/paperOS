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

    async init(fgetOptions = {create:false}){
        const path = this.location.replace(/^\//gm, "").split("/").reverse();

            let selectedFolder = this.parent.rootDirectory;
            path.forEach(async (e)=>{
                console.log(e);
                if(e!=""){
                    selectedFolder = await selectedFolder.getDirectoryHandle(e); 
                }
            });

            this.parentHandle = selectedFolder;
            this.handle = await selectedFolder.getDirectoryHandle(this.name, fgetOptions);
        }
    async readChildren(){

    }
    async delete(){

    }
}
