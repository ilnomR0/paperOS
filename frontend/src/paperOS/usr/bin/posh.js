//# sourceURL=usr/bin/posh.js

//get's the setttings of POSH via the posh.json file
// let poshSettings = await new window.sda.File("/usr/share/posh", "posh.json")
// await poshSettings.init().then(async ()=>{
// poshSettings = await poshSettings.readData();
// set's the PATH
//TODO: make this be done in the .poshrc.js file (unless it's default)
// paperOS.PATH = (await poshSettings.json()).PATH;
// });
//

class POSH extends window.Application{

    constructor(window, psh){
        super({window, psh});
        this.psh = psh;
        this.window = window;
        this.active = false;
        this.finalStr = "";
    }
    async appExecution(){
        console.log("POSH session:", this);
            this.active = true;
            this.psh.say("Welcome to POSH V3.0!\ntype \"help\" for a list of commands\n");
            requestAnimationFrame(()=>{
                try{
                    this.appLoop()
                }catch(err){
                    this.psh.say("ERR:" +err);
                }
            });
    }
    appLoop(){
	//our loop for detecting keys and such
	    if(this.psh.currentKey == "Escape"){
            //kills the application when esc is pressed 
            this.window.closeWindow();
            this.active = false;
        }else if(this.psh.keyActive){
            console.log(this.psh.currentKey);
            if(this.psh.getLine(this.psh.currentLine).innerText.length > this.psh.columns.value){
                this.psh.say("\n");
                this.finalStr = "";
            }    
            this.say(this.psh.currentKey);
        }
        if(this.active){
            requestAnimationFrame(()=>this.appLoop());
        }
    }
    say(text){
        this.finalStr += text;
        this.psh.say(this.finalStr);
    }

}

return POSH;
