//# sourceURL=boot/PSH/main.js
(async () => {
    let bootloader = await new window.sda.File("/boot", "bootloader.js").readData();
    bootloader = new Function(await bootloader.text());
    await bootloader();
    
    

    //await window.pok.executeFile("/usr/bin/bootimg.js");
    await paperOS.executeFile("/boot", "lib.js");
    document.body.innerHTML = "";

    await paperOS.executeFile("/usr/share/welcome","main.js");
    await paperOS.executeFile("/usr/share/posh/lib", "poshInit.js");

})();
