import { Route, Routes } from 'react-router-dom';
import Index from '../pages/AdminPortal/Index';
import { default as ChurchesIndex } from '../pages/Churches/Index';
import { default as LeadersIndex } from '../pages/Leaders/Index';
import { default as MicrochurchesIndex } from '../pages/Microchurches/Index';
import AddChurchform from '../pages/Churches/AddChurchForm';
import AddMicrochurch from '../pages/Microchurches/AddMicrochurch';
import AddLeader from '../pages/Leaders/AddLeader';
import AddRole from '../pages/Leaders/AddRole';
import MicroChurch from '../pages/Microchurches/MicroChurch';


export default function AdminRoutes() {
return (
    <Routes>
        <Route path='/portal' element={<Index />} />
        <Route path='/churches' element={<ChurchesIndex />} />
        <Route path='/churches/add' element={<AddChurchform />} />
        <Route path='/leaders' element={<LeadersIndex />} />
        <Route path='/leaders/add' element={<AddLeader />} />
        <Route path='/leaders/roles/add' element={<AddRole />} />
        <Route path='/microchurches' element={<MicrochurchesIndex />} />
        <Route path='/microchurches/add' element={<AddMicrochurch />} />
        <Route path='/microchurches/:id' element={<MicroChurch />} />
        {/* Add more admin routes as needed */}
    </Routes>
        )
}
