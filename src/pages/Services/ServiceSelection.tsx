import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiDroplet, FiHeart, FiUsers, FiChevronRight } from 'react-icons/fi';
import PageHeader from '../../components/PageHeader/PageHeader';
import './ServiceSelection.css';

const ServiceSelection: React.FC = () => {
    const navigate = useNavigate();

    const services = [
        {
            id: 'wisdom',
            title: 'Wisdom Encounter Service',
            icon: <FiMenu />,
            iconClass: 'icon-primary',
            description: 'Sunday Morning Service'
        },
        {
            id: 'fresh-oil',
            title: 'Fresh Oil Service',
            icon: <FiDroplet />,
            iconClass: 'icon-amber',
            description: 'Mid-week Service'
        },
        {
            id: 'jesus-experience',
            title: 'Jesus Experience Service',
            icon: <FiHeart />,
            iconClass: 'icon-rose',
            description: 'Monthly Service'
        },
        {
            id: 'bacenta',
            title: 'Bacenta Service',
            icon: <FiUsers />,
            iconClass: 'icon-emerald',
            description: 'Small Group Service'
        }
    ];

    const handleServiceSelect = (serviceId: string) => {
        if (serviceId === 'bacenta') {
            navigate('/dashboard/bacenta-service');
        } else {
            console.log('Selected service:', serviceId);
        }
    };

    return (
        <div className="service-selection-page">
            <PageHeader title="Select Service" />

            <div className="selection-container">
                <p className="selection-instruction">Which service are you filling the form for?</p>

                <div className="services-list">
                    {services.map(service => (
                        <button
                            key={service.id}
                            className="service-selection-card"
                            onClick={() => handleServiceSelect(service.id)}
                        >
                            <div className="service-card-left">
                                <div className={`service-icon ${service.iconClass}`}>
                                    {service.icon}
                                </div>
                                <div className="service-text">
                                    <h3 className="service-title">{service.title}</h3>
                                    <p className="service-description">{service.description}</p>
                                </div>
                            </div>
                            <FiChevronRight className="chevron-icon" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ServiceSelection;
