
class SpreadsheetViewer {
    static async render(file, container) {
        try {
            let workbook;
            
            if (file.name.endsWith('.csv')) {
                const text = await FileHandler.readFile(file, 'text');
                workbook = XLSX.read(text, {type: 'string'});
            } else {
                const arrayBuffer = await FileHandler.readFile(file, 'arraybuffer');
                workbook = XLSX.read(arrayBuffer);
            }
            
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const htmlTable = XLSX.utils.sheet_to_html(worksheet);
            
            container.innerHTML = `<div class="spreadsheet-viewer">${htmlTable}</div>`;
        } catch (error) {
            container.innerHTML = `<div class="error-message">Error loading spreadsheet: ${error.message}</div>`;
        }
    }
}
