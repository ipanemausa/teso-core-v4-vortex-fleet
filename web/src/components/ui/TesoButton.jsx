import React from 'react';

/**
 * TESO Standard Button Component
 * @param {Object} props
 * @param {'primary' | 'danger' | 'ghost' | 'glass'} [props.variant='primary'] - Visual style
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Button size
 * @param {React.ReactNode} props.icon - Optional icon element
 * @param {string} [props.className] - Additional classes
 * @param {Function} props.onClick - Click handler
 * @param {React.ReactNode} props.children - Button content
 */
const TesoButton = ({
    variant = 'primary',
    size = 'md',
    icon,
    className = '',
    children,
    style = {},
    ...props
}) => {

    // Base Styles (Tokens)
    const baseStyle = {
        fontFamily: 'var(--font-main)',
        fontWeight: 'bold',
        cursor: 'pointer',
        border: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--spacing-sm)',
        transition: 'all 0.2s ease',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        ...style
    };

    // Variant Styles
    const variants = {
        primary: {
            background: 'var(--color-primary)',
            color: '#000',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-glow-blue)'
        },
        danger: {
            background: 'transparent',
            border: '1px solid var(--color-kpi-danger)',
            color: 'var(--color-kpi-danger)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'none'
        },
        dangerSolid: { // Special case for critical actions
            background: 'var(--color-kpi-danger)',
            color: '#fff',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-glow-red)'
        },
        glass: {
            background: 'rgba(15, 23, 42, 0.6)', // Darker backing for visibility
            border: '1px solid var(--color-border-subtle)',
            color: '#ffffff', // Force White
            borderRadius: 'var(--radius-md)',
            backdropFilter: 'blur(4px)',
            textShadow: '0 2px 4px #000000' // Ensure legibility
        },
        ghost: {
            background: 'transparent',
            color: 'var(--color-text-secondary)',
            border: 'none',
            padding: 0
        },
        active: { // Special state
            background: 'var(--color-kpi-positive)',
            color: '#000',
            borderRadius: 'var(--radius-sm)'
        }
    };

    // Size Styles
    const sizes = {
        sm: {
            padding: '4px 10px',
            fontSize: 'var(--text-xs)',
            borderRadius: variant === 'danger' ? 'var(--radius-lg)' : 'var(--radius-sm)'
        },
        md: {
            padding: '8px 16px',
            fontSize: 'var(--text-sm)'
        },
        lg: {
            padding: '12px 24px',
            fontSize: 'var(--text-md)'
        }
    };

    const computedStyle = {
        ...baseStyle,
        ...variants[variant],
        ...sizes[size],
        ...style // Allow override for positioning
    };

    return (
        <button
            style={computedStyle}
            className={`teso-btn teso-btn-${variant} ${className}`}
            {...props}
        >
            {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
            {children}
        </button>
    );
};

export default TesoButton;
