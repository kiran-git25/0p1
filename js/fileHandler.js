
class FileHandler {
    static supportedTypes = {
        // Documents
        'application/pdf': 'pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
        'application/msword': 'doc',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
        'application/vnd.ms-powerpoint': 'ppt',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
        'application/vnd.ms-excel': 'xls',
        'text/plain': 'txt',
        'text/csv': 'csv',
        'application/rtf': 'rtf',
        'application/json': 'json',
        'application/xml': 'xml',
        'text/xml': 'xml',
        'application/x-yaml': 'yaml',
        'text/yaml': 'yaml',
        
        // Archives
        'application/zip': 'zip',
        'application/x-rar-compressed': 'rar',
        'application/x-7z-compressed': '7z',
        'application/x-tar': 'tar',
        'application/gzip': 'gz',
        
        // Audio
        'audio/mpeg': 'mp3',
        'audio/wav': 'wav',
        'audio/ogg': 'ogg',
        'audio/flac': 'flac',
        'audio/aac': 'aac',
        'audio/mp4': 'm4a',
        'audio/x-ms-wma': 'wma',
        
        // Video
        'video/mp4': 'mp4',
        'video/webm': 'webm',
        'video/ogg': 'ogg',
        'video/x-matroska': 'mkv',
        'video/x-msvideo': 'avi',
        'video/quicktime': 'mov',
        'video/x-flv': 'flv',
        'video/3gpp': '3gp',
        'video/mp2t': 'ts',
        
        // Images
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/gif': 'gif',
        'image/svg+xml': 'svg',
        'image/bmp': 'bmp',
        'image/x-icon': 'ico',
        'image/webp': 'webp',
        'image/avif': 'avif',
        'image/tiff': 'tiff',
        
        // Code/Config
        'text/html': 'html',
        'text/css': 'css',
        'text/javascript': 'js',
        'application/javascript': 'js',
        'text/markdown': 'md'
    };

    static getFileType(file) {
        const extension = file.name.split('.').pop().toLowerCase();
        const mimeType = file.type;
        
        // Check MIME type first
        if (this.supportedTypes[mimeType]) {
            return this.supportedTypes[mimeType];
        }
        
        // Fallback to extension
        const extensionMap = {
            'pdf': 'pdf', 'doc': 'doc', 'docx': 'docx', 'ppt': 'ppt', 'pptx': 'pptx',
            'xls': 'xls', 'xlsx': 'xlsx', 'txt': 'txt', 'csv': 'csv', 'rtf': 'rtf',
            'odt': 'odt', 'epub': 'epub', 'mobi': 'mobi', 'json': 'json',
            'xml': 'xml', 'yaml': 'yaml', 'yml': 'yaml', 'ini': 'ini',
            'zip': 'zip', 'rar': 'rar', '7z': '7z', 'tar': 'tar', 'gz': 'gz',
            'mp3': 'mp3', 'wav': 'wav', 'ogg': 'ogg', 'flac': 'flac',
            'aac': 'aac', 'm4a': 'm4a', 'wma': 'wma',
            'mp4': 'mp4', 'webm': 'webm', 'mkv': 'mkv', 'avi': 'avi',
            'mov': 'mov', 'flv': 'flv', '3gp': '3gp', 'ts': 'ts',
            'jpg': 'jpg', 'jpeg': 'jpg', 'png': 'png', 'gif': 'gif',
            'svg': 'svg', 'bmp': 'bmp', 'ico': 'ico', 'webp': 'webp',
            'avif': 'avif', 'tiff': 'tiff', 'tif': 'tiff',
            'html': 'html', 'htm': 'html', 'css': 'css', 'js': 'js',
            'md': 'md', 'env': 'env', 'cls': 'cls', 'log': 'log'
        };
        
        return extensionMap[extension] || 'unknown';
    }

    static isDangerous(file) {
        return window.isDangerousFile ? window.isDangerousFile(file.name, file.type) : false;
    }
    
    static getDangerLevel(file) {
        return window.getDangerLevel ? window.getDangerLevel(file.name, file.type) : 'low';
    }
    
    static getViewerType(fileType) {
        const viewerMap = {
            // Documents
            'pdf': 'pdf',
            'doc': 'doc', 'docx': 'doc',
            'xls': 'spreadsheet', 'xlsx': 'spreadsheet', 'csv': 'spreadsheet',
            
            // Text files
            'txt': 'text', 'rtf': 'text', 'json': 'code', 'xml': 'code',
            'yaml': 'code', 'ini': 'text', 'env': 'text', 'cls': 'text', 'log': 'text',
            
            // Archives
            'zip': 'archive', 'rar': 'archive', '7z': 'archive', 'tar': 'archive', 'gz': 'archive',
            
            // Media
            'mp3': 'audio', 'wav': 'audio', 'ogg': 'audio', 'flac': 'audio',
            'aac': 'audio', 'm4a': 'audio', 'wma': 'audio',
            'mp4': 'video', 'webm': 'video', 'mkv': 'video', 'avi': 'video',
            'mov': 'video', 'flv': 'video', '3gp': 'video', 'ts': 'video',
            
            // Images
            'jpg': 'image', 'png': 'image', 'gif': 'image', 'svg': 'image',
            'bmp': 'image', 'ico': 'image', 'webp': 'image', 'avif': 'image', 'tiff': 'image',
            
            // Code
            'html': 'code', 'css': 'code', 'js': 'code', 'md': 'code'
        };
        
        return viewerMap[fileType] || 'unsupported';
    }

    static async readFile(file, type = 'text') {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            
            switch (type) {
                case 'arraybuffer':
                    reader.readAsArrayBuffer(file);
                    break;
                case 'dataurl':
                    reader.readAsDataURL(file);
                    break;
                default:
                    reader.readAsText(file);
            }
        });
    }

    static formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}
