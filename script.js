const lines = [
    "Para o amor da minha vida...",
    "Obrigado por estar sempre ao meu lado.",
    "E fazer meus dias MUITO mais felizes.",
    "Você é a melhor coisa que já me aconteceu.",
    "— Eu te amo..."
];

const startDate = new Date(2026, 2, 27, 0, 0, 0); 

const startBtn = document.getElementById('startBtn');
const card = document.querySelector('.card');
const textContainer = document.getElementById('text-container');
const canvas = document.getElementById('treeCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;

let hearts = [];
let fallingHearts = [];
let animationStarted = false;
let groundWidth = 0;
let treeGrowth = 0;
let currentLineIndex = 0;

function resizeCanvas() {
    if (!canvas || !canvas.parentElement) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    if (canvas.width !== rect.width || canvas.height !== rect.height) {
        canvas.width = rect.width;
        canvas.height = rect.height;
    }
}

function updateCounter() {
    const now = new Date();
    let diff = now - startDate;
    if (diff < 0) diff = 0;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (daysEl) daysEl.innerText = days;
    if (hoursEl) hoursEl.innerText = hours;
    if (minutesEl) minutesEl.innerText = minutes;
    if (secondsEl) secondsEl.innerText = seconds;
}

function createHeartCanopy() {
    if (!canvas) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    const initialScale = Math.min(rect.width, rect.height) * 0.019;
    const colors = ['#e84393', '#d63031', '#fdcb6e', '#ff7675', '#a29bfe', '#fd79a8'];

    for (let i = 0; i < 2800; i++) {
        let t = Math.PI * 2 * Math.random();
        let r = Math.pow(Math.random(), 0.6);
        let x = 16 * Math.pow(Math.sin(t), 3) * r;
        let y = (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)) * r;
        
        hearts.push({
            relX: x * initialScale + (Math.random() - 0.5) * 12,
            relY: y * initialScale + (Math.random() - 0.5) * 12,
            size: Math.random() * 3.5 + 1.5,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: 0
        });
    }
}

function drawHeartShape(x, y, size, color, alpha) {
    if (!ctx) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
    ctx.bezierCurveTo(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
    ctx.fill();
    ctx.restore();
}

function typeNextLine() {
    if (!textContainer) return;

    if (currentLineIndex < lines.length) {
        const p = document.createElement('p');
        p.className = 'text-line typing';
        if (currentLineIndex === lines.length - 1) {
            p.classList.add('signature');
        }
        textContainer.appendChild(p);

        const fullText = lines[currentLineIndex];
        let charIndex = 0;

        function typeChar() {
            if (charIndex < fullText.length) {
                p.innerText += fullText.charAt(charIndex);
                charIndex++;
                setTimeout(typeChar, 75);
            } else {
                p.classList.remove('typing');
                currentLineIndex++;
                
                if (currentLineIndex < lines.length) {
                    setTimeout(typeNextLine, 1200);
                } else {
                    // === PARTE DA FOTO: Ativa a exibição em coração logo aqui ===
                    setTimeout(() => {
                        const photoDiv = document.getElementById('photo-container');
                        if (photoDiv) {
                            photoDiv.classList.add('show');
                        }
                    }, 800);
                }
            }
        }
        typeChar();
    }
}

function animate() {
    if (!canvas || !ctx) return;
    
    resizeCanvas();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const baseY = canvas.height * 0.9;
    const maxGround = canvas.width * 0.85;
    const colors = ['#e84393', '#d63031', '#fdcb6e', '#ff7675', '#a29bfe', '#fd79a8'];

    if (groundWidth < maxGround) groundWidth += 6;
    if (groundWidth > maxGround) groundWidth = maxGround;

    ctx.beginPath();
    ctx.moveTo(centerX - groundWidth / 2, baseY);
    ctx.lineTo(centerX + groundWidth / 2, baseY);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    if (groundWidth >= maxGround * 0.4) {
        if (treeGrowth < 1) treeGrowth += 0.006;
        
        const trunkTopY = baseY - (canvas.height * 0.45 * Math.min(treeGrowth, 1));
        ctx.beginPath();
        ctx.moveTo(centerX, baseY);
        ctx.lineTo(centerX, trunkTopY);
        ctx.strokeStyle = '#2ecc71';
        ctx.lineWidth = 4;
        ctx.stroke();

        if (treeGrowth > 0.5) {
            let branchGrowth = Math.min((treeGrowth - 0.5) * 2, 1);
            ctx.lineWidth = 2.5;
            
            ctx.beginPath();
            ctx.moveTo(centerX, baseY - (canvas.height * 0.2));
            ctx.quadraticCurveTo(centerX - 10 * branchGrowth, baseY - (canvas.height * 0.25), centerX - 30 * branchGrowth, baseY - (canvas.height * 0.35));
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(centerX, baseY - (canvas.height * 0.28));
            ctx.quadraticCurveTo(centerX + 15 * branchGrowth, baseY - (canvas.height * 0.32), centerX + 35 * branchGrowth, baseY - (canvas.height * 0.4));
            ctx.stroke();
        }
    }

    if (treeGrowth > 0.8) {
        const centerY = canvas.height * 0.38;
        hearts.forEach(h => {
            if (h.alpha < 1) h.alpha += 0.015;
            drawHeartShape(centerX + h.relX, centerY - h.relY, h.size, h.color, h.alpha);
        });

        if (Math.random() < 0.25) {
            fallingHearts.push({
                relX: - (canvas.width * 0.28) + Math.random() * (canvas.width * 0.56),
                y: canvas.height * 0.15 + Math.random() * (canvas.height * 0.25),
                size: Math.random() * 4 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                speedY: Math.random() * 0.9 + 0.5,
                speedX: (Math.random() - 0.5) * 0.5
            });
        }
    }

    for (let i = fallingHearts.length - 1; i >= 0; i--) {
        let fh = fallingHearts[i];
        fh.y += fh.speedY;
        fh.relX += fh.speedX;
        drawHeartShape(centerX + fh.relX, fh.y, fh.size, fh.color, 0.8);
        if (fh.y > baseY - 2) {
            fallingHearts.splice(i, 1);
        }
    }

    requestAnimationFrame(animate);
}

if (startBtn) {
    startBtn.addEventListener('click', () => {
        if (animationStarted) return;
        animationStarted = true;
        
        startBtn.style.animation = 'none';
        
        requestAnimationFrame(() => {
            setTimeout(() => {
                startBtn.style.transition = 'top 1s ease-in, transform 1s ease-in, background-color 1s, opacity 0.3s ease 0.8s';
                startBtn.style.top = '85%';
                startBtn.style.transform = 'translate(-50%, -50%) scale(0.4)';
                startBtn.style.backgroundColor = '#5c3a21'; 
                startBtn.style.boxShadow = 'none';
                startBtn.style.opacity = '0';
            }, 50);
        });

        setTimeout(() => {
            startBtn.style.display = 'none';
            
            resizeCanvas();
            createHeartCanopy();
            
            setInterval(updateCounter, 1000);
            updateCounter();
            animate();

            setTimeout(() => {
                if (card) card.classList.add('layout-shifted');
                setTimeout(typeNextLine, 1500);
            }, 3000);

        }, 1100);
    });
}

window.addEventListener('resize', resizeCanvas);