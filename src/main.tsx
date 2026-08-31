import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

// The order below is fixed and load-bearing (CLAUDE.md section 2). Tokens must
// exist before anything references them, so tokens.css always loads first.
import './styles/tokens.css'
import './styles/base.css'
import './styles/console.css'

const root = document.getElementById('root')
if (!root) {
  throw new Error('Mount failed: #root is missing from index.html')
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
