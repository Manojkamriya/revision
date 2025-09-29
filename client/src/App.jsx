import React from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Dashboard from './Home'
import Revision from './Revision'

// Create a separate Navigation component that uses useLocation
function Navigation() {
  const location = useLocation()

  return (
    <nav style={{
      background: '#2c3e50',
     
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          gap: '2rem',
          alignItems: 'center'
        }}>
          <Link 
            to="/" 
            style={{
              color: 'white',
              textDecoration: 'none',
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}
          >
            CS Revision
          </Link>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link 
              to="/" 
              style={{
                color: 'white',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                background: location.pathname === '/' ? '#3498db' : 'transparent'
              }}
            >
              Dashboard
            </Link>
            <Link 
              to="/revision" 
              style={{
                color: 'white',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                background: location.pathname === '/revision' ? '#3498db' : 'transparent'
              }}
            >
              Revision
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={
          <>
            <Navigation />
            <Dashboard />
          </>
        } />
        <Route path="/revision" element={
          <>
            <Navigation />
            <Revision />
          </>
        } />
      </Routes>
    </div>
  )
}

export default App