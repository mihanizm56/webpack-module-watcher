const { spawn, exec } = require('child_process');
const { getFinishedLog, getLoadingLog, getCrashedLog } = require('./logs');
const { getDockerRunCommand, getDockerStopCommand } = require('./commands');
const { reloadTrigger } = require('./reload-trigger');

module.exports = class PlatformBuildWithWatchPlugin {


  handlerModulesBuild() {
    const child = spawn('docker', [getDockerRunCommand()], {
      shell: true,
      detached: true,
      // to get REAL logs replace comments and remove child
      // stdio: 'inherit',
    });

    child.stdout.on('end', () => {
      getFinishedLog();
      reloadTrigger();
    });

    child.on('error', error => () => getCrashedLog(error));
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('CustomPlugin', compilation => {
      compilation.hooks.needAdditionalPass.tap(
        'CustomPlugin',
        this.handlerModulesBuild,
      );
    });

    compiler.plugin('beforeCompile', () => {
      getLoadingLog();

      exec(
        getDockerStopCommand(),
        {
          shell: true,
        },
        // to get REAL logs replace comments
        // (error, output) => console.log(output),
      );
    });
  }
};
