import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiDroplet, FiHeart, FiUsers, FiFilter, FiUser } from 'react-icons/fi';
import PageHeader from '../../components/PageHeader/PageHeader';
import './Services.css';

const Services: React.FC = () => {
    const navigate = useNavigate();

    const categories = [
        {
            id: 1,
            title: 'Wisdom Encounter',
            schedule: 'Sundays • 8:00 AM',
            icon: <FiMenu />,
            iconClass: 'icon-primary'
        },
        {
            id: 2,
            title: 'Fresh Oil Service',
            schedule: 'Mid-week • 6:00 PM',
            icon: <FiDroplet />,
            iconClass: 'icon-amber'
        },
        {
            id: 3,
            title: 'Jesus Experience',
            schedule: 'Monthly • 7:00 PM',
            icon: <FiHeart />,
            iconClass: 'icon-rose'
        },
        {
            id: 4,
            title: 'Bacenta Services',
            schedule: 'Small Groups • Sat',
            icon: <FiUsers />,
            iconClass: 'icon-emerald',
            route: '/dashboard/bacenta-services'
        }
    ];

    const recentServices = [
        {
            id: 1,
            title: 'Wisdom Encounter',
            amount: '$5,240',
            date: 'Oct 24, 2023 • 08:30 AM',
            attendance: '1,240',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbsVYW3trDSy1EMdTLF8CtdMKWmTT993vPjggleQV0s1VMGySIvEM1ea7m0z3IOWMdIYqoQdCaHarjAKLmcygi5FJ51vwFWKrhl3TLfCdoFjwWIDjEUgWPnXKgm1i5SULUB5_AgNYuTEIAxWZxyIvytkqca30Uudjp96CJ1OUbrh0nxRzXBlYM07Et9K1DKY85-dp25fgTtHrOibUks-0gqrsYHDknJ4UF3M_UsCJZaGZb-sY2BKLoQm5TlVG7r73HEEe0mMTpMwZj'
        },
        {
            id: 2,
            title: 'Fresh Oil Service',
            amount: '$3,120',
            date: 'Oct 20, 2023 • 06:00 PM',
            attendance: '856',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjEkb3Z4mYHR7Pp5UyLfZ5zk--pfawrbI93SfvysQCtZaBpAxu5XRmoPhkcaoO6KeTp2t_GV7A8M5AzeB9WNb-l8dGRSOOn1TkmlzcwlV84wfdDibYNYezy-mA2f61VqSEKHmA4Axiuw2wS7_83cNrbPZ8BhcvYewCSOl2mexAm5GU--BF-hyyQdCYAKr60Ypg7RwKv1PaosxaAEorCSQFxvqEO5E4eAVYcDredvZDgabaLKDA5kt1uYxFJlrTi0ORo0dMP_HyPKO0'
        },
        {
            id: 3,
            title: 'Bacenta Service - Region A',
            amount: '$840',
            date: 'Oct 19, 2023 • 05:00 PM',
            attendance: '142',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6fdAWNcPCFe68b3H1N3lmeqZaYQ04hZQD7bUwNKHdB80aFH5usJ26bNznvyGsYugiBadXVe_vpyutpsiZ772yZw8P8QRe5TAX-2hT8xFY9UPPyJPTSdYeJPvLwzSlS2hmKb1uTuYhp03OurvV_QcZnbGHZUw3MQMokyU1RQPKTVHsybZclkkJR4C7aJhEYwecpWJSfr9Phy72haWZdUXo5wMBvK2lQY4KvsuTMsIv2UDNVIYX18_HZoi63HpcMQ8sEJjpWu5OaGN3'
        }
    ];

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
                    {recentServices.map(service => (
                        <div key={service.id} className="service-card">
                            <div
                                className="service-image"
                                style={{ backgroundImage: `url("${service.image}")` }}
                            />
                            <div className="service-details">
                                <div className="service-top">
                                    <p className="service-name">{service.title}</p>
                                    <p className="service-amount">{service.amount}</p>
                                </div>
                                <p className="service-date">{service.date}</p>
                                <div className="service-meta">
                                    <FiUser size={14} />
                                    <p className="service-attendance">Attendance: {service.attendance}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Services;
