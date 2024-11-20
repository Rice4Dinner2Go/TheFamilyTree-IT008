//Di chuyển qua lại giữa các trang html, có chèn animation

const pages = new Map([
    ["tree", "../page_Tree.html"],
    ["main", "../index.html"]
]);

document.addEventListener('DOMContentLoaded', () => {
    enterPage();
});

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const enterPage = async () => {
    const overlay_left = document.createElement('div');
    const overlay_right = document.createElement('div');
    overlay_left.className = 'transition-overlay from-left transition-active';
    overlay_right.className = 'transition-overlay from-right transition-active';
    document.body.appendChild(overlay_left);
    document.body.appendChild(overlay_right);
    await sleep(200);
    overlay_left.classList.remove('transition-active');
    overlay_right.classList.remove('transition-active');
}

const goToPage = async (page) => {
    const overlay = document.getElementsByClassName('transition-overlay');
    overlay[0].classList.add('transition-active');
    overlay[1].classList.add('transition-active');
    
    // Chờ hoạt ảnh
    await sleep(200);
    
    // Chuyển trang
    window.location.href = pages.get(page);
}