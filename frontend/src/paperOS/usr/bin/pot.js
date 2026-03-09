//# sourceURL=usr/bin/POT.js

class POT extends Application{

    constructor(){
        super();
        /** @type {cards} the window handle that is used by POT*/
        this.window = document.createElement("paperos-card");
        this.window.setAttribute("applicationLocation", "/usr/share/posh/index.html");
        this.window.setAttribute("icon", "/usr/share/posh/images/poshIcn.png");
        this.window.active = false;
        document.body.appendChild(this.window);
    }

    async appExecution(){

        let PSH = await ApplicationManager.initApplication("/usr/share/pot/libs/psh.js");

        this.window.addEventListener("app-active", async ()=>{
            this.window.active = true;
            //initialize the PSH object once the application is ready
            this.psh = new PSH(this.window.getElementsByClassName("application")[0].shadowRoot.getElementById("Terminal"));
            //initialize the resize event listener. Not only resizes the size of the psh viewport, but also displays the current size of the terminal
            let preRes;
            let preResTxt = "";
            let dispActive = false;
            this.window.addEventListener("resize",async ()=>{
                this.psh.resizeToContainer();
                const stringToSay = `${this.psh.rows.value+1} x ${this.psh.columns.value+1}`;
                this.psh.currentLine = Math.floor(this.psh.rows.value/2);
                if(preRes!= null && this.psh.getLine(preRes)!=undefined && dispActive){
                    this.psh.getLine(preRes).innerText = preResTxt;
                }
                preRes = this.psh.currentLine;
                preResTxt = this.psh.getLine(preRes).innerText;
                await this.psh.say(" ".repeat((this.psh.columns.value/2) - (stringToSay.length/2))+stringToSay);
                dispActive = true;
            });

            this.window.addEventListener("handle-unactive", async()=>{
                if(preRes!= null && this.psh.getLine(preRes)!=undefined || dispActive){
                    this.psh.getLine(preRes).innerText = preResTxt;
                    dispActive = false;
                }
            })

            this.psh.resizeToContainer();

            //loads up a brand new instance of the POSH shell!

            let POSH = await ApplicationManager.initApplication("/usr/bin/posh.js");
            this.posh = new POSH(this.window, this.psh);
            this.posh.executeApp();

        });
    }
}
return POT;
