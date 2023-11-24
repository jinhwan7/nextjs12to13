#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const Runner = require("jscodeshift/src/Runner");

function moveFilesInDir(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((dirent) => {
    const fullPath = path.join(dir, dirent.name);

    if (dirent.isDirectory()) {
      moveFilesInDir(fullPath);
    } else if (
      dirent.name.endsWith(".tsx") &&
      !dirent.name.endsWith("_app.tsx") &&
      !dirent.name.endsWith("_document.tsx") &&
      !dirent.name.endsWith("index.tsx")
    ) {
      const data = fs.readFileSync(fullPath, "utf-8");
      const newData = "'use client'\n" + data;
      fs.writeFileSync(fullPath, newData, "utf-8");
      //path.parse(path)하면 이것저것 정보 나오고 그중에 name이 확장자 제외한 이름
      const newDir = path.join(dir, path.parse(dirent.name).name);

      const newFullPath = path.join(newDir, "page.tsx");

      if (!fs.existsSync(newDir)) {
        fs.mkdirSync(newDir);
      }

      fs.renameSync(fullPath, newFullPath);
    }
  });
}

function makeLayout() {
  const appContent = fs.readFileSync("./pages/_app.tsx", "utf-8");
  const documentContent = fs.readFileSync("./pages/_document.tsx", "utf-8");

  // 각 파일에서 <Head> 태그 내용만 추출
  const appHead = appContent.match(/<Head>([\s\S]*?)<\/Head>/)[1];
  const documentHead = documentContent.match(/<Head>([\s\S]*?)<\/Head>/)[1];

  // 추출한 내용을 합쳐서 layout.tsx에 쓰기
  fs.writeFileSync(
    "./pages/layout.tsx",
    `export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const meta = {
      title: "Next.js Blog Starter Kit",
      description: "Clone and deploy your own Next.js portfolio in minutes.",
      image: "https://assets.vercel.com/image/upload/q_auto/front/vercel/dps.png",
    };
    return (
      <html lang="en">
        <head>
         ${appHead}
         ${documentHead}
        </head>
        <body>{children}</body>
      </html>
    );
  }`
  );

  fs.unlinkSync("./pages/_app.tsx");
  fs.unlinkSync("./pages/_document.tsx");
  fs.rename("./pages/index.tsx", "./pages/page.tsx", () => {});
}

moveFilesInDir("./pages");
makeLayout();
fs.rename("./pages", "./app", () => {});
