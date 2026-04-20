class cd extends Application{
    constructor(POSH, argv){
        super({POSH, argv});
    }
    async appExecution(POSH, argv){
        let parentLocation = FileSystem.formatLocation(POSH.env.workingDir + "/"+ argv[1]).split("/");
        let childLocation = parentLocation.pop();
        parentLocation = parentLocation.join("/");

        console.log(parentLocation, childLocation);

        let nextFolder = await new window.sda.Folder(parentLocation, childLocation);

        await nextFolder.init().then(async ()=>{
            nextFolder = await nextFolder.readChildren();
        });

        if (typeof nextFolder != "undefined") {
            POSH.env.workingDir += "/"+argv[1];
            POSH.env.workingDir = FileSystem.formatLocation(POSH.env.workingDir);
        }else{
            throw new Error('Folder does not exist');
        }
    }
}

return cd;
