class OmniPlayApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupModal();
    }

    setupEventListeners() {
        const dropZone = document.getElementById('drop-zone');
        const fileInput = document.getElementById('file-input');
        const browseBtn = document.getElementById('browse-btn');
        const urlInput = document.getElementById('url-input');
        const loadUrlBtn = document.getElementById('load-url-btn');

        // File input change
        fileInput.addEventListener('change', (e) => {
            this.handleFiles(Array.from(e.target.files));
        });

        // Browse button click
        browseBtn.addEventListener('click', () => {
            fileInput.click();
        });

        // Drop zone click
        dropZone.addEventListener('click', () => {
            fileInput.click();
        });

        // URL input handling
        loadUrlBtn.addEventListener('click', () => {
            this.handleUrl(urlInput.value.trim());
        });

        urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleUrl(urlInput.value.trim());
            }
        });

        // Drag and drop
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });

        dropZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');

            const files = Array.from(e.dataTransfer.files);
            this.handleFiles(files);
        });

        // Prevent default drag behavior on document
        document.addEventListener('dragover', (e) => e.preventDefault());
        document.addEventListener('drop', (e) => e.preventDefault());
    }

    setupModal() {
        const modal = document.getElementById('unsupported-modal');
        const closeBtn = modal.querySelector('.close');

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    async handleFiles(files) {
        for (const file of files) {
            await this.processFile(file);
        }
    }

    async handleUrl(url) {
        if (!url) {
            alert('Please enter a valid URL');
            return;
        }

        try {
            // Validate URL
            const urlObj = new URL(url);

            // Handle different types of URLs
            if (YouTubeViewer.isYouTubeUrl(url)) {
                await this.processYouTubeUrl(url);
            } else if (InstagramViewer.isInstagramUrl(url)) {
                await this.processInstagramUrl(url);
            } else if (this.isVideoStreamingUrl(url)) {
                await this.processVideoStreamingUrl(url);
            } else if (this.isDocumentUrl(url)) {
                await this.processDocumentUrl(url);
            } else if (this.isWebPageUrl(url)) {
                await this.processWebPageUrl(url);
            } else {
                await this.processDirectUrl(url);
            }

            // Clear input after successful processing
            document.getElementById('url-input').value = '';

        } catch (error) {
            alert('Invalid URL format. Please enter a valid URL.');
            console.error('URL processing error:', error);
        }
    }

    async processYouTubeUrl(url) {
        const windowId = WindowManager.createWindow(`YouTube: ${this.extractYouTubeTitle(url)}`, 'youtube');
        const container = document.querySelector(`#${windowId} .window-content`);
        await YouTubeViewer.render(url, container);
    }

    async processInstagramUrl(url) {
        const windowId = WindowManager.createWindow(`Instagram: ${this.extractInstagramTitle(url)}`, 'instagram');
        const container = document.querySelector(`#${windowId} .window-content`);
        await InstagramViewer.render(url, container);
    }

    async processDirectUrl(url) {
        const urlPath = new URL(url).pathname;
        const filename = urlPath.split('/').pop() || 'remote-file';

        const container = WindowManager.createWindow(
            { name: filename, size: 0 }, 
            'url'
        );

        try {
            await URLViewer.render(url, container);
        } catch (error) {
            console.error('Error processing direct URL:', error);
            container.innerHTML = `<div class="error-message">Error loading remote file: ${error.message}</div>`;
        }
    }

    async processFile(file) {
        // Check if file is potentially dangerous
        if (FileHandler.isDangerous(file)) {
            const dangerLevel = FileHandler.getDangerLevel(file);
            UnsafeFileWarning.show(file, dangerLevel);
            return; // Stop processing and show warning instead
        }

        const fileType = FileHandler.getFileType(file);
        const viewerType = FileHandler.getViewerType(fileType);

        console.log(`Processing: ${file.name}, Type: ${fileType}, Viewer: ${viewerType}`);

        if (viewerType === 'unsupported') {
            this.showUnsupportedDialog(file, fileType);
            return;
        }

        const container = WindowManager.createWindow(file, viewerType);

        try {
            switch (viewerType) {
                case 'pdf':
                    await PDFViewer.render(file, container);
                    break;
                case 'doc':
                    await DocViewer.render(file, container);
                    break;
                case 'spreadsheet':
                    await SpreadsheetViewer.render(file, container);
                    break;
                case 'video':
                    await MediaPlayer.render(file, container, 'video');
                    break;
                case 'audio':
                    await MediaPlayer.render(file, container, 'audio');
                    break;
                case 'image':
                    await ImageViewer.render(file, container);
                    break;
                case 'archive':
                    await ArchiveViewer.render(file, container);
                    break;
                case 'code':
                    await CodeViewer.render(file, container);
                    break;
                case 'text':
                    await PlainTextViewer.render(file, container);
                    break;
                default:
                    container.innerHTML = '<div class="error-message">Unknown viewer type</div>';
            }
        } catch (error) {
            console.error('Error processing file:', error);
            container.innerHTML = `<div class="error-message">Error processing file: ${error.message}</div>`;
        }
    }

    showUnsupportedDialog(file, fileType) {
        const modal = document.getElementById('unsupported-modal');
        const content = document.getElementById('unsupported-content');

        const extension = file.name.split('.').pop().toLowerCase();
        const suggestions = this.getUnsupportedSuggestions(extension);

        content.innerHTML = `
            <p><strong>File:</strong> ${file.name}</p>
            <p><strong>Size:</strong> ${FileHandler.formatFileSize(file.size)}</p>
            <p><strong>Type:</strong> ${file.type || 'Unknown'}</p>
            <hr style="margin: 1rem 0;">
            <h4>Suggested Solutions:</h4>
            ${suggestions}
        `;

        modal.style.display = 'block';
    }

    getUnsupportedSuggestions(extension) {
        const suggestions = {
            'ppt': `
                <ul>
                    <li>Convert to .pptx using Microsoft PowerPoint</li>
                    <li>Use LibreOffice Impress to open and convert</li>
                    <li>Upload to Google Slides</li>
                </ul>
            `,
            'pptx': `
                <ul>
                    <li>Use Microsoft PowerPoint</li>
                    <li>Open with LibreOffice Impress</li>
                    <li>Upload to Google Slides</li>
                </ul>
            `,
            'odt': `
                <ul>
                    <li>Use LibreOffice Writer</li>
                    <li>Convert to .docx using online converters</li>
                    <li>Upload to Google Docs</li>
                </ul>
            `,
            'epub': `
                <ul>
                    <li>Use Calibre ebook reader</li>
                    <li>Adobe Digital Editions</li>
                    <li>Browser extensions like EPUBReader</li>
                </ul>
            `,
            'mobi': `
                <ul>
                    <li>Use Amazon Kindle app</li>
                    <li>Calibre ebook management</li>
                    <li>Convert to EPUB using online tools</li>
                </ul>
            `
        };

        return suggestions[extension] || `
            <ul>
                <li>Try converting to a supported format</li>
                <li>Use specialized software for this file type</li>
                <li>Search online for "${extension} file viewer"</li>
            </ul>
        `;
    }

    extractYouTubeTitle(url) {
        const urlObj = new URL(url);
        return urlObj.searchParams.get('v') || 'Video';
    }

    extractInstagramTitle(url) {
        if (url.includes('/p/')) return 'Post';
        if (url.includes('/reel/')) return 'Reel';
        if (url.includes('/tv/')) return 'IGTV';
        return 'Content';
    }

    isVideoStreamingUrl(url) {
        const streamingDomains = [
            'vimeo.com', 'dailymotion.com', 'twitch.tv', 'tiktok.com',
            'facebook.com/watch', 'twitter.com', 'x.com'
        ];
        return streamingDomains.some(domain => url.includes(domain));
    }

    isDocumentUrl(url) {
        const docExtensions = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx'];
        const urlPath = new URL(url).pathname.toLowerCase();
        return docExtensions.some(ext => urlPath.endsWith(ext)) ||
               url.includes('docs.google.com') || 
               url.includes('drive.google.com');
    }

    isWebPageUrl(url) {
        const urlObj = new URL(url);
        return urlObj.pathname === '/' || 
               urlObj.pathname.endsWith('.html') || 
               urlObj.pathname.endsWith('.htm') ||
               !urlObj.pathname.includes('.');
    }

    async processVideoStreamingUrl(url) {
        const hostname = new URL(url).hostname;
        const windowId = WindowManager.createWindow(`${hostname}: Video`, 'video-stream');
        const container = document.querySelector(`#${windowId} .window-content`);
        
        container.innerHTML = `
            <div class="video-stream-viewer">
                <div class="stream-header">
                    <h3>Video Stream from ${hostname}</h3>
                    <p>Loading external video content...</p>
                </div>
                <iframe 
                    src="${url}"
                    style="width: 100%; height: 400px; border: none; border-radius: 8px;"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen>
                </iframe>
                <div class="legal-notice">
                    Content is streamed from ${hostname}. OmniPlay is not responsible for external content.
                </div>
            </div>
        `;
    }

    async processDocumentUrl(url) {
        const filename = new URL(url).pathname.split('/').pop() || 'Document';
        const windowId = WindowManager.createWindow(`Document: ${filename}`, 'document');
        const container = document.querySelector(`#${windowId} .window-content`);
        
        if (url.includes('docs.google.com') || url.includes('drive.google.com')) {
            // Handle Google Docs/Drive
            const embedUrl = url.replace('/edit', '/preview').replace('/view', '/preview');
            container.innerHTML = `
                <div class="document-viewer">
                    <iframe 
                        src="${embedUrl}"
                        style="width: 100%; height: 500px; border: none;"
                        allowfullscreen>
                    </iframe>
                </div>
            `;
        } else {
            // Handle direct document URLs
            await URLViewer.render(url, container);
        }
    }

    async processWebPageUrl(url) {
        const hostname = new URL(url).hostname;
        const windowId = WindowManager.createWindow(`Website: ${hostname}`, 'webpage');
        const container = document.querySelector(`#${windowId} .window-content`);
        
        container.innerHTML = `
            <div class="webpage-viewer">
                <div class="webpage-header">
                    <h3>Website: ${hostname}</h3>
                    <p><a href="${url}" target="_blank" rel="noopener">Open in new tab</a></p>
                </div>
                <iframe 
                    src="${url}"
                    style="width: 100%; height: 500px; border: none; border-radius: 8px;"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                    loading="lazy">
                </iframe>
                <div class="legal-notice">
                    External website content. Some features may be limited due to security restrictions.
                </div>
            </div>
        `;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new OmniPlayApp();
});