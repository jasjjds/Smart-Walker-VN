const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'src');

// Walk directory recursively
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else {
      results.push(filePath);
    }
  });
  return results;
}

function analyze() {
  const allFiles = walk(SRC_DIR).filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));
  const fileContents = {};
  allFiles.forEach(f => {
    fileContents[f] = fs.readFileSync(f, 'utf8');
  });

  const unused = [];

  allFiles.forEach(targetFile => {
    // Skip app directory files as they are Next.js routing endpoints and are not imported directly
    if (targetFile.includes(path.join(SRC_DIR, 'app'))) {
      return;
    }

    const relPath = path.relative(SRC_DIR, targetFile);
    // Get base name without extension and potential directory index references
    const baseName = path.basename(targetFile, path.extname(targetFile));
    
    // We check if other files import this file
    let isUsed = false;
    
    // Check if the relative path or baseName is referenced in any other file
    for (const [otherFile, content] of Object.entries(fileContents)) {
      if (otherFile === targetFile) continue;

      // Extract raw imports/requires
      // Normalize target paths to find matches
      // E.g., if relative path is components/custom/back-button.tsx
      // We look for 'components/custom/back-button' or '@/components/custom/back-button'
      const searchPattern1 = baseName;
      
      // Look for relative import patterns or absolute aliases
      if (content.includes(searchPattern1)) {
        isUsed = true;
        break;
      }
    }

    if (!isUsed) {
      unused.push(targetFile);
    }
  });

  console.log('\n--- UNUSED FILES FOUND ---');
  unused.forEach(f => {
    console.log(path.relative(SRC_DIR, f));
  });
  console.log(`Total: ${unused.length} unused files.`);
}

analyze();
