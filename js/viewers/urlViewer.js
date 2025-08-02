import React from "react";
import { getEmbedUrl } from "../utils/fileHandlers";

const UrlViewer = ({ url }) => {
  const embedUrl = getEmbedUrl(url);

  return (
    <div className="url-viewer">
      <iframe
        src={embedUrl}
        title="Embedded URL"
        width="100%"
        height="500px"
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"
        style={{ borderRadius: "8px" }}
      />
    </div>
  );
};

export default UrlViewer;
