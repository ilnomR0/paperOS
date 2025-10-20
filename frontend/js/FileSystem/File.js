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
        const res = new Response(this.blob, {
            headers: { "Content-Type": this.blob.type || "application/octet-stream" }
        });
        await this.parent.cacheFS.put(this.location + "/" + this.name, res);

    }

    async readData() {
        let res = await caches.match(this.location + "/" + this.name);
        return res;
    }

    async delete() {
        this.parent.cacheFS.delete(this.location + "/" + this.name);
    }
}
