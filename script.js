// --- Elements ---
const giftBox = document.getElementById('giftBox');
const giftStage = document.getElementById('gift-stage');
const cardStage = document.getElementById('card-stage');
const musicBtn = document.getElementById('musicBtn');
const balloonBtn = document.getElementById('balloonBtn');
const audio = document.getElementById('birthdayAudio');
const balloonContainer = document.getElementById('balloon-container');
const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');

let isMusicPlaying = false;

// --- Music Toggle ---
musicBtn.addEventListener('click', () => {
    if (!isMusicPlaying) {
        audio.play().then(() => {
            musicBtn.innerHTML = "⏸ Pause Music";
            musicBtn.style.background = "#fd79a8"; // Change color to pink
            isMusicPlaying = true;
        }).catch(error => {
            alert("Please make sure 'happy_birthday.mp3' is in the folder!");
            console.log("Audio play failed: ", error);
        });
    } else {
        audio.pause();
        musicBtn.innerHTML = '<span class="btn-number">1</span> 🎵 Play Music';
        musicBtn.style.background = "#a29bfe"; // Revert to purple
        isMusicPlaying = false;
    }
});

// --- Balloon Generator ---
const balloonColors = ['#fd79a8', '#6c5ce7', '#00b894', '#fab1a0', '#74b9ff'];

balloonBtn.addEventListener('click', () => {
    createBalloonBatch();
});

function createBalloonBatch() {
    for (let i = 0; i < 15; i++) {
        setTimeout(spawnBalloon, i * 150); // Stagger them slightly
    }
}

function spawnBalloon() {
    const balloon = document.createElement('div');
    balloon.classList.add('balloon');
    // Random position and color
    balloon.style.left = Math.random() * 100 + 'vw';
    balloon.style.background = balloonColors[Math.floor(Math.random() * balloonColors.length)];
    // Random size variance
    const size = Math.random() * 20 + 40; 
    balloon.style.width = size + 'px';
    balloon.style.height = (size * 1.2) + 'px';
    
    balloonContainer.appendChild(balloon);

    // Remove balloon from DOM after animation finishes (6s)
    setTimeout(() => {
        balloon.remove();
    }, 6000);
}

// --- Gift Opening & Confetti ---
giftBox.addEventListener('click', () => {
    giftStage.classList.add('hidden');
    cardStage.classList.remove('hidden');
    startConfetti();
});

// Confetti Setup
let confetti = [];
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class ConfettiParticle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.size = Math.random() * 10 + 5;
        // Pony Colors: Pink, Purple, Cyan, White
        const colors = ['#fd79a8', '#6c5ce7', '#81ecec', '#ffffff'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 3 + 2;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 4 - 2;
    }
    update() {
        this.y += this.speedY;
        this.x += Math.sin(this.y * 0.01) + this.speedX; // Wobbly fall
        this.rotation += this.rotationSpeed;
        
        if (this.y > canvas.height) {
            this.y = -10;
            this.x = Math.random() * canvas.width;
        }
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;
        // Draw circle confetti (dots)
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function startConfetti() {
    // Center the initial burst of confetti more
    for (let i = 0; i < 150; i++) {
        confetti.push(new ConfettiParticle());
    }
    animateConfetti();
}

function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confetti.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateConfetti);
}
