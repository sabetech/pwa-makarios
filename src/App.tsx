import { QueryClient, QueryClientProvider } from 'react-query'
import './App.css'
import UserProvider from './contexts/UserContext'
import Welcome from './pages/Auth/Welcome'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Home/Dashboard'
import Members from './pages/Directory/Members'
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
                  useIsAuthenticated() ? 
                  <Route>
                    {/* <Route path='*' element={<Dashboard />} /> */}
                    <Route path='/dashboard' element={<Dashboard />} />
                    <Route path='/fellowship' element={<FellowshipServiceDetails />} />
                    <Route path='/fellowship/fill-form' element={<FellowshipServiceForm />} />
                    <Route path='/directory' element={<Directory />} />
                    <Route path='/directory/members' element={<Members />} />
                    <Route path='/services' element={<Services />} />
                    <Route path='/arrivals' element={<Arrivals />} />
                    
                    <Route path='/churches' element={<Churches />} />
                    <Route path='/church' element={<Church />} />
                    <Route path='/churches/add' element={<AddChurchform />} />

                    <Route path='/streams' element={<Streams />} />
                    <Route path='/streams/add' element={<AddStream />} />

                    <Route path='/admin/portal' element={<AdminPortal />} />
                  </Route>
                   : <Route path='*' element={<Welcome />} />
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
