import { Route, Routes } from 'react-router-dom';
import Index from '../pages/AdminPortal/Index';
import { default as ChurchesIndex } from '../pages/Churches/Index';
import { default as LeadersIndex } from '../pages/Leaders/Index';
import AddChurchform from '../pages/Churches/AddChurchForm';
import AddLeader from '../pages/Leaders/AddLeader';

export default function AdminRoutes() {
return (
    <Routes>
        <Route path='/portal' element={<Index />} />
        <Route path='/churches' element={<ChurchesIndex />} />
        <Route path='/churches/add' element={<AddChurchform />} />
        <Route path='/leaders' element={<LeadersIndex />} />
        <Route path='/leaders/add' element={<AddLeader />} />
    </Routes>
        )
}
