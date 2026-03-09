//# sourceURL=usr/bin/mkdir.js

let parentPath = FileSystem.formatLocation(POSH.workingDirectory + "/" + POSH.args[1]).split("/");
let childPath = parentPath.pop();
parentPath = parentPath.join("/");

let folder = await new window.sda.Folder(parentPath, childPath);
await folder.init({create:true});
