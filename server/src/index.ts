import express, { Request, Response } from 'express'
import { JSONFilePreset } from 'lowdb/node'
import { Server as WebSocketServer } from 'ws'
import path from 'path'
const app = express()

const defaultData = {
  marqueeItems: ['Welcome to the contest!'],
  contests: []
}
const db = await JSONFilePreset('volume/db.json', defaultData)

const port = 3000
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})

const wss = new WebSocketServer({ server })

app.use(express.json())

const DomjudgeApi = Bun.env.DOMJUDGE_API
const username = Bun.env.DOMJUDGE_USERNAME
const password = Bun.env.DOMJUDGE_PASSWORD

async function domjudgeFetch(path: string) {
  const apiEndpoint = `${DomjudgeApi}/api/v4/${path}`
  const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`

  const res = await fetch(apiEndpoint, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader
    }
  })

  return await res.json()
}

app.get('/api/contests', async (req: Request, res: Response) => {
  const onlyActive = req.query.onlyActive || false
  res.send(await domjudgeFetch(`contests?onlyActive=${onlyActive}`))
})

app.get('/api/contests/:id', async (req: Request, res: Response) => {
  const id = req.params.id
  res.send(await domjudgeFetch(`contests/${id}`))
})

app.get('/api/contests/:id/state', async (req: Request, res: Response) => {
  const id = req.params.id
  res.send(await domjudgeFetch(`contests/${id}/state`))
})

app.get('/api/contests/:id/problems', async (req: Request, res: Response) => {
  const id = req.params.id
  res.send(await domjudgeFetch(`contests/${id}/problems`))
})

app.get('/api/contests/:id/scoreboard', async (req: Request, res: Response) => {
  const id = req.params.id
  res.send(await domjudgeFetch(`contests/${id}/scoreboard?public=true`))
})

app.get('/api/contests/:id/submissions', async (req: Request, res: Response) => {
  const id = req.params.id
  res.send(await domjudgeFetch(`contests/${id}/submissions`))
})

app.get('/api/contests/:id/judgements', async (req: Request, res: Response) => {
  const id = req.params.id
  res.send(await domjudgeFetch(`contests/${id}/judgements`))
})

app.get('/api/contests/:id/teams', async (req: Request, res: Response) => {
  const id = req.params.id
  res.send(await domjudgeFetch(`contests/${id}/teams?public=true`))
})

app.get('/api/contests/:id/event-feed', async (req: Request, res: Response) => {
  const id = req.params.id
  res.send(await domjudgeFetch(`contests/${id}/event-feed`))
})

app.post('/api/marquee', async (req: Request, res: Response) => {
  const item = req.body

  db.data.marqueeItems = item.marqueeItems
  await db.write()

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(item))
    }
  })

  res.send(item)
})

app.get('/api/marquee', async (req: Request, res: Response) => {
  const item = db.data.marqueeItems || {}
  res.send({
    marqueeItems: item
  })
})

app.delete('/api/marquee', async (req: Request, res: Response) => {
  db.data.marqueeItems = []
  await db.write()
  res.send('OK')
})

wss.on('connection', (ws) => {
  console.log('Client connected')
  ws.on('message', (message) => {
    console.log(`Received message => ${message}`)
  })
})

if (Bun.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'public')))

  app.get('*', (req, res) => {
    console.log(path.join(__dirname, 'public', 'index.html'))
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
  })
}
