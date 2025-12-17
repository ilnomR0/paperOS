//# sourceURL=boot/bootloader.js
class paperOS {

    static currentUser = "root";

    static Cards;
    static PATH;

    static async executeFile(path, name, scope = {}){
        
        let scriptContent = await new window.sda.File(path, name);
        await scriptContent.init().then(async()=>{
            scriptContent = await scriptContent.readData();
        });
        const decoded = await scriptContent.text();

        const runner = new Function(...Object.keys(scope), `
        return (async () => {
            ${decoded}
        })();
    `);

        return runner(...Object.values(scope));
    }

}

(async () => {
    document.body.style.backgroundColor = "black";

    //execute the POSH class?
    
    window.paperOS = paperOS;

    await paperOS.executeFile("/usr/bin", "posh.js");
})();
