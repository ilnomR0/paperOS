export class POSH {

    constructor(element, rows = 47, columns = 100) {


        this.terminalElem = document.createElement("div");

        this.rows = { value: rows };
        this.columns = { value: columns };

        this.currentLine = 0;
        this.scrollPos = this.rows.value;

        //calculate width and height of individial characters
        this.terminalElem.style.display = "flex";
        this.terminalElem.style.flexDirection = "column";
        this.terminalElem.style.fontFamily = "monospace";
        this.terminalElem.innerText = "P";
        this.terminalElem.style.position = "absolute";

        element.appendChild(this.terminalElem);

        this.rowSize = this.terminalElem.offsetHeight;
        this.columnSize = this.terminalElem.offsetWidth;
        this.terminalElem.innerText = "";
        element.removeChild(this.terminalElem);

        this.terminalElem.style.height = "100%";
        this.terminalElem.style.width = "100%";
        //generate all of the rows

        this.clear();

        element.appendChild(this.terminalElem);
    }
    clear() {
        this.terminalElem.innerHTML = "";
        for (let i = 1; i <= this.rows.value; i++) {
            let row = document.createElement("span");
            row.style.whiteSpace = "pre";
            row.style.height = `${this.rowSize}px`;
            row.style.width = `${this.columnSize * this.columns.value}px`;
            row.style.overflow = `hidden`;
            this.terminalElem.appendChild(row);
        }
    }
    resizeToContainer() {

        this.rows = { value: Math.floor(this.terminalElem.offsetHeight / this.rowSize) };
        this.columns = { value: Math.floor(this.terminalElem.offsetWidth / this.columnSize) };

        for (let i = 0; i <= this.rows.value; i++) {
            let row = this.terminalElem.querySelectorAll("span")[i];
            if (row) {
                row.style.width = `${this.columnSize * this.columns.value}px`;
                row.style.height = `${this.rowSize}px`;
            } else {
                let row = document.createElement("span");
                row.style.whiteSpace = "pre";
                row.style.height = `${this.rowSize}px`;
                row.style.width = `${this.columnSize * this.columns.value}px`;
                row.style.overflow = `hidden`;
                this.terminalElem.appendChild(row);
            }

            for (let i = this.rows.value; i <= this.terminalElem.querySelectorAll("span"); i++) {
                this.terminalElem.querySelectorAll("span")[i].remove();
            }
            this.scrollPos = this.rows.value;
        }

        console.log("resized to: ", this.rows.value, this.columns.value);
    }
    getLine(number) {
        return this.terminalElem.querySelectorAll("span")[number];
    }
    scroll(amount = 1){
        for(let i = 0; i < amount; i++){
            this.terminalElem.querySelectorAll("span")[i].remove();
            let row = document.createElement("span");
            row.style.whiteSpace = "pre";
            row.style.height = `${this.rowSize}px`;
            row.style.width = `${this.columnSize * this.columns.value}px`;
            row.style.overflow = `hidden`;
            this.terminalElem.appendChild(row);
        }
    }
    say(text) {
        //parse lines into arrays
        let lines = text.split("\n")

        //displays the first line (if the first line isn't nothing)
        let line = this.getLine(this.currentLine);
        if (lines[0] != "") {
            line.innerText = lines[0];
        }

        //if there is a new line, then use it and print
        for (let i = 1; i < lines.length; i++) {
            if(this.currentLine < this.scrollPos){
                this.currentLine++;
            }else{
                this.scroll();
            }
            line = this.getLine(this.currentLine)
            if (lines[i] != "") {
                line.innerText = lines[i];
            }
        }
    }
}
