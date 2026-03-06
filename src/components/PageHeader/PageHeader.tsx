import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import './PageHeader.css';

interface PageHeaderProps {
    title: string;
    onBack?: () => void;
    rightAction?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, onBack, rightAction }) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    return (
        <div className="page-header">
            <button className="back-button" onClick={handleBack} aria-label="Go back">
                <FiArrowLeft size={24} />
            </button>
            <h1 className="header-title">{title}</h1>
            <div className="header-right">
                {rightAction}
            </div>
        </div>
    );
};

export default PageHeader;
