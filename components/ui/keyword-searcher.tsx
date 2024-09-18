'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import FilePathTree from "@/components/file-path-tree"
import { Loader2 } from "lucide-react"

interface SearchResult {
  repository: string;
  remote: string;
  branch: string;
  filepath: string;
  linestart: number | null;
  lineend: number | null;
  summary: string;
}

export default function KeywordSearcher() {
  const [keyword, setKeyword] = useState('llamas')
  const [repoUrl, setRepoUrl] = useState('meta-llama/llama3')
  const [results, setResults] = useState<SearchResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isKeywordValid, setIsKeywordValid] = useState(true)
  const [isRepoUrlValid, setIsRepoUrlValid] = useState(true)
  const [hasAttemptedSearch, setHasAttemptedSearch] = useState(false)

  const validateInputs = () => {
    const keywordValid = keyword.trim().length > 0
    const repoUrlValid = /^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/.test(repoUrl.trim())
    
    setIsKeywordValid(keywordValid)
    setIsRepoUrlValid(repoUrlValid)
    
    return keywordValid && repoUrlValid
  }

  const handleSearch = async () => {
    setHasAttemptedSearch(true)
    const isFormValid = validateInputs()
    if (!isFormValid) return
    setError(null);

    setIsLoading(true)
    setResults([]) // Clear previous results
    try {
      const repositories = [{
        remote: `github`,
        branch: 'main',
        repository: repoUrl
      }]
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: keyword, repositories, sessionId: 'session-' + Date.now() })
      });
      if (!response.ok) {
        setError('Error: No results found. Check repository URL.')
        return
      }
      const data: SearchResult[] = await response.json();
      if (data.length === 0) {
        setError('Error: No results found. Check repository URL.')
      }
      setResults(data);
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">File Structure Mapper</h1>
      <div className="flex flex-col space-y-2 mb-4">
        <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">Search repo for:</label>
        <Input
          type="text"
          placeholder="Enter keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className={hasAttemptedSearch && !isKeywordValid ? 'border-red-500' : ''}
        />
        {hasAttemptedSearch && !isKeywordValid && <p className="text-red-500 text-sm">Please enter a keyword</p>}
        <label htmlFor="repoUrl" className="block text-sm font-medium text-gray-700 mb-1">
          Github Repo (username/repo-name)
        </label>
        <Input
          type="text"
          placeholder="Enter GitHub repository (e.g., username/repo-name)"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          className={hasAttemptedSearch && !isRepoUrlValid ? 'border-red-500' : ''}
        />
        {hasAttemptedSearch && !isRepoUrlValid && <p className="text-red-500 text-sm">Please enter a valid repository (e.g., username/repo-name)</p>}
        <Button onClick={handleSearch} disabled={isLoading}>
          <Search className="mr-2 h-4 w-4" /> {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {isLoading ? (
        <div className="mt-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-center mt-2 text-muted-foreground">Searching repository...</p>
        </div>
      ) : results.length > 0 ? (
        <FilePathTree results={results} />
      ) : null}
    </div>
  )
}