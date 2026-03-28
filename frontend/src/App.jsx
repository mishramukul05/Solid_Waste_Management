import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen font-sans text-gray-900 bg-eco-bg">
        {/* A simple thematic navigation bar */}
        <nav className="bg-eco-dark text-white p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <span className="text-xl font-bold tracking-wider">🌿 EcoManage</span>
          </div>
        </nav>

        {/* Main Content Area */}
        <main>
          <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;