import express, { Request, Response } from 'express'
import 'dotenv/config'
const app = express()
const port = 3000

const DomjudgeApi = process.env.DOMJUDGE_API
const username = process.env.DOMJUDGE_USERNAME
const password = process.env.DOMJUDGE_PASSWORD

async function domjudgeFetch(path: string) {
  const res = await fetch(`${DomjudgeApi}/api/v4/${path}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
