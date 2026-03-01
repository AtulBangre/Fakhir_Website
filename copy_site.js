const fs = require('fs');
const path = require('path');

const srcDir = 'G:/Project/Maurya technologies/fakhri-outh-test';
const destDir = 'g:/Project/Maurya technologies/fakhari-website';

function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();

    const relPathSrc = path.relative(srcDir, src).replace(/\\/g, '/');

    // Skip unwanted folders and files
    const skipPaths = [
        /^node_modules(\/|$)/,
        /^\.git(\/|$)/,
        /^\.next(\/|$)/,
        /^app\/(admin|super-admin|client|api)(\/|$)/,
        /^app\/\(public\)\/(auth|login|signup|forgot-password|reset-password)(\/|$)/,
        /^components\/(admin|client|dashboard|invoice|super-admin)(\/|$)/,
        /^lib\/actions\/(admin\.js|auth\.js|dashboard\.js|invoice\.js|settings\.js|task\.js|team\.js|user\.js)$/,
        /^models\/(User\.js|PricingPlan\.js|Task\.js|Milestone\.js|Invoice\.js)$/, // Keep Blog, Testimonial, etc.
        /^package-lock\.json$/,
    ];

    const shouldSkip = skipPaths.some(regex => regex.test(relPathSrc)) && relPathSrc !== '';
    
    // Also skip replacing package.json completely manually if we don't want to break existing but actually we want exact copy
    // We will just copy it.

    if (shouldSkip) {
        return;
    }

    if (isDirectory) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        fs.readdirSync(src).forEach(function(childItemName) {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        // Because destination might have default nextjs files, let's copy and overwrite
        fs.copyFileSync(src, dest);
    }
}

// First, lets clear out the destination app and components folders to prevent stale files
const dirsToClear = ['app', 'components', 'lib', 'models', 'context', 'public'];
dirsToClear.forEach(dir => {
    const fullPath = path.join(destDir, dir);
    if (fs.existsSync(fullPath)) {
        fs.rmSync(fullPath, { recursive: true, force: true });
    }
});

copyRecursiveSync(srcDir, destDir);
console.log('Copy complete!');
