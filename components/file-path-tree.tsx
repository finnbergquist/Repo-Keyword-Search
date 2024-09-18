import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronRight, ChevronDown, File, Folder } from 'lucide-react'

interface SearchResult {
  repository: string;
  remote: string;
  branch: string;
  filepath: string;
  linestart: number | null;
  lineend: number | null;
  summary: string;
}

interface TreeNode {
  name: string;
  children: TreeNode[];
  result?: SearchResult;
}

const FilePathTree: React.FC<{ results: SearchResult[] }> = ({ results }) => {
  const buildTree = (results: SearchResult[]): TreeNode => {
    const root: TreeNode = { name: 'root', children: [] };
    results.forEach(result => {
      const parts = result.filepath.split('/');
      let currentNode = root;
      parts.forEach((part, index) => {
        let child = currentNode.children.find(c => c.name === part);
        if (!child) {
          child = { name: part, children: [] };
          currentNode.children.push(child);
        }
        if (index === parts.length - 1) {
          child.result = result;
        }
        currentNode = child;
      });
    });
    return root;
  };

  const renderNode = (node: TreeNode, depth: number = 0) => {
    const isEdgeNode = node.children.length === 0;

    return (
      <div key={node.name} className={`ml-${depth * 6} mt-4`}>
        <div className="flex items-center">
          {depth > 0 && (
            <div className="mr-2 text-primary">
              {isEdgeNode ? (
                <ChevronRight className="h-6 w-6" />
              ) : (
                <ChevronDown className="h-6 w-6" />
              )}
            </div>
          )}
          <Card 
            className={`p-4 ${isEdgeNode ? 'cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300' : 'bg-secondary'}`}
          >
            <div className="flex items-center space-x-3">
              {isEdgeNode ? (
                <File className="h-8 w-8 text-primary" />
              ) : (
                <Folder className="h-8 w-8 text-primary" />
              )}
              {node.result ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="text-lg font-semibold hover:text-primary transition-colors duration-300 underline">{node.name}</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">{node.result.filepath}</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4 space-y-2">
                      <p><strong>Repository:</strong> {node.result.repository}</p>
                      <p><strong>Branch:</strong> {node.result.branch}</p>
                      <p><strong>Summary:</strong> {node.result.summary}</p>
                    </div>
                  </DialogContent>
                </Dialog>
              ) : (
                <span className="text-lg font-semibold">{node.name}</span>
              )}
            </div>
          </Card>
        </div>
        {node.children.length > 0 && (
          <div className={`ml-6 mt-2 pl-4 border-l-4 border-primary`}>
            {node.children.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const tree = buildTree(results);

  return (
    <div className="mt-8 p-6">
      {tree.children.map(child => renderNode(child))}
    </div>
  );
};

export default FilePathTree;