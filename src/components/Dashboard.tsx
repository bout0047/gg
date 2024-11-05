import React, { useState } from 'react';
import { FolderOpen, LogOut } from 'lucide-react';
import BucketList from './BucketList';
import FileList from './FileList';
import SearchBar from './SearchBar';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const availableTags = ['marketing', 'reports', 'images', 'documents', 'archive'];

  const handleTagSelect = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleTagRemove = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <FolderOpen className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">
                Secure Storage
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <SearchBar
                searchTerm={searchTerm}
                selectedTags={selectedTags}
                onSearchChange={handleSearchChange}
                onTagSelect={handleTagSelect}
                onTagRemove={handleTagRemove}
                availableTags={availableTags}
              />
              <button
                onClick={onLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedBucket ? (
          <BucketList
            onSelectBucket={setSelectedBucket}
            searchTerm={searchTerm}
            selectedTags={selectedTags}
          />
        ) : (
          <FileList
            bucketName={selectedBucket}
            onBack={() => setSelectedBucket(null)}
            searchTerm={searchTerm}
            selectedTags={selectedTags}
          />
        )}
      </main>
    </div>
  );
}

export default Dashboard;