import React from 'react';
import { ArrowRight, User, Package, Bird, Tractor, ClipboardCheck } from 'lucide-react';
import './TraceabilityView.css';

/**
 * TraceabilityView — visual chain showing the full journey of an investment.
 * 
 * Props:
 *   data = {
 *     investor: { name, id },
 *     package: { name, type },
 *     livestock: { type, quantity, status },
 *     farmer: { name, id },
 *     fso: { name, id },
 *   }
 */
const TraceabilityView = ({ data = {} }) => {
    const nodes = [
        {
            icon: User,
            label: 'Investor',
            value: data.investor?.name || 'N/A',
            sub: data.investor?.id ? `ID: ${data.investor.id}` : '',
            color: '#7c3aed',
        },
        {
            icon: Package,
            label: 'Package',
            value: data.package?.name || 'N/A',
            sub: data.package?.type || '',
            color: '#2563eb',
        },
        {
            icon: Bird,
            label: 'Livestock',
            value: data.livestock?.type || 'N/A',
            sub: data.livestock?.quantity ? `${data.livestock.quantity} units · ${data.livestock.status || ''}` : '',
            color: '#0891b2',
        },
        {
            icon: Tractor,
            label: 'Farmer',
            value: data.farmer?.name || 'N/A',
            sub: data.farmer?.id ? `ID: ${data.farmer.id}` : '',
            color: '#16a34a',
        },
        {
            icon: ClipboardCheck,
            label: 'FSO',
            value: data.fso?.name || 'N/A',
            sub: data.fso?.id ? `ID: ${data.fso.id}` : '',
            color: '#d97706',
        },
    ];

    return (
        <div className="trace-container">
            {nodes.map((node, idx) => {
                const Icon = node.icon;
                return (
                    <React.Fragment key={node.label}>
                        <div className="trace-node">
                            <div className="trace-icon" style={{ background: node.color + '1a', border: `2px solid ${node.color}33` }}>
                                <Icon size={22} color={node.color} />
                            </div>
                            <div className="trace-info">
                                <span className="trace-label">{node.label}</span>
                                <span className="trace-value">{node.value}</span>
                                {node.sub && <span className="trace-sub">{node.sub}</span>}
                            </div>
                        </div>
                        {idx < nodes.length - 1 && (
                            <div className="trace-arrow">
                                <ArrowRight size={18} color="#9ca3af" />
                            </div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default TraceabilityView;
