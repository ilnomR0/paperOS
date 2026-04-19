class whoami extends Application{
    constructor(POSH){
        super({POSH});
    }
    appExecution(POSH){
        POSH.say(POSH.currentUser + "\n");
    }
}

return whoami;
