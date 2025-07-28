
class WindowManager {
    static windowCount = 0;
    static zIndexCounter = 1000;

    static createWindow(file, viewerType) {
        this.windowCount++;
        const windowId = `window-${this.windowCount}`;
        
        const windowElement = document.createElement('div');
        windowElement.className = 'file-window';
        windowElement.id = windowId;
        windowElement.style.left = `${20 + (this.windowCount * 30)}px`;
        windowElement.style.top = `${20 + (this.windowCount * 30)}px`;
        windowElement.style.zIndex = ++this.zIndexCounter;
        
        windowElement.innerHTML = `
            <div class="window-header">
                <div class="window-title" title="${file.name}">${file.name}</div>
                <div class="window-controls">
                    <div class="window-control close-btn" onclick="WindowManager.closeWindow('${windowId}')"></div>
                </div>
            </div>
            <div class="window-content">
                <div class="viewer-content">Loading...</div>
            </div>
        `;
        
        document.getElementById('windows-container').appendChild(windowElement);
        
        // Make window draggable
        this.makeDraggable(windowElement);
        
        // Focus on click
        windowElement.addEventListener('mousedown', () => {
            windowElement.style.zIndex = ++this.zIndexCounter;
        });
        
        return windowElement.querySelector('.viewer-content');
    }
    
    static closeWindow(windowId) {
        const window = document.getElementById(windowId);
        if (window) {
            // Trigger cleanup for media URLs
            const event = new Event('beforeunload');
            window.dispatchEvent(event);
            window.remove();
        }
    }
    
    static makeDraggable(element) {
        const header = element.querySelector('.window-header');
        let isDragging = false;
        let currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0;
        
        header.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('window-control')) return;
            
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            
            if (e.target === header || e.target.classList.contains('window-title')) {
                isDragging = true;
                element.style.zIndex = ++this.zIndexCounter;
            }
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                
                xOffset = currentX;
                yOffset = currentY;
                
                element.style.left = currentX + 'px';
                element.style.top = currentY + 'px';
            }
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
            initialX = currentX;
            initialY = currentY;
        });
    }
}
