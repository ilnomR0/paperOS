class whoami extends Application{
    constructor(POSH){
        super({POSH});
    }
    async appExecution(POSH){
        POSH.say("I am "+ POSH.env.currentUser + "\n");

        console.log(await new Promise((resolve)=>{
            setTimeout(()=>{
                resolve("done");
            }, 1000);
        }));
        console.log("continuing...");
    }
}

return whoami;
