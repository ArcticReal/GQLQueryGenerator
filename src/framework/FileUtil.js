import fs from 'fs';

function createFile(file){
  mkdirs(file.path);
  fs.writeFile(`${file.path}${file.name}`, file.content, file.encoding, (err) => {
    if (err) throw err;
  });

}

function mkdirs(path){
  if (!fs.existsSync(path)) {
    mkdirs(path.replace(/[\w]*\/$/, ""));
    fs.mkdirSync(path);
  }
}


export {createFile, mkdirs};
