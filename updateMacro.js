const exec = require('child_process').execSync;
const path = require('path');

const basePath = __dirname;
const powerShellScriptPath = path.join(basePath, 'updateMacro.ps1');

const updateMacro = () => {
  const results = exec(`powershell.exe ${powerShellScriptPath}`);
  console.log('Powershell script result:');
  console.log(results);
  return ;
};

module.exports = updateMacro;
