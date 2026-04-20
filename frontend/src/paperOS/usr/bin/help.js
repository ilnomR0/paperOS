class help extends Application{
    constructor(POSH, argv){
        super({POSH, argv});
    }
    async appExecution(POSH, argv){

        POSH.say(`-----COMMANDS-------
cd newLocation: changes the current directory to the newLocation relative to whatever the working directory is.

pwd:                    prints the working directory

help:                   displays this menu

cat <file>:               reads and prints out the contents of the given file relative to the working directory

clear:                  clears the terminal's output (aka all of this text)

ls [location]: lists all folders and files in the working directory. When given location, it will display the contents of the working directory + the location directory.

exit:                   leaves the POSH shell

newUsr <username>:        creates a new user with the given name username (IN DEVELOPMENT)

rm <file/folder>:         removes the given file or folder relative to the working directory.

whoami:                 if you ever forget who you are; don't worry! The "whoami" command can lend you a hand.

touch <filename>:         this creates a new file relative to the working directory.

man <command>:            gives you the manual of a given command if one has been given, listing things such as what arguments do what and what the flags are and can do

sn <file>:                opens the given file in our very own text editor Stickynote! 


HINT: if you ever want to update this "help" list, you can edit the help.js file located in /usr/bin/. This is where ALL commands that you can run from POSH are stored, or if you have  your own directory in mind and don't want to muddle everything inside of /usr/bin/, we got you! Simply edit your PATH variable (located in your .poshrc.js file, located within your home directory (/root/ if you are superuser, /home/yourname/ if you are regular user))
`);
    }
}
