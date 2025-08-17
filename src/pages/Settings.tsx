
import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Book, 
  Github, 
  GitBranch, 
  Settings as SettingsIcon, 
  Plus, 
  AlertCircle,
  Trash2 
} from 'lucide-react'

interface Repository {
  id: string
  name: string
  type: 'confluence' | 'github' | 'gitlab'
  url: string
  status: 'connected' | 'disconnected' | 'error'
}

export default function Settings() {
  const [repositories, setRepositories] = useState<Repository[]>([
    {
      id: '1',
      name: 'Company SOPs',
      type: 'confluence',
      url: 'https://company.atlassian.net/wiki',
      status: 'connected'
    },
    {
      id: '2', 
      name: 'Documentation Repo',
      type: 'github',
      url: 'https://github.com/company/docs',
      status: 'disconnected'
    }
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [newRepo, setNewRepo] = useState({
    name: '',
    type: 'confluence' as const,
    url: ''
  })

  const getIcon = (type: string) => {
    switch (type) {
      case 'confluence': return <Book className="w-5 h-5" />
      case 'github': return <Github className="w-5 h-5" />
      case 'gitlab': return <GitBranch className="w-5 h-5" />
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

  const handleAddRepository = () => {
    if (newRepo.name && newRepo.url) {
      const repo: Repository = {
        id: Date.now().toString(),
        ...newRepo,
        status: 'disconnected'
      }
      setRepositories([...repositories, repo])
      setNewRepo({ name: '', type: 'confluence', url: '' })
      setShowAddForm(false)
    }
  }

  const handleDeleteRepository = (id: string) => {
    setRepositories(repositories.filter(repo => repo.id !== id))
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
            onClick={() => setShowAddForm(true)}
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
                  <p className="text-sm text-gray-500">{repo.url}</p>
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

        {/* Add Repository Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50"
          >
            <h3 className="font-medium text-gray-900 mb-4">Add New Repository</h3>
            <div className="space-y-4">
              <div>
                <label className="label">Repository Name</label>
                <input
                  type="text"
                  value={newRepo.name}
                  onChange={(e) => setNewRepo({ ...newRepo, name: e.target.value })}
                  className="input"
                  placeholder="e.g., Company SOPs"
                />
              </div>
              <div>
                <label className="label">Repository Type</label>
                <select
                  value={newRepo.type}
                  onChange={(e) => setNewRepo({ ...newRepo, type: e.target.value as any })}
                  className="input"
                >
                  <option value="confluence">Confluence</option>
                  <option value="github">GitHub</option>
                  <option value="gitlab">GitLab</option>
                </select>
              </div>
              <div>
                <label className="label">Repository URL</label>
                <input
                  type="url"
                  value={newRepo.url}
                  onChange={(e) => setNewRepo({ ...newRepo, url: e.target.value })}
                  className="input"
                  placeholder="https://..."
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleAddRepository}
                  className="btn-primary btn-md"
                >
                  Add Repository
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
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
    </div>
  )
}