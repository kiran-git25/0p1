
class MediaPlayer {
    static async render(file, container, type) {
        try {
            const url = URL.createObjectURL(file);
            
            if (type === 'video') {
                container.innerHTML = `
                    <div class="video-viewer">
                        <video controls preload="metadata">
                            <source src="${url}" type="${file.type}">
                            Your browser does not support this video format.
                        </video>
                    </div>
                `;
            } else {
                container.innerHTML = `
                    <div class="audio-viewer">
                        <audio controls preload="metadata">
                            <source src="${url}" type="${file.type}">
                            Your browser does not support this audio format.
                        </audio>
                        <div style="margin-top: 1rem;">
                            <strong>File:</strong> ${file.name}<br>
                            <strong>Size:</strong> ${FileHandler.formatFileSize(file.size)}<br>
                            <strong>Type:</strong> ${file.type}
                        </div>
                    </div>
                `;
            }
            
            // Clean up URL when window is closed
            container.addEventListener('beforeunload', () => {
                URL.revokeObjectURL(url);
            });
        } catch (error) {
            container.innerHTML = `<div class="error-message">Error loading media: ${error.message}</div>`;
        }
    }
}
