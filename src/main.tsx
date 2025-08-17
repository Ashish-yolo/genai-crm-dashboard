import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import DebugApp from './DebugApp'
import './index.css'

console.log('🚀 Main.tsx is executing!')
console.log('React version:', React.version)

// Use DebugApp to test basic React functionality
const useDebugMode = false // Set to true to enable debug mode

try {
  const rootElement = document.getElementById('root')
  console.log('Root element found:', rootElement)
  
  if (rootElement) {
    console.log('Rendering React app...')
    
    ReactDOM.render(
      <React.StrictMode>
        {useDebugMode ? <DebugApp /> : <App />}
      </React.StrictMode>,
      rootElement
    )
    
    console.log('✅ React app rendered successfully!')
  } else {
    console.error('❌ Root element not found!')
  }
} catch (error) {
  console.error('❌ Error during React rendering:', error)
}