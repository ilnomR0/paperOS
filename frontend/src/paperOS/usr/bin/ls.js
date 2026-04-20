//# sourceURL=usr/bin/ls.js

class ls extends Application{
    constructor(POSH, argv){
        super({POSH, argv});
    }
    async appExecution(POSH, argv){

        let path = FileSystem.formatLocation(POSH.env.workingDir + (argv[1] ? `/${argv[1]}` : "")).split("/");
        const end = path.pop();
        path = path.join("/");
        console.log(path);
        console.log(end);
        let files = await new window.sda.Folder(path, end)
        await files.init().then(async ()=>{
            files = await files.readChildren();
        });
        console.log(files);
        if(typeof files != 'undefined'){
            for await (const file of files) {
                POSH.say(`${file.name}\n`);
            }
        }else{
            throw new Error(`cannot access '${argv[1]}': No such file or directory`);
        }
    }
}

return ls;
