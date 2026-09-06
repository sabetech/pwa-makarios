import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Space, Divider, Button, DotLoading, DatePicker } from 'antd-mobile';
import { FiPhone, FiMail, FiMapPin, FiCalendar, FiUser, FiHeart, FiBriefcase, FiUsers, FiHome, FiMessageSquare } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import PageHeader from '../../components/PageHeader/PageHeader';
import { useMember } from '../../hooks/useMembers';
import { useMemberAttendanceHistory } from '../../hooks/useAttendance';
import SeverityBadge from '../../components/SeverityBadge/SeverityBadge';
import './MemberProfile.css';

const InfoRow = ({ icon: Icon, label, value }: { icon: any, label: string, value?: string }) => {
    if (!value) return null;
    return (
        <div className="info-row">
            <div className="info-icon">
                <Icon size={18} />
            </div>
            <div className="info-content">
                <div className="info-label">{label}</div>
                <div className="info-value">{value}</div>
            </div>
        </div>
    );
};

const MemberProfile: React.FC = () => {
    const { id = '' } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: member, isLoading, isError } = useMember(id);
    const [dateFrom, setDateFrom] = useState<string | undefined>(undefined);
    const [dateTo, setDateTo] = useState<string | undefined>(undefined);
    const [showFromPicker, setShowFromPicker] = useState(false);
    const [showToPicker, setShowToPicker] = useState(false);

    const { data: attendanceData, isLoading: loadingAttendance } = useMemberAttendanceHistory(id, {
        from: dateFrom,
        to: dateTo,
    });

    if (isLoading) {
        return (
            <div className="member-profile-page">
                <PageHeader title="Loading Profile..." />
                <div className="profile-loading" style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
                    <DotLoading color='primary' />
                </div>
            </div>
        );
    }

    if (isError || !member) {
        return (
            <div className="member-profile-page">
                <PageHeader title="Profile Error" />
                <div className="profile-content not-found" style={{ textAlign: 'center', padding: '20px' }}>
                    <p>The member protocol could not be loaded or was not found.</p>
                    <Button color="primary" onClick={() => navigate('/dashboard/members')}>
                        Back to Members
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="member-profile-page">
            <PageHeader title="Member Profile" />

            <div className="profile-content">
                <div className="profile-hero">
                    <div 
                        className="profile-avatar-container" 
                        onClick={() => navigate(`/dashboard/members/edit/${id}`)}
                        style={{ cursor: 'pointer' }}
                    >
                        <img src={member.img_url || 'https://via.placeholder.com/150?text=No+Image'} alt={member.name} className="profile-avatar" />
                        <div className="edit-badge">
                            <span className="material-symbols-outlined">edit</span>
                        </div>
                    </div>
                    <h2 className="profile-name">{member.name}</h2>
                    <p className="profile-primary-role">{(typeof member.bacenta === 'object' && member.bacenta ? member.bacenta.name : member.bacenta) || 'General'} Member</p>

                    <div className="profile-quick-actions">
                        {member.phone && (
                            <a href={`tel:${member.phone}`} className="quick-action-btn primary">
                                <FiPhone size={20} />
                            </a>
                        )}
                        {member.whatsapp && (
                            <a href={`https://wa.me/${member.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="quick-action-btn whatsapp">
                                <FaWhatsapp size={20} />
                            </a>
                        )}
                        {member?.email && (
                            <a href={`mailto:${member.email}`} className="quick-action-btn message-icon">
                                <FiMessageSquare size={20} />
                            </a>
                        )}
                    </div>
                </div>

                <div className="profile-details">
                    <Card title="Personal Information" className="profile-card">
                        <Space direction="vertical" block>
                            <InfoRow icon={FiPhone} label="Phone" value={member.phone || undefined} />
                            <InfoRow icon={FiPhone} label="WhatsApp" value={member.whatsapp || undefined} />
                            <InfoRow icon={FiMail} label="Email" value={member?.email || undefined} />
                            <Divider className="profile-divider" />
                            <InfoRow icon={FiCalendar} label="Date of Birth" value={member.dob || undefined} />
                            <InfoRow icon={FiUser} label="Gender" value={member.gender || undefined} />
                            <InfoRow icon={FiHeart} label="Marital Status" value={member.marital_status || undefined} />
                            <InfoRow icon={FiBriefcase} label="Occupation" value={member.occupation || undefined} />
                        </Space>
                    </Card>

                    <Card title="Affiliation & Location" className="profile-card">
                        <Space direction="vertical" block>
                            <InfoRow icon={FiMapPin} label="Address" value={member.address || undefined} />
                            <InfoRow icon={FiMapPin} label="GPS Location" value={member.gps_location || undefined} />
                            <Divider className="profile-divider" />
                            <InfoRow icon={FiHome} label="Bacenta" value={typeof member.bacenta === 'object' && member.bacenta ? member.bacenta.name : (member.bacenta || undefined)} />
                            <InfoRow icon={FiUsers} label="Basonta" value={typeof member.basonta === 'object' && member.basonta ? member.basonta.name : (member.basonta || undefined)} />
                        </Space>
                    </Card>

                    {/* Attendance Section */}
                    {attendanceData && (
                        <Card title="Attendance History" className="profile-card">
                            <div className="attendance-severity-section">
                                {attendanceData.member.severity && (
                                    <div className="attendance-severity-display">
                                        <SeverityBadge
                                            label={attendanceData.member.severity.label}
                                            color={attendanceData.member.severity.color}
                                            consecutiveAbsences={attendanceData.member.consecutive_absences}
                                            size="large"
                                        />
                                        <span className="absence-count">
                                            {attendanceData.member.consecutive_absences} consecutive absence{attendanceData.member.consecutive_absences !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="attendance-date-filters">
                                <div className="date-filter" onClick={() => setShowFromPicker(true)}>
                                    <FiCalendar size={14} />
                                    <span>{dateFrom || 'From'}</span>
                                </div>
                                <span className="date-separator">-</span>
                                <div className="date-filter" onClick={() => setShowToPicker(true)}>
                                    <FiCalendar size={14} />
                                    <span>{dateTo || 'To'}</span>
                                </div>
                            </div>

                            <DatePicker
                                visible={showFromPicker}
                                onClose={() => setShowFromPicker(false)}
                                onConfirm={(val) => setDateFrom(val.toISOString().split('T')[0])}
                            />
                            <DatePicker
                                visible={showToPicker}
                                onClose={() => setShowToPicker(false)}
                                onConfirm={(val) => setDateTo(val.toISOString().split('T')[0])}
                            />

                            {loadingAttendance ? (
                                <div className="attendance-loading">
                                    <DotLoading color='primary' />
                                </div>
                            ) : (
                                <div className="attendance-history-list">
                                    {attendanceData.history.length === 0 ? (
                                        <p className="no-attendance">No attendance records found</p>
                                    ) : (
                                        attendanceData.history.map((record) => (
                                            <div key={record.id} className="attendance-record">
                                                <div className="record-date">
                                                    {record.service?.date ? new Date(record.service.date).toLocaleDateString('en-US', {
                                                        weekday: 'short',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    }) : 'N/A'}
                                                </div>
                                                <div className={`record-status ${record.status}`}>
                                                    {record.status === 'present' ? 'Present' : 'Absent'}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </Card>
                    )}
                </div>

                <div className="profile-actions">
                    <Button 
                        block 
                        color="primary" 
                        fill="outline" 
                        className="edit-profile-btn" 
                        onClick={() => navigate(`/dashboard/members/edit/${id}`)}
                    >
                        Edit Profile
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default MemberProfile;
