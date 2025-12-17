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
        const path = FileSystem.formatLocation(this.location).replace(/^\//gm, "").split("/");

            let selectedFolder = this.parent.rootDirectory;

        for(const loc of path){
            console.log("selected directory: ", loc);
            if(loc!=""){
                selectedFolder = await selectedFolder.getDirectoryHandle(loc);
            }
        }
            this.parentHandle = selectedFolder;
            this.handle = this.name == "" ? selectedFolder : await selectedFolder.getDirectoryHandle(this.name, fgetOptions);
        }
    async readChildren(){
        return await this.handle.values();
    }
    async delete(){

    }
}
