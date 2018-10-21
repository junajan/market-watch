const _ = require('lodash');
const SocketIo = require('socket.io');

const loader = require('./core/fileLoader');

function registerEventHandlers (modules, client) {
  modules.forEach(module => module.registerHandlers(client))
}

module.exports = function SocketServer (server, app) {
  const io = SocketIo(server);

  /**
   * SocketIo routes
   */
  const socketModules = loader.loadFilesSync('./**/*.socket.js');
  const modules = socketModules.map(module => new module.module(app, io));

  io.on('connection', (client) => {
    console.log("SocketIO::connect", client.id);

		client.use((packet, next) => {
    	const _packet = _.cloneDeep(packet) // don't modify original packet
    	const eventName = _packet.shift()
      console.log("SocketIO::%s", eventName, _packet);
      next();
    });

    registerEventHandlers(modules, client)

    client.on('disconnect', () => {
      console.log("SocketIO::disconnect", client.id);
    });
  });

	return io;
};
