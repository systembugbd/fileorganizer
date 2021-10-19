const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

const types = {
  media: ['mp4', 'webm', 'mpeg'],
  archive: ['7zip', 'zip', 'rar', 'jar'],
  image: ['png', 'jpg', 'gif'],
  doc: ['doc', 'docx', 'xls', 'xlsx', 'pdf'],
  app: ['exe'],
};

const getCategory = (filename, ext) => {
  // eslint-disable-next-line
  for (const type in types) {
    const ctype = types[type];
    for (let i = 0; i < ctype.length; i++) {
      if (ext === ctype[i]) {
        return type;
      }
    }
  }
  return 'others';
};

const sendFile = (distPath, categoryType, filePath, filename) => {
  const newDistPath = path.join(distPath, categoryType);

  if (fs.existsSync(newDistPath) === false) {
    fs.mkdirSync(newDistPath);
  }
  // console.log(filePath, path.join(newDistPath, existingFile[i]))
  fs.copyFileSync(filePath, path.join(newDistPath, filename));

  return {
    distPath,
    categoryType,
    filePath,
    filename,
  };
};

async function deleteOldFileConfirmation() {
  const result = inquirer
    .prompt({
      type: 'confirm',
      name: 'deleteOldFile',
      message: 'Are you sure you want to delete old source file?',
      default: false,
    });

  return result;
}
async function organize(arr) {
  const srcPath = arr[3];
  //   cosnt pathFormat = path.format()
  const distPath = path.join(srcPath, 'organized');
  const existingFile = fs.readdirSync(path.join(srcPath));

  if (fs.existsSync(distPath) === false) {
    fs.mkdirSync(distPath);
    console.log('Processing...');
  }

  if (fs.readdirSync(distPath).length === 0 || fs.readdirSync(distPath).length !== 0) {
    //   console.log(distPath, 'is empty')
    // console.log(existingFile);

    // eslint-disable-next-line
      for (let i = 0; i < existingFile.length; i++) {
      const filePath = path.join(srcPath, existingFile[i]);
      const isFile = fs.lstatSync(filePath).isFile();
      const ext = path.extname(filePath).slice(1);

      if (isFile) {
        const categoryType = getCategory(existingFile[i], ext);
        // console.log(existingFile[i] + " >>>>> " +categoryType)
        const sendFiles = sendFile(distPath, categoryType, filePath, existingFile[i]);
        console.log(`Source: ${sendFiles.filePath} >>>> Dist: ${sendFiles.distPath} copying...`);
      }
    }
  } else {
    console.log(`organized folder already exists on your given ${distPath} location and it has content inside.`);
  }
  const deleted = await deleteOldFileConfirmation();
  // console.log(deleted.deleteOldFile, deleted);
  if (deleted.deleteOldFile) {
    // console.log(deleted.deleteOldFile, deleted, 'again...');
    // eslint-disable-next-line
    // console.log(existingFile.length)

    for (let i = 0; i < existingFile.length; i++) {
      const filePath = path.join(srcPath, existingFile[i]);
      fs.unlink(filePath, () => {
        console.log(`❌ ${i} deleting this ${existingFile[i]}...`);
      });
    }
  }
}

module.exports = organize;
