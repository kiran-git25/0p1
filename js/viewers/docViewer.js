
class DocViewer {
    static async render(file, container) {
        try {
            if (file.name.endsWith('.docx')) {
                const arrayBuffer = await FileHandler.readFile(file, 'arraybuffer');
                const result = await mammoth.convertToHtml({arrayBuffer});
                container.innerHTML = `<div class="doc-viewer">${result.value}</div>`;
                
                if (result.messages.length > 0) {
                    console.warn('Document conversion warnings:', result.messages);
                }
            } else {
                // For .doc files, show unsupported message
                container.innerHTML = `
                    <div class="error-message">
                        <h4>Legacy DOC Format</h4>
                        <p>Legacy .doc files require special handling. Try:</p>
                        <ul>
                            <li>Converting to .docx using Microsoft Word or LibreOffice</li>
                            <li>Using online converters like CloudConvert</li>
                            <li>Opening in Google Docs</li>
                        </ul>
                    </div>
                `;
            }
        } catch (error) {
            container.innerHTML = `<div class="error-message">Error loading document: ${error.message}</div>`;
        }
    }
}
