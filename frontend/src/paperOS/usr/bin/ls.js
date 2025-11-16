//# sourceURL=usr/bin/ls.js

let path = FileSystem.formatLocation(POSH.workingDirectory + (POSH.args[1] ? `/${POSH.args[1]}` : "")).split("/");
const end = path.pop();
path = path.join("/");
console.log(path);
console.log(end);
const files = await new window.sda.Folder(path, end).readChildren();
if(typeof files != 'undefined'){
    for (const file of files) {
        POSH.say(`${file}\n`);
    }
}else{
    throw new Error(`cannot access '${POSH.args[1]}': No such file or directory`);
}
