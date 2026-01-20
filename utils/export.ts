import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getJournalEntries, getMoodCheckins, getUserProfile, getAppSettings } from './storage';

export const exportToJSON = () => {
    const data = {
        profile: getUserProfile(),
        settings: getAppSettings(),
        journalEntries: getJournalEntries(),
        moodCheckins: getMoodCheckins(),
        exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reflect-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export const exportToPDF = () => {
    const doc = new jsPDF();
    const profile = getUserProfile();
    const entries = getJournalEntries();
    const moodCheckins = getMoodCheckins();

    // --- Header ---
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text('Re-Flect Journal Export', 14, 20);

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated for: ${profile.name}`, 14, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 36);

    let finalY = 45;

    // --- Mood Check-in Summary ---
    if (moodCheckins.length > 0) {
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('Recent Mood History', 14, finalY);
        finalY += 6;

        const moodData = moodCheckins.map(m => [
            new Date(m.date).toLocaleDateString() + ' ' + new Date(m.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            m.mood,
            m.note || '-'
        ]);

        autoTable(doc, {
            startY: finalY,
            head: [['Date', 'Mood', 'Note']],
            body: moodData,
            theme: 'grid',
            headStyles: { fillColor: [66, 133, 244] }, // Primary-ish blue
            styles: { fontSize: 10 },
        });

        // @ts-ignore
        finalY = doc.lastAutoTable.finalY + 15;
    }

    // --- Journal Entries ---
    if (entries.length > 0) {
        // If getting too close to bottom, add page
        if (finalY > 250) {
            doc.addPage();
            finalY = 20;
        }

        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('Journal Entries', 14, finalY);
        finalY += 10;

        entries.forEach((entry) => {
            // Check for page break
            if (finalY > 260) {
                doc.addPage();
                finalY = 20;
            }

            // Entry Date
            doc.setFontSize(10);
            doc.setTextColor(150, 150, 150);
            doc.text(new Date(entry.date).toLocaleString(), 14, finalY);
            finalY += 6;

            // Entry Title
            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0);
            const title = entry.title || 'Untitled Entry';
            doc.text(title, 14, finalY);
            finalY += 8;

            // Entry Content (Strip HTML for now as jsPDF handles text better)
            doc.setFontSize(11);
            doc.setTextColor(50, 50, 50);

            // Simple HTML stripper
            const div = document.createElement("div");
            div.innerHTML = entry.content;
            const textContent = div.textContent || div.innerText || "";

            const splitText = doc.splitTextToSize(textContent, 180);
            doc.text(splitText, 14, finalY);

            finalY += (splitText.length * 5) + 15;
        });
    }

    doc.save(`reflect-journal-${new Date().toISOString().split('T')[0]}.pdf`);
};
