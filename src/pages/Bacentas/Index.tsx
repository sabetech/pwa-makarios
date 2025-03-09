import { useEffect, useState } from "react";
import MyNavBar from "../../components/NavBar";
import { List, Avatar } from "antd-mobile";
import { useGetBacentas } from "../../hooks/BacentaHooks";
import { useLocation, useNavigate } from "react-router-dom";
import { TBacenta } from "../../types/bacenta";

const Index = () => {
    const location = useLocation();
    const [bacentas, setBacentas] = useState<TBacenta[]>([]);
    const navigate = useNavigate();

    const { data: fetchedBacentas, isLoading } = (location.state?.cachedRegion && location.state.cachedRegion?.bacentas?.length > 0) ? function() {
            return {
            data: location.state.cachedRegion?.bacentas,
            isLoading: false,
        }}() 
        : useGetBacentas();
    
    useEffect(() => {
        setBacentas(fetchedBacentas || [])
    },[fetchedBacentas])

    return (<>
        <MyNavBar prevPage="/dashboard" currentPage="Bacentas" />
        <List header={`Bacentas: ${bacentas?.length}`} style={{'--header-font-size': '20px'}} mode={'card'}>
            {
                bacentas && bacentas?.map((bacenta: TBacenta) => (
                    <List.Item 
                        key={bacenta.id}
                        prefix={<Avatar src={bacenta.leader?.img_url ?? '/404'} />}
                        description={`${bacenta?.region?.name ?? location.state.cachedRegion?.name ?? "Unknown Region"} - ${bacenta?.region?.stream?.name ?? location.state.cachedRegion?.stream?.name ?? "Unknown Stream"} - ${bacenta?.leader?.name ?? "Unknown Person"}` }
                        onClick={() => {
                            navigate(`${bacenta.id}`, {
                                state: {
                                    cachedBacenta: bacenta,
                                    cachedRegion: bacenta.region ?? location.state.cachedRegion,
                                    cachedStream: bacenta.region?.stream ?? location.state.cachedRegion?.stream
                                }
                            })
                        }}
                        >
                        {bacenta.name}
                    </List.Item>
                ))
            }
        </List>
    </>)
}

export default Index;