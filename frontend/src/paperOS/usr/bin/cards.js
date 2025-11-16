//# sourceURL=usr/bin/cards.js
(async () => {
    //styles
    let styles = document.createElement("style");
    let defaultStyles = await new window.sda.File("/usr/share/cards/styles", "cards.css").readData();
    styles.textContent = await defaultStyles.text();

    document.head.appendChild(styles);
})();

class cards extends HTMLElement {
    constructor() {
        super();


    }



    async connectedCallback() {

        this.title = "";
        this.width = 600;
        this.height = 300;
        this.minWidth = 30;
        this.minHeight = 30;
        this.x = window.innerWidth / 2 - this.width / 2;
        this.y = window.innerHeight / 2 - this.height / 2;
        this.mouseDistFromWin = { x: 0, y: 0 };
        this.icon;
        this.active = false;
        this.resizing = {
            north: false,
            south: false,
            east: false,
            west: false
        };
        this.moving = false;
        this.fullscreen = false;

        this.application = "";
        this.applicationVariables = {};
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
        
        let iconFile = await window.sda.File.constructFromFull(this.getAttribute("icon")).readData();

        this.icon = URL.createObjectURL(await iconFile.blob());
        this.applicationLocation = this.getAttribute("applicationLocation");

        this.style.width = this.width + "px";
        this.style.height = this.height + "px";
        this.style.minWidth = this.minWidth + "px";
        this.style.minHeight = this.minHeight + "px";
        this.style.left = this.x + "px";
        this.style.top = this.y + "px";
        this.resizeEventListener = new CustomEvent("resize", this);

        const applicationContainer = document.createElement("div");
        const application = applicationContainer.attachShadow({ mode: "open" });
        applicationContainer.setAttribute("class", "application");

        const doc = await paperOS.Cards.parseDocument(this.applicationLocation, "/usr/share/cards/styles/defaultApplication.css");

        this.title = (doc.querySelector("title")?.innerText ?? this.applicationLocation);
        applicationContainer.setAttribute("style", doc.body.getAttribute("style") ?? "");
        application.innerHTML = doc.documentElement.innerHTML;


        const titlebar = document.createElement("div");
        titlebar.setAttribute("class", "titlebar");

        const title = document.createElement("span");
        title.innerText = this.title;
        title.setAttribute("class", "title");

        const icon = document.createElement("img");
        icon.src = this.icon;
        icon.setAttribute("class", "iconSmall");

        this.closeButton = document.createElement("button");
        this.fullscreenButton = document.createElement("button");
        this.minimizeButton = document.createElement("button");

        this.closeButton.innerText = "";
        this.fullscreenButton.innerText = "󰊓";
        this.minimizeButton.innerText = "";

        this.closeButton.setAttribute("class", "close titlebarButton");
        this.fullscreenButton.setAttribute("class", "fullscreen titlebarButton");
        this.minimizeButton.setAttribute("class", "minimize titlebarButton");

        this.closeButton.setAttribute("onclick", `this.parentElement.parentElement.closeWindow();`);
        this.fullscreenButton.setAttribute("onclick", `this.parentElement.parentElement.fullscreenWindow();`);

        // load handlebars

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
        });
        document.addEventListener("mousemove", (e) => {
            if (!this.fullscreen) {
                if (this.resizing.east) {
                    this.width = e.screenX - this.oldProp.cursorX + this.oldProp.width;
                }
                if (this.resizing.north && this.oldProp.height - (e.screenY - this.oldProp.cursorY) > this.minHeight) {
                    this.y = e.screenY + (this.oldProp.y - this.oldProp.cursorY);
                    this.height = this.oldProp.height - (e.screenY - this.oldProp.cursorY);
                } else if (this.resizing.north) {
                    this.height = this.oldProp.height - (e.screenY - this.oldProp.cursorY);
                }
                if (this.resizing.west && this.oldProp.width - (e.screenX - this.oldProp.cursorX) > this.minWidth) {
                    this.x = e.screenX + (this.oldProp.x - this.oldProp.cursorX);
                    this.width = this.oldProp.width - (e.screenX - this.oldProp.cursorX);
                } else if (this.resizing.west) {
                    this.width = this.oldProp.width - (e.screenX - this.oldProp.cursorX);
                }
                if (this.resizing.south) {
                    this.height = e.screenY - this.oldProp.cursorY + this.oldProp.height;
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
                applicationContainer.dispatchEvent(this.resizeEventListener);
            }
        });
        document.addEventListener("mousedown", (e) => {
            console.log(e.target);
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

        this.dispatchEvent(new CustomEvent("app-ready", { bubbles: true }));


    }
    closeWindow() {
        this.remove();
    }
    fullscreenWindow() {
        this.fullscreen = !this.fullscreen;
        if (this.fullscreen) {
            this.style.width = `100%`;
            this.style.height = "100%";
            this.style.left = 0 + "px";
            this.style.top = 0 + "px";
            this.fullscreenButton.innerText = "󰊔";
        } else {
            this.style.width = this.width + "px";
            this.style.height = this.height + "px";
            this.style.left = this.x + "px";
            this.style.top = this.y + "px";
            this.fullscreenButton.innerText = "󰊓";
        }
    }
    disconnectedCallback() {

    }
    connectedMoveCallback() {

    }
    adoptedCallback() {

    }
}

customElements.define("paperos-card", cards)
