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
import BussingDetails from './pages/Detail/BussingDetail'
import FellowshipServiceDetails from './pages/Detail/FellowshipServiceDetail'
import FellowshipServiceForm from './pages/Forms/FellowshipService'
import ForgotPassword from './pages/Auth/ForgotPassword'
import Register from './pages/Auth/Register'
import { AuthProvider } from "react-auth-kit";

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
    <AuthProvider
      authType={"cookie"} // or "localstorage" based on where you want to store the token
      authName={"_auth"} // Your custom name for the auth token
      cookieDomain={window.location.hostname} // Specify cookie domain
      cookieSecure={false} // True if you're using HTTPS
    >
      <UserProvider>
        <QueryClientProvider client={queryClient}>
        <div className="App">
          <Router>
            <Routes>
                <Route path='/' element={<Welcome />} />
                <Route path='/login' element={<Welcome />} />
                <Route path='/register' element={ <Register /> } />
                <Route path='/forgot-password' element={ <ForgotPassword /> } />

                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/bussing' element={<BussingDetails />} />
                <Route path='/fellowship' element={<FellowshipServiceDetails />} />
                <Route path='/fellowship/fill-form' element={<FellowshipServiceForm />} />
                <Route path='/directory' element={<Directory />} />
                <Route path='/directory/members' element={<Members />} />
                <Route path='/services' element={<Services />} />
                <Route path='/arrivals' element={<Arrivals />} />

                
            
            </Routes>
          </Router>
          {/* <Footer label='(c) Anagkazo Lite 2023' style={{position: 'fixed', bottom: 10}}></Footer> */}
        </div>
        
        </QueryClientProvider>
      </UserProvider>
    </AuthProvider>
  )
}

export default App
