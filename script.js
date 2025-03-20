const resizeHandle = document.getElementById('resize-handle');
const textarea = document.getElementById('textarea');
let isResizing = false;

resizeHandle.addEventListener('mousedown', (e) => {
    isResizing = true;
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', () => {
        isResizing = false;
        document.removeEventListener('mousemove', handleResize);
    });
});

function handleResize(e) {
    if (isResizing) {
        const container = textarea.parentElement;
        const containerRect = container.getBoundingClientRect();
        
        const newWidth = e.clientX - containerRect.left;
        const newHeight = e.clientY - containerRect.top;
        
        // Asegura que a área de texto tenha tamanho mínimo
        if (newWidth > 150 && newHeight > 100) {
            container.style.width = `${newWidth}px`;
            container.style.height = `${newHeight}px`;
            textarea.style.width = `${newWidth}px`;
            textarea.style.height = `${newHeight}px`;
        }
    }
}
