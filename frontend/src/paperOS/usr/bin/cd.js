let parentLocation = FileSystem.formatLocation(POSH.workingDirectory + "/"+ POSH.args[1]).split("/");
let childLocation = parentLocation.pop();
parentLocation = parentLocation.join("/");

console.log(parentLocation, childLocation);

let nextFolder = await new window.sda.Folder(parentLocation, childLocation).readChildren();
if (typeof nextFolder != "undefined") {
    POSH.workingDirectory += "/"+POSH.args[1];
    POSH.workingDirectory = FileSystem.formatLocation(POSH.workingDirectory);
}else{
    throw new Error('Folder does not exist');
}
