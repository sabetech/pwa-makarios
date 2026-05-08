import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiDroplet, FiHeart, FiUsers, FiChevronRight, FiLoader } from 'react-icons/fi';
import PageHeader from '../../components/PageHeader/PageHeader';
import { fetchServiceTypes, ServiceType } from '../../api/services';
import './ServiceSelection.css';

const iconMap: Record<string, { icon: JSX.Element; iconClass: string }> = {
    'wisdom': { icon: <FiMenu />, iconClass: 'icon-primary' },
    'fresh-oil': { icon: <FiDroplet />, iconClass: 'icon-amber' },
    'jesus-experience': { icon: <FiHeart />, iconClass: 'icon-rose' },
    'bacenta': { icon: <FiUsers />, iconClass: 'icon-emerald' },
};

const ServiceSelection: React.FC = () => {
    const navigate = useNavigate();
    const [services, setServices] = useState<ServiceType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadServiceTypes = async () => {
            try {
                const data = await fetchServiceTypes();
                setServices(data);
            } catch (err) {
                setError('Failed to load service types');
                console.error('Error fetching service types:', err);
            } finally {
                setLoading(false);
            }
        };

        loadServiceTypes();
    }, []);

    const handleServiceSelect = (serviceId: string) => {
        const selectedService = services.find(s => s.id === serviceId);
        const isBacenta = selectedService?.service_type?.toLowerCase().includes('bacenta');

        if (isBacenta) {
            navigate('/dashboard/bacenta-select', {
                state: { serviceTypeId: serviceId }
            });
        } else {
            console.log('Selected service:', serviceId);
        }
    };

    if (loading) {
        return (
            <div className="service-selection-page">
                <PageHeader title="Select Service" />
                <div className="selection-container loading-container">
                    <FiLoader className="spinner" />
                    <p>Loading service types...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="service-selection-page">
                <PageHeader title="Select Service" />
                <div className="selection-container error-container">
                    <p className="error-message">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="service-selection-page">
            <PageHeader title="Select Service" />

            <div className="selection-container">
                <p className="selection-instruction">Which service are you filling the form for?</p>

                <div className="services-list">
                    {services.map(service => {
                        const iconInfo = iconMap[service.id] || { icon: <FiMenu />, iconClass: 'icon-primary' };
                        return (
                            <button
                                key={service.id}
                                className="service-selection-card"
                                onClick={() => handleServiceSelect(service.id)}
                            >
                                <div className="service-card-left">
                                    <div className={`service-icon ${iconInfo.iconClass}`}>
                                        {iconInfo.icon}
                                    </div>
                                    <div className="service-text">
                                        <h3 className="service-title">{service.service_type}</h3>
                                        {service.description && (
                                            <p className="service-description">{service.description}</p>
                                        )}
                                    </div>
                                </div>
                                <FiChevronRight className="chevron-icon" />
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ServiceSelection;
