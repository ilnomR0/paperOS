class whoami extends Application{
    constructor(POSH){
        super({POSH});
    }
    appExecution(POSH){
        POSH.say(POSH.env.currentUser + "\n");
    }
}

return whoami;
