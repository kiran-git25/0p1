const DANGEROUS_EXTENSIONS = [
    // Executable files
    'exe', 'msi', 'app', 'deb', 'rpm', 'dmg', 'pkg',

    // Scripts that can execute code
    'bat', 'cmd', 'sh', 'ps1', 'vbs', 'scr',
    'com', 'pif', 'lnk',

    // Programming files that could contain malicious code
    'js', 'jse', 'jar', 'class',

    // Archive files that might contain executables
    // Note: We still support viewing these, but with warnings

    // System files
    'dll', 'sys', 'drv',

    // Mobile executables
    'apk', 'ipa', 'xap',

    // Macro-enabled documents (potential risk)
    'docm', 'xlsm', 'pptm',

    // Other potentially risky formats
    'hta', 'cpl', 'gadget', 'msc'
];

const DANGEROUS_MIMETYPES = [
    'application/x-msdownload',
    'application/x-executable',
    'application/x-winexe',
    'application/x-msdos-program',
    'application/x-ms-dos-executable',
    'application/octet-stream' // Generic binary - could be anything
];

function isDangerousFile(filename, mimetype = '') {
    const extension = filename.split('.').pop().toLowerCase();

    // Check extension
    if (DANGEROUS_EXTENSIONS.includes(extension)) {
        return true;
    }

    // Check mimetype
    if (DANGEROUS_MIMETYPES.includes(mimetype)) {
        return true;
    }

    return false;
}

function getDangerLevel(filename, mimetype = '') {
    const extension = filename.split('.').pop().toLowerCase();

    // High risk: Executables and scripts
    const highRisk = ['exe', 'bat', 'cmd', 'sh', 'vbs', 'scr', 'msi', 'com', 'pif'];
    if (highRisk.includes(extension)) {
        return 'high';
    }

    // Medium risk: Programming files and macro documents
    const mediumRisk = ['js', 'jar', 'class', 'docm', 'xlsm', 'pptm', 'apk'];
    if (mediumRisk.includes(extension)) {
        return 'medium';
    }

    // Low risk: System files (usually not directly executable by user)
    const lowRisk = ['dll', 'sys', 'drv'];
    if (lowRisk.includes(extension)) {
        return 'low';
    }

    return 'unknown';
}

// Export functions to global scope
window.isDangerousFile = isDangerousFile;
window.getDangerLevel = getDangerLevel;