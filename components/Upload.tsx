import { CheckCircle2, ImageIcon, UploadIcon } from "lucide-react";
import React from "react";
import { useOutletContext } from "react-router";
import { PROGRESS_INCREMENT, PROGRESS_INTERVAL_MS, REDIRECT_DELAY_MS } from "../lib/constants";

interface UploadProps {
  onComplete?: (base64Data: string) => void;
}

const Upload = ({ onComplete }: UploadProps) => {
  const [file, setFile] = React.useState<File | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const { isSignedIn } = useOutletContext<any>();

  const processFile = (selectedFile: File) => {
    if (!isSignedIn) return;
    setFile(selectedFile);
    setProgress(0);

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target?.result as string;
      const interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + PROGRESS_INCREMENT;
          if (next >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              if (onComplete) onComplete(base64Data);
            }, REDIRECT_DELAY_MS);
            return 100;
          }
          return next;
        });
      }, PROGRESS_INTERVAL_MS);
    };
    reader.readAsDataURL(selectedFile);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isSignedIn) return;
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isSignedIn) return;
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isSignedIn) return;
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isSignedIn) return;
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="upload">
      {!file ? (
        <div 
          className={`dropzone ${isDragging ? "is-dragging" : ""}`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <input
            type="file"
            className="drop-input"
            accept="jpg, jpeg, .png"
            disabled={!isSignedIn}
            onChange={onChange}
          />
          <div className="drop-content">
            <div className="drop-icon ">
              <UploadIcon size={20} />
            </div>
            <p>
              {isSignedIn
                ? "Drag and drop your floor plan here, or click to select a file."
                : "Please sign in to upload your floor plan."}
            </p>
            <p className="help">Maxinun file size: 50MB</p>
          </div>
        </div>
      ) : (
        <div className="upload-status">
          <div className="status-content">
            <div className="status-icon">
              {progress === 100 ? (
                <CheckCircle2 className="check" />
              ) : (
                <ImageIcon className="image" />
              )}
            </div>
            <h3>{file.name}</h3>
            <div className="progress">
              <div className="progress-bar" style={{ width: `${progress}%` }} />
              <p className="status-text">
                {progress < 100 ? "Analyzing Floor Plan..." : "Redirecting..."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;
