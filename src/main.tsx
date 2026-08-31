import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

// Stylesheet imports are deliberately absent until Stage B. When they land,
// the order is fixed and load-bearing (CLAUDE.md section 2):
// tokens.css, then base.css, then console.css.

const root = document.getElementById('root')
if (!root) {
  throw new Error('Mount failed: #root is missing from index.html')
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
