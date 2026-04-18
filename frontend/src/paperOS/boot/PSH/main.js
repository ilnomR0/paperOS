//# sourceURL=boot/PSH/main.js

//This is the very start of redactedOS as a whole. Or if you decide to fork it cuz u don't like redactedOS... here... (plz stay we luv u :3)
(async () => {

    window.envVariables = {};

    //imports the app manager commands
    const appMgrFile = await new window.sda.File("/boot", "appMgr.js");
    let appMgr;
    await appMgrFile.init().then(async ()=>{
        appMgr = await appMgrFile.readData();

        appMgr = new Function(await appMgr.text());
        const {ApplicationManager, Application} = await appMgr();
        window.ApplicationManager = ApplicationManager;
        window.Application = Application;


        //await window.pok.executeFile("/usr/bin/bootimg.js");
        //await redactedOS.executeFile("/boot", "lib.js");
        document.body.innerHTML = "";

        //await redactedOS.executeFile("/usr/share/welcome","main.js");
        //await redactedOS.executeFile("/usr/share/posh/lib", "poshInit.js");

        //initializes the paperos-card HTML tag to be used globally. 
        let cards = await ApplicationManager.initApplication("/usr/bin/cards.js");
        
        //loads the fontfile and parses it
        let parsedFonts = await cards.parseDocument("/etc/fonts/setFonts.html");
        let fontsCss = document.createElement("style");
        fontsCss.innerText = parsedFonts.documentElement.querySelector("style").innerText;
        document.head.appendChild(fontsCss);

        let Desktop = await ApplicationManager.initApplication("/usr/bin/desk.js");
        let app = new Desktop();
        app.executeApp();

        let POT = await ApplicationManager.initApplication("/usr/bin/pot.js");
        app = new POT();
        app.executeApp();

        let Welcome = await ApplicationManager.initApplication("/usr/share/welcome/main.js");
        app = new Welcome();
        app.executeApp();
    });

})();
