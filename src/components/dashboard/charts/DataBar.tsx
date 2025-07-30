import { BarChart, Bar, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const DataBar = () => {

        

    return (

        <ResponsiveContainer width="90%" height="30%">
            <BarChart data={[
                {name: 'Week 1', income: 0, attn: 0, bussing: 0},
                {name: 'Week 2', income: 0, attn: 0, bussing: 0},
                {name: 'Week 3', income: 0, attn: 0, bussing: 0},
                {name: 'Week 4', income: 0, attn: 0, bussing: 0},
            ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                
                <Bar dataKey="income" fill="#F7A840" label={{ position: 'top' }}/>
                <Bar dataKey="attn" fill="#250009" label={{ position: 'top' }}/>
                <Bar dataKey="bussing" fill="#C0C0C0" label={{ position: 'top' }}/>
            </BarChart>
        </ResponsiveContainer>        
    )
}

export default DataBar