import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CitizenAuthPage from './pages/CitizenAuthPage';
import ManagerAuthPage from './pages/ManagerAuthPage';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import WorkerAuthPage from './pages/WorkerAuthPage';
import WorkerDashboard from './pages/WorkerDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen font-sans text-gray-800 bg-eco-bg flex flex-col relative overflow-hidden">
        
        {/* Decorative background blobs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-eco-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob pointer-events-none z-0"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-earth-100 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000 pointer-events-none z-0"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-eco-100 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-4000 pointer-events-none z-0"></div>

        {/* Global Navigation */}
        <nav className="relative z-50 bg-white/80 backdrop-blur-xl sticky top-0 border-b border-green-100 shadow-[0_8px_30px_-12px_rgba(34,197,94,0.15)] transition-all py-3.5">
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-3 cursor-pointer transition-transform hover:scale-105 active:scale-95 group">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-green-200/60 text-2xl group-hover:-rotate-12 transition-all duration-300">
                ♻️
              </div>
              <span className="text-2xl mt-0.5 font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-green-800 via-green-600 to-emerald-500 drop-shadow-sm">
                EcoManage
              </span>
            </Link>
            <div className="hidden sm:flex items-center gap-2.5 bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 px-5 py-2 rounded-2xl border border-green-200/60 shadow-sm">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-sm font-extrabold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-emerald-600">
                Solid Waste Management System
              </span>
            </div>
          </div>
        </nav>

        {/* Main Routed Content */}
        <main className="flex-1 relative z-10 w-full flex flex-col">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login/citizen" element={<CitizenAuthPage />} />
            <Route path="/login/manager" element={<ManagerAuthPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/login/worker" element={<WorkerAuthPage />} />
            <Route path="/worker-dashboard" element={<WorkerDashboard />} />
          </Routes>
        </main>
        
        {/* Subtle global footer */}
        <footer className="relative z-10 text-center py-6 text-sm text-gray-400 font-medium">
          &copy; {new Date().getFullYear()} EcoManage Platform. All rights reserved.
        </footer>
      </div>
    </Router>
  );
}

export default App;
