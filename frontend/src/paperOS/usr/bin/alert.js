//# sourceURL=usr/bin/cards.js

class alert extends Application{
    constructor(ctx, argv){
        super({ctx, argv});
        /**@type{cards}*/
        this.window = document.createElement("paperos-card");
        this.window.width = 100;
        this.window.height = 50;
        this.resizable = false;
        this.movable = false;
        this.msg = argv[1];
        document.body.appendChild(this.window);
    }
    appExecution(ctx, argv){
        this.window.document = this.window.getElementsByClassName("application")[0].shadowRoot;
        this.window.document.innerHTML = argv[1];
    }
}

return alert;
