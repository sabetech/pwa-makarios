import { TUser } from "../../types/user";

type DashboardSummaryProps = {
    user: TUser
}
const DashboardSummaryProps:React.FC<DashboardSummaryProps> = ({user}) => {
    // This is future of dashboard value cards to make just one request for values
    return (
        <>
            PageSummary
        </>);
}

export default DashboardSummaryProps