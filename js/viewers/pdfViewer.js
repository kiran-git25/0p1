
class PDFViewer {
    static async render(file, container) {
        try {
            const arrayBuffer = await FileHandler.readFile(file, 'arraybuffer');
            const pdf = await pdfjsLib.getDocument({data: arrayBuffer}).promise;
            
            container.innerHTML = '<div class="pdf-viewer"></div>';
            const pdfContainer = container.querySelector('.pdf-viewer');
            
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({scale: 1.2});
                
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                canvas.className = 'pdf-page';
                
                await page.render({
                    canvasContext: context,
                    viewport: viewport
                }).promise;
                
                pdfContainer.appendChild(canvas);
            }
        } catch (error) {
            container.innerHTML = `<div class="error-message">Error loading PDF: ${error.message}</div>`;
        }
    }
}
