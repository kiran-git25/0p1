
class ArchiveViewer {
    static async render(file, container) {
        try {
            if (file.name.endsWith('.zip')) {
                const arrayBuffer = await FileHandler.readFile(file, 'arraybuffer');
                const zip = await JSZip.loadAsync(arrayBuffer);
                
                let html = '<div class="archive-viewer"><h4>Archive Contents:</h4>';
                
                zip.forEach((relativePath, zipEntry) => {
                    const size = zipEntry._data ? zipEntry._data.uncompressedSize : 'Unknown';
                    html += `
                        <div class="archive-item">
                            <span>${relativePath}</span>
                            <span>${FileHandler.formatFileSize(size)}</span>
                        </div>
                    `;
                });
                
                html += '</div>';
                container.innerHTML = html;
            } else {
                // For other archive formats
                container.innerHTML = `
                    <div class="error-message">
                        <h4>Archive Format Not Fully Supported</h4>
                        <p>File: <strong>${file.name}</strong></p>
                        <p>Size: <strong>${FileHandler.formatFileSize(file.size)}</strong></p>
                        <p>To extract this archive, try:</p>
                        <ul>
                            <li>7-Zip (Windows)</li>
                            <li>The Unarchiver (Mac)</li>
                            <li>Archive Manager (Linux)</li>
                            <li>Online extractors like extract.me</li>
                        </ul>
                    </div>
                `;
            }
        } catch (error) {
            container.innerHTML = `<div class="error-message">Error reading archive: ${error.message}</div>`;
        }
    }
}
