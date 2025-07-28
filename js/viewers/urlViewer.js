
class URLViewer {
    static async render(url, container) {
        try {
            // Extract filename and extension from URL
            const urlPath = new URL(url).pathname;
            const filename = urlPath.split('/').pop() || 'remote-file';
            const extension = filename.split('.').pop()?.toLowerCase() || '';
            
            container.innerHTML = `
                <div class="url-viewer">
                    <div style="background: #f8f9fa; padding: 12px; border-bottom: 1px solid #e9ecef; font-size: 13px;">
                        <strong>Remote File:</strong> ${filename}<br>
                        <strong>URL:</strong> <a href="${url}" target="_blank" rel="noopener">${url}</a>
                    </div>
                    <div class="url-content" style="padding: 1rem; height: calc(100% - 60px); overflow: auto;">
                        <div class="loading-message">Loading remote content...</div>
                    </div>
                </div>
            `;
            
            const contentDiv = container.querySelector('.url-content');
            
            // Determine how to handle the file based on extension
            if (this.isImageExtension(extension)) {
                await this.loadAsImage(url, contentDiv);
            } else if (this.isVideoExtension(extension)) {
                await this.loadAsVideo(url, contentDiv);
            } else if (this.isAudioExtension(extension)) {
                await this.loadAsAudio(url, contentDiv);
            } else if (this.isTextExtension(extension)) {
                await this.loadAsText(url, contentDiv);
            } else {
                await this.loadAsGeneric(url, contentDiv);
            }
            
        } catch (error) {
            container.innerHTML = `
                <div class="error-message">
                    <h4>Unable to load remote file</h4>
                    <p>Error: ${error.message}</p>
                    <p>This may be due to CORS restrictions or the file format not being supported for remote viewing.</p>
                    <p><a href="${url}" target="_blank" rel="noopener">Open in new tab</a></p>
                </div>
            `;
        }
    }
    
    static async loadAsImage(url, container) {
        const img = document.createElement('img');
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.display = 'block';
        img.style.margin = '0 auto';
        
        img.onload = () => {
            container.innerHTML = '';
            container.appendChild(img);
        };
        
        img.onerror = () => {
            container.innerHTML = `
                <div class="error-message">
                    Unable to load image. The URL may be incorrect or CORS-protected.
                    <br><a href="${url}" target="_blank" rel="noopener">View in new tab</a>
                </div>
            `;
        };
        
        img.src = url;
    }
    
    static async loadAsVideo(url, container) {
        container.innerHTML = `
            <video controls style="width: 100%; max-width: 100%;">
                <source src="${url}" type="video/${this.getVideoMimeType(url)}">
                Your browser does not support the video tag.
                <br><a href="${url}" target="_blank" rel="noopener">Download video</a>
            </video>
        `;
    }
    
    static async loadAsAudio(url, container) {
        container.innerHTML = `
            <audio controls style="width: 100%;">
                <source src="${url}" type="audio/${this.getAudioMimeType(url)}">
                Your browser does not support the audio tag.
                <br><a href="${url}" target="_blank" rel="noopener">Download audio</a>
            </audio>
        `;
    }
    
    static async loadAsText(url, container) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const text = await response.text();
            container.innerHTML = `
                <pre class="text-viewer" style="white-space: pre-wrap; font-family: monospace; font-size: 14px;">
                    ${this.escapeHtml(text)}
                </pre>
            `;
        } catch (error) {
            container.innerHTML = `
                <div class="error-message">
                    Unable to load text content: ${error.message}
                    <br><a href="${url}" target="_blank" rel="noopener">Open in new tab</a>
                </div>
            `;
        }
    }
    
    static async loadAsGeneric(url, container) {
        container.innerHTML = `
            <div class="generic-url-viewer" style="text-align: center; padding: 2rem;">
                <h3>Remote File Preview</h3>
                <p>This file type cannot be previewed directly in the browser.</p>
                <div style="margin: 1rem 0;">
                    <a href="${url}" target="_blank" rel="noopener" class="browse-btn">
                        Open in New Tab
                    </a>
                </div>
                <p style="font-size: 12px; color: #666; margin-top: 1rem;">
                    Some files may require downloading to view properly.
                </p>
            </div>
        `;
    }
    
    static isImageExtension(ext) {
        return ['jpg', 'jpeg', 'png', 'gif', 'svg', 'bmp', 'webp', 'avif', 'tiff'].includes(ext);
    }
    
    static isVideoExtension(ext) {
        return ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'].includes(ext);
    }
    
    static isAudioExtension(ext) {
        return ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a'].includes(ext);
    }
    
    static isTextExtension(ext) {
        return ['txt', 'md', 'json', 'xml', 'csv', 'html', 'css', 'js'].includes(ext);
    }
    
    static getVideoMimeType(url) {
        const ext = url.split('.').pop()?.toLowerCase();
        const mimeMap = {
            'mp4': 'mp4',
            'webm': 'webm',
            'ogg': 'ogg'
        };
        return mimeMap[ext] || 'mp4';
    }
    
    static getAudioMimeType(url) {
        const ext = url.split('.').pop()?.toLowerCase();
        const mimeMap = {
            'mp3': 'mpeg',
            'wav': 'wav',
            'ogg': 'ogg'
        };
        return mimeMap[ext] || 'mpeg';
    }
    
    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
