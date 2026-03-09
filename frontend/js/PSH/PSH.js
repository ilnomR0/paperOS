/**
 *@property {HTMLElement} terminalElem the selected element to be the host for the terminal
  @property {number} rows the number of rows in characters the PSH object is 
  @property {number} columns the number of columns in characters the PSH object is 
  @property {number} currentLine the "pointer" that points to the current selected line on what to "say" next.
  @property {number} scrollPos how far the current line needs to be before the scroll function says it's OK to scroll.
  
  
    
 */
export class PSH {
    /**
    *@param {HTMLElement} element The selected element to render your Paper Shell
    @param {number} [rows = 47] This determines the row size in characters of the given element
    @param {number} [columns = 100] This determines the column size in characters of the given element
    */
    constructor(element, rows = 47, columns = 100) {
        /** @type {HTMLElement} The selected elment to be the host for the terminal*/
        this.terminalElem = document.createElement("div");
        /** @type {{value:number}} The number of rows in characters*/
        this.rows = { value: rows - 1 };
        /** @type {{value:number}} The number of columns in characters*/
        this.columns = { value: columns - 1 };
        /** @type {number} the current line position, is a pointer referencing any line from 0 to n, where n is the number of rows the terminal has*/
        this.currentLine = 0;
        /** @type {number} This defines the line position that the scroll effect will take place */
        this.scrollPos = this.rows.value;

        // Create a hidden measurement span so we get fractional pixel sizes (avoids rounding issues at different zoom levels)
        const meas = document.createElement("span");
        meas.style.position = "absolute";
        meas.style.visibility = "hidden";
        meas.style.whiteSpace = "pre";
        meas.style.fontFamily = "monospace";
        meas.innerText = "P"; // use a representative character
        element.appendChild(meas);

        const rect = meas.getBoundingClientRect();
        this.rowSize = rect.height;
        this.columnSize = rect.width;

        element.removeChild(meas);

        // configure terminal element
        this.terminalElem.style.display = "flex";
        this.terminalElem.style.flexDirection = "column";
        this.terminalElem.style.fontFamily = "monospace";
        this.terminalElem.style.position = "absolute";
        this.terminalElem.style.height = "100%";
        this.terminalElem.style.width = "100%";

        // generate initial rows
        this.clear();

        element.appendChild(this.terminalElem);
    }
    /**
    *Clears the PSH terminal
    */
    clear() {
        this.terminalElem.innerHTML = "";
        // create exactly `rows.value` rows (no off-by-one)
        for (let i = 0; i < this.rows.value; i++) {
            let row = document.createElement("span");
            row.style.whiteSpace = "pre";
            row.style.height = `${this.rowSize}px`;
            row.style.width = `${this.columnSize * this.columns.value}px`;
            row.style.overflow = `hidden`;
            this.terminalElem.appendChild(row);
        }
    }
    /**
    * When this is called, it resizes the rows and columns to match the container elements width and height all in columns
    */
    resizeToContainer() {
        // compute using bounding rects (float) to avoid number rounding errors at different zoom levels
        const containerRect = this.terminalElem.getBoundingClientRect();
        const newRows = Math.max(0, Math.ceil(containerRect.height / this.rowSize));
        const newCols = Math.max(0, Math.ceil(containerRect.width / this.columnSize));

        this.rows.value = newRows - 1;
        this.columns.value = newCols - 1;

        const spans = Array.from(this.terminalElem.querySelectorAll("span"));

        // Update existing rows
        for (let i = 0; i < Math.min(spans.length, newRows); i++) {
            spans[i].style.width = `${this.columnSize * this.columns.value}px`;
            spans[i].style.height = `${this.rowSize}px`;
        }

        // Add missing rows
        for (let i = spans.length; i < newRows; i++) {
            let row = document.createElement("span");
            row.style.whiteSpace = "pre";
            row.style.height = `${this.rowSize}px`;
            row.style.width = `${this.columnSize * this.columns.value}px`;
            row.style.overflow = `hidden`;
            this.terminalElem.appendChild(row);
        }

        // Remove extra rows
        if (spans.length > newRows) {
            for (let i = newRows; i < spans.length; i++) {
                spans[i].remove();
            }
        }

        this.scrollPos = this.rows.value;

        console.log("resized to: ", this.rows.value, this.columns.value);
    }
    /**
    *Gives an HTML object based off of the number of the line to apply styles and getting widths and such.
    @param {number} number the given line number starting at 0 going up to the height of the paper shell application, in characters
    */
    getLine(number) {
        return this.terminalElem.querySelectorAll("span")[number];
    }
    /**
     *This will move all of the contents up by one, deleting the lowest one and adding a new one at the bottom.
     @param {number} [amount=1] the ammount to scroll by. 
     */
    scroll(amount = 1) {
        for (let i = 0; i < amount; i++) {
            this.terminalElem.querySelectorAll("span")[i].remove();
            let row = document.createElement("span");
            row.style.whiteSpace = "pre";
            row.style.height = `${this.rowSize}px`;
            row.style.width = `${this.columnSize * this.columns.value}px`;
            row.style.overflow = `hidden`;
            this.terminalElem.appendChild(row);
        }
    }
    /**
    * This displays text to the terminal at the pointers current line
    * @param {String} text the text that is to be said. Supports newline characters
    */
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
            if (this.currentLine < this.scrollPos) {
                this.currentLine++;
            } else {
                this.scroll();
            }
            line = this.getLine(this.currentLine)
            if (lines[i] != "") {
                line.innerText = lines[i];
            }
        }

    }
}
