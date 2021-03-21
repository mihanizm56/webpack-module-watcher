# @mihanizm56/webpack-stream-watcher

## Webpack plugin that reloads the separated react-app on browser after your app was builded and runs the docker image to start your own app with .umd static files

### Please note, that you must insert the plugin's requirements to your separated react-app
### Please note, that this is works only in Linux and MacOs machine (windows 10 PRO maybe but was not tested)


#### Plugin required environments:
 - PLT_IMAGE_PORT - port of your "watching app"
 - PLT_IMAGE_NAME - docker image name that will watcher run to server files via nginx
 - PLT_STREAM_SEND_PORT - the port to send web-socket messages

### Insert the websocket server in the separate react-app

```javascript
// webpackDevServer.config.js
const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 5010 })

module.exports = function(proxy, allowedHost) {
  return {
    // other settings
    before(app, server) { 
      // create the connection
      wss.on('connection', ws => {
        // get trigger message
        ws.on('message', message =>
          // reload page 
          server.sockWrite(server.sockets,'content-changed')
        )
      })
      
      // other settings
    },
  };
};

```

### Example of usage

```javascript
// webpack.config.js
const PlatformBuildWithWatchPlugin = require('@mihanizm56/webpack-stream-watcher');

module.exports = {
  // your config ...
  plugins: [new PlatformBuildWithWatchPlugin()]
};
```

#### The actual web-socket messager runs the command

```javascript
// node_modules/@mihanizm56/webpack-stream-watcher/reload-trigger.js
const WebSocket = require('ws');

const platformPort = process.env.PLT_STREAM_SEND_PORT || 5010;

module.exports.reloadTrigger = () => {
  const ws = new WebSocket(`ws://localhost:${platformPort}`);

  ws.on('open', function open() {
    ws.send('trigger');
    ws.close();
  });
};
```

## The Websocket signal can be used in different approaches - not only to trigger reloads !!!
