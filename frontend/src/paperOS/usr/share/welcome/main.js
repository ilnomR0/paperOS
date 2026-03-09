//# sourceURL=usr/share/welcome/main.js

class Welcome extends Application{
    constructor(){
        super();
        /** @type {cards} the window handle that is used by POT*/
        this.window = document.createElement("paperos-card");
        this.window.setAttribute("applicationLocation", "/usr/share/welcome/index.html");
        document.body.appendChild(this.window);
    }

    async appExecution(){
        this.window.addEventListener("app-active",()=>{
                this.window.document = this.window.getElementsByClassName("application")[0].shadowRoot;

                /**@type {HTMLButtonElement}*/
                this.window.document.getElementById("launchPotBtn").onclick = this.launchPOT;
                this.window.document.getElementById("launchDevBtn").onclick = this.launchDocs;
        });
    }


    async launchPOT(){
        let POSH = await ApplicationManager.initApplication("/usr/bin/pot.js");
        let app = new POSH();
        app.executeApp();
    }
    async launchDocs(){
        let Docs = await ApplicationManager.initApplication("/usr/share/docs/main.js");
        let app = new Docs();
        app.executeApp();
    }
}

return Welcome;
