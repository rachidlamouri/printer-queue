const fs = require('fs');
const path = require('path');

const QUEUE_DIR = 'queue';
const BACKUP_DIR = `backup`;
const DRIVE_DIR = 'E:';
const DRIVE_BACKUP_DIR = `${DRIVE_DIR}/backup`;

const forceMakeDir = (folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }
};

forceMakeDir(QUEUE_DIR);
forceMakeDir(BACKUP_DIR);

if (!fs.existsSync(DRIVE_DIR)) {
  console.log();
  console.log('    Error!');
  console.log(`    Cannot find drive ${DRIVE_DIR}/`);
  process.exit();
}

forceMakeDir(DRIVE_BACKUP_DIR);

const queueFiles = fs.readdirSync(QUEUE_DIR);
if (queueFiles.length === 0) {
  console.log('    No files in queue!');
  process.exit();
}

const backupFilesInDrive = () => {
  const allFiles = fs.readdirSync(DRIVE_DIR);
  const gcodeFiles = allFiles.filter((filename) => path.extname(filename) === '.gcode');

  gcodeFiles.forEach((filename) => {
    const filepath = `${DRIVE_DIR}/${filename}`;
    const backupFilepath = `${DRIVE_BACKUP_DIR}/${filename}`;

    fs.renameSync(filepath, backupFilepath);
  });
};

const moveFilesFromQueueToDrive = () => {
  queueFiles.forEach((filename) => {
    const filepath = `${QUEUE_DIR}/${filename}`;
    const drivePath = `${DRIVE_DIR}/${filename}`
    const backupFilepath = `${BACKUP_DIR}/${filename}`;

    fs.copyFileSync(filepath, drivePath);
    fs.renameSync(filepath, backupFilepath);
  });

  const calibrationFilename = 'calibration.gcode';
  fs.copyFileSync(calibrationFilename, `${DRIVE_DIR}/${calibrationFilename}`);
};

backupFilesInDrive();
moveFilesFromQueueToDrive();

console.log('    Done!');
