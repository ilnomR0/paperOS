//# sourceURL=usr/bin/rmdir.js
class rmdir extends Application{
    constructor(POSH, argv){
        super({POSH, argv});
    }
    async appExecution(POSH, argv){
        let parentPath = FileSystem.formatLocation(POSH.env.workingDir + "/" + argv[1]).split("/");
        let childPath = parentPath.pop();
        parentPath = parentPath.join("/");

        let folder = await new window.sda.Folder(parentPath, childPath);
        await folder.init().then(async ()=>{
            if(typeof folder != "undefined"){
                folder.delete(); 
            }else{
                throw new Error(`${argv[1]}: No such folder`);
            }
        });

    }
}

return rmdir;
