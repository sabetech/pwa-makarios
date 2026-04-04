import React from 'react';
import PageHeader from '../../components/PageHeader/PageHeader';
import './Insights.css';

const Insights: React.FC = () => {
    return (
        <div className="insights-page">
            <PageHeader title="Insights" />
            <div className="insights-content" style={{ padding: '20px', textAlign: 'center' }}>
                <h2>Insights coming soon</h2>
                <p>Track your church growth and performance here.</p>
            </div>
        </div>
    );
};

export default Insights;
