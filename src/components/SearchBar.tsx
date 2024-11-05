import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  selectedTags: string[];
  onSearchChange: (value: string) => void;
  onTagSelect: (tag: string) => void;
  onTagRemove: (tag: string) => void;
  availableTags: string[];
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  selectedTags,
  onSearchChange,
  onTagSelect,
  onTagRemove,
  availableTags,
}) => {
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);

  useEffect(() => {
    setShowTagSuggestions(searchTerm.startsWith('#'));
  }, [searchTerm]);

  const handleInputChange = (value: string) => {
    onSearchChange(value);
    setShowTagSuggestions(value.startsWith('#'));
  };

  const handleTagSelect = (tag: string) => {
    onTagSelect(tag);
    onSearchChange('');
    setShowTagSuggestions(false);
  };

  return (
    <div className="w-full max-w-2xl relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search files or type # for tags..."
          value={searchTerm}
          onChange={(e) => handleInputChange(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
      
      {selectedTags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
            >
              #{tag}
              <button
                onClick={() => onTagRemove(tag)}
                className="ml-1 inline-flex items-center"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      
      {showTagSuggestions && availableTags.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg">
          <div className="py-1">
            {availableTags
              .filter(tag => 
                !selectedTags.includes(tag) && 
                tag.toLowerCase().includes(searchTerm.toLowerCase().slice(1))
              )
              .map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagSelect(tag)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  #{tag}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;