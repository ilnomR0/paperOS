//# sourceURL=usr/share/docs/main.js

class Docs extends Application{
    constructor(){
        super();
        /** @type {cards} the window handle that is used by POT*/
        this.window = document.createElement("paperos-card");
        this.window.setAttribute("applicationLocation", "/usr/share/docs/index.html");
        document.body.appendChild(this.window);
    }

    async appExecution(){
        this.window.addEventListener("app-active",()=>{
                this.window.document = this.window.getElementsByClassName("application")[0].shadowRoot;
        });
    }
}

return Docs;

