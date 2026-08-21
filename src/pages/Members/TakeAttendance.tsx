import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Switch,
    Toast,
    DotLoading,
    Picker,
} from 'antd-mobile';
import { FiSearch, FiCheckCircle, FiCalendar, FiChevronDown } from 'react-icons/fi';
import PageHeader from '../../components/PageHeader/PageHeader';
import { useMembers } from '../../hooks/useMembers';
import { fetchServices, Service } from '../../api/services';
import { markAttendance, fetchServiceAttendance } from '../../api/attendance';
import './TakeAttendance.css';

const TakeAttendance: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const { data: members = [], isLoading: loadingMembers } = useMembers();
    const [services, setServices] = useState<Service[]>([]);
    const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
    const [pickerVisible, setPickerVisible] = useState(false);
    const [attendanceStatus, setAttendanceStatus] = useState<Map<number, boolean>>(new Map());
    const [submitting, setSubmitting] = useState(false);
    const [loadingService, setLoadingService] = useState(false);

    // Refs so background refetches never wipe unsaved edits
    const membersRef = useRef(members);
    membersRef.current = members;
    const dirtyRef = useRef(false);

    useEffect(() => {
        const loadServices = async () => {
            try {
                const data = await fetchServices();
                setServices(data);
                if (data.length > 0) {
                    setSelectedServiceId(data[0].id);
                }
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };
        loadServices();
    }, []);

    useEffect(() => {
        if (!selectedServiceId) return;

        dirtyRef.current = false;
        let cancelled = false;

        const loadExisting = async () => {
            try {
                setLoadingService(true);
                const existing = await fetchServiceAttendance(selectedServiceId);
                if (cancelled || dirtyRef.current) return;
                const statusMap = new Map<number, boolean>();
                membersRef.current.forEach(m => statusMap.set(m.id, false));
                existing.forEach(record => {
                    statusMap.set(record.member_id, record.status === 'present');
                });
                setAttendanceStatus(statusMap);
            } catch (error) {
                console.error('Error fetching service attendance:', error);
            } finally {
                if (!cancelled) setLoadingService(false);
            }
        };
        loadExisting();

        return () => { cancelled = true; };
    }, [selectedServiceId]);

    const toggleAttendance = (id: number) => {
        dirtyRef.current = true;
        setAttendanceStatus(prev => {
            const next = new Map(prev);
            next.set(id, !next.get(id));
            return next;
        });
    };

    const selectedService = services.find(s => s.id === selectedServiceId);

    const presentCount = useMemo(
        () => Array.from(attendanceStatus.values()).filter(Boolean).length,
        [attendanceStatus]
    );

    const handleSubmit = async () => {
        if (!selectedServiceId) {
            Toast.show({ icon: 'fail', content: 'Please select a service' });
            return;
        }

        try {
            setSubmitting(true);
            const attendances = members.map(m => ({
                member_id: m.id,
                status: (attendanceStatus.get(m.id) ? 'present' : 'absent') as 'present' | 'absent',
            }));
            await markAttendance(selectedServiceId, attendances);
            dirtyRef.current = false;
            Toast.show({
                icon: 'success',
                content: 'Attendance logged successfully',
            });
            setTimeout(() => navigate('/dashboard/members'), 1500);
        } catch (error) {
            console.error('Error submitting attendance:', error);
            Toast.show({ icon: 'fail', content: 'Failed to log attendance. Please try again.' });
        } finally {
            setSubmitting(false);
        }
    };

    const filteredMembers = members.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const pickerColumns = [
        services.map(s => ({
            label: `${s.service_type?.service_type || 'Service'} - ${new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
            value: s.id,
        })),
    ];

    return (
        <div className="attendance-page">
            <PageHeader title="Log Attendance" />

            <div className="attendance-content">
                {/* Service Selector Card */}
                <div className="calendar-card" onClick={() => setPickerVisible(true)}>
                    <div className="date-selector-display">
                        <div className="date-info">
                            <FiCalendar className="calendar-icon" />
                            <div className="date-text-group">
                                <span className="date-label">Select Service</span>
                                <span className="selected-date-text">
                                    {selectedService
                                        ? `${selectedService.service_type?.service_type || 'Service'} - ${new Date(selectedService.date).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}`
                                        : loadingMembers ? 'Loading...' : 'No services found'}
                                </span>
                            </div>
                        </div>
                        <div className="change-date-btn">
                            <span>Change</span>
                            <FiChevronDown />
                        </div>
                    </div>

                    <Picker
                        columns={pickerColumns}
                        visible={pickerVisible}
                        onClose={() => setPickerVisible(false)}
                        value={[selectedServiceId]}
                        onConfirm={(val) => {
                            if (val[0] !== null) setSelectedServiceId(val[0] as number);
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
                    {loadingMembers ? (
                        <div className="end-of-list"><DotLoading color="primary" /> Loading members...</div>
                    ) : filteredMembers.length === 0 ? (
                        <div className="end-of-list">No members found</div>
                    ) : (
                        filteredMembers.map(member => (
                            <div key={member.id} className="attendance-item">
                                <div className="member-avatar">
                                    {member.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                                </div>
                                <div className="member-info">
                                    <div className="member-name">{member.name}</div>
                                    <div className="member-role">{member.phone || 'Member'}</div>
                                </div>
                                <div className="attendance-toggle">
                                    <Switch
                                        checked={!!attendanceStatus.get(member.id)}
                                        onChange={() => toggleAttendance(member.id)}
                                        style={{
                                            '--checked-color': 'var(--adm-color-primary)',
                                            '--height': '31px',
                                            '--width': '51px',
                                        }}
                                    />
                                </div>
                            </div>
                        ))
                    )}
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
                    disabled={submitting || !selectedServiceId || members.length === 0}
                >
                    {submitting ? (
                        <>Submitting... <DotLoading color="white" /></>
                    ) : (
                        <>
                            <FiCheckCircle style={{ marginRight: 8 }} />
                            Submit Attendance
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
};

export default TakeAttendance;
