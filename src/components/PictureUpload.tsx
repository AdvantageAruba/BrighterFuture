import React, { useState } from 'react';
import { User, X, Upload, Camera } from 'lucide-react';

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
  const [preview, setPreview] = useState<string | null>(currentPicture || null);
  const [dragActive, setDragActive] = useState(false);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const handleFileSelect = (file: File) => {
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Please select an image smaller than 5MB');
        return;
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      onPictureChange(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const removePicture = () => {
    setPreview(null);
    onPictureChange(null);
    if (onPictureRemove) {
      onPictureRemove();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center space-x-6">
        {/* Picture Display */}
        <div className="flex-shrink-0">
          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="Profile preview"
                className={`${sizeClasses[size]} rounded-full object-cover border-2 border-gray-200`}
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={removePicture}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                  title="Remove picture"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className={`${sizeClasses[size]} rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center`}>
              <User className={`${iconSizes[size]} text-gray-400`} />
            </div>
          )}
        </div>

        {/* Upload Controls */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Picture
          </label>
          
          {/* Drag & Drop Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-4 transition-colors duration-200 ${
              dragActive 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <Upload className={`mx-auto h-8 w-8 text-gray-400 mb-2 ${dragActive ? 'text-blue-400' : ''}`} />
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium text-blue-600 hover:text-blue-500">
                  Click to upload
                </span>{' '}
                or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
          </div>

          {/* File Input */}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            disabled={disabled}
            className="hidden"
            id="picture-upload"
          />
          
          {/* Upload Button */}
          <button
            type="button"
            onClick={() => document.getElementById('picture-upload')?.click()}
            disabled={disabled}
            className="mt-3 w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Camera className="w-4 h-4" />
            <span>Choose File</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PictureUpload;
