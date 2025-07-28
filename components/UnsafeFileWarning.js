class UnsafeFileWarning {
    static create(file, dangerLevel = 'medium') {
        const modal = document.createElement('div');
        modal.className = 'unsafe-file-modal';
        modal.innerHTML = this.getWarningHTML(file, dangerLevel);

        return modal;
    }

    static getWarningHTML(file, dangerLevel) {
        const extension = file.name.split('.').pop().toLowerCase();
        const riskLevel = this.getRiskLevelText(dangerLevel);
        const riskColor = this.getRiskColor(dangerLevel);

        return `
            <div class="unsafe-file-overlay">
                <div class="unsafe-file-dialog">
                    <div class="warning-header" style="border-left: 4px solid ${riskColor};">
                        <div class="warning-icon">⚠️</div>
                        <h3>Security Warning</h3>
                    </div>

                    <div class="warning-content">
                        <div class="file-info">
                            <p><strong>File:</strong> ${file.name}</p>
                            <p><strong>Size:</strong> ${this.formatFileSize(file.size)}</p>
                            <p><strong>Extension:</strong> .${extension}</p>
                            <p><strong>Risk Level:</strong> <span style="color: ${riskColor}; font-weight: bold;">${riskLevel}</span></p>
                        </div>

                        <div class="warning-message">
                            <p>🚫 <strong>This file type may pose a security risk</strong></p>
                            <p>Files with extension <code>.${extension}</code> can potentially contain:</p>
                            <ul>
                                <li>Executable code or scripts</li>
                                <li>Malware or viruses</li>
                                <li>System-level commands</li>
                            </ul>

                            <div class="safety-note">
                                <p><strong>Safety Note:</strong> OmniPlay does not run or execute any files. 
                                If you trust this file, you may choose to view it as plain text only.</p>
                            </div>
                        </div>

                        <div class="warning-actions">
                            <button class="btn-cancel" onclick="this.closest('.unsafe-file-modal').remove()">
                                ❌ Cancel
                            </button>
                            <button class="btn-safe-view" onclick="UnsafeFileWarning.openAsSafeText(this)" data-file-name="${file.name}">
                                📄 Open as Plain Text
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    static getRiskLevelText(level) {
        const levels = {
            'high': 'HIGH RISK',
            'medium': 'MEDIUM RISK',
            'low': 'LOW RISK',
            'unknown': 'UNKNOWN RISK'
        };
        return levels[level] || 'UNKNOWN RISK';
    }

    static getRiskColor(level) {
        const colors = {
            'high': '#d32f2f',
            'medium': '#f57c00',
            'low': '#fbc02d',
            'unknown': '#757575'
        };
        return colors[level] || '#757575';
    }

    static formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    static openAsSafeText(button) {
        const fileName = button.getAttribute('data-file-name');
        const modal = button.closest('.unsafe-file-modal');

        // Get the file from the global context (this would need to be set up)
        const fileInput = document.getElementById('file-input');
        const files = Array.from(fileInput.files);
        const targetFile = files.find(f => f.name === fileName);

        if (targetFile) {
            // Create a new File object to force plain text viewing
            const reader = new FileReader();
            reader.onload = function(e) {
                const container = WindowManager.createWindow(
                    { name: `${fileName} (Safe Text View)`, size: targetFile.size },
                    'text'
                );

                container.innerHTML = `
                    <div class="safe-text-viewer">
                        <div class="safe-text-header">
                            <p>🔒 <strong>Safe Text View</strong> - File content displayed as plain text only</p>
                        </div>
                        <div class="safe-text-content">
                            <pre>${e.target.result}</pre>
                        </div>
                    </div>
                `;
            };
            reader.readAsText(targetFile);
        }

        modal.remove();
    }

    static show(file, dangerLevel = 'medium') {
        const modal = this.create(file, dangerLevel);
        document.body.appendChild(modal);

        // Store file reference for safe text viewing
        modal._targetFile = file;

        return modal;
    }
}