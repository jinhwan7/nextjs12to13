#!/usr/bin/env node

const fs = require('fs');
const path = require('path');



function moveFilesInDir(dir) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach(dirent => {
      const fullPath = path.join(dir, dirent.name);
  
      if (dirent.isDirectory()) {
        moveFilesInDir(fullPath);
      } else if (dirent.name.endsWith('.tsx') && !dirent.name.endsWith('_app.tsx') && !dirent.name.endsWith('_document.tsx') && !dirent.name.endsWith('index.tsx')) {
        const newDir = path.join(dir, path.parse(dirent.name).name);
        
        const newFullPath = path.join(newDir, 'page.tsx');
  
        if (!fs.existsSync(newDir)) {
          fs.mkdirSync(newDir);
        }
  
        fs.renameSync(fullPath, newFullPath);
      }
    });
  }
  /* transformSomeCode.js */
function transformSomeCode(file, { jscodeshift }) {
    // 1. AST로 파싱
    const tree = jscodeshift(file.source);
  
   // 2. 수정할 노드 선택
   const nodes = tree.find();
  
    // 3. 수정
   jscodeshift(nodes)
      .remove() | .replaceWith() | .insertBefore()
  
    // 4. 소스 코드로 내보내기
   return tree.toSource();
  }

moveFilesInDir('./pages');
//여기 다른 메소드로 


