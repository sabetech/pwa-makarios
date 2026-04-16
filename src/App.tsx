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
import EditMember from './pages/Members/EditMember';
import TakeAttendance from './pages/Members/TakeAttendance';
import MemberProfile from './pages/Members/MemberProfile';
import Insights from './pages/Home/Insights';
import AdminPortal from './pages/Admin/AdminPortal';
import ManageStreams from './pages/Admin/ManageStreams';
import ManageRegions from './pages/Admin/ManageRegions';
import ManageBacentas from './pages/Admin/ManageBacentas';
import ManageLeaders from './pages/Admin/ManageLeaders';
import Campaigns from './pages/Campaigns/Campaigns';
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
              <Route path="campaigns" element={<Campaigns />} />
               <Route path="members" element={<Members />} />
              <Route path="members/add" element={<AddMember />} />
              <Route path="members/edit/:id" element={<EditMember />} />
              <Route path="members/attendance" element={<TakeAttendance />} />
              <Route path="members/:id" element={<MemberProfile />} />
              <Route path="arrivals" element={<div>Arrivals Page</div>} />
              <Route path="settings" element={<Settings />} />
              <Route path="insights" element={<Insights />} />
              <Route path="admin" element={<AdminPortal />} />
              <Route path="admin/streams" element={<ManageStreams />} />
              <Route path="admin/regions" element={<ManageRegions />} />
              <Route path="admin/bacentas" element={<ManageBacentas />} />
              <Route path="admin/leaders" element={<ManageLeaders />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
