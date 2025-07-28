
class CodeViewer {
    static async render(file, container) {
        try {
            const text = await FileHandler.readFile(file, 'text');
            const extension = file.name.split('.').pop().toLowerCase();
            
            container.innerHTML = `
                <div class="code-viewer">
                    <div style="background: #f8f9fa; padding: 8px; border-bottom: 1px solid #e9ecef; font-size: 12px;">
                        <strong>${file.name}</strong> • ${FileHandler.formatFileSize(file.size)} • ${extension.toUpperCase()}
                    </div>
                    <pre class="text-viewer" style="margin: 0; padding: 1rem; background: #f8f9fa;">${this.escapeHtml(text)}</pre>
                </div>
            `;
        } catch (error) {
            container.innerHTML = `<div class="error-message">Error loading code file: ${error.message}</div>`;
        }
    }
    
    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
class CodeViewer {
    static async render(file, container) {
        try {
            const text = await file.text();
            const extension = file.name.split('.').pop().toLowerCase();
            
            container.innerHTML = `
                <div class="code-viewer">
                    <div class="code-header">
                        <span class="code-filename">${file.name}</span>
                        <span class="code-language">${this.getLanguageName(extension)}</span>
                    </div>
                    <pre class="code-content"><code class="language-${extension}">${this.escapeHtml(text)}</code></pre>
                </div>
            `;
        } catch (error) {
            container.innerHTML = `<div class="error-message">Error loading code file: ${error.message}</div>`;
        }
    }
    
    static getLanguageName(extension) {
        const languages = {
            'js': 'JavaScript',
            'ts': 'TypeScript',
            'py': 'Python',
            'java': 'Java',
            'cpp': 'C++',
            'c': 'C',
            'css': 'CSS',
            'html': 'HTML',
            'json': 'JSON',
            'xml': 'XML',
            'yaml': 'YAML',
            'yml': 'YAML',
            'md': 'Markdown',
            'sh': 'Shell',
            'sql': 'SQL',
            'php': 'PHP',
            'rb': 'Ruby',
            'go': 'Go',
            'rs': 'Rust'
        };
        
        return languages[extension] || extension.toUpperCase();
    }
    
    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
