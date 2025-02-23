import "./Profile.css";
import { LeftOutline } from 'antd-mobile-icons'
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";

type ProfileCardProps = {
    avatar: string,
    name: string
    avg_offering: number,
    avg_attendance: number,
    avg_bussing: number,
    role: string,
    area: string

}

const ProfileCard: React.FC<ProfileCardProps> = ({avatar, name, avg_attendance, avg_bussing, avg_offering, area, role}) => {
    const navigate = useNavigate();

    return (
        <div className="card-container">
			<header>
				<img className="profile-img" src={avatar} alt={name} />
                <FaHome onClick={() => navigate('/dashboard')} style={{ position: "absolute", top: 10, right: '20', color: "white", fontSize: 25 }}/>
			</header>
            <LeftOutline onClick={() => navigate(-1)} style={{ position: "absolute", top: 10, left: 10, color: "white", fontSize: 25 }}/>
			<h1 className="bold-text">
				{name} <span className="normal-text">{role}</span>
			</h1>
			<h2 className="normal-text">{area}</h2>
			<div className="social-container">
				<div className="followers">
					<h1 className="bold-text">{avg_bussing}</h1>
					<h2 className="smaller-text">Avg Bussing</h2>
				</div>
				<div className="likes">
					<h1 className="bold-text">{avg_offering}</h1>
					<h2 className="smaller-text">Avg Offering</h2>
				</div>
				<div className="photos">
					<h1 className="bold-text">{avg_attendance}</h1>
					<h2 className="smaller-text">Avg Attendance</h2>
				</div>
			</div>
		</div>)
}


export default ProfileCard;