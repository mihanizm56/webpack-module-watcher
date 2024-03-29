const dotenv = require('dotenv');

dotenv.config();

const dockerPort = process.env.PLT_IMAGE_PORT || 443;
const dockerName = process.env.PLT_IMAGE_NAME || 'local';

const getDockerRunCommand = () =>
  `stop ${dockerName} || docker run --name ${dockerName} -it --rm -d -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf -v $(pwd)/build:/usr/share/metadata/core/build -p ${dockerPort}:80 fholzer/nginx-brotli:v1.19.1 nginx -g 'daemon off;'`;
const getDockerStopCommand = () => `docker stop ${dockerName}`;
module.exports = {
  getDockerRunCommand,
  getDockerStopCommand,
  dockerPort,
  dockerName,
};
