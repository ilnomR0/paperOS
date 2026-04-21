//# sourceURL=usr/share/pacman/main.js

class PacmanApp extends Application {
    constructor() {
        super();
        this.window = document.createElement("paperos-card");
        this.window.setAttribute("applicationLocation", "/usr/share/pacman/index.html");
        this.window.setAttribute("min-width", "500");
        this.window.setAttribute("min-height", "600");
        this.window.setAttribute("width", "500");
        this.window.setAttribute("height", "600");
        document.body.appendChild(this.window);

        // Game Configuration
        this.TS = 20; // Tile Size
        this.ROWS = 21;
        this.COLS = 21;
        this.SPEED = 2; // Must divide cleanly into TileSize
        this.GHOST_SPEED = 2;
        
        this.ctx = null;
        this.gameLoop = null;
        this.score = 0;
        this.dotsRemaining = 0;
        this.frightenedTimer = 0;
        this.gameOver = true;

        // Map Legend: 1=Wall, 0=Dot, 2=Power Pellet, 3=Empty/Ghost House
        this.mapLayout = [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
            [1,2,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,2,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,0,1],
            [1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
            [1,1,1,1,1,0,1,1,1,3,1,3,1,1,1,0,1,1,1,1,1],
            [3,3,3,3,1,0,1,3,3,3,3,3,3,3,1,0,1,3,3,3,3],
            [1,1,1,1,1,0,1,3,1,1,3,1,1,3,1,0,1,1,1,1,1],
            [3,3,3,3,3,0,3,3,1,3,3,3,1,3,3,0,3,3,3,3,3],
            [1,1,1,1,1,0,1,3,1,1,1,1,1,3,1,0,1,1,1,1,1],
            [3,3,3,3,1,0,1,3,3,3,3,3,3,3,1,0,1,3,3,3,3],
            [1,1,1,1,1,0,1,3,1,1,1,1,1,3,1,0,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
            [1,0,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1],
            [1,2,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,2,1],
            [1,1,1,0,1,0,1,0,1,1,1,1,1,0,1,0,1,0,1,1,1],
            [1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
            [1,0,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ];
        this.grid = [];
        this.pac = { x: 10*this.TS, y: 15*this.TS, vx: 0, vy: 0, nextVx: 0, nextVy: 0 };
        this.ghosts = [];
    }

    async appExecution() {
        this.window.addEventListener("app-active", () => {
            this.doc = this.window.getElementsByClassName("application")[0].shadowRoot;
            this.canvas = this.doc.getElementById("gameCanvas");
            this.ctx = this.canvas.getContext("2d");
            this.scoreDisplay = this.doc.getElementById("scoreDisplay");
            this.container = this.doc.getElementById("gameContainer");

            this.doc.getElementById("startBtn").onclick = () => this.startGame();
            this.container.addEventListener("keydown", (e) => this.handleInput(e));
            
            this.parseMap();
            this.draw();
        });
    }

    parseMap() {
        this.grid = [];
        this.dotsRemaining = 0;
        for (let r = 0; r < this.ROWS; r++) {
            let row = [];
            for (let c = 0; c < this.COLS; c++) {
                row.push(this.mapLayout[r][c]);
                if (this.mapLayout[r][c] === 0 || this.mapLayout[r][c] === 2) this.dotsRemaining++;
            }
            this.grid.push(row);
        }
    }

    startGame() {
        if (this.gameLoop) cancelAnimationFrame(this.gameLoop);
        this.parseMap();
        this.score = 0;
        this.gameOver = false;
        this.frightenedTimer = 0;
        this.scoreDisplay.innerText = "Score: 0";
        
        // Reset Pacman (Middle bottom)
        this.pac = { x: 10 * this.TS, y: 15 * this.TS, vx: 0, vy: 0, nextVx: 0, nextVy: 0 };

        // Initialize Ghosts
        this.ghosts = [
            { id: 'blinky', color: '#FF0000', x: 10*this.TS, y: 7*this.TS, vx: -this.GHOST_SPEED, vy: 0 },
            { id: 'pinky', color: '#FFB8FF', x: 10*this.TS, y: 9*this.TS, vx: this.GHOST_SPEED, vy: 0 },
            { id: 'inky', color: '#00FFFF', x: 9*this.TS, y: 9*this.TS, vx: 0, vy: -this.GHOST_SPEED },
            { id: 'clyde', color: '#FFB852', x: 11*this.TS, y: 9*this.TS, vx: 0, vy: -this.GHOST_SPEED }
        ];

        this.container.focus();
        this.step();
    }

    handleInput(e) {
        if(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"].includes(e.key)) e.preventDefault();
        if (e.key === "ArrowUp" || e.key === "w") { this.pac.nextVx = 0; this.pac.nextVy = -this.SPEED; }
        if (e.key === "ArrowDown" || e.key === "s") { this.pac.nextVx = 0; this.pac.nextVy = this.SPEED; }
        if (e.key === "ArrowLeft" || e.key === "a") { this.pac.nextVx = -this.SPEED; this.pac.nextVy = 0; }
        if (e.key === "ArrowRight" || e.key === "d") { this.pac.nextVx = this.SPEED; this.pac.nextVy = 0; }
    }

    step() {
        if (this.gameOver) return;
        this.update();
        this.draw();
        this.gameLoop = requestAnimationFrame(() => this.step());
    }

    isWall(x, y) {
        let c = Math.floor(x / this.TS);
        let r = Math.floor(y / this.TS);
        // Wrap around logic for tunnel
        if (c < 0 || c >= this.COLS) return false;
        return this.grid[r][c] === 1;
    }

    update() {
        // --- Pacman Movement & Buffering ---
        // Only allow turns if exactly aligned with grid
        if (this.pac.x % this.TS === 0 && this.pac.y % this.TS === 0) {
            // Try next direction buffer
            if (!this.isWall(this.pac.x + this.pac.nextVx, this.pac.y + this.pac.nextVy)) {
                this.pac.vx = this.pac.nextVx;
                this.pac.vy = this.pac.nextVy;
            }
            // Stop if hitting wall in current direction
            if (this.isWall(this.pac.x + this.pac.vx, this.pac.y + this.pac.vy)) {
                this.pac.vx = 0;
                this.pac.vy = 0;
            }
        }

        this.pac.x += this.pac.vx;
        this.pac.y += this.pac.vy;

        // Tunnel Wrap
        if (this.pac.x < -this.TS) this.pac.x = this.COLS * this.TS;
        if (this.pac.x > this.COLS * this.TS) this.pac.x = -this.TS;

        // Eat Dots
        if (this.pac.x % this.TS === 0 && this.pac.y % this.TS === 0) {
            let c = this.pac.x / this.TS;
            let r = this.pac.y / this.TS;
            if (c >= 0 && c < this.COLS) {
                if (this.grid[r][c] === 0) { // Normal Dot
                    this.grid[r][c] = 3;
                    this.score += 10;
                    this.dotsRemaining--;
                } else if (this.grid[r][c] === 2) { // Power Pellet
                    this.grid[r][c] = 3;
                    this.score += 50;
                    this.dotsRemaining--;
                    this.frightenedTimer = 300; // ~5 seconds at 60fps
                }
                this.scoreDisplay.innerText = "Score: " + this.score;
            }
        }

        if (this.dotsRemaining === 0) this.endGame("YOU WIN!");

        // --- Ghost AI ---
        if (this.frightenedTimer > 0) this.frightenedTimer--;

        for (let g of this.ghosts) {
            // Only decide new path at intersections (grid centers)
            if (g.x % this.TS === 0 && g.y % this.TS === 0) {
                let options = [];
                let dirs = [[0, -this.GHOST_SPEED], [0, this.GHOST_SPEED], [-this.GHOST_SPEED, 0], [this.GHOST_SPEED, 0]];
                
                for (let d of dirs) {
                    // Ghosts cannot reverse direction instantly
                    if (d[0] === -g.vx && d[1] === -g.vy && (g.vx !== 0 || g.vy !== 0)) continue;
                    
                    if (!this.isWall(g.x + d[0], g.y + d[1])) {
                        options.push(d);
                    }
                }

                if (options.length > 0) {
                    let chosenDir = options[0];
                    if (this.frightenedTimer > 0) {
                        // Frightened: Pick random valid intersection
                        chosenDir = options[Math.floor(Math.random() * options.length)];
                    } else {
                        // Chase Logic: Pick tile closest to target
                        let targetX = this.pac.x;
                        let targetY = this.pac.y;

                        // Personality Overrides
                        if (g.id === 'pinky') {
                            targetX += this.pac.vx * 4;
                            targetY += this.pac.vy * 4;
                        } else if (g.id === 'inky') {
                            targetX += (Math.random() > 0.5 ? 40 : -40);
                        } else if (g.id === 'clyde') {
                            let dist = Math.hypot(this.pac.x - g.x, this.pac.y - g.y);
                            if (dist < 5 * this.TS) { targetX = 0; targetY = 400; } // Retreat to corner
                        }

                        let minDist = Infinity;
                        for (let d of options) {
                            let nextX = g.x + d[0];
                            let nextY = g.y + d[1];
                            let dist = Math.hypot(targetX - nextX, targetY - nextY);
                            if (dist < minDist) {
                                minDist = dist;
                                chosenDir = d;
                            }
                        }
                    }
                    g.vx = chosenDir[0];
                    g.vy = chosenDir[1];
                }
            }
            g.x += g.vx;
            g.y += g.vy;

            // Tunnel Wrap for Ghosts
            if (g.x < -this.TS) g.x = this.COLS * this.TS;
            if (g.x > this.COLS * this.TS) g.x = -this.TS;

            // Collision Detection
            let dist = Math.hypot(this.pac.x - g.x, this.pac.y - g.y);
            if (dist < this.TS / 1.5) {
                if (this.frightenedTimer > 0) {
                    // Eat Ghost
                    this.score += 200;
                    g.x = 10 * this.TS; g.y = 9 * this.TS; // Send to house
                    g.vx = 0; g.vy = -this.GHOST_SPEED;
                } else {
                    this.endGame("GAME OVER");
                }
            }
        }
    }

    draw() {
        this.ctx.fillStyle = "#000";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw Map
        for (let r = 0; r < this.ROWS; r++) {
            for (let c = 0; c < this.COLS; c++) {
                let x = c * this.TS;
                let y = r * this.TS;
                if (this.grid[r][c] === 1) {
                    this.ctx.fillStyle = "#1919A6"; // Arcade Blue
                    this.ctx.fillRect(x, y, this.TS, this.TS);
                } else if (this.grid[r][c] === 0) {
                    this.ctx.fillStyle = "#FFF"; // Normal Dot
                    this.ctx.fillRect(x + 8, y + 8, 4, 4);
                } else if (this.grid[r][c] === 2) {
                    this.ctx.fillStyle = "#FFB8AE"; // Power Pellet
                    this.ctx.beginPath();
                    this.ctx.arc(x + 10, y + 10, 6, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }
        }

        // Draw Pacman
        this.ctx.fillStyle = "#FFFF00";
        this.ctx.beginPath();
        // A simple mouth animation based on grid position
        let mouthOpen = (this.pac.x % this.TS < this.TS/2) && (this.pac.y % this.TS < this.TS/2);
        this.ctx.arc(this.pac.x + 10, this.pac.y + 10, 8, mouthOpen ? 0.2 : 0, Math.PI * 2 - (mouthOpen ? 0.2 : 0));
        this.ctx.lineTo(this.pac.x + 10, this.pac.y + 10);
        this.ctx.fill();

        // Draw Ghosts
        for (let g of this.ghosts) {
            this.ctx.fillStyle = (this.frightenedTimer > 0) ? "#0000FF" : g.color;
            if (this.frightenedTimer > 0 && this.frightenedTimer < 60 && this.frightenedTimer % 10 < 5) {
                this.ctx.fillStyle = "#FFF"; // Flash before running out
            }
            
            this.ctx.beginPath();
            this.ctx.arc(g.x + 10, g.y + 10, 8, Math.PI, 0);
            this.ctx.lineTo(g.x + 18, g.y + 18);
            this.ctx.lineTo(g.x + 10, g.y + 14);
            this.ctx.lineTo(g.x + 2, g.y + 18);
            this.ctx.fill();
        }
    }

    endGame(msg) {
        this.gameOver = true;
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "#FFFF00";
        this.ctx.font = "30px monospace";
        this.ctx.textAlign = "center";
        this.ctx.fillText(msg, this.canvas.width / 2, this.canvas.height / 2);
    }
}

return PacmanApp;
