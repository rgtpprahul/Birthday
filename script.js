// Clock with Hour and Minute Hand
const clockCanvas = document.getElementById("clockCanvas");
const clockCtx = clockCanvas.getContext("2d");

function drawClock() {
    const now = new Date();
    const sec = now.getSeconds();
    const min = now.getMinutes();
    const hr = now.getHours();

    clockCtx.clearRect(0, 0, clockCanvas.width, clockCanvas.height);

    // Draw clock face
    clockCtx.beginPath();
    clockCtx.arc(150, 150, 140, 0, 2 * Math.PI);
    clockCtx.fillStyle = "#fff";
    clockCtx.fill();
    clockCtx.stroke();

    // Draw hour hand
    const hrAngle = ((hr % 12) * Math.PI) / 6 + (min * Math.PI) / 360;
    clockCtx.lineWidth = 8;
    clockCtx.beginPath();
    clockCtx.moveTo(150, 150);
    clockCtx.lineTo(150 + 60 * Math.cos(hrAngle - Math.PI / 2), 150 + 60 * Math.sin(hrAngle - Math.PI / 2));
    clockCtx.stroke();

    // Draw minute hand
    const minAngle = (min * Math.PI) / 30;
    clockCtx.lineWidth = 6;
    clockCtx.beginPath();
    clockCtx.moveTo(150, 150);
    clockCtx.lineTo(150 + 90 * Math.cos(minAngle - Math.PI / 2), 150 + 90 * Math.sin(minAngle - Math.PI / 2));
    clockCtx.stroke();

    // Draw second hand
    const secAngle = (sec * Math.PI) / 30;
    clockCtx.lineWidth = 4;
    clockCtx.beginPath();
    clockCtx.moveTo(150, 150);
    clockCtx.lineTo(150 + 100 * Math.cos(secAngle - Math.PI / 2), 150 + 100 * Math.sin(secAngle - Math.PI / 2));
    clockCtx.strokeStyle = "red";
    clockCtx.stroke();
}

setInterval(drawClock, 1000);

// Slideshow Image Change Every Second
const images = [
    "IMG-20190828-WA0119.jpg",
    "IMG-20190828-WA0160.jpg",
    "IMG-20190828-WA0162.jpg",
    "IMG-20190828-WA0237.jpg",
    "IMG-20200128-WA0006.jpg"
];

let currentImageIndex = 0;
const slideElement = document.getElementById('slide');

function changeSlide() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    slideElement.src = images[currentImageIndex];
}

setInterval(changeSlide, 1000); // Change image every second

// Fireworks VFX

const PI2 = Math.PI * 2;
const random = (min, max) => Math.random() * (max - min + 1) + min | 0;
const timestamp = _ => new Date().getTime();

class Birthday {
    constructor() {
        this.resize();

        // create a lovely place to store the firework
        this.fireworks = [];
        this.counter = 0;
    }

    resize() {
        this.width = canvas.width = window.innerWidth;
        let center = this.width / 2 | 0;
        this.spawnA = center - center / 4 | 0;
        this.spawnB = center + center / 4 | 0;

        this.height = canvas.height = window.innerHeight;
        this.spawnC = this.height * 0.1;
        this.spawnD = this.height * 0.5;
    }

    onClick(evt) {
        let x = evt.clientX || evt.touches && evt.touches[0].pageX;
        let y = evt.clientY || evt.touches && evt.touches[0].pageY;

        let count = random(3, 5);
        for (let i = 0; i < count; i++) this.fireworks.push(new Firework(
            random(this.spawnA, this.spawnB),
            this.height,
            x,
            y,
            random(0, 260),
            random(30, 110)));

        this.counter = -1;
    }

    update(delta) {
        ctx.globalCompositeOperation = 'hard-light';
        ctx.fillStyle = `rgba(20,20,20,${7 * delta})`;
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.globalCompositeOperation = 'lighter';
        for (let firework of this.fireworks) firework.update(delta);

        this.counter += delta * 3;
        if (this.counter >= 1) {
            this.fireworks.push(new Firework(
                random(this.spawnA, this.spawnB),
                this.height,
                random(0, this.width),
                random(this.spawnC, this.spawnD),
                random(0, 360),
                random(30, 110)));
            this.counter = 0;
        }

        if (this.fireworks.length > 1000) this.fireworks = this.fireworks.filter(firework => !firework.dead);
    }
}

class Firework {
    constructor(x, y, targetX, targetY, shade, offsprings) {
        this.dead = false;
        this.offsprings = offsprings;
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.shade = shade;
        this.history = [];
    }

    update(delta) {
        if (this.dead) return;

        let xDiff = this.targetX - this.x;
        let yDiff = this.targetY - this.y;

        if (Math.abs(xDiff) > 3 || Math.abs(yDiff) > 3) {
            this.x += xDiff * 2 * delta;
            this.y += yDiff * 2 * delta;

            this.history.push({
                x: this.x,
                y: this.y
            });

            if (this.history.length > 20) this.history.shift();
        } else {
            if (this.offsprings && !this.madeChilds) {
                let babies = this.offsprings / 2;
                for (let i = 0; i < babies; i++) {
                    let targetX = this.x + this.offsprings * Math.cos(PI2 * i / babies) | 0;
                    let targetY = this.y + this.offsprings * Math.sin(PI2 * i / babies) | 0;
                    birthday.fireworks.push(new Firework(this.x, this.y, targetX, targetY, this.shade, 0));
                }
            }
            this.madeChilds = true;
            this.history.shift();
        }

        if (this.history.length === 0) this.dead = true;
        else if (this.offsprings) {
            for (let i = 0; i < this.history.length; i++) {
                let point = this.history[i];
                ctx.beginPath();
                ctx.fillStyle = `hsl(${this.shade},100%,${i}%)`;
                ctx.arc(point.x, point.y, 1, 0, PI2, false);
                ctx.fill();
            }
        } else {
            ctx.beginPath();
            ctx.fillStyle = `hsl(${this.shade},100%,50%)`;
            ctx.arc(this.x, this.y, 1, 0, PI2, false);
            ctx.fill();
        }
    }
}

const canvas = document.getElementById('birthday');
const ctx = canvas.getContext('2d');

let then = timestamp();
const birthday = new Birthday();

window.onresize = () => birthday.resize();
document.onclick = evt => birthday.onClick(evt);
document.ontouchstart = evt => birthday.onClick(evt);

(function loop() {
    requestAnimationFrame(loop);

    let now = timestamp();
    let delta = now - then;

    then = now;
    birthday.update(delta / 1000);
})();
// Clock functionality
function updateClock() {
    const clock = document.querySelector('.clock');
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clock.textContent = `${hours}:${minutes}:${seconds}`;
}

// Slideshow functionality
let slideIndex = 0;
function showSlides() {
    const slides = document.querySelectorAll('.slide');
    slides.forEach((slide, index) => {
        slide.style.opacity = index === slideIndex ? 1 : 0;
    });
    slideIndex = (slideIndex + 1) % slides.length;
}

// Initialize clock and slideshow
setInterval(updateClock, 1000);
setInterval(showSlides, 5000);

// Initial calls
updateClock();
showSlides();