//# sourceURL=usr/bin/rm.js
class rm extends Application{
    constructor(POSH, argv){
        super({POSH, argv});
    }
    async appExecution(POSH, argv){
        let parentPath = FileSystem.formatLocation(POSH.env.workingDir + "/" + argv[1]).split("/");
        let childPath = parentPath.pop();
        parentPath = parentPath.join("/");

        let file = await new window.sda.File(parentPath, childPath);
        await file.init().then(async ()=>{
            if(typeof file != "undefined"){
                file.delete(); 
            }else{
                throw new Error(`${argv[1]}: No such file or directory`);
            }
        });
    }
}
return rm;
