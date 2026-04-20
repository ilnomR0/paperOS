//# sourceURL=boot/lib.js
(async () => {
    await window.paperOS.executeFile("/usr/bin","cards.js");
    
    await paperOS.executeFile("/usr/bin","posh.js");
    await paperOS.executeFile("/usr/bin","desk.js");
    let parsedFonts =  await paperOS.Cards.parseDocument("/etc/fonts/setFonts.html");
    let fontsCss = document.createElement("style");
    fontsCss.innerText = parsedFonts.documentElement.querySelector("style").innerText;
    document.head.appendChild(fontsCss);
})();
