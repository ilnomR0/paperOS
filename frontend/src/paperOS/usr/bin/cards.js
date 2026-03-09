//# sourceURL=usr/bin/cards.js
(async () => {
    //styles
    let styles = document.createElement("style");
    let defaultStyles = await new window.sda.File("/usr/share/cards/styles", "cards.css");
    await defaultStyles.init().then(async ()=>{
        defaultStyles = await defaultStyles.readData();
        styles.textContent = await defaultStyles.text();

        document.head.appendChild(styles);
    });
})();

/**
* This is the CARDS window manager. The way that this works is all via one singular HTML object. paperos-card.
* CARDS not only manages how the windows are displayed, but also applications and their scope itself. This should be replaced by some other system, cards should simply render HTML documents. The backend structure should manage applications.
*/
class cards extends HTMLElement {
    constructor() {
        super();
    }


    /** get's called whenever you create the element. these contain all of the attributes that are used by the application */
    async connectedCallback() {

        /** @type {string} the title of the application */
        this.title = "";
        /** @type {number} the width of the app */
        this.width = 600;
        /** @type {number} the height of the app */
        this.height = 300;
        /** @type {number} the minimum width the app can resize to*/
        this.minWidth = 30;
        /** @type {number} the minimum height the app can resize to*/
        this.minHeight = 30;
        /** @type {number} the X location of the app */
        this.x = window.innerWidth / 2 - this.width / 2;
        /** @type {number} the Y location of the app */
        this.y = window.innerHeight / 2 - this.height / 2;

        /** @type {{x:number, y:number}} This is the mouses distance from the window's corner. This can be used to get the location of the mouse inside of the window*/
        this.mouseDistFromWin = { x: 0, y: 0 };
        /** @type {string} the location of the icon to use that is related to the application */
        this.icon;
        /** @type {boolean} is the application open and ready to be used or no?*/
        this.active = false;
        /** @type {{north:boolean, south:boolean, east:boolean, west:boolean}} A set of boolean values to determine what side of the window you have grabbed onto and are resizing */
        this.resizing = {
            north: false,
            south: false,
            east: false,
            west: false,
        };
        /** @type {boolean} have you grabbed onto any sort of movement handle? */
        this.moving = false;
        /** @type {boolean} should the application be displayed in a fullscreen mode or no? */
        this.fullscreen = false;

        /** @type {{*}} a map of all of the variables that can be used locally by the application. This shall be replaced by an ApplicationManager */
        this.applicationVariables = {};

        //sets a bunch of these variables via the attribute commands on the element itself
        this.setAttribute("width", this.getAttribute("width") ?? 600);
        this.width = Number(this.getAttribute("width"));
        this.setAttribute("height", this.getAttribute("height") ?? 300);
        this.height = Number(this.getAttribute("height"));
        this.setAttribute("y", this.getAttribute("y") ?? window.innerHeight / 2 - this.height / 2);
        this.y = Number(this.getAttribute("y"));
        this.setAttribute("x", this.getAttribute("x") ?? window.innerWidth / 2 - this.width / 2);
        this.x = Number(this.getAttribute("x"));
        this.setAttribute("min-height", this.getAttribute("min-height") ?? 100);
        this.minHeight = Number(this.getAttribute("min-height"));
        this.setAttribute("min-width", this.getAttribute("min-width") ?? 100);
        this.minWidth = Number(this.getAttribute("min-width"));
        this.setAttribute("icon", this.getAttribute("icon") ?? "/usr/share/cards/images/defaultAppIcon.png");

        //get's the icon's information
        let iconFile = await window.sda.File.constructFromFull(this.getAttribute("icon"));
        await iconFile.init().then(async ()=>{
            iconFile = await iconFile.readData();
        });
        this.icon = URL.createObjectURL(await iconFile.blob());
        /** @type {string} this is the location of the HTML document to render.*/
        this.applicationLocation = this.getAttribute("applicationLocation");

        this.style.width = this.width + "px";
        this.style.height = this.height + "px";
        this.style.minWidth = this.minWidth + "px";
        this.style.minHeight = this.minHeight + "px";
        this.style.left = this.x + "px";
        this.style.top = this.y + "px";

        /** @type{{resized:CustomEvent, appActive:CustomEvent}} A bunch of event listeners for the window itself.*/
        this.eventListeners = {
            resized:new Event("resize", {bubbles:true}),
            appActive:new Event("app-active", {bubbles:true}),
            fullscreen:new Event("fullscreen", {bubbles:true}),
            handleActive:new Event("handle-active", {bubbles:true}),
            handleUnactive:new Event("handle-unactive", {bubbles:true})
        }

        //sets up the styling of the inner application context, parses all of the resources so they all use local systems rather then URL's and external sources
        const applicationContainer = document.createElement("div");
        const application = applicationContainer.attachShadow({ mode: "open" });
        applicationContainer.setAttribute("class", "application");

        const doc = await cards.parseDocument(this.applicationLocation, "/usr/share/cards/styles/defaultApplication.css");


        this.title = (doc.querySelector("title")?.innerText ?? this.applicationLocation);
        applicationContainer.setAttribute("style", doc.body.getAttribute("style") ?? "");
        application.innerHTML = doc.documentElement.innerHTML;

        //titlebar initialization 
        const titlebar = document.createElement("div");
        titlebar.setAttribute("class", "titlebar");

        const title = document.createElement("span");
        title.innerText = this.title;
        title.setAttribute("class", "title");

        const icon = document.createElement("img");
        icon.src = this.icon;
        icon.setAttribute("class", "iconSmall");

        /** @type {HTMLButtonElement} the button for closing the window */
        this.closeButton = document.createElement("button");
        /** @type {HTMLButtonElement} the button for toggling fullscreen mode */
        this.fullscreenButton = document.createElement("button");
        /** @type {HTMLButtonElement} the button for minimizing the window */
        this.minimizeButton = document.createElement("button");

        this.closeButton.innerText = "";
        this.fullscreenButton.innerText = "󰊓";
        this.minimizeButton.innerText = "";

        this.closeButton.setAttribute("class", "close titlebarButton");
        this.fullscreenButton.setAttribute("class", "fullscreen titlebarButton");
        this.minimizeButton.setAttribute("class", "minimize titlebarButton");

        this.closeButton.setAttribute("onclick", `this.parentElement.parentElement.closeWindow();`);
        this.fullscreenButton.setAttribute("onclick", `this.parentElement.parentElement.fullscreenWindow();`);

        // load handlebars for resizing the window application. When they are resized, they will call the resize event listener

        const handleN = document.createElement("div");
        const handleE = document.createElement("div");
        const handleS = document.createElement("div");
        const handleW = document.createElement("div");

        const handleNE = document.createElement("div");
        const handleSW = document.createElement("div");
        const handleNW = document.createElement("div");
        const handleSE = document.createElement("div");

        handleN.setAttribute("class", "handleN resizeHandle");
        handleE.setAttribute("class", "handleE resizeHandle");
        handleS.setAttribute("class", "handleS resizeHandle");
        handleW.setAttribute("class", "handleW resizeHandle");

        handleNE.setAttribute("class", "handleNE resizeHandleCorner");
        handleSW.setAttribute("class", "handleSW resizeHandleCorner");
        handleNW.setAttribute("class", "handleNW resizeHandleCorner");
        handleSE.setAttribute("class", "handleSE resizeHandleCorner");

        const handleNDisplay = document.createElement("div");
        const handleEDisplay = document.createElement("div");
        const handleSDisplay = document.createElement("div");
        const handleWDisplay = document.createElement("div");

        const handleNEDisplay = document.createElement("div");
        const handleSWDisplay = document.createElement("div");
        const handleNWDisplay = document.createElement("div");
        const handleSEDisplay = document.createElement("div");

        handleNDisplay.setAttribute("class", "displayHandleInactive handleN resizeHandle");
        handleEDisplay.setAttribute("class", "displayHandleInactive handleE resizeHandle");
        handleSDisplay.setAttribute("class", "displayHandleInactive handleS resizeHandle");
        handleWDisplay.setAttribute("class", "displayHandleInactive handleW resizeHandle");

        handleNEDisplay.setAttribute("class", "displayHandleInactive handleNE resizeHandleCorner");
        handleSWDisplay.setAttribute("class", "displayHandleInactive handleSW resizeHandleCorner");
        handleNWDisplay.setAttribute("class", "displayHandleInactive handleNW resizeHandleCorner");
        handleSEDisplay.setAttribute("class", "displayHandleInactive handleSE resizeHandleCorner");

        handleE.onmousedown = () => {
            this.resizing.east = true;
        }
        handleN.onmousedown = () => {
            this.resizing.north = true;
        }
        handleS.onmousedown = () => {
            this.resizing.south = true;
        }
        handleW.onmousedown = () => {
            this.resizing.west = true;
        }

        handleNE.onmousedown = () => {
            this.resizing.north = true;
            this.resizing.east = true;
        }
        handleNW.onmousedown = () => {
            this.resizing.north = true;
            this.resizing.west = true;
        }
        handleSE.onmousedown = () => {
            this.resizing.south = true;
            this.resizing.east = true;
        }
        handleSW.onmousedown = () => {
            this.resizing.south = true;
            this.resizing.west = true;
        }

        titlebar.onmousedown = () => {
            this.moving = true;
        }
        document.addEventListener("mouseup", () => {
            this.resizing = {
                north: false,
                south: false,
                east: false,
                west: false
            };
            this.moving = false;
            this.dispatchEvent(this.eventListeners.handleUnactive);
        });
        //what happens when you click down on the handles
        document.addEventListener("mousemove", (e) => {
            if (!this.fullscreen) {
                if (this.resizing.east) {
                    this.width = e.screenX - this.oldProp.cursorX + this.oldProp.width;
                applicationContainer.dispatchEvent(this.eventListeners.resized);
                }
                if (this.resizing.north && this.oldProp.height - (e.screenY - this.oldProp.cursorY) > this.minHeight) {
                    this.y = e.screenY + (this.oldProp.y - this.oldProp.cursorY);
                    this.height = this.oldProp.height - (e.screenY - this.oldProp.cursorY);
                applicationContainer.dispatchEvent(this.eventListeners.resized);
                } else if (this.resizing.north) {
                    this.height = this.oldProp.height - (e.screenY - this.oldProp.cursorY);
                applicationContainer.dispatchEvent(this.eventListeners.resized);
                }
                if (this.resizing.west && this.oldProp.width - (e.screenX - this.oldProp.cursorX) > this.minWidth) {
                    this.x = e.screenX + (this.oldProp.x - this.oldProp.cursorX);
                    this.width = this.oldProp.width - (e.screenX - this.oldProp.cursorX);
                applicationContainer.dispatchEvent(this.eventListeners.resized);
                } else if (this.resizing.west) {
                    this.width = this.oldProp.width - (e.screenX - this.oldProp.cursorX);
                applicationContainer.dispatchEvent(this.eventListeners.resized);
                }
                if (this.resizing.south) {
                    this.height = e.screenY - this.oldProp.cursorY + this.oldProp.height;
                applicationContainer.dispatchEvent(this.eventListeners.resized);
                }
                if (this.moving) {
                    this.x = e.screenX + (this.oldProp.x - this.oldProp.cursorX);
                    this.y = e.screenY + (this.oldProp.y - this.oldProp.cursorY);
                }
                this.style.width = this.width + "px";
                this.style.height = this.height + "px";
                this.style.left = this.x + "px";
                this.style.top = this.y + "px";

                this.setAttribute("width", this.width);
                this.setAttribute("height", this.height);
                this.setAttribute("x", this.x);
                this.setAttribute("y", this.y);
            }
        });

        //focuses the window 
        document.addEventListener("mousedown", (e) => {
            if (this.contains(e.target)) {
                this.active = true;
                this.classList.add("active");
                this.style.zIndex = 999;
                this.oldProp = {
                    x: this.x,
                    y: this.y,
                    width: this.width,
                    height: this.height,
                    cursorX: e.screenX,
                    cursorY: e.screenY
                }
            } else {
                this.active = false;
                this.classList.remove("active");
                this.style.zIndex = 1;
            }
            this.dispatchEvent(this.eventListeners.handleActive);
        });
        window.addEventListener("resize", ()=>{
            if(this.fullscreen) this.dispatchEvent(this.eventListeners.resized);
        });

        titlebar.appendChild(icon);
        titlebar.appendChild(title);
        titlebar.appendChild(this.closeButton);
        titlebar.appendChild(this.fullscreenButton);
        this.appendChild(titlebar);
        this.appendChild(applicationContainer);
        this.appendChild(handleN);
        this.appendChild(handleE);
        this.appendChild(handleS);
        this.appendChild(handleW);
        this.appendChild(handleNE);
        this.appendChild(handleNW);
        this.appendChild(handleSE);
        this.appendChild(handleSW);


        this.dispatchEvent(this.eventListeners.appActive);

    }
    /**
    *This function is called when you wish to close the window
    */
    closeWindow() {
        this.remove();
    }
    /**
    *This is a toggle function for fullscreen mode.
    */
    fullscreenWindow() {
        this.fullscreen = !this.fullscreen;
        if (this.fullscreen) {
            this.style.width = `100%`;
            this.style.height = "100%";
            this.style.left = 0 + "px";
            this.style.top = 0 + "px";
            this.fullscreenButton.innerText = "󰊔";
            this.style.borderRadius = "0";
        } else {
            this.style.width = this.width + "px";
            this.style.height = this.height + "px";
            this.style.left = this.x + "px";
            this.style.top = this.y + "px";
            this.fullscreenButton.innerText = "󰊓";
            this.style.borderRadius = "10px"; 
        }
        this.dispatchEvent(this.eventListeners.fullscreen);
        this.dispatchEvent(this.eventListeners.resized);
    }
    disconnectedCallback() {

    }
    connectedMoveCallback() {

    }
    adoptedCallback() {

    }
    /**
    * This function parses an HTML document to fit this local system. This allows files to access each other from within the OPFS file system, allowing for things like images and such
    * @param {string} location the HTML document location that you wish to format
    * @param {...string} defaultCSS Some default stylesheets that you wish to load when you parse the document.
    */
    static async parseDocument(location, ...defaultCSS) {
        let docFile = await window.sda.File.constructFromFull(location);
        await docFile.init().then(async()=>{
            docFile = await docFile.readData();
        });
        let doc = await new DOMParser().parseFromString(await docFile.text(), "text/html");
        if(defaultCSS){
            for(let cssDefault of defaultCSS){
                let sheet = document.createElement("link");
                sheet.setAttribute("rel", "stylesheet");
                sheet.setAttribute("href", cssDefault);
                doc.head.appendChild(sheet);
            }
        }
        //console.log("pre parse\n", doc.documentElement.innerHTML);

        let linkTags = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'))
        let styleTags = Array.from(doc.querySelectorAll("style"));
        for (const link of linkTags) {
            const href = link.getAttribute("href");
            if (!href.startsWith("http")) {
                let file = await window.sda.File.constructFromFull(href);
                await file.init().then(async ()=>{
                    file = await file.readData();
                });
                let modifiedCSS = await file.text();
                const styleURLs = [...modifiedCSS.matchAll(/url\(["']?(.*?)["']?\)/gmi)];
                for (const match of styleURLs) {
                    let originalPath = await window.sda.File.constructFromFull(match[1]);

                    await originalPath.init().then(async ()=>{
                        originalPath = await originalPath.readData();
                    });

                    //console.log(originalPath);
                    const blob = URL.createObjectURL(await originalPath.blob());
                    modifiedCSS = modifiedCSS.replaceAll(match[0], `url("${blob}")`);
                }

                const styleTag = doc.createElement("style");
                styleTag.textContent = modifiedCSS;
                link.replaceWith(styleTag);
            }
        }
        for(const style of styleTags){
            let modifiedCSS = style.textContent;
            const styleURLs = [...style.innerText.matchAll(/url\(["']?(.*?)["']?\)/gmi)];
            for (const match of styleURLs) {
                let originalPath = await window.sda.File.constructFromFull(match[1]);

                await originalPath.init().then(async ()=>{
                    originalPath = await originalPath.readData();
                });

                //console.log(originalPath);
                const blob = URL.createObjectURL(await originalPath.blob());
                modifiedCSS = modifiedCSS.replaceAll(match[0], `url("${blob}")`);
            }

            style.textContent = modifiedCSS;
        }

        //console.log("after parse\n", doc.documentElement.innerHTML);
        return doc;
    }
}
    //finally, define it as a true element
customElements.define("paperos-card", cards);
return cards;
