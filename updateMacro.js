const exec = require('child_process').execSync;
const path = require('path');

const basePath = __dirname;
const powerShellScriptPath = path.join(basePath, 'updateMacro.ps1');

const updateMacro = () => {
  try {
    exec(`cd ${basePath} && powershell.exe .\\updateMacro.ps1`);
    console.log('Powershell script: Success');
    return ;
  } catch(e) {
    console.log('Powershell script: Failed');
  }
  
};

module.exports = updateMacro;
