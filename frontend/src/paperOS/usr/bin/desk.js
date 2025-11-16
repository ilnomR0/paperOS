//# sourceURL=usr/bin/desk.js
//background image
let settingsFile = await window.sda.File.constructFromFull(window.paperOS.currentUser == "root" ?
    "/root/.conf/settings.json" :
    `/home/${window.currentUsr}/.conf/settings.json`).readData();
let settings = await settingsFile.json();

let imageFile = await window.sda.File.constructFromFull(settings.background).readData();
let imageBin = await URL.createObjectURL(await imageFile.blob());

document.body.style.backgroundImage = `URL(${imageBin}`;
document.body.style.backgroundSize = 'cover';
document.body.style.backgroundRepeat = 'no-repeat';
document.body.style.backgroundAttachment = "fixed";

// application on desktops

(async () => {
    let style = document.createElement("style");
    let deskCSSfile = await new window.sda.File("/usr/share/desk", "desk.css").readData();
    style.textContent = await deskCSSfile.text();
    document.head.appendChild(style);
    console.log("desk: ", settings);
    //let applications = await window.pok.fileSystem.readFolder(settings.desktopApps);

    //console.log("desk: ", applications);

    let desktop = document.createElement("div");
    desktop.setAttribute("id", "desktop");

    /*for (let applicationI = 0; applicationI < applications.length; applicationI++) {

        let application = applications[applicationI];

        console.log("desk: ", application);
        let applicationBtn = document.createElement("button");
        applicationBtn.setAttribute("class", "desktopBtn");

        let applicationIcn = document.createElement("img");
        let applicationIcnFile = await new window.sda.File("/usr/share/cards/images", "defaultAppIcon.png").readData();
        applicationIcn.src = await URL.createObjectURL(await applicationIcnFile.blob());
        applicationIcn.style.width = "100%";
        applicationBtn.appendChild(applicationIcn);
        applicationBtn.textapplication;
        const appName = document.createElement("span");
        appName.textContent = application;
        applicationBtn.appendChild(appName);


        applicationBtn.addEventListener("drag",(e)=>{
            e.preventDefault();

            let oldX = applicationIcn.getBoundingClientRect().x;
            let oldY = applicationIcn.getBoundingClientRect().y;

            let cellW = getComputedStyle(desktop).getPropertyValue("grid-template-rows");
            let cellH = getComputedStyle(desktop).getPropertyValue("row-width");

            let oldGridX = Math.floor(oldX / cellW);
            let oldGridY = Math.floor(oldY / cellH);

            applicationIcn.style.top =  e.clientX;


        });


        desktop.appendChild(applicationBtn);
    }*/

    document.body.appendChild(desktop);

})();
//ruler bar


