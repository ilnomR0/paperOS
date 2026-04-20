//# sourceURL=usr/share/snake/main.js

class SnakeApp extends Application {
    constructor() {
        super();
        this.window = document.createElement("paperos-card");
        this.window.setAttribute("applicationLocation", "/usr/share/snake/index.html");
        this.window.setAttribute("min-width", "700");
        this.window.setAttribute("min-height", "650");
        this.window.setAttribute("width", "700");
        this.window.setAttribute("height", "650");
        document.body.appendChild(this.window);

        // App-specific state
        this.canvas = null;
        this.ctx = null;
        this.gridSize = 20;
        this.snake = [];
        this.food = { x: 0, y: 0 };
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.gameLoop = null;
        this.speed = 120; // Milliseconds per frame
    }

    async appExecution() {
        this.window.addEventListener("app-active", () => {
            // Mount the shadow DOM
            this.window.document = this.window.getElementsByClassName("application")[0].shadowRoot;

            // Grab DOM elements
            this.canvas = this.window.document.getElementById("gameCanvas");
            this.ctx = this.canvas.getContext("2d");
            this.scoreDisplay = this.window.document.getElementById("scoreDisplay");
            this.container = this.window.document.getElementById("gameContainer");

            // Bind Event Listeners
            this.window.document.getElementById("startBtn").onclick = () => this.startGame();
            
            // Listen for keypresses strictly inside this app's container
            this.container.addEventListener("keydown", (e) => this.handleInput(e));

            // Draw initial empty board
            this.draw();
        });
    }

    handleInput(e) {
        // Prevent arrows/space from scrolling the whole OS while playing
        if(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
            e.preventDefault();
        }

        // Change direction (but prevent 180-degree self-destruction turns)
        if ((e.key === "ArrowUp" || e.key === "w") && this.dy === 0) { this.dx = 0; this.dy = -1; }
        if ((e.key === "ArrowDown" || e.key === "s") && this.dy === 0) { this.dx = 0; this.dy = 1; }
        if ((e.key === "ArrowLeft" || e.key === "a") && this.dx === 0) { this.dx = -1; this.dy = 0; }
        if ((e.key === "ArrowRight" || e.key === "d") && this.dx === 0) { this.dx = 1; this.dy = 0; }
    }

    startGame() {
        // Reset state
        if (this.gameLoop) clearTimeout(this.gameLoop);
        this.snake = [{ x: 10, y: 10 }];
        this.dx = 1;
        this.dy = 0;
        this.score = 0;
        this.speed = 120;
        this.scoreDisplay.innerText = "Score: " + this.score;
        
        this.placeFood();
        
        // Force focus onto the game container so keys work immediately without clicking
        this.container.focus();

        this.step(); // Start the loop
    }

    placeFood() {
        const cols = this.canvas.width / this.gridSize;
        const rows = this.canvas.height / this.gridSize;
        
        // Ensure food doesn't spawn inside the snake
        let valid = false;
        while (!valid) {
            this.food = {
                x: Math.floor(Math.random() * cols),
                y: Math.floor(Math.random() * rows)
            };
            valid = !this.snake.some(part => part.x === this.food.x && part.y === this.food.y);
        }
    }

    step() {
        this.update();
        this.draw();
        
        // If dx and dy are 0, the game is over
        if (this.dx !== 0 || this.dy !== 0) {
            this.gameLoop = setTimeout(() => this.step(), this.speed);
        }
    }

    update() {
        const head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };
        const cols = this.canvas.width / this.gridSize;
        const rows = this.canvas.height / this.gridSize;

        // 1. Check Wall Collision
        if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
            this.gameOver();
            return;
        }

        // 2. Check Self Collision
        for (let part of this.snake) {
            if (head.x === part.x && head.y === part.y) {
                this.gameOver();
                return;
            }
        }

        // Move snake forward
        this.snake.unshift(head);

        // 3. Check Food Collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.scoreDisplay.innerText = "Score: " + this.score;
            this.placeFood();
            
            // Speed up slightly every time you eat
            if (this.speed > 50) this.speed -= 3;
        } else {
            // Remove tail if no food eaten
            this.snake.pop();
        }
    }

    draw() {
        // Clear board
        this.ctx.fillStyle = "#111";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw Food
        this.ctx.fillStyle = "#FF3333";
        this.ctx.fillRect(this.food.x * this.gridSize + 1, this.food.y * this.gridSize + 1, this.gridSize - 2, this.gridSize - 2);

        // Draw Snake
        this.ctx.fillStyle = "#00FF00";
        for (let part of this.snake) {
            this.ctx.fillRect(part.x * this.gridSize + 1, part.y * this.gridSize + 1, this.gridSize - 2, this.gridSize - 2);
        }
    }

    gameOver() {
        this.dx = 0;
        this.dy = 0;
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "#FFF";
        this.ctx.font = "35px monospace";
        this.ctx.textAlign = "center";
        this.ctx.fillText("GAME OVER", this.canvas.width / 2, this.canvas.height / 2);
    }
}

return SnakeApp;
