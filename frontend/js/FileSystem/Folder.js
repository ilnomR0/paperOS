//import { FileSystem } from "./FileSystem.js";

export class Folder {

    constructor(parent, location, name) {
        /**
         * @type {FileSystem}
         */
        this.parent = parent;
        this.location = location;
        this.name = name;
        this.contains = [];
        console.log(`attaching ${this.location}${this.name}/ to ${this.parent.name}`);
    }

}
