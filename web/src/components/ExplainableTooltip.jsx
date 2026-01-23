import React from 'react';
import './ExplainableTooltip.css';

/**
 * XAI Component: Envelops a KPI to explain its logic.
 * @param {string} title - The "Question" (e.g., "Why this number?")
 * @param {string} explanation - The "Answer" (The formula or source).
 * @param {children} children - The KPI element to wrap.
 */
const ExplainableTooltip = ({ title, explanation, children }) => {
    return (
        <div className="xai-tooltip-container">
            {children}
            <div className="xai-tooltip-card">
                <div className="xai-tooltip-title">
                    <span>💡</span> {title || "Logic Explained"}
                </div>
                <div className="xai-tooltip-body">
                    {explanation}
                </div>
            </div>
        </div>
    );
};

export default ExplainableTooltip;
