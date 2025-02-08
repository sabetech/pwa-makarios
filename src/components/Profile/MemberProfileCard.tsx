import { TMember } from "../../types/member"
import { LeftOutline } from 'antd-mobile-icons'
import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


type MemberProfileCardProps = {
    member: TMember
}

const MemberProfileCard: React.FC<MemberProfileCardProps> = ({ member }) => {
    const navigate = useNavigate();

    return (
        <div className="card-container">
			<header>
				<img className="profile-img" src={member.img_url} alt={member.name} />
			</header>
            <LeftOutline onClick={() => navigate(-1)} style={{ position: "absolute", top: 10, left: 10, color: "white", fontSize: 25 }}/>
            <FaHome onClick={() => navigate('/dashboard')} style={{ position: "absolute", top: 10, right: '20', color: "white", fontSize: 25 }}/>
            <h1 className="bold-text" style={{paddingBottom: 0}}>
                {member.name}
            </h1>
            <h2 className="normal-text">{`${member?.address === 'undefined' ? "": member?.address}, ${member?.phone === 'undefined' ? '' : member?.phone}`}</h2>
        </div>

    )
}

export default MemberProfileCard