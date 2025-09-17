const fs = require("fs");
const path = require("path");

const rootDir = path.join(__dirname, "images");
const outputFile = path.join(__dirname, "photos.js");

const IMAGE_EXT = /\.(jpe?g|png|gif|webp)$/i;
const VIDEO_EXT = /\.(mp4|webm|mov|avi)$/i;

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  const result = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(rootDir, fullPath).replace(/\\/g, "/");

    if (entry.isDirectory()) {
      result.push({
        type: "folder",
        name: entry.name,
        path: relativePath,
        children: scanDir(fullPath),
      });
    } else if (IMAGE_EXT.test(entry.name)) {
      result.push({
        type: "image",
        name: entry.name,
        path: relativePath,
      });
    } else if (VIDEO_EXT.test(entry.name)) {
      result.push({
        type: "video",
        name: entry.name,
        path: relativePath,
      });
    }
  }

  return result;
}

const data = scanDir(rootDir);
const content = `export const mediaTree = ${JSON.stringify(data, null, 2)};`;

fs.writeFileSync(outputFile, content, "utf8");
console.log("✅ photos.js створено!");
