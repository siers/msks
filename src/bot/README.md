# msks-bot, [Mr. Meeseeks](https://www.youtube.com/watch?v=qUYvIAP3qQk)

IRC chatbot that sits in one or many channels and sends all it can find to RethinkDB.

Also supports simple commands like `!ping`, `!version` and `!uptime`.

### What is the Purpose?

Data gathering for web client that can display real-time messages and full history. See [`msks-web`](https://github.com/daGrevis/msks-web).

## Development

Install environment:

```sh
yarn install
```

Start RethinkDB:

```sh
rethinkdb
```

Start bot:

```sh
yarn run start
```