//# sourceURL=boot/appMgr.js
class ApplicationManager{
    /**
     *Executes an application with the given app location. Returns the Application object inside of the file
     * @param {string} location the given file that is executed
     * @returns {*} This can return whatever the file wishes to return. 
     */
    static async initApplication(location){
        const file = window.sda.File.constructFromFull(location);
        let app;
        return await file.init().then(async ()=>{
            app = await file.readData();
            
            app = new Function(await app.text());
            return await app();
        });
    }
}
class Application{
    /**
    * generates an application instance.
    * @param {string} appLocation the location of the application to execute
    * @param {{*}} scope a bunch of variables that can be used by the given application when it was spawned as a child process
    */
    constructor(scope = {}){
        /** @type {Application[]} a list of child applications */
        this.childApplications = [];
        this.scope = scope;
    }
    /**
     *This is where the users' code is 
     */
    appExecution(){

    }
    async executeApp(){
        this.appExecution(...Object.values(this.scope));
    }
    /**
    * This will attach the given application to this application
    * @param {application} application
    */
    attachChildProcess(application){
        this.childApplications += application;
    }
}

return {ApplicationManager, Application};
