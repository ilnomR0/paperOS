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

class POSH extends Application{

    constructor(window, popt){
        if(window.appName == "POSH"){
            super({window:(window.window), popt:(window.popt)}, "POSH");
            this.popt = window.popt;
            this.window = window.window;
            this.popt.clear();
        }else{
            super({window, popt},"POSH");
            this.popt = popt;
            this.window = window;
        }
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
        this.formattedTag = this.tag
            .replace("/0pwD", this.env.workingDir)
            .replace("/0pcU", this.env.currentUser)

        this.textBuffer = this.formattedTag;
        this.fTextBuffer = this.formattedTag;
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
    async execCommand(){
        if(this.commandBuffer == ""){
            return;
        }
        //splits up the command
        const argv = [...this.commandBuffer.matchAll(/(\x60.*?\x60)|(\x27.*?\x27)|(\x22.*?\x22)|(\S+)/gm)].map(match => match[1] ?? match[2] ?? match[3] ?? match[4]); 
        //reserves error and success
        let error;
        let success;
        //goes through every command in path, one found it says it succeeded and leaves.
        for(const binPath of this.env.path.split(":")){
            try{
                const appMgr = await ApplicationManager.initApplication(`${binPath}/${argv[0]}.js`);
                const POSHapp = new appMgr(this,argv);
                await POSHapp.executeApp();   
                success = true;
                break;
            }catch(err){
                error = err;
            }
            if(!success){
                this.say(`ERROR POSH: ${error}\n${this.formattedTag}`);
                console.error(error);
            }
        }
    }
    async appLoop(lifetime){
        this.formattedTag = this.tag
            .replace("/0pwD", this.env.workingDir)
            .replace("/0pcU", this.env.currentUser)

        if(!this.popt.keyActive){
            this.lastKey = "";
        }
        if(this.popt.keyBuffer.length > 0){
            let e = this.popt.keyBuffer.shift();
            this.popt.currentKey = e.key;
            if(this.popt.currentKey == "Backspace"){
                if(this.commandBuffer.length >= 1){
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
                this.say("\n");
                await this.execCommand();
                this.textBuffer = this.formattedTag;
                this.fTextBuffer = this.formattedTag;
                this.commandBuffer = "";
            }else if(!!this.popt.keyPressed["Control"]?.active && !!this.popt.keyPressed["v"]?.active){
                document.addEventListener("paste", this.paste);
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
            }
            await this.say(this.textBuffer);
            this.lastKey = this.popt.currentKey;
        }


        if(this.active){
            requestAnimationFrame(async (lifetime)=>{
                try{
                    await this.appLoop(lifetime)
                }catch(err){
                    this.popt.say("POSH ERR:" +err);
                }
            });
        }
    }
    paste(event){
        event.preventDefault();

        const clipboardTxt = (event.clipboardData || window.clipboardData).getData('text');

        for(let character of clipboardTxt){
            if(this.popt.getLine(this.popt.currentLine).innerText.length >= this.popt.columns.value){
                this.popt.say("\n");
                this.textBuffer = "";
            }
            console.log(this.fTextBuffer);
            this.textBuffer += character;
            this.fTextBuffer += character;
            this.commandBuffer+=character;
        }
        this.say(this.textBuffer);
        this.lastKey = this.popt.currentKey;
        document.removeEventListener("paste", this.paste);
    }
    async say(text){
        this.popt.say(text);
    }
    async clear(){
        this.popt.currentLine = 0;
        this.popt.clear();
    }
    exit(){
        this.window.closeWindow();
        this.active = false;
    }
}

return POSH;
