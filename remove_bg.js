const Jimp = require('jimp');

async function removeWhite(filename, outputName) {
    console.log("Processing", filename);
    const img = await Jimp.read(filename);
    
    img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
        const r = this.bitmap.data[idx];
        const g = this.bitmap.data[idx + 1];
        const b = this.bitmap.data[idx + 2];
        
        // Remove white or near-white pixels
        if (r > 230 && g > 230 && b > 230) {
            this.bitmap.data[idx + 3] = 0;
        }
    });
    
    await img.writeAsync(outputName);
    console.log("Saved", outputName);
}

async function run() {
    try {
        await removeWhite('dhe logo.png', 'dhe_logo_transparent.png');
        await removeWhite('logo without bgcolor.jpg', 'logo_transparent.png');
    } catch(e) {
        console.error("Error", e);
    }
}

run();
