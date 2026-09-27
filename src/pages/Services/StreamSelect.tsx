import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiLayers, FiChevronRight, FiLoader, FiClock, FiUser } from 'react-icons/fi';
import PageHeader from '../../components/PageHeader/PageHeader';
import { fetchStreams, Stream } from '../../api/streams';
import './StreamSelect.css';

const StreamSelect: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { serviceTypeId } = (location.state as { serviceTypeId: string }) || {};
    const [streams, setStreams] = useState<Stream[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadStreams = async () => {
            try {
                const data = await fetchStreams();
                setStreams(data);
            } catch (err) {
                setError('Failed to load streams');
                console.error('Error fetching streams:', err);
            } finally {
                setLoading(false);
            }
        };

        loadStreams();
    }, []);

    const handleStreamSelect = (stream: Stream) => {
        navigate('/dashboard/stream-service', {
            state: {
                streamId: stream.id,
                streamName: stream.name,
                serviceTypeId
            }
        });
    };

    if (loading) {
        return (
            <div className="stream-select-page">
                <PageHeader title="Select Stream" />
                <div className="stream-select-container loading-container">
                    <FiLoader className="spinner" />
                    <p>Loading streams...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="stream-select-page">
                <PageHeader title="Select Stream" />
                <div className="stream-select-container error-container">
                    <p className="error-message">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="stream-select-page">
            <PageHeader title="Select Stream" />

            <div className="stream-select-container">
                <p className="stream-select-instruction">Which stream are you filling the form for?</p>

                {streams.length === 0 ? (
                    <div className="stream-select-container empty-container">
                        <p className="empty-message">No streams found.</p>
                    </div>
                ) : (
                    <div className="streams-list">
                        {streams.map(stream => (
                            <button
                                key={stream.id}
                                className="stream-select-card"
                                onClick={() => handleStreamSelect(stream)}
                            >
                                <div className="stream-select-card-left">
                                    <div className="stream-select-icon icon-primary">
                                        <FiLayers />
                                    </div>
                                    <div className="stream-select-text">
                                        <h3 className="stream-select-name">{stream.name}</h3>
                                        <div className="stream-select-meta">
                                            {stream.meeting_time && (
                                                <span className="stream-select-meta-item">
                                                    <FiClock size={12} />
                                                    {stream.meeting_time}
                                                </span>
                                            )}
                                            {stream.overseer && (
                                                <span className="stream-select-meta-item">
                                                    <FiUser size={12} />
                                                    {stream.overseer.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <FiChevronRight className="chevron-icon" />
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StreamSelect;
