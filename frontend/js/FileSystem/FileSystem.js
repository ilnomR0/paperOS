//filesystem class. An interface for managing files within the indexedDB storage system. 

export class FileSystem {
  constructor(name){
    this.name = name;
    this.virtualFS = [];
  }

  //formatLocation. For formatting a string. For example, an input of "/usr/bin/../.." would format to "/"

  static formatLocation(location) {
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

  //from zip file. Creates a new FileSystem based off of a zip file. 

  static fromZipFile(location){
    
  }
}
