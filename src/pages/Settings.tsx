
import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Book, 
  Github, 
  GitBranch, 
  Settings as SettingsIcon, 
  Plus, 
  AlertCircle,
  Trash2,
  Database,
  FileText
} from 'lucide-react'
import RepositoryModal from '@/components/repository/RepositoryModal'

interface Repository {
  id: string
  name: string
  type: 'confluence' | 'github' | 'gitlab' | 'database' | 'file_upload'
  config: any
  status: 'connected' | 'disconnected' | 'error'
  createdAt: string
}

export default function Settings() {
  const [repositories, setRepositories] = useState<Repository[]>([
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
      status: 'disconnected',
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
  ])

  const [showModal, setShowModal] = useState(false)

  const getIcon = (type: string) => {
    switch (type) {
      case 'confluence': return <Book className="w-5 h-5" />
      case 'github': return <Github className="w-5 h-5" />
      case 'gitlab': return <GitBranch className="w-5 h-5" />
      case 'database': return <Database className="w-5 h-5" />
      case 'file_upload': return <FileText className="w-5 h-5" />
      default: return <SettingsIcon className="w-5 h-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-100'
      case 'disconnected': return 'text-gray-600 bg-gray-100'
      case 'error': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const handleAddRepository = (repository: Repository) => {
    const updatedRepos = [...repositories, repository]
    setRepositories(updatedRepos)
    
    // Save to localStorage so AI Assistant can access them
    localStorage.setItem('repositories', JSON.stringify(updatedRepos))
  }

  const handleDeleteRepository = (id: string) => {
    const updatedRepos = repositories.filter(repo => repo.id !== id)
    setRepositories(updatedRepos)
    
    // Update localStorage
    localStorage.setItem('repositories', JSON.stringify(updatedRepos))
  }


  const getRepositoryDetails = (repo: Repository) => {
    switch (repo.type) {
      case 'confluence':
        return `${repo.config.baseUrl}${repo.config.spaceKey ? ` | ${repo.config.spaceKey}` : ''}`
      case 'github':
      case 'gitlab':
        return `${repo.config.repoUrl} | ${repo.config.branch || 'main'}`
      case 'database':
        return `${repo.config.type} | ${repo.config.host}${repo.config.database ? `/${repo.config.database}` : ''}`
      case 'file_upload':
        return `${repo.config.files?.length || 0} files uploaded`
      default:
        return 'Configuration details'
    }
  }

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Configure your CRM preferences and repository integrations
          </p>
        </div>
      </div>

      {/* Repository Integration Section */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Repository Integrations
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Connect to Confluence, GitHub, and other knowledge sources for AI-powered support
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary btn-md flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Repository</span>
          </button>
        </div>

        {/* Repository List */}
        <div className="space-y-4">
          {repositories.map((repo) => (
            <motion.div
              key={repo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="text-gray-600">
                  {getIcon(repo.type)}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {repo.name}
                  </h3>
                  <p className="text-sm text-gray-500">{getRepositoryDetails(repo)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(repo.status)}`}>
                  {repo.status}
                </span>
                <button
                  onClick={() => handleDeleteRepository(repo.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Demo Notice */}
      <div className="card p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">Demo Mode</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              This is a demo version. Repository connections are simulated. 
              In production, you would configure actual API credentials and authentication.
            </p>
          </div>
        </div>
      </div>

      {/* Repository Modal */}
      <RepositoryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleAddRepository}
      />
    </div>
  )
}