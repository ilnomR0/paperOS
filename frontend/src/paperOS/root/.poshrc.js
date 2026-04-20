//# sourceURL=root/.poshrc.js
class poshRC extends window.Application{
    constructor(POSH){
        super({POSH});
    }

    async appExecution(POSH) {
        //this is where all of the command history lives
        POSH.HISTFILE = "/root/.histfile"
        //the little tag that appears whenever commands are ran
        POSH.tag = `<span style="color:cyan;">${POSH.env.workingDir}</span>?<span style="color:#00ff00;">${POSH.env.currentUser}</span>\> `;
        //location(s) of all of the commands, (cat, ls, mkdir, whoami, etc). To add on more binary paths, add ":" followed by your path (NO SPACES)
        POSH.env.path = "/usr/bin";

        //default boot parameters
        await POSH.clear();
        await POSH.say("welcome to POSH!\n");
        await POSH.say("type \"help\" for a list of commands\n");
    }
}

return poshRC;
