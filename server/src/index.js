global.Promise = require('bluebird')
const fs = require('fs')

const _ = require('lodash')
const Queue = require('promise-queue')
const http = require('http')
const socketio = require('socket.io')
const Koa = require('koa')
const KoaStatic = require('koa-static')

const config = require('./config')
const logger = require('./logger')
const httpLogger = require('./http/logger')
const httpRouter = require('./http/router')
const actions = require('./actions')
const { ircClient } = require('./irc')
const events = require('./irc/events')
const waitForRethink = require('./rethink/waitForRethink')
const waitForElastic = require('./elastic/waitForElastic')

Queue.configure(Promise)

const SERVER_PORT = 3001

const koa = new Koa()
koa.use(httpLogger())
koa.use(httpRouter.routes())
koa.use(httpRouter.allowedMethods())

let server = http.createServer(koa.callback())

let io = socketio(server, {
  serveClient: false,
})

const ACTIONS = {
  'server/SUBSCRIBE_TO_CHANNELS': actions.subscribeToChannels,
  'server/SUBSCRIBE_TO_USERS': actions.subscribeToUsers,
  'server/SUBSCRIBE_TO_MESSAGES': actions.subscribeToMessages,
  'server/UNSUBSCRIBE_FROM_MESSAGES': actions.unsubscribeFromMessages,
  'server/LOAD_MESSAGES': actions.loadMessages,
  'server/SEARCH': actions.search,
}

io.on('connection', socket => {
  let context = {
    changefeeds: [],
    messagesChangefeeds: {},
  }

  socket.on('action', ({ type, payload = null }) => {
    if (!ACTIONS[type]) {
      logger.warn(`Unknown action: ${type}`)
      return
    }

    const action = ACTIONS[type]
    action(payload || {})({ socket, context })
  })

  socket.on('disconnect', () => {
    const { changefeeds } = context
    changefeeds.forEach(changefeed => {
      changefeed.close()
    })
  })
})

const eventQueue = new Queue(1, Infinity)

const eventMap = {
  debug: events.onDebug,
  close: events.onClose,
  connecting: events.onConnecting,
  reconnecting: events.onReconnecting,
  registered: events.onRegistered,
  join: events.onJoin,
  quit: events.onQuit,
  part: events.onPart,
  kick: events.onKick,
  nick: events.onNick,
  userlist: events.onUserList,
  mode: events.onMode,
  topic: events.onTopic,
  privmsg: events.onMessage,
  action: events.onAction,
  notice: events.onNotice,
}

_.forEach(eventMap, (fn, name) => {
  ircClient.on(name, payload => {
    eventQueue.add(() => fn(payload))
  })
})

Promise.all([
  waitForRethink(),
  config.elastic.enable === true ? waitForElastic() : Promise.resolve(),
]).then(() => {
  server.listen(SERVER_PORT)
  logger.info(`Listening on port ${SERVER_PORT}...`)

  if (config.irc.enable) {
    ircClient.connect()
  }
})
