
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
    
    async processFile(file) {
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
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new OmniPlayApp();
});
