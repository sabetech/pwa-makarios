import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import Login from './pages/Auth/Login';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Home/Dashboard';
import Settings from './pages/Settings/Settings';
import Services from './pages/Services/Services';
import ServiceSelection from './pages/Services/ServiceSelection';
import BacentaServiceForm from './pages/Services/BacentaServiceForm';
import BacentaServicesList from './pages/Services/BacentaServicesList';
import Members from './pages/Members/Members';
import AddMember from './pages/Members/AddMember';
import TakeAttendance from './pages/Members/TakeAttendance';
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
              <Route path="services" element={<Services />} />
              <Route path="service-selection" element={<ServiceSelection />} />
              <Route path="bacenta-services" element={<BacentaServicesList />} />
              <Route path="bacenta-service" element={<BacentaServiceForm />} />
              <Route path="campaigns" element={<div>Campaigns Page</div>} />
              <Route path="members" element={<Members />} />
              <Route path="members/add" element={<AddMember />} />
              <Route path="members/attendance" element={<TakeAttendance />} />
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
