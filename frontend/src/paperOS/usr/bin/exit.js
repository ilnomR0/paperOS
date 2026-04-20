class exit extends Application{
    constructor(POSH, argv){
        super({POSH, argv});
    }
    async appExecution(POSH, argv){

        POSH.exit();
    }
}
return exit;
