//# sourceURL=boot/PSH/main.js

(async () => {
    const bootloaderFile = await new window.sda.File("/boot", "bootloader.js");
    let bootloader;
    await bootloaderFile.init().then(async ()=>{
        bootloader = await bootloaderFile.readData();

        bootloader = new Function(await bootloader.text());
        await bootloader();



        //await window.pok.executeFile("/usr/bin/bootimg.js");
        await paperOS.executeFile("/boot", "lib.js");
        document.body.innerHTML = "";

        await paperOS.executeFile("/usr/share/welcome","main.js");
        await paperOS.executeFile("/usr/share/posh/lib", "poshInit.js");
    });

})();
