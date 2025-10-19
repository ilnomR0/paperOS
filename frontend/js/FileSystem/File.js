import { FileSystem } from "./FileSystem.js";

export class File {
    constructor(self, location, name) {
        /**
         *@type {FileSystem}
         */
        this.parent = self;
        this.location = location;
        this.name = name;
        
    }
    async writeData(data) {
        this.blob = data;
        this.url = URL.createObjectURL(this.blob);
        
        let res = await fetch(this.url);
        await this.parent.cacheFS.put(this.location + "/" + this.name, res);
        URL.revokeObjectURL(this.url);
    }

    async readData() {
        let res = await caches.match(this.location + "/" + this.name);
        return res;
    }

    async delete() {
        this.parent.cacheFS.delete(this.location + "/" + this.name);
    }
}
