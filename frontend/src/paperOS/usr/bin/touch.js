//# sourceURL=usr/bin/touch.js

let parentPath = FileSystem.formatLocation(POSH.workingDirectory + "/" + POSH.args[1]).split("/");
let childPath = parentPath.pop();
parentPath = parentPath.join("/");

let file = await new window.sda.File(parentPath, childPath);
await file.init({create:true});
