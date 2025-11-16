//# sourceURL=usr/bin/cat.js

let parentPath = FileSystem.formatLocation(POSH.workingDirectory + "/" + POSH.args[1]).split("/");
let childPath = parentPath.pop();
parentPath = parentPath.join("/");

let file = await new window.sda.File(parentPath, childPath).readData();
if(typeof file != "undefined"){
    POSH.say(await file.text() + "\n");
}else{
    throw new Error(`${POSH.args[1]}: No such file or directory`);
}
