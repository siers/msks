const _ = require('lodash')
const ircFramework = require('irc-framework')

const config = require('../config')
const { versionText } = require('../version')

const ircClient = new ircFramework.Client({
  host: config.irc.host,
  port: config.irc.port,
  nick: config.irc.nick,
  username: config.irc.username,
  password: config.irc.password,
  tls: config.irc.tls,
  gecos: config.irc.gecos,
  auto_reconnect: true,
  // Tries to reconnect for at least 5 hours.
  auto_reconnect_wait: 2000 + Math.round(Math.random() * 2000),
  auto_reconnect_max_retries: 9000,
  version: versionText,
})

let ctx = {
  connectionTime: null,
}

const isMe = nick => ircClient.user.nick === nick

const isPM = message => (
  // Apparently & is a valid prefix for channel.
  !_.startsWith(message.to, '#')
  && !_.startsWith(message.to, '&')
)

module.exports = {
  ircClient,
  ctx,
  isMe,
  isPM,
}
