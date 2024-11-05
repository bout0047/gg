import React from 'react';
import { X } from 'lucide-react';

interface ImagePreviewProps {
  src: string;
  onClose: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ src, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="relative max-w-4xl max-h-[90vh] mx-4">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>
        <img
          src={src}
          alt="Preview"
          className="max-w-full max-h-[85vh] object-contain rounded-lg"
        />
      </div>
    </div>
  );
};

export default ImagePreview;