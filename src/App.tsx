import { QueryClient, QueryClientProvider } from 'react-query'
import './App.css'
import UserProvider from './contexts/UserContext'
import Welcome from './pages/Auth/Welcome'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Home/Dashboard'
import Members from './pages/Members/Members'
import Services from './pages/Services/Services'
import Arrivals from './pages/Arrivals/Arrivals'
import Directory from './pages/Directory/Directory'
import FellowshipServiceDetails from './pages/Detail/FellowshipServiceDetail'
import FellowshipServiceForm from './pages/Forms/FellowshipService'
import ForgotPassword from './pages/Auth/ForgotPassword'
import Register from './pages/Auth/Register'
import AdminPortal from './pages/AdminPortal/Index'
import Churches from './pages/Churches/Index'
import Church from './pages/Churches/Church'
import AddChurchform from './pages/Churches/AddChurchForm'

import Streams from './pages/Streams/Index'
import AddStream from './pages/Streams/AddStream'

import { useIsAuthenticated } from './hooks/AuthHooks'
import SetPicture from './pages/Auth/SetPicture'
import ProtectedRoute from './pages/Auth/ProtectedRoute'
import Stream from './pages/Streams/Stream'
import AddMember from './pages/Members/AddMember'

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        //other query settings
        refetchOnWindowFocus: false,
      },
    },
  });


  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <div className="App">
          <Router>
            <Routes>
                <Route path='/' element={<Welcome />} />
                <Route path='/login' element={<Welcome />} />
                <Route path='/register' element={ <Register /> } />
                <Route path='/set-photo' element={ <SetPicture /> } />
                <Route path='/forgot-password' element={ <ForgotPassword /> } />

                {
                  // TODO: Add protected routes
                 
                  <Route element={<ProtectedRoute />}>
                    <Route path='/dashboard' element={<Dashboard />} />
                    <Route path='/fellowship' element={<FellowshipServiceDetails />} />
                    <Route path='/fellowship/fill-form' element={<FellowshipServiceForm />} />
                    <Route path='/directory' element={<Directory />} />
                    <Route path='/directory/members' element={<Members />} />
                    <Route path='/directory/members/add' element={<AddMember />} />
                    <Route path='/directory/members/:id' element={<Members />} />

                    <Route path='/directory/churches' element={<Churches />} />
                    <Route path='/directory/churches/add' element={<AddChurchform />} />
                    <Route path='/directory/churches/:id' element={<Church />} />
                    <Route path='/directory/churches/:church_id/streams/add' element={<AddStream />} />
                    <Route path='/directory/churches/:church_id/streams' element={<Streams />} />
                    <Route path='/directory/churches/:church_id/streams/:stream_id' element={<Stream />} />
                    
                    <Route path='/services' element={<Services />} />
                    <Route path='/arrivals' element={<Arrivals />} />                    
                    <Route path='/admin/portal' element={<AdminPortal />} />
                  </Route>
                }
                                
            </Routes>
          </Router>
          {/* <Footer label='(c) Anagkazo Lite 2023' style={{position: 'fixed', bottom: 10}}></Footer> */}
        </div>
      </UserProvider>
    </QueryClientProvider>
  )
}

export default App
