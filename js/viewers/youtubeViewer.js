
class YouTubeViewer {
    static async render(url, container) {
        try {
            const videoId = this.extractVideoId(url);
            if (!videoId) {
                throw new Error('Invalid YouTube URL');
            }
            
            const embedUrl = `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&controls=1`;
            
            container.innerHTML = `
                <div class="youtube-viewer">
                    <div class="youtube-disclaimer">
                        <strong>Note:</strong> This video is streamed via YouTube's public embed player. 
                        Ads may still appear unless you use YouTube Premium. OmniPlay is not affiliated with YouTube.
                    </div>
                    <iframe 
                        class="youtube-iframe" 
                        src="${embedUrl}"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowfullscreen>
                    </iframe>
                    <div class="legal-notice">
                        <strong>Legal Notice:</strong> You are responsible for complying with copyright laws when using OmniPlay. 
                        Do not open, play, or share content you do not own or have rights to.
                    </div>
                </div>
            `;
        } catch (error) {
            container.innerHTML = `<div class="error-message">Error loading YouTube video: ${error.message}</div>`;
        }
    }
    
    static extractVideoId(url) {
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
            /youtube\.com\/watch\?.*v=([^&\n?#]+)/
        ];
        
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }
        
        return null;
    }
    
    static isYouTubeUrl(url) {
        return /(?:youtube\.com|youtu\.be)/.test(url);
    }
}
