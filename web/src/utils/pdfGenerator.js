import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateStressReport = (scenario, result, analytics) => {
    const doc = new jsPDF();

    // --- HEADER ---
    doc.setFillColor(5, 10, 16); // Dark Background
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(0, 240, 255); // Neon Blue
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("TESO FINANCIAL ENGINE", 15, 20);

    doc.setFontSize(10);
    doc.setTextColor(200, 200, 200);
    doc.text("CERTIFICADO DE RESILIENCIA FINANCIERA", 15, 30);

    doc.setTextColor(255, 255, 255);
    doc.text(`FECHA: ${new Date().toLocaleDateString()}`, 160, 20);
    doc.text(`ID: ${Math.floor(Math.random() * 100000)}`, 160, 26);

    // --- SCENARIO SECTION ---
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text("1. ESCENARIO SIMULADO (WAR ROOM)", 15, 55);

    autoTable(doc, {
        startY: 60,
        head: [['PARAMETRO', 'VALOR CONFIGURADO', 'IMPACTO']],
        body: [
            ['Días Cartera (CxC)', `${scenario.cxcDays} Días`, 'Ciclo de Cobro'],
            ['Frecuencia Nómina (CxP)', `${scenario.cxpFreq} Días`, 'Presión de Caja'],
            ['Factor Crecimiento', `${scenario.growth}x`, 'Volumen Operativo']
        ],
        theme: 'grid',
        headStyles: { fillColor: [50, 50, 50] }
    });

    // --- RESULT SECTION ---
    const startY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text("2. RESULTADO DE ESTRÉS", 15, startY);

    const statusColor = result.status === 'INSOLVENT' ? [239, 68, 68] : [5, 150, 105];

    // Colored Status Box
    doc.setFillColor(...statusColor);
    doc.rect(15, startY + 5, 180, 25, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`ESTADO: ${result.status}`, 25, startY + 18);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`CASH RUNWAY: ${result.runway}`, 120, startY + 18);

    doc.setTextColor(0, 0, 0);

    // --- METRICS ---
    const startY2 = startY + 40;
    doc.text("3. MÉTRICAS CLAVE", 15, startY2);

    autoTable(doc, {
        startY: startY2 + 5,
        body: [
            ['Cash Flow Mínimo', new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(result.minCash)],
            ['Día de Quiebra Est.', result.insolvencyDay || 'N/A'],
            ['Margen Operativo', `${analytics.marginPercent}%`],
            ['Ingresos Proyectados', new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(analytics.totalRevenue)]
        ],
        theme: 'striped'
    });

    // --- FOOTER ---
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    const pageHeight = doc.internal.pageSize.height;
    doc.text("Este documento es generado automáticamente por la IA de Teso.", 15, pageHeight - 15);
    doc.text("La validez de este certificado depende de la integridad de los datos de entrada.", 15, pageHeight - 10);

    return doc;
};
