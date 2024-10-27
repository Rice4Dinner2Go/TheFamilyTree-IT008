// Cả cái chương trình này dùng để vẽ cái background mà nó di chuyển đc
// Đi cùng với canvas.css

const canvas = document.querySelector('.draggable-canvas');
let isDragging = false;
let currentX = 0;
let currentY = 0;
let initialX = 0;
let initialY = 0;

canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    canvas.classList.add('dragging');
    initialX = e.clientX - currentX;
    initialY = e.clientY - currentY;
});

window.addEventListener('mousemove', (e) => {
    if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        canvas.style.transform = 
            `translate(${currentX}px, ${currentY}px)`;
    }
});

window.addEventListener('mouseup', () => {
    isDragging = false;
    canvas.classList.remove('dragging');
});

canvas.addEventListener('touchstart', (e) => {
    isDragging = true;
    canvas.classList.add('dragging');
    initialX = e.touches[0].clientX - currentX;
    initialY = e.touches[0].clientY - currentY;
});

window.addEventListener('touchmove', (e) => {
    if (isDragging) {
        e.preventDefault();
        currentX = e.touches[0].clientX - initialX;
        currentY = e.touches[0].clientY - initialY;
        canvas.style.transform = 
            `translate(${currentX}px, ${currentY}px)`;
    }
});

window.addEventListener('touchend', () => {
    isDragging = false;
    canvas.classList.remove('dragging');
});