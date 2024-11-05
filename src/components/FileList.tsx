import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, Tag, Download, Trash2, Eye } from 'lucide-react';
import { getFiles, uploadFile, deleteFile, downloadFile } from '../services/api';
import ImagePreview from './ImagePreview';

interface FileListProps {
  bucketName: string;
  onBack: () => void;
  searchTerm: string;
  selectedTags: string[];
}

const FileList: React.FC<FileListProps> = ({ bucketName, onBack, searchTerm, selectedTags }) => {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    loadFiles();
  }, [bucketName]);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const data = await getFiles(bucketName);
      setFiles(data);
    } catch (err) {
      setError('Failed to load files');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await uploadFile(bucketName, file);
        loadFiles();
      } catch (err) {
        setError('Failed to upload file');
        console.error(err);
      }
    }
  };

  const handleDelete = async (fileName: string) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        await deleteFile(bucketName, fileName);
        loadFiles();
      } catch (err) {
        setError('Failed to delete file');
        console.error(err);
      }
    }
  };

  const handleDownload = async (fileName: string) => {
    try {
      const blob = await downloadFile(bucketName, fileName);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to download file');
      console.error(err);
    }
  };

  const isImageFile = (filename: string) => {
    const ext = filename.toLowerCase().split('.').pop();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '');
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => file.tags?.includes(tag));
    return matchesSearch && matchesTags;
  });

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-800">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
          <h2 className="text-2xl font-bold text-gray-900">{bucketName}</h2>
        </div>
        <div className="flex space-x-4">
          <label className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
            <Upload className="h-4 w-4 mr-2" />
            Upload File
            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                File
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tags
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredFiles.map((file) => (
              <tr key={file.name} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {isImageFile(file.name) && (
                        <img
                          className="h-10 w-10 rounded-lg object-cover cursor-pointer"
                          src={file.url}
                          alt=""
                          onClick={() => setPreviewImage(file.url)}
                        />
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{file.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {Math.round(file.size / 1024)} KB
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-2">
                    {file.tags?.map((tag: string, index: number) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-3">
                    {isImageFile(file.name) && (
                      <button
                        onClick={() => setPreviewImage(file.url)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                    )}
                    <button 
                      onClick={() => handleDownload(file.name)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(file.name)}
                      className="text-red-400 hover:text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {previewImage && (
        <ImagePreview
          src={previewImage}
          onClose={() => setPreviewImage(null)}
        />
      )}
    </div>
  );
};

export default FileList;