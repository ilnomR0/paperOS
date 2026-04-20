//# sourceURL=usr/bin/desk.js


class Desktop extends Application{

    /**
    *The desktop application is the main desktop environment for everything desktop related. Everything from the ruler bar, to what files are loaded when you double click can be found here
    */
    constructor(){
        super();
        //background image
        this.settingsFile;
        this.settings;
        this.imageFile;
        this.imageBin;
        this.element;
    }

    async appExecution(){
        //retrieves the settings file for the app
        this.settingsFile = await window.sda.File.constructFromFull("/root/.conf/settings.json");
        await this.settingsFile.init().then(async ()=>{
            this.settingsFile = await this.settingsFile.readData();
            this.settings = await this.settingsFile.json();
        });

        //get's the image file from the settings file
        this.imageFile = await window.sda.File.constructFromFull(this.settings.background);
        await this.imageFile.init().then(async ()=>{
            this.imageFile = await this.imageFile.readData();
            this.imageBin = URL.createObjectURL(await this.imageFile.blob());
        });


        // application on desktops

        //apply the CSS Desktop file
        let style = document.createElement("style");
        let deskCSSfile = await new window.sda.File("/usr/share/desk", "desk.css");
        await deskCSSfile.init().then(async ()=>{
            deskCSSfile = await deskCSSfile.readData();
            style.textContent = await deskCSSfile.text();
        });

        document.head.appendChild(style);

        this.element = document.createElement("div");
        this.element.setAttribute("id", "desktop");


        document.body.appendChild(this.element);
        this.element.style.backgroundImage = `URL(${this.imageBin}`;
        this.element.style.backgroundSize = 'cover';
        this.element.style.backgroundRepeat = 'no-repeat';
        this.element.style.backgroundAttachment = "fixed";
    }

};

return Desktop;
