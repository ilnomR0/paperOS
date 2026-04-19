//# sourceURL=root/.poshrc.js
class poshRC extends window.Application{
    constructor(POSH){
        super();
        this.POSH = POSH;
    }

    async appExecution() {
        //this is where all of the command history lives
        this.POSH.HISTFILE = "/root/.histfile"
        //the little tag that appears whenever commands are ran
        this.POSH.tag = `<span style="color:cyan;">${this.POSH.env.workingDir}</span>?<span style="color:#00ff00;">${this.POSH.env.currentUser}</span>\> `;
        //location(s) of all of the commands, (cat, ls, mkdir, whoami, etc). To add on more binary paths, add ":" followed by your path (NO SPACES)
        this.POSH.env.path = "/usr/bin";

        //default boot parameters
        await this.POSH.clear();
        await this.POSH.say("welcome to POSH!\n");
        await this.POSH.say("type \"help\" for a list of commands\n");
    }
}

return poshRC;
