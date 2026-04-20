class pwd extends Application{
    constructor(POSH, argv){
        super({POSH, argv});
    }
    async appExecution(POSH, argv){
        POSH.say(POSH.env.workingDir + "\n");
    }
}
return pwd;
