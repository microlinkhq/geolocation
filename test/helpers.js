'use strict'

const { listen } = require('async-listen')
const { createServer } = require('http')
const { promisify } = require('util')

const closeServer = server => promisify(server.close.bind(server))()

const runServer = async (t, handler, { throwErrors = true } = {}) => {
  const server = createServer(async (req, res) => {
    try {
      await handler(req, res)
    } catch (error) {
      console.error(error)
      if (throwErrors) throw error
      res.statusCode = 500
      res.end()
    }
  })

  const url = await listen(server)
  t.teardown(() => closeServer(server))
  return url
}

module.exports = { runServer }
