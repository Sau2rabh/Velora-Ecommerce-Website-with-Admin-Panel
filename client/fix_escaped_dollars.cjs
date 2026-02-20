const fs = require('fs');
const path = require('path');

function fixDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            fixDirectory(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;
            
            // The file currently has: `\${import.meta.env.VITE_API_URL}
            // We want it to be: `${import.meta.env.VITE_API_URL}
            content = content.replace(/`\\\$\{import\.meta\.env\.VITE_API_URL\}/g, '`${import.meta.env.VITE_API_URL}');
            
            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Fixed: ${fullPath}`);
            }
        }
    }
}
fixDirectory(path.join(__dirname, 'src'));
