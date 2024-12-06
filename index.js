const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const rules = document.getElementById('rules');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const diffBtn = document.getElementById('difficulty');
const trashImage = new Image();
trashImage.src = 'Images/trash1.png'; 
trashImage.src = 'Images/trash2.png'; 
trashImage.src = 'Images/trash3.png'; 
const trashes = [];
//test
var j = 0;
let imagestab = ['Images/trash1.png', 'Images/trash2.png', 'Images/trash3.png'];
let score = 0;
let hasTouchedPaddle = false;
const background = new Image();
background.src = 'https://i.gifer.com/WlSu.gif'; // Remplace par le chemin de ton image

// Dessiner l'image une fois qu'elle est chargée
background.onload = function() {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
};
// Balle
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 9,
    speed: 0,
    dx: 0,
    dy: 0,
};

// Barre (paddle)
const paddle = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 20,
    w: 130,
    h: 9,
    speed: 8,
    dx: 0,
};

// Lancer le jeu
function startGame() {
    const startBtn = document.getElementById('start');
    startBtn.style.display = 'none';
    diffBtn.style.display = 'block';
}

// Cacher les choix de difficulté
function hideDiff() {
    diffBtn.style.display = 'none';
}

// Modes de difficulté
function easyMode() {
    ball.speed = 1.8;
    ball.dx = 2;
    ball.dy = -2;
    hideDiff();
    initTrashes(3); // 5 déchets pour le mode facile
}

function mediumMode() {
    ball.speed = 2.8;
    ball.dx = 5.2;
    ball.dy = -5.2;
    hideDiff();
}

function hardMode() {
    ball.speed = 4.6;
    ball.dx = 5.9;
    ball.dy = -5.9;
    hideDiff();
}

function initTrashes(count) {
    for (let i = 0; i < count; i++) {
        trashes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height / 2, // Départ dans la partie haute du canvas
            size: 20,
            dx: (Math.random() * 2 - 1) * 4, // Vitesse horizontale aléatoire
            dy: (Math.random() * 2 + 2),    // Vitesse verticale aléatoire
        });
    }
}

// Dessiner la balle
function drawBall() {
    ctx.drawImage(trashImage, ball.x - ball.size, ball.y - ball.size, ball.size * 5, ball.size * 5);
}

trashImage.onload = () => {
    update(); 
};

function drawTrashes() {
    trashes.forEach(trash => {
        ctx.drawImage(trashImage, trash.x - trash.size, trash.y - trash.size, trash.size * 2, trash.size * 2);
    });
}

// Dessiner la barre
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.fillStyle = '#6B5B95';
    ctx.fill();
    ctx.closePath();
}

// Dessiner le score
function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

// Déplacement de la barre
function movePaddle() {
    paddle.x += paddle.dx;

    // Collision avec les murs
    if (paddle.x + paddle.w > canvas.width) {
        paddle.x = canvas.width - paddle.w;
    }

    if (paddle.x < 0) {
        paddle.x = 0;
    }
}

// Déplacement de la balle
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Collision avec les murs (droite/gauche)
    if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
        ball.dx *= -1;
    }

    // Collision avec le haut
    if (ball.y - ball.size < 0) {
        ball.dy *= -1;

        if (hasTouchedPaddle) {
            j++;
            trashImage.src = imagestab[j % 3];
            // Change la taille de la balle
        }
    }

    // Collision avec la barre
    if (
        ball.x - ball.size > paddle.x &&
        ball.x + ball.size < paddle.x + paddle.w &&
        ball.y + ball.size > paddle.y
    ) {
        hasTouchedPaddle = true; // La balle a touché la barre
        ball.dy = -ball.speed;
        score= score + 1;
        if (score == 5){
            document.querySelector('.win').style.display = 'block';
            update();
            pauseGame();
        }
    }

    // Perte si la balle touche le bas
    if (ball.y + ball.size > canvas.height) {
        score = 0;
        pauseGame();
        document.querySelector('.lose').style.display = 'block';
    }
   
}

// Pause du jeu après une perte
function pauseGame() {
    ball.speed = 0;
    ball.dx = 0;
    ball.dy = 0;
    paddle.dx = 0;
}

// Dessiner tout
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawScore();
}

// Mettre à jour l'animation
function update() {
    movePaddle();
    moveBall();
    draw();
    requestAnimationFrame(update);
}

// Gestion des mouvements avec la souris
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    // Ajuster la position de la barre
    paddle.x = mouseX - paddle.w / 2;

    // Empêcher la barre de sortir des limites
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.w > canvas.width) paddle.x = canvas.width - paddle.w;
});

// Gestion des événements clavier
function keyDown(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        paddle.dx = paddle.speed;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.dx = -paddle.speed;
    }
}

function keyUp(e) {
    if (
        e.key === 'Right' ||
        e.key === 'ArrowRight' ||
        e.key === 'Left' ||
        e.key === 'ArrowLeft'
    ) {
        paddle.dx = 0;
    }
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// Règles
rulesBtn.addEventListener('click', () => rules.classList.add('show'));
closeBtn.addEventListener('click', () => rules.classList.remove('show'));

// Initialiser le jeu
update();
