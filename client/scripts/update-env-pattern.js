const fs = require('fs');
const path = require('path');

// Recursively find all .ts and .tsx files
function findFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // Skip node_modules and build directories
            if (!['node_modules', 'out', 'dist', '.git'].includes(file)) {
                findFiles(filePath, fileList);
            }
        } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
            fileList.push(filePath);
        }
    });

    return fileList;
}

// Calculate relative path from file to config
function getRelativePath(fromFile, toFile) {
    const from = path.dirname(fromFile);
    let relative = path.relative(from, toFile);

    // Convert Windows backslashes to forward slashes
    relative = relative.replace(/\\/g, '/');

    // Remove .ts extension
    relative = relative.replace(/\.ts$/, '');

    // Ensure it starts with ./ or ../
    if (!relative.startsWith('.')) {
        relative = './' + relative;
    }

    return relative;
}

try {
    console.log('🔍 Scanning for files with old environment variable pattern...\n');

    const srcDir = path.join(__dirname, '..', 'src');
    const configFile = path.join(srcDir, 'config', 'env.ts');
    const allFiles = findFiles(srcDir);

    const oldPattern = /const apiBase = import\.meta\.env\.VITE_API_URL\?\.replace\('\/api\/v1', ''\) \|\| 'http:\/\/localhost:5000';/g;
    const newPattern = "const apiBase = getApiBaseUrl();";

    let filesToUpdate = [];
    let totalReplacements = 0;

    // First pass: find files that need updating
    allFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf-8');
        const matches = content.match(oldPattern);

        if (matches && matches.length > 0) {
            filesToUpdate.push({
                path: file,
                relativePath: path.relative(path.join(__dirname, '..'), file),
                count: matches.length
            });
            totalReplacements += matches.length;
        }
    });

    console.log(`Found ${filesToUpdate.length} files with ${totalReplacements} occurrences\n`);

    if (filesToUpdate.length === 0) {
        console.log('✅ No files need updating!');
        process.exit(0);
    }

    // Second pass: update files
    let updatedCount = 0;
    let importsAdded = 0;

    filesToUpdate.forEach((fileInfo, index) => {
        const { path: filePath, relativePath, count } = fileInfo;
        console.log(`${index + 1}. ${relativePath} (${count} occurrence${count > 1 ? 's' : ''})`);

        try {
            let content = fs.readFileSync(filePath, 'utf-8');
            const originalContent = content;

            // Replace all occurrences
            content = content.replace(oldPattern, newPattern);

            // Check if import already exists
            const hasImport = /import\s+{[^}]*getApiBaseUrl[^}]*}\s+from\s+['"][^'"]*config\/env['"]/.test(content);

            if (!hasImport) {
                // Calculate relative import path
                const importPath = getRelativePath(filePath, configFile);
                const importStatement = `import { getApiBaseUrl } from '${importPath}';\n`;

                // Find the last import statement
                const importMatches = [...content.matchAll(/^import\s+.+?;$/gm)];

                if (importMatches.length > 0) {
                    const lastImport = importMatches[importMatches.length - 1];
                    const insertPosition = lastImport.index + lastImport[0].length;

                    content =
                        content.slice(0, insertPosition) +
                        '\n' + importStatement +
                        content.slice(insertPosition);

                    importsAdded++;
                } else {
                    // No imports found, add at the beginning
                    content = importStatement + '\n' + content;
                    importsAdded++;
                }
            }

            // Write back if changed
            if (content !== originalContent) {
                fs.writeFileSync(filePath, content, 'utf-8');
                updatedCount++;
                console.log(`   ✅ Updated`);
            }

        } catch (error) {
            console.error(`   ❌ Error: ${error.message}`);
        }
    });

    console.log(`\n${'='.repeat(60)}`);
    console.log('📊 Update Summary:');
    console.log(`${'='.repeat(60)}`);
    console.log(`✅ Files updated: ${updatedCount}/${filesToUpdate.length}`);
    console.log(`📦 Imports added: ${importsAdded}`);
    console.log(`🔄 Total replacements: ${totalReplacements}`);
    console.log(`${'='.repeat(60)}\n`);

    console.log('⚠️  Next steps:');
    console.log('   1. Review the changes (git diff)');
    console.log('   2. Rebuild the client: npm run build');
    console.log('   3. Test the application');
    console.log('   4. Verify images load correctly from /uploads/\n');

} catch (error) {
    console.error('❌ Fatal error:', error.message);
    console.error(error.stack);
    process.exit(1);
}
