import { QueryClient, QueryClientProvider } from 'react-query'
import './App.css'
import UserProvider from './contexts/UserContext'
import Welcome from './pages/Auth/Welcome'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Home/Dashboard'
import Members from './pages/Directory/Members'
import Services from './pages/Services/Services'
import Arrivals from './pages/Arrivals/Arrivals'

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
    <UserProvider>
    <QueryClientProvider client={queryClient}>
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Welcome />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/directory' element={<Members />} />
          <Route path='/services' element={<Services />} />
          <Route path='/arrivals' element={<Arrivals />} />
        </Routes>
      </Router>
      {/* <Footer label='(c) Anagkazo Lite 2023' style={{position: 'fixed', bottom: 10}}></Footer> */}
    </div>
    
    </QueryClientProvider>
    </UserProvider>
  )
}

export default App
