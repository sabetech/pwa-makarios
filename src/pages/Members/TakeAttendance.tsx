import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Switch,
    Input,
    Toast,
    Space,
    DatePicker
} from 'antd-mobile';
import { FiSearch, FiChevronLeft, FiChevronRight, FiCheckCircle, FiCalendar } from 'react-icons/fi';
import PageHeader from '../../components/PageHeader/PageHeader';
import './TakeAttendance.css';

const TakeAttendance: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [datePickerVisible, setDatePickerVisible] = useState(false);

    // Mock data for members
    const [members, setMembers] = useState([
        { id: 1, name: 'John Doe', role: 'Youth Member', initials: 'JD', present: true, color: 'primary' },
        { id: 2, name: 'Jane Smith', role: 'Staff Leader', initials: 'JS', present: false, color: 'purple' },
        { id: 3, name: 'Mike Johnson', role: 'New Volunteer', initials: 'MJ', present: true, color: 'emerald' },
        { id: 4, name: 'Sarah Williams', role: 'Youth Member', initials: 'SW', present: false, color: 'orange' },
        { id: 5, name: 'Alex Brown', role: 'Youth Member', initials: 'AB', present: false, color: 'primary' },
    ]);

    const presentCount = members.filter(m => m.present).length;

    const toggleAttendance = (id: number) => {
        setMembers(members.map(m =>
            m.id === id ? { ...m, present: !m.present } : m
        ));
    };

    const handleSubmit = () => {
        Toast.show({
            icon: 'success',
            content: 'Attendance logged successfully',
        });
        setTimeout(() => navigate('/dashboard/members'), 1500);
    };

    const filteredMembers = members.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="attendance-page">
            <PageHeader title="Log Attendance" />

            <div className="attendance-content">
                {/* Date Selector Card */}
                <div className="calendar-card" onClick={() => setDatePickerVisible(true)}>
                    <div className="date-selector-display">
                        <div className="date-info">
                            <FiCalendar className="calendar-icon" />
                            <div className="date-text-group">
                                <span className="date-label">Attendance Date</span>
                                <span className="selected-date-text">
                                    {selectedDate.toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                        </div>
                        <div className="change-date-btn">
                            <span>Change</span>
                            <FiChevronRight />
                        </div>
                    </div>

                    <DatePicker
                        title='Select Attendance Date'
                        visible={datePickerVisible}
                        onClose={() => setDatePickerVisible(false)}
                        defaultValue={selectedDate}
                        max={new Date()}
                        onConfirm={val => {
                            setSelectedDate(val);
                        }}
                    />
                </div>

                <div className="attendance-stats">
                    <span className="tracking-text">Tracking {members.length} members</span>
                    <div className="present-badge">
                        {presentCount} PRESENT
                    </div>
                </div>

                <div className="search-bar-sticky">
                    <div className="search-container">
                        <FiSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search members by name..."
                            className="search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="attendance-list">
                    {filteredMembers.map(member => (
                        <div key={member.id} className="attendance-item">
                            <div className="member-avatar" style={{
                                backgroundColor: member.color === 'primary' ? 'var(--adm-color-primary-light)' : `var(--color-${member.color}-light)`,
                                color: member.color === 'primary' ? 'var(--adm-color-primary)' : `var(--color-${member.color})`
                            }}>
                                {member.initials}
                            </div>
                            <div className="member-info">
                                <div className="member-name">{member.name}</div>
                                <div className="member-role">{member.role}</div>
                            </div>
                            <div className="attendance-toggle">
                                <Switch
                                    checked={member.present}
                                    onChange={() => toggleAttendance(member.id)}
                                    style={{
                                        '--checked-color': 'var(--adm-color-primary)',
                                        '--height': '31px',
                                        '--width': '51px',
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                    <div className="end-of-list">END OF LIST</div>
                </div>
            </div>

            <div className="attendance-footer">
                <Button
                    block
                    color="primary"
                    size="large"
                    className="submit-attendance-btn"
                    onClick={handleSubmit}
                >
                    <FiCheckCircle style={{ marginRight: 8 }} />
                    Submit Attendance
                </Button>
            </div>
        </div>
    );
};

export default TakeAttendance;
