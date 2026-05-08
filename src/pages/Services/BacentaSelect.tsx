import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiUsers, FiChevronRight, FiLoader, FiMapPin, FiUser } from 'react-icons/fi';
import PageHeader from '../../components/PageHeader/PageHeader';
import { fetchBacentas, Bacenta } from '../../api/bacentas';
import './BacentaSelect.css';

const BacentaSelect: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { serviceTypeId } = (location.state as { serviceTypeId: string }) || {};
    const [bacentas, setBacentas] = useState<Bacenta[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadBacentas = async () => {
            try {
                const data = await fetchBacentas();
                setBacentas(data);
            } catch (err) {
                setError('Failed to load bacentas');
                console.error('Error fetching bacentas:', err);
            } finally {
                setLoading(false);
            }
        };

        loadBacentas();
    }, []);

    const handleBacentaSelect = (bacenta: Bacenta) => {
        navigate('/dashboard/bacenta-service', {
            state: {
                bacentaId: bacenta.id,
                bacentaName: bacenta.name,
                serviceTypeId
            }
        });
    };

    if (loading) {
        return (
            <div className="bacenta-select-page">
                <PageHeader title="Select Bacenta" />
                <div className="bacenta-select-container loading-container">
                    <FiLoader className="spinner" />
                    <p>Loading bacentas...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bacenta-select-page">
                <PageHeader title="Select Bacenta" />
                <div className="bacenta-select-container error-container">
                    <p className="error-message">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bacenta-select-page">
            <PageHeader title="Select Bacenta" />

            <div className="bacenta-select-container">
                <p className="bacenta-select-instruction">Which bacenta are you filling the form for?</p>

                {bacentas.length === 0 ? (
                    <div className="bacenta-select-container empty-container">
                        <p className="empty-message">No bacentas found.</p>
                    </div>
                ) : (
                    <div className="bacentas-list">
                        {bacentas.map(bacenta => (
                            <button
                                key={bacenta.id}
                                className="bacenta-select-card"
                                onClick={() => handleBacentaSelect(bacenta)}
                            >
                                <div className="bacenta-select-card-left">
                                    <div className="bacenta-select-icon icon-emerald">
                                        <FiUsers />
                                    </div>
                                    <div className="bacenta-select-text">
                                        <h3 className="bacenta-select-name">{bacenta.name}</h3>
                                        <div className="bacenta-select-meta">
                                            {bacenta.region && (
                                                <span className="bacenta-select-meta-item">
                                                    <FiMapPin size={12} />
                                                    {bacenta.region.name}
                                                </span>
                                            )}
                                            {bacenta.leader && (
                                                <span className="bacenta-select-meta-item">
                                                    <FiUser size={12} />
                                                    {bacenta.leader.name}
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

export default BacentaSelect;
