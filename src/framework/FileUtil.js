import fs from 'fs';

function createFile(file){
  fs.mkdir(file.path, (err) => {
    if (err){
      if(err.code!=='EEXIST')
        throw err;
    }else {
      console.log('mkdired');
    }
    fs.writeFile(`${file.path}${file.name}`, file.content, file.encoding, (err) => {
      if (err) throw err;
    });
  });
}

export {createFile};
