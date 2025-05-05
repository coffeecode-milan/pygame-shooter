// Get canvas and context
const canvas = document.getElementById('pong');
const context = canvas.getContext('2d');

// Create the ball object
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    color: 'WHITE'
};

// Create the paddle object
const paddleWidth = 10, paddleHeight = 100;
const user = {
    x: 0, // left side
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: 'WHITE',
    score: 0
};

const com = {
    x: canvas.width - paddleWidth, // right side
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: 'WHITE',
    score: 0
};

// Create the net object
const net = {
    x: canvas.width / 2 - 1,
    y: 0,
    width: 2,
    height: canvas.height,
    color: 'WHITE'
};

// Draw rectangle
function drawRect(x, y, w, h, color) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}

// Draw circle
function drawCircle(x, y, r, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
}

// Draw text
function drawText(text, x, y, color) {
    context.fillStyle = color;
    context.font = '45px Arial';
    context.fillText(text, x, y);
}

// Render the game elements
function render() {
    // Clear the canvas
    drawRect(0, 0, canvas.width, canvas.height, 'BLACK');

    // Draw the net
    drawRect(net.x, net.y, net.width, net.height, net.color);

    // Draw the score
    drawText(user.score, canvas.width / 4, canvas.height / 5, 'WHITE');
    drawText(com.score, 3 * canvas.width / 4, canvas.height / 5, 'WHITE');

    // Draw the paddles
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);

    // Draw the ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

// Control user paddle
canvas.addEventListener('mousemove', movePaddle);

function movePaddle(evt) {
    let rect = canvas.getBoundingClientRect();
    user.y = evt.clientY - rect.top - user.height / 2;
}

// Collision detection
function collision(b, p) {
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
}

// Reset the ball position
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
}

// Update: positions, score, movement
function update() {
    // Move the ball
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // AI paddle movement
    com.y += ((ball.y - (com.y + com.height / 2))) * 0.1;

    // Ball collision with top and bottom wall
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
    }

    // Ball collision with paddles
    let player = (ball.x < canvas.width / 2) ? user : com;
    
    if (collision(ball, player)) {
        // Where the ball hits the paddle
        let collidePoint = (ball.y - (player.y + player.height / 2));
        collidePoint = collidePoint / (player.height / 2);

        // Angle of the ball
        let angleRad = collidePoint * Math.PI / 4;

        // Direction of the ball
        let direction = (ball.x < canvas.width / 2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        // Speed up the ball after each hit
        ball.speed += 0.5;
    }

    // Update the score
    if (ball.x - ball.radius < 0) {
        // Com wins
        com.score++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        // User wins
        user.score++;
        resetBall();
    }
}

// Game loop
function game() {
    update();
    render();
}

// Call the game function 60 times per second
const framePerSecond = 60;
setInterval(game, 1000 / framePerSecond);
