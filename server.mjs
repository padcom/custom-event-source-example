#!/usr/bin/env node

import express from 'express'
import cors from 'cors'

function log(level, ...content) {
  console.log(`${new Date().toISOString()} [${level}]`, ...content)
}

const app = express()
app.use(cors())

const clients = []

app.post('/api/events', (request, response) => {
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  }
  response.writeHead(200, headers)

  const client = {
    id: Date.now(),
    response
  }

  clients.push(client)
  log('info', client.id, 'Connection opened')

  request.on('close', () => {
    log('info', client.id, 'Connection closed')
    clients.splice(clients.indexOf(client), 1)
  })
})

const listener = app.listen(8080, () => {
  setInterval(() => {
    clients.forEach(client => client.response.write(`data: Hello!\n\n`))
  }, 3000)

  console.log('listening on', listener.address())
})
