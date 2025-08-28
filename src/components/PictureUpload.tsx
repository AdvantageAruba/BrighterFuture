import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface PictureUploadProps {
  currentPicture?: string | null;
  onPictureChange: (file: File | null) => void;
  onPictureRemove?: () => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

const PictureUpload: React.FC<PictureUploadProps> = ({
  currentPicture,
  onPictureChange,
  onPictureRemove,
  size = 'md',
  disabled = false,
  className = ''
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentPicture || null);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update preview when currentPicture changes
  useEffect(() => {
    setPreview(currentPicture || null);
  }, [currentPicture]);

  // Image compression function
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions (max 800x800, maintain aspect ratio)
        const maxSize = 800;
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              resolve(compressedFile);
            } else {
              resolve(file); // Fallback to original if compression fails
            }
          },
          'image/jpeg',
          0.8 // Quality: 0.8 (80%)
        );
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFile = useCallback(async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setIsCompressing(true);
      try {
        // Compress the image
        const compressedFile = await compressImage(file);
        console.log(`Original size: ${(file.size / 1024 / 1024).toFixed(2)}MB, Compressed size: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
        
        if (compressedFile.size > maxSize) {
          alert('Image is still too large after compression. Please try a smaller image.');
          setIsCompressing(false);
          return;
        }
        
        file = compressedFile; // Use compressed version
      } catch (error) {
        console.error('Image compression failed:', error);
        alert('Image compression failed. Please try a smaller image.');
        setIsCompressing(false);
        return;
      } finally {
        setIsCompressing(false);
      }
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Pass file to parent component
    onPictureChange(file);
  }, [onPictureChange]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  const handleRemove = useCallback(() => {
    setPreview(null);
    onPictureChange(null);
    if (onPictureRemove) {
      onPictureRemove();
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onPictureChange, onPictureRemove]);

  const openFileDialog = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-24 h-24';
      case 'lg':
        return 'w-48 h-48';
      default:
        return 'w-32 h-32';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center space-x-2">
        <ImageIcon className="w-5 h-5 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Profile Picture</span>
      </div>
      
      <div className="space-y-3">
        {/* Current Picture Display */}
        {preview && (
          <div className="relative inline-block">
            <img
              src={preview}
              alt="Profile preview"
              className={`${getSizeClasses()} rounded-lg object-cover border-2 border-gray-200`}
            />
            <button
              onClick={handleRemove}
              disabled={disabled}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Remove picture"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Upload Area */}
        {!preview && (
          <div
            className={`${getSizeClasses()} border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors duration-200 ${
              dragActive ? 'border-blue-500 bg-blue-50' : ''
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={disabled ? undefined : openFileDialog}
          >
            {isCompressing ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Compressing image...</p>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 text-center">
                  <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
              </>
            )}
          </div>
        )}

        {/* File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />

        {/* Upload Button (if no preview) */}
        {!preview && !isCompressing && (
          <button
            onClick={openFileDialog}
            disabled={disabled}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Choose Image
          </button>
        )}
      </div>
    </div>
  );
};

export default PictureUpload;
