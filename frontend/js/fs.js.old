export class FS {

    constructor(fileSystem) {
        /**
         * @type {IDBDatabase}
         */
        this.fileSystem = fileSystem;
        this.VFileSystem = [];



    }



    //formats the location to be pure


    /**
     * 
     * @param {string} location
     * @returns {IDBObjectStore}
     */
    formatLocation(location) {
        location = String(location).replace(/(.*\/)\//gm, "/");
            const parts = location.split("/");

            const stack = [];

            for (let i = 0; i < parts.length; i++) {

                if ((parts[i] === "" && i!=parts.length-1) || parts[i] === ".") {
                    continue;
                } else if (parts[i] === "..") {
                    if (stack.length > 0) stack.pop();
                } else {
                    stack.push(parts[i]);
                }
            }

            return "/" + stack.join("/");
        }

    //creates files in the indexedDB file system

    async createFile(location) {
        location = this.formatLocation(location);
        let fsTransaction = this.fileSystem.transaction("files", "readwrite");
        var fsObject = fsTransaction.objectStore("files");
        fsObject.put({ location, data: ""});
    }

    //deletes files in the indexedDB file system

    async delete(location){
        location = this.formatLocation(location);
        console.log(`deleting ${location}...   |   ${location} is a ${location.endsWith("/") ? "folder" : "file"}`);


        if(location.endsWith("/")){
            let files = await this.readFolder(location);
            console.log(files);
            for(let file of files){
                console.log(`| ${file.name}    |    ${file.type}`);
                console.log(location + file.name + (file.type == "folder" ? "/" : ""));
                this.deleteFile(location + file.name + (file.type == "folder" ? "/" : ""));
            }

        }

        let fsTransaction = this.fileSystem.transaction("files", "readwrite");
        var fsObject = fsTransaction.objectStore("files");
        fsObject.delete(location);

    }

    //writes to files in indexedDB file system

    async writeFile(location, data) {
        location = this.formatLocation(location);

        console.log(`writing to ${location}`);

        let fsObject = this.fileSystem.transaction("files", "readwrite").objectStore("files");
        return fsObject.put({ location, data: data });
    }

    //reads files in indexed DB file system

    async readFile(location) {

        location = this.formatLocation(location);

        return new Promise((resolve, reject) => {
            let fsObject = this.fileSystem.transaction("files", "readwrite").objectStore("files");
            let file = fsObject.get(this.formatLocation(location));

            file.onsuccess = () => {
                if (file.result) resolve(file.result.data);
                else reject(`file '${location}' not found`);
            };

            file.onerror = () => reject(file.error);

        });
    }

    //searches through folders

    async readFolder(location) {
        location = this.formatLocation(location);
        const results = [];

        return new Promise((resolve, reject) => {
            let fsObject = this.fileSystem.transaction("files", "readonly").objectStore("files");
            const cursorRequire = fsObject.openCursor();

            cursorRequire.onsuccess = (e) => {
                const cursor = e.target.result;
                if (cursor) {
                    /**
                     * wd = /asdf/
                     * stuff
                     * main.txt
                     * stuff
                     */
                    /**
                     * @type {String}
                     */
                    const path = cursor.key; 
                    if (path.startsWith(location)) {

                        const subPath = path.substring(location.length);
                        console.log(`fs.js | input location: ${location}   | path: ${path}  |  subpath: ${subPath} `);
                        if(subPath != "" && !results.includes(subPath)){
                            results.push({
                                "name" : subPath.replace(/\/.*/g, ""),
                                "type" : subPath.endsWith("/") ? "folder" : "file"
                            });
                        }
                    }
                    cursor.continue();
                } else {
                    const uniqueByName = Array.from(
                        new Map(results.map(obj => [obj.name, obj])).values()
                    );
                    console.log(`final:`, uniqueByName);
                    resolve(uniqueByName);
                }
            }
            cursorRequire.onerror = (e) => {
                reject(`Cursor error: ${e.target.error}`);
            };
        });
    }
}
