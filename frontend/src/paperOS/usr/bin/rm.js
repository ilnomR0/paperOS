//# sourceURL=usr/bin/rm.js

let parentPath = FileSystem.formatLocation(POSH.workingDirectory + "/" + POSH.args[1]).split("/");
let childPath = parentPath.pop();
parentPath = parentPath.join("/");

let file = await new window.sda.File(parentPath, childPath);
await file.init().then(async ()=>{
    if(typeof file != "undefined"){
        file.delete(); 
    }else{
        throw new Error(`${POSH.args[1]}: No such file or directory`);
    }
});
