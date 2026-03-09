//# sourceURL=usr/bin/rmdir.js

let parentPath = FileSystem.formatLocation(POSH.workingDirectory + "/" + POSH.args[1]).split("/");
let childPath = parentPath.pop();
parentPath = parentPath.join("/");

let folder = await new window.sda.Folder(parentPath, childPath);
await folder.init().then(async ()=>{
    if(typeof folder != "undefined"){
        folder.delete(); 
    }else{
        throw new Error(`${POSH.args[1]}: No such folder`);
    }
});
