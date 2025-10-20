# paperOS

paperOS is a web-based OS that has a host of apps, and is highly extensible. It uses the same file system commonly used by the unix kerel. paperOS itself runs off of POK (Paper Os Kernel), from which it can modify files and things.

## creating a fork

### building (??what???)

If you would like to fork paperOS, you must build it. Why? Because POK, to install the OS to your browser, requires an input of a .zip file. This makes referencing all of the files needed for the OS easier. 

If you would like to build it, you can call
```bash
npm run build
```
all this does is delete the existing build, and re-zip up the src/paperOS file.
### running

From your existing paperOS session, factory-reset it. If you are unable to do so:

1. open `inspector tools` via `ctrl + shift + i`
2. click on the `storage` tab
3. click through `indexDB` till you reach `FS`
4. right click `FS` then click `delete`

## externally used resources:

1. [fflate](https://github.com/101arrowz/fflate/tree/master), A thing for getting the data out of .zip files for installing the selected OS
2. that's it :D Everything else from the beginning terminal to the application windows were done all by hand
