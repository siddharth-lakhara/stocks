const exec = require('child_process').execSync;

const powerShellScriptPath = process.env.powerShellScriptPath;

const updateMacro = () => {
  const results = exec(`powershell.exe ${powerShellScriptPath}`);
  console.log('Powershell script result:');
  console.log(results);
  return ;
};

module.exports = updateMacro;
