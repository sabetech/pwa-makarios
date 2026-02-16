import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import Login from './pages/Auth/Login';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Home/Dashboard';
import Settings from './pages/Settings/Settings';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />

            <Route path="/dashboard" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="services" element={<div>Services Page</div>} />
              <Route path="campaigns" element={<div>Campaigns Page</div>} />
              <Route path="members" element={<div>Members Page</div>} />
              <Route path="arrivals" element={<div>Arrivals Page</div>} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
