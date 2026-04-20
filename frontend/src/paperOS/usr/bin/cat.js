//# sourceURL=usr/bin/cat.js

class cat extends Application{
    constructor(POSH, argv){
        super({POSH, argv}, "cat")
    }
    async appExecution(POSH, argv){
        let parentPath = FileSystem.formatLocation(POSH.env.workingDir + "/" + argv[1]).split("/");
        let childPath = parentPath.pop();
        parentPath = parentPath.join("/");

        let file = await new window.sda.File(parentPath, childPath);
        await file.init().then(async ()=>{
            file = await file.readData();
        });
        if(typeof file != "undefined"){
            POSH.say(await file.text() + "\n");
        }else{
            throw new Error(`${argv[1]}: No such file or directory`);
        }
    }
}

return cat;
