import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Database, 
  FileText, 
  Book, 
  Github,
  GitBranch,
  Upload,
  Link as LinkIcon,
  CheckCircle,
  AlertCircle,
  Loader
} from 'lucide-react'
import toast from 'react-hot-toast'

interface RepositoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (repository: any) => void
}

type RepositoryType = 'database' | 'file_upload' | 'confluence' | 'github' | 'gitlab'

interface DatabaseConfig {
  name: string
  type: 'postgresql' | 'mysql' | 'mongodb' | 'sqlite'
  host: string
  port: string
  database: string
  username: string
  password: string
  ssl: boolean
}

interface FileUploadConfig {
  name: string
  files: File[]
  description: string
  tags: string[]
}

interface ConfluenceConfig {
  name: string
  baseUrl: string
  username: string
  apiToken: string
  spaceKey: string
  includeAttachments: boolean
}

interface GitConfig {
  name: string
  repoUrl: string
  accessToken: string
  branch: string
  path: string
  includeWiki: boolean
}

export default function RepositoryModal({ isOpen, onClose, onSave }: RepositoryModalProps) {
  const [selectedType, setSelectedType] = useState<RepositoryType>('confluence')
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Configuration states
  const [databaseConfig, setDatabaseConfig] = useState<DatabaseConfig>({
    name: '',
    type: 'postgresql',
    host: '',
    port: '5432',
    database: '',
    username: '',
    password: '',
    ssl: true
  })

  const [fileUploadConfig, setFileUploadConfig] = useState<FileUploadConfig>({
    name: '',
    files: [],
    description: '',
    tags: []
  })

  const [confluenceConfig, setConfluenceConfig] = useState<ConfluenceConfig>({
    name: '',
    baseUrl: '',
    username: '',
    apiToken: '',
    spaceKey: '',
    includeAttachments: true
  })

  const [gitConfig, setGitConfig] = useState<GitConfig>({
    name: '',
    repoUrl: '',
    accessToken: '',
    branch: 'main',
    path: '',
    includeWiki: false
  })

  const repositoryTypes = [
    {
      id: 'confluence' as const,
      name: 'Confluence',
      description: 'Connect to Confluence spaces for SOPs and documentation',
      icon: Book,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      id: 'database' as const,
      name: 'Database',
      description: 'Connect to your database for structured data access',
      icon: Database,
      color: 'text-green-600 bg-green-100'
    },
    {
      id: 'file_upload' as const,
      name: 'File Upload',
      description: 'Upload SOP documents, PDFs, and knowledge files',
      icon: FileText,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      id: 'github' as const,
      name: 'GitHub',
      description: 'Connect to GitHub repositories for documentation',
      icon: Github,
      color: 'text-gray-600 bg-gray-100'
    },
    {
      id: 'gitlab' as const,
      name: 'GitLab',
      description: 'Connect to GitLab projects for documentation',
      icon: GitBranch,
      color: 'text-orange-600 bg-orange-100'
    }
  ]

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setFileUploadConfig(prev => ({
      ...prev,
      files: [...prev.files, ...files]
    }))
  }

  const removeFile = (index: number) => {
    setFileUploadConfig(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }))
  }

  const testConnection = async () => {
    setConnectionStatus('testing')
    setIsConnecting(true)

    try {
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real implementation, you would test the actual connection here
      const success = Math.random() > 0.3 // 70% success rate for demo
      
      if (success) {
        setConnectionStatus('success')
        toast.success('Connection successful!')
      } else {
        setConnectionStatus('error')
        toast.error('Connection failed. Please check your credentials.')
      }
    } catch (error) {
      setConnectionStatus('error')
      toast.error('Connection test failed')
    } finally {
      setIsConnecting(false)
    }
  }

  const handleSave = async () => {
    let config
    let type = selectedType

    switch (selectedType) {
      case 'database':
        if (!databaseConfig.name || !databaseConfig.host) {
          toast.error('Please fill in required database fields')
          return
        }
        config = databaseConfig
        break
      case 'file_upload':
        if (!fileUploadConfig.name || fileUploadConfig.files.length === 0) {
          toast.error('Please provide a name and upload at least one file')
          return
        }
        config = fileUploadConfig
        break
      case 'confluence':
        if (!confluenceConfig.name || !confluenceConfig.baseUrl || !confluenceConfig.apiToken) {
          toast.error('Please fill in required Confluence fields')
          return
        }
        config = confluenceConfig
        break
      case 'github':
      case 'gitlab':
        if (!gitConfig.name || !gitConfig.repoUrl) {
          toast.error('Please fill in required repository fields')
          return
        }
        config = gitConfig
        break
    }

    const repository = {
      id: Date.now().toString(),
      type,
      name: config.name,
      config,
      status: 'connected',
      createdAt: new Date().toISOString()
    }

    onSave(repository)
    toast.success('Repository added successfully!')
    onClose()
  }

  const renderDatabaseForm = () => (
    <div className="space-y-4">
      <div>
        <label className="label">Repository Name *</label>
        <input
          type="text"
          value={databaseConfig.name}
          onChange={(e) => setDatabaseConfig(prev => ({ ...prev, name: e.target.value }))}
          className="input"
          placeholder="e.g., Customer Database"
        />
      </div>
      
      <div>
        <label className="label">Database Type</label>
        <select
          value={databaseConfig.type}
          onChange={(e) => setDatabaseConfig(prev => ({ ...prev, type: e.target.value as any }))}
          className="input"
        >
          <option value="postgresql">PostgreSQL</option>
          <option value="mysql">MySQL</option>
          <option value="mongodb">MongoDB</option>
          <option value="sqlite">SQLite</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Host *</label>
          <input
            type="text"
            value={databaseConfig.host}
            onChange={(e) => setDatabaseConfig(prev => ({ ...prev, host: e.target.value }))}
            className="input"
            placeholder="localhost"
          />
        </div>
        <div>
          <label className="label">Port</label>
          <input
            type="text"
            value={databaseConfig.port}
            onChange={(e) => setDatabaseConfig(prev => ({ ...prev, port: e.target.value }))}
            className="input"
            placeholder="5432"
          />
        </div>
      </div>

      <div>
        <label className="label">Database Name</label>
        <input
          type="text"
          value={databaseConfig.database}
          onChange={(e) => setDatabaseConfig(prev => ({ ...prev, database: e.target.value }))}
          className="input"
          placeholder="crm_database"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Username</label>
          <input
            type="text"
            value={databaseConfig.username}
            onChange={(e) => setDatabaseConfig(prev => ({ ...prev, username: e.target.value }))}
            className="input"
            placeholder="username"
          />
        </div>
        <div>
          <label className="label">Password</label>
          <input
            type="password"
            value={databaseConfig.password}
            onChange={(e) => setDatabaseConfig(prev => ({ ...prev, password: e.target.value }))}
            className="input"
            placeholder="••••••••"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="ssl"
          checked={databaseConfig.ssl}
          onChange={(e) => setDatabaseConfig(prev => ({ ...prev, ssl: e.target.checked }))}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="ssl" className="text-sm text-gray-700">Use SSL connection</label>
      </div>
    </div>
  )

  const renderFileUploadForm = () => (
    <div className="space-y-4">
      <div>
        <label className="label">Repository Name *</label>
        <input
          type="text"
          value={fileUploadConfig.name}
          onChange={(e) => setFileUploadConfig(prev => ({ ...prev, name: e.target.value }))}
          className="input"
          placeholder="e.g., Company SOPs"
        />
      </div>

      <div>
        <label className="label">Description</label>
        <textarea
          value={fileUploadConfig.description}
          onChange={(e) => setFileUploadConfig(prev => ({ ...prev, description: e.target.value }))}
          className="input"
          rows={3}
          placeholder="Describe the content of these files..."
        />
      </div>

      <div>
        <label className="label">Upload Files *</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">
            Drag and drop files here, or click to browse
          </p>
          <p className="text-xs text-gray-500">
            Supports PDF, DOC, DOCX, TXT, MD files up to 10MB each
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt,.md"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-2 btn-primary btn-md"
          >
            Browse Files
          </button>
        </div>
      </div>

      {fileUploadConfig.files.length > 0 && (
        <div>
          <label className="label">Uploaded Files ({fileUploadConfig.files.length})</label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {fileUploadConfig.files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 border border-gray-200 rounded">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderConfluenceForm = () => (
    <div className="space-y-4">
      <div>
        <label className="label">Repository Name *</label>
        <input
          type="text"
          value={confluenceConfig.name}
          onChange={(e) => setConfluenceConfig(prev => ({ ...prev, name: e.target.value }))}
          className="input"
          placeholder="e.g., Company Knowledge Base"
        />
      </div>

      <div>
        <label className="label">Confluence Base URL *</label>
        <input
          type="url"
          value={confluenceConfig.baseUrl}
          onChange={(e) => setConfluenceConfig(prev => ({ ...prev, baseUrl: e.target.value }))}
          className="input"
          placeholder="https://yourcompany.atlassian.net/wiki"
        />
      </div>

      <div>
        <label className="label">Space Key</label>
        <input
          type="text"
          value={confluenceConfig.spaceKey}
          onChange={(e) => setConfluenceConfig(prev => ({ ...prev, spaceKey: e.target.value }))}
          className="input"
          placeholder="e.g., SUPPORT, DOCS"
        />
        <p className="text-xs text-gray-500 mt-1">
          Leave empty to access all spaces you have permission to
        </p>
      </div>

      <div>
        <label className="label">Username/Email *</label>
        <input
          type="email"
          value={confluenceConfig.username}
          onChange={(e) => setConfluenceConfig(prev => ({ ...prev, username: e.target.value }))}
          className="input"
          placeholder="your.email@company.com"
        />
      </div>

      <div>
        <label className="label">API Token *</label>
        <input
          type="password"
          value={confluenceConfig.apiToken}
          onChange={(e) => setConfluenceConfig(prev => ({ ...prev, apiToken: e.target.value }))}
          className="input"
          placeholder="••••••••"
        />
        <p className="text-xs text-gray-500 mt-1">
          Create an API token at: Account Settings → Security → API tokens
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="includeAttachments"
          checked={confluenceConfig.includeAttachments}
          onChange={(e) => setConfluenceConfig(prev => ({ ...prev, includeAttachments: e.target.checked }))}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="includeAttachments" className="text-sm text-gray-700">
          Include page attachments
        </label>
      </div>
    </div>
  )

  const renderGitForm = () => (
    <div className="space-y-4">
      <div>
        <label className="label">Repository Name *</label>
        <input
          type="text"
          value={gitConfig.name}
          onChange={(e) => setGitConfig(prev => ({ ...prev, name: e.target.value }))}
          className="input"
          placeholder="e.g., Documentation Repository"
        />
      </div>

      <div>
        <label className="label">Repository URL *</label>
        <input
          type="url"
          value={gitConfig.repoUrl}
          onChange={(e) => setGitConfig(prev => ({ ...prev, repoUrl: e.target.value }))}
          className="input"
          placeholder="https://github.com/company/docs"
        />
      </div>

      <div>
        <label className="label">Access Token</label>
        <input
          type="password"
          value={gitConfig.accessToken}
          onChange={(e) => setGitConfig(prev => ({ ...prev, accessToken: e.target.value }))}
          className="input"
          placeholder="••••••••"
        />
        <p className="text-xs text-gray-500 mt-1">
          Required for private repositories
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Branch</label>
          <input
            type="text"
            value={gitConfig.branch}
            onChange={(e) => setGitConfig(prev => ({ ...prev, branch: e.target.value }))}
            className="input"
            placeholder="main"
          />
        </div>
        <div>
          <label className="label">Path Filter</label>
          <input
            type="text"
            value={gitConfig.path}
            onChange={(e) => setGitConfig(prev => ({ ...prev, path: e.target.value }))}
            className="input"
            placeholder="docs/, README.md"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="includeWiki"
          checked={gitConfig.includeWiki}
          onChange={(e) => setGitConfig(prev => ({ ...prev, includeWiki: e.target.checked }))}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="includeWiki" className="text-sm text-gray-700">
          Include repository wiki
        </label>
      </div>
    </div>
  )

  const renderConfigurationForm = () => {
    switch (selectedType) {
      case 'database':
        return renderDatabaseForm()
      case 'file_upload':
        return renderFileUploadForm()
      case 'confluence':
        return renderConfluenceForm()
      case 'github':
      case 'gitlab':
        return renderGitForm()
      default:
        return null
    }
  }

  const canTestConnection = () => {
    switch (selectedType) {
      case 'database':
        return databaseConfig.name && databaseConfig.host
      case 'confluence':
        return confluenceConfig.baseUrl && confluenceConfig.apiToken
      case 'github':
      case 'gitlab':
        return gitConfig.repoUrl
      case 'file_upload':
        return false // No connection test for file uploads
      default:
        return false
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Add Repository Integration
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex h-[calc(90vh-140px)]">
              {/* Repository Type Selection */}
              <div className="w-80 border-r border-gray-200 p-6 overflow-y-auto">
                <h3 className="text-sm font-medium text-gray-900 mb-4">
                  Choose Integration Type
                </h3>
                <div className="space-y-2">
                  {repositoryTypes.map((type) => {
                    const Icon = type.icon
                    return (
                      <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          selectedType === type.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${type.color}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{type.name}</h4>
                            <p className="text-sm text-gray-500 mt-1">
                              {type.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Configuration Form */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-2xl">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">
                    Configure {repositoryTypes.find(t => t.id === selectedType)?.name}
                  </h3>
                  
                  {renderConfigurationForm()}

                  {/* Connection Test */}
                  {selectedType !== 'file_upload' && (
                    <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Test Connection</h4>
                          <p className="text-sm text-gray-600">
                            Verify your credentials and connection settings
                          </p>
                        </div>
                        <button
                          onClick={testConnection}
                          disabled={!canTestConnection() || isConnecting}
                          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {connectionStatus === 'testing' ? (
                            <Loader className="w-4 h-4 animate-spin" />
                          ) : connectionStatus === 'success' ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : connectionStatus === 'error' ? (
                            <AlertCircle className="w-4 h-4 text-red-600" />
                          ) : (
                            <LinkIcon className="w-4 h-4" />
                          )}
                          <span>
                            {connectionStatus === 'testing' ? 'Testing...' :
                             connectionStatus === 'success' ? 'Connected' :
                             connectionStatus === 'error' ? 'Failed' : 'Test Connection'}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="btn-primary btn-md"
              >
                Add Repository
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}