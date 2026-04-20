//# sourceURL=usr/share/minesweeper/main.js

class MinesweeperApp extends Application {
    constructor() {
        super();
        this.window = document.createElement("paperos-card");
        this.window.setAttribute("applicationLocation", "/usr/share/minesweeper/index.html");
        
        // Slightly different dimensions to perfectly fit the 10x10 grid
        this.window.setAttribute("min-width", "500");
        this.window.setAttribute("min-height", "600");
        this.window.setAttribute("width", "500");
        this.window.setAttribute("height", "600");
        document.body.appendChild(this.window);

        // Game Settings
        this.rows = 10;
        this.cols = 10;
        this.totalMines = 15;
        
        // Game State
        this.board = [];
        this.isGameOver = false;
        this.minesLeft = this.totalMines;
        this.cellsRevealed = 0;
        
        // Number colors for classic minesweeper look
        this.colors = ["", "#0000FA", "#4B802D", "#DB1300", "#202081", "#690400", "#457A7A", "#1B1B1B", "#7A7A7A"];
    }

    async appExecution() {
        this.window.addEventListener("app-active", () => {
            // Mount the shadow DOM
            this.doc = this.window.getElementsByClassName("application")[0].shadowRoot;

            // Grab DOM elements
            this.gridElem = this.doc.getElementById("grid");
            this.mineCountElem = this.doc.getElementById("mineCount");
            this.statusMsgElem = this.doc.getElementById("statusMsg");

            // Bind Event Listeners
            this.doc.getElementById("restartBtn").onclick = () => this.startGame();

            this.startGame();
        });
    }

    startGame() {
        this.isGameOver = false;
        this.minesLeft = this.totalMines;
        this.cellsRevealed = 0;
        this.board = [];
        this.gridElem.innerHTML = "";
        this.mineCountElem.innerText = `Mines: ${this.minesLeft}`;
        this.statusMsgElem.innerText = "Left Click: Reveal | Right Click: Flag";
        this.statusMsgElem.style.color = "#888";

        this.initBoard();
        this.plantMines();
        this.calculateNeighbors();
        this.drawBoard();
    }

    initBoard() {
        for (let r = 0; r < this.rows; r++) {
            let row = [];
            for (let c = 0; c < this.cols; c++) {
                row.push({
                    r: r,
                    c: c,
                    isMine: false,
                    isRevealed: false,
                    isFlagged: false,
                    neighborMines: 0,
                    element: null // Will hold the DOM reference
                });
            }
            this.board.push(row);
        }
    }

    plantMines() {
        let minesPlaced = 0;
        while (minesPlaced < this.totalMines) {
            let r = Math.floor(Math.random() * this.rows);
            let c = Math.floor(Math.random() * this.cols);
            if (!this.board[r][c].isMine) {
                this.board[r][c].isMine = true;
                minesPlaced++;
            }
        }
    }

    calculateNeighbors() {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.board[r][c].isMine) continue;
                
                let count = 0;
                // Check all 8 surrounding cells
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        let nr = r + i;
                        let nc = c + j;
                        if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
                            if (this.board[nr][nc].isMine) count++;
                        }
                    }
                }
                this.board[r][c].neighborMines = count;
            }
        }
    }

    drawBoard() {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                let cell = document.createElement("div");
                cell.classList.add("cell");
                
                // Left Click
                cell.addEventListener("click", () => this.handleLeftClick(r, c));
                
                // Right Click (Prevent default browser menu)
                cell.addEventListener("contextmenu", (e) => {
                    e.preventDefault();
                    this.handleRightClick(r, c);
                });

                this.board[r][c].element = cell;
                this.gridElem.appendChild(cell);
            }
        }
    }

    handleLeftClick(r, c) {
        if (this.isGameOver) return;
        let cell = this.board[r][c];
        
        if (cell.isRevealed || cell.isFlagged) return;

        if (cell.isMine) {
            this.triggerGameOver(false);
            return;
        }

        this.revealCell(r, c);
        this.checkWinCondition();
    }

    handleRightClick(r, c) {
        if (this.isGameOver) return;
        let cell = this.board[r][c];
        
        if (cell.isRevealed) return;

        // Toggle Flag
        cell.isFlagged = !cell.isFlagged;
        if (cell.isFlagged) {
            cell.element.innerText = "🚩";
            cell.element.classList.add("flag");
            this.minesLeft--;
        } else {
            cell.element.innerText = "";
            cell.element.classList.remove("flag");
            this.minesLeft++;
        }
        this.mineCountElem.innerText = `Mines: ${this.minesLeft}`;
    }

    revealCell(r, c) {
        let cell = this.board[r][c];
        if (cell.isRevealed || cell.isFlagged) return;

        cell.isRevealed = true;
        this.cellsRevealed++;
        cell.element.classList.add("revealed");

        if (cell.neighborMines > 0) {
            cell.element.innerText = cell.neighborMines;
            cell.element.style.color = this.colors[cell.neighborMines];
        } else {
            // Recursive Flood Fill for empty spaces
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    let nr = r + i;
                    let nc = c + j;
                    if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
                        this.revealCell(nr, nc);
                    }
                }
            }
        }
    }

    checkWinCondition() {
        let safeCells = (this.rows * this.cols) - this.totalMines;
        if (this.cellsRevealed === safeCells) {
            this.triggerGameOver(true);
        }
    }

    triggerGameOver(isWin) {
        this.isGameOver = true;
        
        if (isWin) {
            this.statusMsgElem.innerText = "YOU WIN!";
            this.statusMsgElem.style.color = "#00FF00";
        } else {
            this.statusMsgElem.innerText = "GAME OVER";
            this.statusMsgElem.style.color = "#ff3333";
        }

        // Reveal all mines
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                let cell = this.board[r][c];
                if (cell.isMine) {
                    cell.element.classList.add("revealed", "mine");
                    cell.element.innerText = "💣";
                } else if (cell.isFlagged && !cell.isMine) {
                    // Show incorrect flags
                    cell.element.innerText = "❌";
                }
            }
        }
    }
}

return MinesweeperApp;
