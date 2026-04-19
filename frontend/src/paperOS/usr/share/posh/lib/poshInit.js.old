//# sourceURL=usr/share/posh/lib/poshInit.js
(async () => {

    let poshVSession = await document.createElement("paperos-card");
    poshVSession.setAttribute("applicationLocation", "/usr/share/posh/index.html");
    poshVSession.setAttribute("icon", "/usr/share/posh/images/poshIcn.png");

    document.body.appendChild(poshVSession);

    await new Promise(resolve => {
        poshVSession.addEventListener("app-ready", resolve);
    });

    poshVSession.applicationVariables.POSH = new window.posh(poshVSession);
    //console.log(poshVSession.applicationVariables.POSH);

    poshVSession.addEventListener("resize", (elem) => {
        const testSpan = document.createElement("span");
        testSpan.innerText = "M"; // Use a wide character for worst-case sizing
        testSpan.style.visibility = "hidden";
        testSpan.style.position = "absolute";
        testSpan.style.font = getComputedStyle(elem).font;
        document.body.appendChild(testSpan);
        const charWidth = testSpan.offsetWidth;
        const charHeight = testSpan.offsetHeight;
        testSpan.remove();


        poshVSession.applicationVariables.POSH.charWidth = Math.floor(elem.width / charWidth);
        poshVSession.applicationVariables.POSH.charHeight = Math.floor(elem.height / charHeight);

    })

    poshVSession.applicationVariables.POSH.execCommand(
        poshVSession.applicationVariables.POSH.currentUser == "root" ?
            "/root/.poshrc.js" :
            `/home/${poshVSession.applicationVariables.POSH.currentUser}/.poshrc.js`);
})()
