import SmoothLineChart from "../Charts/SmoothLineChart";
import {Swiper} from 'antd-mobile'

type AttendanceCardProps = {
  regionName: string;
  streamName: string;
  leaderName: string;
  leaderPicture: string;
  latestAttn: number;
  latestOffering: number;
  averageAttendance: number;
  averageOffering: number;
  images?: string[];
  previewChartData?: number[];
};

const AttendanceCard = ({
  regionName,
  streamName,
  leaderName,
  leaderPicture,
  latestAttn,
  latestOffering,
  averageAttendance,
  averageOffering,
  previewChartData,
}: AttendanceCardProps) => {
    
    return (<>
    <div style={{border: '1px solid #ccc', borderRadius: 10, padding: 20, marginTop: 20, boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}>
        <div style={{display: 'flex', alignItems: 'center', marginBottom: 20}}>
            <img src={leaderPicture} alt={leaderName} style={{width: 60, height: 60, borderRadius: '50%', marginRight: 20, objectFit: 'cover'}} />
            <div>
                <h2 style={{margin: 0}}>{leaderName}</h2>
                <p style={{margin: 0, color: '#555'}}><strong>{regionName}</strong> - {streamName} </p>
            </div>
        </div>
        
        <Swiper autoplay loop>
            <Swiper.Item key='1'>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 20}}>
                    <div style={{textAlign: 'center'}}>
                        <p style={{margin: 0, color: '#555'}}>This week's Attn</p>
                        <h3 style={{margin: 0}}>{averageAttendance}</h3>
                    </div>
                    <div style={{textAlign: 'center'}}>
                        <p style={{margin: 0, color: '#555'}}>This week's Offering</p>
                        <h3 style={{margin: 0}}>Ghc{averageAttendance}</h3>
                    </div>
                </div>
            </Swiper.Item>
            <Swiper.Item key='2'>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 20}}>
                    <div style={{textAlign: 'center'}}>
                        <p style={{margin: 0, color: '#555'}}>Avg Attn</p>
                        <h3 style={{margin: 0}}>{averageAttendance}</h3>
                    </div>
                    <div style={{textAlign: 'center'}}>
                        <p style={{margin: 0, color: '#555'}}>Avg Offering</p>
                        <h3 style={{margin: 0}}>Ghc{averageOffering}</h3>
                    </div>
                </div>
            </Swiper.Item>
        </Swiper>
        
        
        {/* <div style={{display: 'flex', overflowX: 'auto'}}>
            {images.map((imgSrc, index) => (
                <img 
                    key={index} 
                    src={imgSrc} 
                    alt={`Service ${index + 1}`} 
                    style={{width: 100, height: 100, objectFit: 'cover', borderRadius: 5, marginRight: '3px'}} 
                />
            ))}
        </div> */}
        <div>
            <SmoothLineChart lineColor="#570A22" data={previewChartData?.map((val) => ({ value: val }))}/>
        </div>
    </div>
    </>
)};



export default AttendanceCard;