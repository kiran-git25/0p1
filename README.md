
# 🎵 OmniPlay

**Universal File Viewer - 100% Privacy Respecting**

OmniPlay is a fully open-source, client-side web application that allows users to view, play, and interact with 55+ file formats directly in their browser without uploading files to any server.

## ✨ Features

- **Universal File Support**: 55+ file formats including documents, media, images, archives, and code files
- **YouTube Integration**: Embed and play YouTube videos using official YouTube API
- **Remote File Support**: Load files directly from URLs
- **Background Playback**: Full support for background audio and video playback
- **Multi-Window Interface**: Open multiple files simultaneously in separate windows
- **100% Client-Side**: No uploads, no tracking, complete privacy
- **Mobile Responsive**: Works seamlessly on desktop and mobile devices

## 📁 Supported File Types

### Documents
- **PDF**: Native PDF viewer with zoom and navigation
- **Word**: .docx, .doc files
- **Excel**: .xlsx, .xls, .csv spreadsheets
- **Text**: .txt, .rtf, .md, .json, .xml, .yaml

### Media
- **Audio**: .mp3, .wav, .ogg, .flac, .aac, .m4a, .wma
- **Video**: .mp4, .webm, .mkv, .avi, .mov, .flv, .3gp

### Images
- **Formats**: .jpg, .png, .gif, .svg, .bmp, .ico, .webp, .avif, .tiff

### Archives
- **Compression**: .zip, .rar, .7z, .tar, .gz

### Code & Configuration
- **Web**: .html, .css, .js
- **Data**: .json, .xml, .yaml, .csv
- **Text**: .md, .txt, .log, .ini

## 🚀 Getting Started

### Option 1: Use Online (Recommended)
Visit the live application at: [Your Replit URL]

### Option 2: Run Locally
1. Clone this repository
2. Install dependencies: `npm install`
3. Start the server: `npm start`
4. Open your browser to `http://localhost:5000`

## 🔐 Security Statement

> OmniPlay is built with a privacy-first, security-conscious architecture. It is a 100% client-side application — it does not upload, execute, or transmit any files.

> - Files are only accessed locally and temporarily via browser memory
> - OmniPlay never executes code from files (e.g., scripts, binaries, macros)
> - Files with known risk extensions (`.exe`, `.bat`, `.js`, `.vbs`, etc.) are **not opened automatically**
> - Users are shown a warning and can choose to view such files as plain text only
> - OmniPlay does not track users, use analytics, or store personal data

> This design ensures that:
> - No virus can be spread from OmniPlay to your system
> - No user can infect another user (OmniPlay has no data sharing or networking)
> - All actions are sandboxed inside your own browser

## ⚖️ Legal Notice

### Data Processing & Privacy
- OmniPlay is an **open-source, client-side file viewer/player**
- It does **not collect, store, or transmit user data**
- It does **not bypass or modify any third-party platform behavior** (e.g., YouTube ads, file protection, DRM)
- All file processing occurs entirely within your web browser
- No files are uploaded to any server

### YouTube Disclaimer
> "YouTube videos are embedded using the official YouTube Embed API. OmniPlay does not block ads or download YouTube content. For ad-free playback, please use YouTube Premium."

### User Responsibility
> "Users are solely responsible for any content they open or interact with in OmniPlay. The maintainers are not liable for misuse, copyright violations, or illegal content access."

### Copyright & Licensing
- Users must ensure they have the right to view, play, or share any content they load into OmniPlay
- Respect copyright laws and content creators' rights
- This application does not grant any rights to copyrighted material

### Third-Party Content
When loading external content (YouTube videos, remote URLs):
- Direct connections are made between your browser and the remote server
- OmniPlay does not proxy, cache, or store remote content
- The privacy policy and terms of the remote server apply
- OmniPlay is not responsible for third-party content or policies

## 🛠️ Technical Architecture

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Node.js with Express (for static file serving)
- **Libraries**: PDF.js, Mammoth.js, SheetJS, JSZip
- **Deployment**: Optimized for Replit deployment
- **Security**: Client-side processing, CSP headers, XSS protection

## 📋 Browser Compatibility

- Chrome/Chromium 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

OmniPlay is open source and welcomes contributions! 

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Development Guidelines
- Maintain client-side only architecture
- Ensure privacy-first design
- Test on multiple browsers
- Follow existing code patterns
- Add appropriate file type support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🔗 Links

- **Repository**: [GitHub/Replit Repository]
- **Issues**: Report bugs and request features
- **Privacy Policy**: [PRIVACY.md](PRIVACY.md)
- **License**: [LICENSE.md](LICENSE.md)

## ⚠️ Disclaimer

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND. THE AUTHORS ARE NOT LIABLE FOR ANY MISUSE, COPYRIGHT VIOLATIONS, OR DAMAGES ARISING FROM THE USE OF THIS SOFTWARE.

---

**Built with ❤️ by Kiran | 2025**
