//# sourceURL=usr/bin/posh.js

/**
 *----------------------ABOUT POSH----------------------
 * POSH is one of the oldest parts, but also the most interestng
 * POSH stands for Paper Os Shell, and is the bridge from your keyboard
 * to  some commands within /usr/bin, or any other executables you define
 * in your path variable which you can change at ~/.poshrc.js. If you 
 * are used to any of the older versions of POSH, this is not the same.
 * POSH has now been split up into 3 main parts:
 *     1. the PaperOsTerminal,
 *     2. the PaperOsPseudoTermial
 *     3. Paper Os SHell
 */

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

    constructor(window, popt){
        super({window, popt});
        this.popt = popt;
        this.window = window;
        this.active = false;

        this.popt.resizeToContainer();

        this.blacklist = ["Shift", "Meta", "Control", "Alt", "Escape"];
        this.lastKey = "";
        this.textBuffer = "";
        this.fTextBuffer = "";
        this.commandBuffer = ""; 
    }
    async appExecution(){

        this.env = structuredClone(window.envVariables); 
        this.env.workingDir = "/usr/bin/";

        const poshRC = await ApplicationManager.initApplication(`${this.env.homeDir}.poshrc.js`);
        const poshRCApp = new poshRC(this);
        await poshRCApp.executeApp();
        this.textBuffer = this.tag;
        this.fTextBuffer = this.tag;
        console.log(this.textBuffer);
        this.active = true;
        this.say(this.textBuffer);
        requestAnimationFrame((lifetime)=>{
            try{
                this.say(this.textBuffer);
                this.appLoop(lifetime)
            }catch(err){
                this.popt.say("ERR:" +err);
            }
        });
    }
    execCommand(){
        //splits up the command
        const formattedArgs = [...this.commandBuffer.matchAll(/(\x60.*?\x60)|(\x27.*?\x27)|(\x22.*?\x22)|(\S+)/gm)].map(match => match[1] ?? match[2] ?? match[3] ?? match[4]); 
        //reserves error and success
        let error;
        let success;
        //goes through every command in path, one found it says it succeeded and leaves.
        this.env.path.split(":").forEach(async (binPath)=>{
            try{
                const appMgr = await ApplicationManager.initApplication(`${binPath}${formattedArgs[0]}.js`);
                const app = new appMgr(...formattedArgs);
                await app.executeApp();   
                success = true;
                throw BreakException;
            }catch(err){
                error = err;
            }finally{
                //if it never succeeded, then it failed. 
                if(!success){
                    this.say(`ERROR POSH: ${error}\n${this.tag}`);
                }
            }
        });  
        this.commandBuffer = "";
    }
    appLoop(lifetime){
        if(!this.popt.keyActive){
            this.lastKey = "";
        }
        if(this.popt.currentKey == "Escape"){
            //kills the application when esc is pressed 
            this.window.closeWindow();
            this.active = false;
        }else if(this.popt.keyActive && this.popt.currentKey != this.lastKey || this.popt.keyRep){

            if(this.popt.currentKey == "Backspace"){
                if(this.fTextBuffer.length > this.tag.length){
                    if(this.textBuffer.length <= 0){
                        this.say(" ");
                        this.popt.currentLine--;
                        this.textBuffer = this.popt.getLine(this.popt.currentLine).innerHTML;
                    }
                    this.textBuffer = this.textBuffer.slice(0, Math.max(this.textBuffer.length-1, 0));
                    this.commandBuffer = this.commandBuffer.slice(0, Math.max(this.commandBuffer.length-1, 0));
                    this.fTextBuffer = this.fTextBuffer.slice(0, Math.max(this.fTextBuffer.length-1, 0));
                this.say(this.textBuffer);
                }
            }else if(this.popt.currentKey == "Enter"){
                this.execCommand();
                this.textBuffer = this.tag;
                this.fTextBuffer = this.tag;
                this.say("\n"+this.textBuffer);
            }else if(this.blacklist.includes(this.popt.currentKey)){

            }else{

                if(this.popt.getLine(this.popt.currentLine).innerText.length >= this.popt.columns.value){
                    this.popt.say("\n");
                    this.textBuffer = "";
                }
                console.log(this.fTextBuffer);
                this.textBuffer += this.popt.currentKey;
                this.fTextBuffer += this.popt.currentKey;
                this.commandBuffer+=this.popt.currentKey;
                this.say(this.textBuffer);
            }
            this.lastKey = this.popt.currentKey;
        }


        if(this.active){
            requestAnimationFrame((lifetime)=>this.appLoop(lifetime));
        }
    }
    say(text){
        this.popt.say(text);
    }
    clear(){this.popt.clear()}

}

return POSH;
