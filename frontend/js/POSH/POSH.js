export class POSH {

    constructor(element, rows = 47, columns = 100) {
        this.terminalElem = document.createElement("div");

        this.rows = { value: rows - 1 };
        this.columns = { value: columns - 1 };

        this.currentLine = 0;
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
    resizeToContainer() {
        // compute using bounding rects (float) to avoid integer rounding errors at different zoom levels
        const containerRect = this.terminalElem.getBoundingClientRect();
        const newRows = Math.max(0, Math.floor(containerRect.height / this.rowSize));
        const newCols = Math.max(0, Math.floor(containerRect.width / this.columnSize));

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
    getLine(number) {
        return this.terminalElem.querySelectorAll("span")[number];
    }
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
