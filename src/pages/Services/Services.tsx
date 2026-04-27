import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiDroplet, FiHeart, FiUsers, FiFilter, FiUser } from 'react-icons/fi';
import PageHeader from '../../components/PageHeader/PageHeader';
import { fetchServices, Service } from '../../api/services';
import { fetchStreams, Stream } from '../../api/streams';
import './Services.css';

const Services: React.FC = () => {
    const navigate = useNavigate();
    const [services, setServices] = useState<Service[]>([]);
    const [streams, setStreams] = useState<Stream[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [servicesData, streamsData] = await Promise.all([
                    fetchServices(),
                    fetchStreams()
                ]);
                setServices(servicesData);
                setStreams(streamsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const getStreamIcon = (index: number) => {
        const icons = [<FiMenu />, <FiDroplet />, <FiHeart />, <FiUsers />];
        return icons[index % icons.length];
    };

    const getIconClass = (index: number) => {
        const classes = ['icon-primary', 'icon-amber', 'icon-rose', 'icon-emerald'];
        return classes[index % classes.length];
    };

    const categories = streams.map((stream, index) => ({
        id: stream.id,
        title: stream.name,
        schedule: stream.description || 'Service',
        icon: getStreamIcon(index),
        iconClass: getIconClass(index),
        route: stream.name.toLowerCase().includes('bacenta') ? '/dashboard/bacenta-services' : undefined
    }));


    return (
        <div className="services-page">
            <PageHeader title="Services" />

            <section className="services-section">
                <div className="section-header">
                    <h2 className="section-title">Service Categories</h2>
                    <button className="see-all-btn">See All</button>
                </div>
                <div className="categories-grid">
                    {categories.map(category => (
                        <div
                            key={category.id}
                            className={`category-card${category.route ? ' category-card--clickable' : ''}`}
                            onClick={() => category.route && navigate(category.route)}
                        >
                            <div className={`category-icon ${category.iconClass}`}>
                                {category.icon}
                            </div>
                            <div className="category-info">
                                <p className="category-title">{category.title}</p>
                                <p className="category-schedule">{category.schedule}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="services-section">
                <div className="section-header">
                    <h3 className="section-title">Recent Services</h3>
                    <button className="filter-btn">
                        <FiFilter />
                    </button>
                </div>
                <div className="recent-list">
                    {loading ? (
                        Array(3).fill(0).map((_, i) => (
                            <div className="service-card skeleton-card" key={i}>
                                <div className="service-image skeleton" />
                                <div className="service-details">
                                    <div className="service-top">
                                        <div className="skeleton-text skeleton-title" />
                                        <div className="skeleton-text skeleton-amount" />
                                    </div>
                                    <div className="skeleton-text skeleton-date" />
                                    <div className="skeleton-text skeleton-meta" />
                                </div>
                            </div>
                        ))
                    ) : (
                        services.map(service => (
                            <div key={service.id} className="service-card">
                                <div
                                    className="service-image"
                                    style={{ backgroundImage: `url("${service.service_photo}")` }}
                                />
                                <div className="service-details">
                                    <div className="service-top">
                                        <div className="service-title-container">
                                            <p className="service-name">{service.title}</p>
                                            <span className="service-type-badge">
                                                {service.service_type.service_type}
                                            </span>
                                        </div>
                                        <div className="service-amount-container">
                                            <p className="service-amount">{service.amount}</p>
                                            <p className="service-offering">Offering: {service.offering}</p>
                                        </div>
                                    </div>
                                    <p className="service-date">{service.date}</p>
                                    <div className="service-meta">
                                        <FiUser size={14} />
                                        <p className="service-attendance">Attendance: {service.attendance}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) || (
                        <p className="empty-state">No recent services found.</p>
                    )}
                </div>
            </section>

        </div>
    );
};

export default Services;
