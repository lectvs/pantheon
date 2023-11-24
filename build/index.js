const fs = require('fs');
const path = require('path');
const JSZip = require('./jszip');


exports.buildGame = function(directory, gameName) {
    let files = [
        { directory: 'assets', exclude: ['.pyxel', '.flp', '.xrns', 'LICENSE*'] },
        { directory: 'js', exclude: ['pixiEdits.txt', 'pantheon.d.ts'] },
        { file: 'index.html' },
    ];

    createAdvancedZip(path.join(directory, 'bin'), files, path.join(directory, `build/${gameName}.zip`));

}

exports.buildSrc = function(directory, gameName) {
    let files = [
        { directory: '.vscode' },
        { directory: 'bin', exclude: ['pixiEdits.txt'] },
        { directory: 'drafts' },
        { directory: 'pantheon', exclude: ['build*', '.git', 'enginetodo.txt', 'LICENSE'] },
        { directory: 'src' },
        { file: 'favicon.ico' },
        { file: 'README.md' },
        { file: 'tsconfig.json' },
        { file: 'tscw.bat' },
        { inline: getLicense('LICENSE_ART'), path: 'bin/assets/LICENSE-FOR-ART-ASSETS' },
        { inline: getLicense('LICENSE_SRC'), path: 'pantheon/LICENSE' },
        { inline: getLicense('LICENSE_SRC'), path: 'src/LICENSE' },
    ];

    createAdvancedZip(directory, files, path.join(directory, `build/${gameName}-src.zip`));
}



function addFileToZip(zip, pathOnDisk, pathInZip) {
    let file = fs.readFileSync(pathOnDisk);
    zip.file(pathInZip, file);
}

function addInlineToZip(zip, contents, pathInZip) {
    zip.file(pathInZip, contents);
}

function createSimpleZip(rootDirectory, absolutePathFiles, outPath) {
    let zip = new JSZip();
    for (let file of absolutePathFiles) {
        addFileToZip(zip, file, path.relative(rootDirectory, file));
    }
    saveZip(zip, outPath);
}

function createAdvancedZip(rootDirectory, files, outPath) {
    let zip = new JSZip();
    for (let file of files) {
        if (file.inline) {
            addInlineToZip(zip, file.inline, file.path);
        } else if (file.file) {
            addFileToZip(zip, path.join(rootDirectory, file.file), file.file);
        } else if (file.directory) {
            let exclusions = file.exclude || [];
            let innerFiles = exclude(getFileListRecursive(path.join(rootDirectory, file.directory)), exclusions);
            for (let innerFile of innerFiles) {
                addFileToZip(zip, innerFile, path.relative(rootDirectory, innerFile));
            }
        } else {
            console.error("Unknown file:", file);
        }
    }
    saveZip(zip, outPath);
}

function getLicense(fileName) {
    let license = fs.readFileSync(path.join(__dirname, fileName)).toString();
    return license
        .replace('{{year}}', new Date().getFullYear());
}

function exclude(list, exclusions) {
    return list.filter(f => !exclusions.some(ex => {
        if (ex.endsWith('*')) return f.includes(ex.substring(0, ex.length-1));
        return f.endsWith(ex);
    }));
}

function getFileListRecursive(directory) {
    let result = [];
    for (let entry of fs.readdirSync(directory, { withFileTypes: true })) {
        let fullPath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            result.push(...getFileListRecursive(fullPath));
        } else {
            result.push(fullPath);
        }
    }
    return result;
}

function saveZip(zip, filePath) {
    zip.generateAsync({ type: "nodebuffer" }).then(function (buffer) {
        let directory = path.dirname(filePath);
        fs.mkdirSync(directory, { recursive: true });
        fs.writeFileSync(filePath, buffer);
    });
}
