//# sourceURL=usr/bin/touch.js

class touch extends Application{
    constructor(POSH, argv){
        super({POSH, argv});
    }

    async appExecution(POSH, argv){
        let parentPath = FileSystem.formatLocation(POSH.env.workingDir + "/" + argv[1]).split("/");
        let childPath = parentPath.pop();
        parentPath = parentPath.join("/");

        let file = await new window.sda.File(parentPath, childPath);
        await file.init({create:true});
    } 
}
return touch;

