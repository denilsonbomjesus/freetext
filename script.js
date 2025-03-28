const resizeHandle = document.getElementById('resize-handle');
const textarea = document.getElementById('textarea');
let isResizing = false;

const startResize = (e) => {
    isResizing = true;
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', stopResize);
    document.addEventListener('touchmove', handleResize);
    document.addEventListener('touchend', stopResize);
};

const stopResize = () => {
    isResizing = false;
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', stopResize);
    document.removeEventListener('touchmove', handleResize);
    document.removeEventListener('touchend', stopResize);
};

const handleResize = (e) => {
    if (!isResizing) return;
    const container = textarea.parentElement;
    const containerRect = container.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    const maxWidth = window.innerWidth - 40;
    const maxHeight = window.innerHeight - 40;
    const newWidth = Math.min(touch.clientX - containerRect.left, maxWidth);
    const newHeight = Math.min(touch.clientY - containerRect.top, maxHeight);

    if (newWidth >= 150 && newHeight >= 100) {
        container.style.width = `${newWidth}px`;
        container.style.height = `${newHeight}px`;
    }
};

resizeHandle.addEventListener('mousedown', startResize);
resizeHandle.addEventListener('touchstart', startResize);