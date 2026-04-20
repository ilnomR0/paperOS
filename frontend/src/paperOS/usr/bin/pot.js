//# sourceURL=usr/bin/POT.js


/**--------------------------ABOUT POT-------------------------- 
 * POT (Paper Os Terminal) is the window/container area of the 
 * application. If you want to make any modifications to the window,
 * you would do that over in the POT. 
 */
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

        let POPT = await ApplicationManager.initApplication("/usr/share/pot/libs/popt.js");
        //loads up a brand new instance of the POSH shell!
        //TODO: make environment variables for this. POT should read that
        let POSH = await ApplicationManager.initApplication("/usr/bin/posh.js");
        this.window.addEventListener("app-active", async ()=>{
            this.window.active = true;
            //initialize the POPT object once the application is ready
            this.popt = new POPT(this.window.getElementsByClassName("application")[0].shadowRoot.getElementById("Terminal"));
            //initialize the resize event listener. Not only resizes the size of the popt viewport, but also displays the current size of the terminal
            let preRes;
            let preResTxt = "";
            let dispActive = false;
            this.window.addEventListener("resize",async ()=>{
                this.popt.resizeToContainer();
                const stringToSay = `${this.popt.rows.value+1} x ${this.psh.columns.value+1}`;
                this.popt.currentLine = Math.floor(this.psh.rows.value/2);
                if(preRes!= null && this.popt.getLine(preRes)!=undefined && dispActive){
                    this.popt.getLine(preRes).innerText = preResTxt;
                }
                preRes = this.popt.currentLine;
                preResTxt = this.popt.getLine(preRes).innerText;
                await this.popt.say(" ".repeat((this.psh.columns.value/2) - (stringToSay.length/2))+stringToSay);
                dispActive = true;

            });

            this.window.addEventListener("handle-unactive", async()=>{
                if(preRes!= null && this.popt.getLine(preRes)!=undefined || dispActive){
                    this.popt.getLine(preRes).innerText = preResTxt;
                    dispActive = false;
                }
            })
            this.popt.resizeToContainer();
            this.posh = new POSH(this.window, this.popt);
            this.posh.executeApp();

        });
    }
}
return POT;
