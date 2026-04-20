//# sourceURL=usr/share/welcome/main.js

//to create an application, simply create a regular class and define it as an application
//Every application lives on a separate thread on your CPU, allowing paperOS to be super
//speedy. 
//
//This can be utilized in for example a minecraft clone, where you have loading
//chunks and preforming actions. If you want little lag, you would have these on separate
//threads. You can do this in paperOS by simply creating another application, and making
//them die together.

class Welcome extends Application{

    //the constructor is where everything in initialization happens, for example 
    //creating variables specific to applications.
   
    constructor(){
        super();
        /** @type {cards} This is a window handle. You can make windows and modify attributes with this*/
        this.window = document.createElement("paperos-card");
        this.window.setAttribute("applicationLocation", "/usr/share/welcome/index.html");
        document.body.appendChild(this.window);
    }

    async appExecution(){
        //this little event listener executes whenever the application has fully loaded, and the document can be accessed
        this.window.addEventListener("app-active",()=>{
            //in this instance, we set the windows' document element to it's own shadow document
                this.window.document = this.window.getElementsByClassName("application")[0].shadowRoot;

            //we can now modify different HTML elements within the document
                this.window.document.getElementById("launchPotBtn").onclick = () => this.launchPOT();
                this.window.document.getElementById("launchDevBtn").onclick = () => this.launchDocs();
                this.window.document.getElementById("playSnake").onclick = () => this.playSnake();
                this.window.document.getElementById("playMinesweeper").onclick = () => this.playMinesweeper();
                this.window.document.getElementById("nuke").onclick = () => this.nuke();
        });
    }

    //because this is a class, we can define functions in a class-based way, calling different functions or initializing
    //other classes. This develops a nice per-application system, where every new application lives in it's own world.
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
    
    async playSnake(){
        let snake = await ApplicationManager.initApplication("/usr/share/snake/main.js");
        let app = new snake();
        await app.executeApp();
    }
    async playMinesweeper(){
        let snake = await ApplicationManager.initApplication("/usr/share/minesweeper/main.js");
        let app = new snake();
        await app.executeApp();
    }
    async nuke(){
        const root = await navigator.storage.getDirectory();
        for await (const [name] of root.entries()) {
            await root.removeEntry(name, { recursive: true });
        }
        console.log("Paper OS: Factory Reset Complete.");
        location.reload();
    }
}

return Welcome;
