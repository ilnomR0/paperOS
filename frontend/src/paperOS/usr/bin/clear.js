//# sourceURL=usr/bin/ls.js

class clear extends Application{
    constructor(POSH){
        super({POSH});
    }
    appExecution(POSH){
        POSH.clear(); 
    }
}

return clear;
