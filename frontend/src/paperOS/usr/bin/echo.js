//# sourceURL=usr/bin/ls.js

class echo extends Application{
    constructor(POSH, argv){
        super({POSH, argv});
    }
    appExecution(POSH, argv){
        POSH.say(argv[1] + "\n");
    }
}

return echo;
