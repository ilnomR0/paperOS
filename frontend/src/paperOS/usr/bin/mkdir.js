//# sourceURL=usr/bin/mkdir.js

class mkdir extends Application{
    constructor(POSH, argv){
        super({POSH, argv});
    }
    async appExecution(POSH, argv){

        let parentPath = FileSystem.formatLocation(POSH.env.workingDir + "/" + argv[1]).split("/");
        let childPath = parentPath.pop();
        parentPath = parentPath.join("/");

        let folder = await new window.sda.Folder(parentPath, childPath);
        await folder.init({create:true});
    }
}

return mkdir;
