import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SeverityBadge.css';

const LABEL_COLOR_TOKENS: Record<string, string> = {
    active: 'var(--severity-green)',
    mild: 'var(--severity-yellow)',
    moderate: 'var(--severity-amber)',
    severe: 'var(--severity-red)',
};

interface SeverityBadgeProps {
    label: string;
    color?: string;
    consecutiveAbsences: number;
    memberId?: number;
    size?: 'small' | 'medium' | 'large';
    showCount?: boolean;
}

const SeverityBadge: React.FC<SeverityBadgeProps> = ({
    label,
    color,
    consecutiveAbsences,
    memberId,
    size = 'medium',
    showCount = false
}) => {
    const navigate = useNavigate();

    const resolvedColor = color ?? LABEL_COLOR_TOKENS[label.toLowerCase()] ?? 'var(--adm-color-slate)';
    const detail = consecutiveAbsences === 0
        ? 'Present in last service'
        : `Absent ${consecutiveAbsences} consecutive week${consecutiveAbsences > 1 ? 's' : ''}`;
    const ariaLabel = `${label} severity: ${detail}`;

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (memberId) {
            navigate(`/members/${memberId}`);
        }
    };

    return (
        <button
            type="button"
            className={`severity-badge severity-badge--${size} ${memberId ? 'severity-badge--clickable' : ''}`}
            style={{ '--badge-color': resolvedColor } as React.CSSProperties}
            onClick={handleClick}
            aria-label={ariaLabel}
            title={detail}
            disabled={!memberId}
        >
            <span className="severity-dot" aria-hidden="true" />
            <span className="severity-label">{label}</span>
            {showCount && consecutiveAbsences > 0 && (
                <span className="severity-count">
                    · Absent {consecutiveAbsences} wk{consecutiveAbsences > 1 ? 's' : ''}
                </span>
            )}
        </button>
    );
};

export default SeverityBadge;
