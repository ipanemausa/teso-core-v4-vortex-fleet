const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'ipane', 'Downloads', 'app', 'teso_core', 'web', 'src', 'components', 'OperationalDashboard.jsx');

try {
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split('\n');

    let cutIndex = -1;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(') : (')) {
            cutIndex = i;
            break;
        }
    }

    if (cutIndex === -1) {
        console.error('Could not find cut point ") : ("');
        process.exit(1);
    }

    const cleanLines = lines.slice(0, cutIndex);
    const newContent = cleanLines.join('\n') + '\n' +
        `                    ) : (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#64748b', gap: '20px' }}>
                             <div style={{ fontSize: '3rem' }}>🚧</div>
                             <h2 style={{ fontFamily: 'monospace', color: '#94a3b8' }}>ANALYTICS MODULE UPDATING</h2>
                             <div style={{ color: '#475569' }}>Please use the "Live Ops" Map View</div>
                        </div>
                    )
                }
            </div>
        )
};

export default OperationalDashboard;`;

    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Successfully repaired OperationalDashboard.jsx');

} catch (err) {
    console.error('Error:', err);
    process.exit(1);
}
