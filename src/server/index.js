const WebSocket = require("ws")

const server = require("./server")

/**
 * Returns web socket server
 *
 * @param {server.Options} options
 * @return {Promise<WebSocket.Server>} Web Socket Server
 */
async function wsServer(options) {
  const httpserver = await server(options)
  return new WebSocket.Server({ server: httpserver })
}

module.exports = {
  wsServer,
  server
}
