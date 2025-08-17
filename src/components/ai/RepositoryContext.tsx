import { useState, useEffect } from 'react'
import { Database, FileText, Book, Github, GitBranch } from 'lucide-react'

interface Repository {
  id: string
  name: string
  type: 'confluence' | 'github' | 'gitlab' | 'database' | 'file_upload'
  config: any
  status: 'connected' | 'disconnected' | 'error'
  createdAt: string
}

interface RepositoryContextProps {
  onRepositorySelect: (repositories: Repository[]) => void
  selectedRepositories: string[]
}

export default function RepositoryContext({ onRepositorySelect, selectedRepositories }: RepositoryContextProps) {
  const [repositories, setRepositories] = useState<Repository[]>([])

  useEffect(() => {
    // Load repositories from localStorage or use demo data
    const savedRepos = localStorage.getItem('repositories')
    if (savedRepos) {
      setRepositories(JSON.parse(savedRepos))
    } else {
      // Use demo repositories
      const demoRepos: Repository[] = [
        {
          id: '1',
          name: 'Company SOPs',
          type: 'confluence',
          config: {
            baseUrl: 'https://company.atlassian.net/wiki',
            spaceKey: 'SUPPORT'
          },
          status: 'connected',
          createdAt: '2024-01-15T10:00:00Z'
        },
        {
          id: '2', 
          name: 'Documentation Repo',
          type: 'github',
          config: {
            repoUrl: 'https://github.com/company/docs',
            branch: 'main'
          },
          status: 'connected',
          createdAt: '2024-01-10T15:30:00Z'
        },
        {
          id: '3',
          name: 'Customer Database',
          type: 'database',
          config: {
            type: 'postgresql',
            host: 'localhost',
            database: 'crm_db'
          },
          status: 'connected',
          createdAt: '2024-01-20T09:15:00Z'
        }
      ]
      setRepositories(demoRepos)
    }
  }, [])

  const getIcon = (type: string) => {
    switch (type) {
      case 'confluence': return <Book className="w-4 h-4" />
      case 'github': return <Github className="w-4 h-4" />
      case 'gitlab': return <GitBranch className="w-4 h-4" />
      case 'database': return <Database className="w-4 h-4" />
      case 'file_upload': return <FileText className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600'
      case 'disconnected': return 'text-gray-600'
      case 'error': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const handleRepositoryToggle = (repoId: string) => {
    const isSelected = selectedRepositories.includes(repoId)
    let newSelection
    
    if (isSelected) {
      newSelection = selectedRepositories.filter(id => id !== repoId)
    } else {
      newSelection = [...selectedRepositories, repoId]
    }
    
    const selectedRepos = repositories.filter(repo => newSelection.includes(repo.id))
    onRepositorySelect(selectedRepos)
  }

  const connectedRepos = repositories.filter(repo => repo.status === 'connected')

  if (connectedRepos.length === 0) {
    return (
      <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
        <p className="text-sm text-gray-600">
          No repositories connected. Go to Settings to add knowledge sources.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-900">Knowledge Sources</h4>
      <div className="space-y-2">
        {connectedRepos.map((repo) => (
          <label
            key={repo.id}
            className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
          >
            <input
              type="checkbox"
              checked={selectedRepositories.includes(repo.id)}
              onChange={() => handleRepositoryToggle(repo.id)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <div className="flex items-center space-x-2 flex-1">
              <div className={getStatusColor(repo.status)}>
                {getIcon(repo.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{repo.name}</p>
                <p className="text-xs text-gray-500 capitalize">{repo.type}</p>
              </div>
            </div>
          </label>
        ))}
      </div>
      {selectedRepositories.length > 0 && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            ✨ AI will reference {selectedRepositories.length} selected knowledge source{selectedRepositories.length > 1 ? 's' : ''} when answering your questions.
          </p>
        </div>
      )}
    </div>
  )
}