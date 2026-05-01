const fs = require('fs');
const path = require('path');

// Look for any .tsv file in the current directory
const files = fs.readdirSync(__dirname);
const tsvFile = files.find(file => file.endsWith('.tsv'));

if (!tsvFile) {
    console.error("❌ No TSV database file found in this folder!");
    process.exit(1);
}

console.log(`⏳ Converting ${tsvFile} to static kiosk database...`);

try {
    const fileContent = fs.readFileSync(path.join(__dirname, tsvFile), 'utf-8');
    const lines = fileContent.split(/\r?\n/).filter(line => line.trim() !== '');
    
    if (lines.length > 0) {
        const headers = lines[0].split('\t').map(h => h.trim());
        const allRecords = [];
        
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split('\t');
            const record = {};
            for (let j = 0; j < headers.length; j++) {
                record[headers[j]] = values[j] ? values[j].trim() : '';
            }
            allRecords.push(record);
        }
        
        // Write out to a JavaScript file that the browser can load directly
        const jsOutput = `const libraryData = ${JSON.stringify(allRecords, null, 2)};\n`;
        fs.writeFileSync(path.join(__dirname, 'public', 'data.js'), jsOutput, 'utf-8');
        
        console.log(`✅ Successfully baked ${allRecords.length} records into public/data.js!`);
        console.log(`🚀 The Kiosk is updated and ready to run locally.`);
    } else {
        console.error("❌ The TSV file is empty.");
    }
} catch (error) {
    console.error("❌ Error reading file:", error.message);
}
