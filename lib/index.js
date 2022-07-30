const { spawn, exec } = require('child_process');
const { getFinishedLog, getLoadingLog, getCrashedLog } = require('./logs');
const { getDockerRunCommand, getDockerStopCommand } = require('./commands');
const { reloadTrigger } = require('./reload-trigger');

module.exports = class PlatformBuildWithWatchPlugin {
  handlerModulesBuild() {
    setTimeout(() => {
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
    }, 500);
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('CustomPlugin', compilation => {
      compilation.hooks.needAdditionalPass.tap(
        'CustomPlugin',
        this.handlerModulesBuild,
      );
    });

    compiler.hooks.beforeCompile.tap('MyPlugin', () => {
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
