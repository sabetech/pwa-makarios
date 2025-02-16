import { Divider, Grid, Space } from 'antd-mobile';

const Averages = () => {
    return (<>
        <Divider />
            <Space direction='vertical' style={{marginLeft: 15}}>
                <Grid columns={3} gap={8} style={{fontFamily: 'Verdana, sans-serif', fontSize: 13, display: 'flex', justifyContent: 'center'}}>
                    <Grid.Item>
                        <Space direction='vertical'>
                            <div>Avg Attendance</div>
                            <div>0</div>
                        </Space>
                    </Grid.Item>
                    <Grid.Item>
                        <Space direction='vertical'>
                            <div>Avg Weekly Income (Ghc)</div>
                            <div>0</div>
                        </Space>
                    </Grid.Item>
                    <Grid.Item>
                        <Space direction='vertical'>
                            <div>Avg Weekly Bussing </div>
                            <div>0</div>
                        </Space>
                    </Grid.Item>
                </Grid>
            </Space>
            <Divider />
    </>)
}

export default Averages