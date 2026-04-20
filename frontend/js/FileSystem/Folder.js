import { FileSystem } from "./FileSystem.js";

export class Folder {

    /**
     *The Folder object creates a reference to a given location on the OPFS (Origin Private File System) to a folder. This can be used even when a folder doesn't exist to create folders.
     @param {string} name the name of the Folder you wish to source/create
     @param {string} location The path of the folder you wish to source/create
     @param {FileSystem} parent
     */
    constructor(parent, location, name) {
        /**
         * @type {FileSystem}
         */
        this.parent = parent;
        /** @type {string} the location of the Folder object to get info from*/
        this.location = location;
        /** @type {string} the name of the Folder object to get info from*/
        this.name = name;
        console.log(`attaching ${this.location}/${this.name}/ to ${this.parent.name}`);
    }

    /**
    * Initializes the Folder object to be linked to the folder properly
    * @param {{ create: boolean; }} [fgetOptions={create:false}] The Filesystem getting options. See MDN Docs for more info
    */
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
    /**
     * Reads the children and returns a list of the handles to the given children in the form of an Iterator
     * @returns Iterator
     */
    async readChildren(){
        return this.handle.values();
    }
    /**
    * completely removes the file from the disk.
    */
    async delete(){
        this.parentHandle.removeEntry(this.name);
    }
}
