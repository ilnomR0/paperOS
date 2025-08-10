(async () => {
    let bootloader = new Function(window.pok.decoder.decode(await window.pok.fileSystem.readFile("/boot/bootloader.js")));
    console.log(bootloader);
    await bootloader();
    window.currentUsr = "root";

    //await window.pok.executeFile("/usr/bin/bootimg.js");
    await window.pok.executeFile("/boot/lib.js");
    await window.pok.clear();

    document.body.innerHTML += `<paperos-card applicationLocation = '/usr/share/welcome/index.html'></paperos-card>`;
    window.pok.executeFile("/usr/share/posh/lib/poshInit.js");
})();
