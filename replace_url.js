const fs = require('fs');
const path = require('path');

function replaceInPath(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === '.git' || file === '.next') continue;
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInPath(fullPath);
        } else {
            if (!fullPath.match(/\.(js|jsx|ts|tsx|css|xml|txt|md|mjs)$/)) continue;
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;
            // Replace https://www.fakhriitservices.com with https://www.fakhriitservices.com
            // making sure we don't replace https://www.fakhriitservices.com twice.
            content = content.replace(/https:\/\/fakhriitservices\.com/g, 'https://www.fakhriitservices.com');
            // Fix double www
            content = content.replace(/https:\/\/www\.www\.fakhriitservices\.com/g, 'https://www.fakhriitservices.com');

            if (content !== original) {
                fs.writeFileSync(fullPath, content);
                console.log('Fixed:', fullPath);
            }
        }
    }
}
replaceInPath('g:/Project/Maurya technologies/fakhari-website');
