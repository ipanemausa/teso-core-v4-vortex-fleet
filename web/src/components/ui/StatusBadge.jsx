import React from 'react';

/**
 * TESO Standard Status Badge (Pill)
 * @param {Object} props
 * @param {'active' | 'warning' | 'critical' | 'neutral' | 'info'} [props.status='neutral'] - Semantic status
 * @param {string} props.children - Label content
 */
const StatusBadge = ({ status = 'neutral', children, style = {} }) => {

    // Map Status to Tokens
    const statusMap = {
        active: {
            color: 'var(--color-kpi-positive)',
            borderColor: 'var(--color-kpi-positive)',
            bg: 'rgba(57, 255, 20, 0.1)'
        },
        success: { // Alias for active
            color: 'var(--color-kpi-positive)',
            borderColor: 'var(--color-kpi-positive)',
            bg: 'rgba(57, 255, 20, 0.1)'
        },
        warning: {
            color: 'var(--color-kpi-warning)',
            borderColor: 'var(--color-kpi-warning)',
            bg: 'rgba(255, 87, 34, 0.1)'
        },
        critical: {
            color: 'var(--color-kpi-danger)',
            borderColor: 'var(--color-kpi-danger)',
            bg: 'rgba(239, 68, 68, 0.15)'
        },
        neutral: {
            color: 'var(--color-text-secondary)',
            borderColor: 'var(--color-border-subtle)',
            bg: 'rgba(255, 255, 255, 0.05)'
        },
        info: {
            color: 'var(--color-primary)',
            borderColor: 'var(--color-primary)',
            bg: 'rgba(0, 240, 255, 0.1)'
        }
    };

    const theme = statusMap[status] || statusMap.neutral;

    const badgeStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: 'var(--radius-lg)',
        border: `1px solid ${theme.borderColor}`,
        backgroundColor: theme.bg,
        color: theme.color,
        fontSize: 'var(--text-xs)',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        ...style
    };

    return (
        <span style={badgeStyle}>
            {children}
        </span>
    );
};

export default StatusBadge;
