import React, { useState } from 'react';
import { FileTextIcon, DownloadIcon, Loader2Icon } from './icons';

interface ResumeViewerProps {
  resumeUrl: string;
  iconOnly?: boolean;
  showText?: boolean;
  className?: string;
  iconSize?: number;
}

/**
 * ResumeViewer component that handles downloading a resume with a custom filename
 */
const ResumeViewer: React.FC<ResumeViewerProps> = ({
  resumeUrl,
  iconOnly = false,
  showText = true,
  className = '',
  iconSize = 20
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  // Handle downloading the resume with a custom filename
  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (isDownloading) return; // Prevent multiple clicks

    setIsDownloading(true);

    try {
      // Fetch the file first to bypass Content-Disposition headers
      const response = await fetch(resumeUrl);
      const blob = await response.blob();

      // Create a blob URL
      const blobUrl = URL.createObjectURL(blob);

      // Create a temporary link element
      const link = document.createElement('a');
      link.href = blobUrl;

      // Set the download attribute with custom filename
      link.download = 'adhithanresume.pdf';

      // Append to the document, click it, and remove it
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
    } catch (error) {
      console.error('Error downloading resume:', error);

      // Fallback method
      try {
        const link = document.createElement('a');

        // Add a timestamp to force download and bypass cache
        const urlWithParam = new URL(resumeUrl);
        urlWithParam.searchParams.append('download', 'adhithanresume.pdf');
        urlWithParam.searchParams.append('t', Date.now().toString());

        link.href = urlWithParam.toString();
        link.download = 'adhithanresume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (fallbackError) {
        console.error('Fallback download failed:', fallbackError);
        // Last resort: direct navigation
        window.location.href = resumeUrl;
      }
    } finally {
      // Reset downloading state after a short delay
      setTimeout(() => setIsDownloading(false), 1000);
    }
  };

  // Render icon-only version (for footer)
  if (iconOnly) {
    return (
      <div className={`${className}`}>
        <button
          onClick={handleDownload}
          className="text-muted-foreground hover:text-primary transition-colors"
          aria-label="Download Resume"
          disabled={isDownloading}
        >
          {isDownloading ? (
            <Loader2Icon size={iconSize} className="animate-spin" />
          ) : (
            <FileTextIcon size={iconSize} />
          )}
        </button>
      </div>
    );
  }

  // Render full button version (for about page)
  return (
    <div className={`${className}`}>
      <button
        onClick={handleDownload}
        className="inline-flex items-center gap-1 rounded-lg bg-primary px-5 py-2.5 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-70"
        disabled={isDownloading}
      >
        {isDownloading ? (
          <Loader2Icon size={16} className="mr-1 animate-spin" />
        ) : (
          <DownloadIcon size={16} className="mr-1" />
        )}
        {showText && <span>{isDownloading ? 'Downloading...' : 'Download Resume'}</span>}
      </button>
    </div>
  );
};

export default ResumeViewer;
