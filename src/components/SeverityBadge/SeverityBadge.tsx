import React from 'react';
import './SeverityBadge.css';

interface SeverityBadgeProps {
    label: string;
    color: string;
    consecutiveAbsences: number;
    size?: 'small' | 'medium' | 'large';
    showTooltip?: boolean;
}

const SeverityBadge: React.FC<SeverityBadgeProps> = ({
    label,
    color,
    consecutiveAbsences,
    size = 'medium',
    showTooltip = true
}) => {
    const getTooltipText = () => {
        if (consecutiveAbsences === 0) return 'Active - Present in last service';
        return `Absent ${consecutiveAbsences} consecutive week${consecutiveAbsences > 1 ? 's' : ''}`;
    };

    return (
        <div className={`severity-badge severity-badge--${size}`} style={{ '--badge-color': color } as React.CSSProperties}>
            <span className="severity-dot" />
            <span className="severity-label">{label}</span>
            {showTooltip && (
                <span className="severity-tooltip">{getTooltipText()}</span>
            )}
        </div>
    );
};

export default SeverityBadge;
