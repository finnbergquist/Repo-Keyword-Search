import React from 'react';

interface FilePathGraphProps {
  filepath: string;
}

export const FilePathGraph: React.FC<FilePathGraphProps> = ({ filepath }) => {
  const parts = filepath.split('/');
  return (
    <div className="flex items-center space-x-1 text-sm">
      {parts.map((part, index) => (
        <span key={index} className="flex items-center">
          {index > 0 && <span className="text-gray-400 mx-1">/</span>}
          <span className="bg-gray-100 rounded px-1 py-0.5">{part}</span>
        </span>
      ))}
    </div>
  );
};
