(async()=>{

    POSH.HISTFILE = "/root/.histfile"

    await POSH.clear();
    await POSH.say("welcome to POSH!\n");
    await POSH.say("type \"help\" for a list of commands\n");
    
    await POSH.execCommand("/usr/share/posh/lib/posh.js");
})();
