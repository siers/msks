const config = {
  basePath: process.env.REACT_APP_BASE_PATH || '/',
  embedChannel: process.env.REACT_APP_EMBED_CHANNEL,
  socketUrl: process.env.REACT_APP_SOCKET_URL || '//',
  socketPath: process.env.REACT_APP_SOCKET_PATH || '/socket.io',
}

export default config
