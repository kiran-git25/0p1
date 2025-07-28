
class ImageViewer {
    static async render(file, container) {
        try {
            const url = URL.createObjectURL(file);
            
            container.innerHTML = `
                <div class="image-viewer">
                    <img src="${url}" alt="${file.name}" />
                    <div style="margin-top: 1rem; text-align: center;">
                        <strong>${file.name}</strong><br>
                        ${FileHandler.formatFileSize(file.size)} • ${file.type}
                    </div>
                </div>
            `;
            
            // Clean up URL when window is closed
            container.addEventListener('beforeunload', () => {
                URL.revokeObjectURL(url);
            });
        } catch (error) {
            container.innerHTML = `<div class="error-message">Error loading image: ${error.message}</div>`;
        }
    }
}
