
class PlainTextViewer {
    static async render(file, container) {
        try {
            const text = await FileHandler.readFile(file, 'text');
            
            container.innerHTML = `
                <div class="text-file-viewer">
                    <div style="background: #f8f9fa; padding: 8px; border-bottom: 1px solid #e9ecef; font-size: 12px;">
                        <strong>${file.name}</strong> • ${FileHandler.formatFileSize(file.size)}
                    </div>
                    <pre class="text-viewer" style="margin: 0; padding: 1rem;">${this.escapeHtml(text)}</pre>
                </div>
            `;
        } catch (error) {
            container.innerHTML = `<div class="error-message">Error loading text file: ${error.message}</div>`;
        }
    }
    
    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
