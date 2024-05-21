import express from 'express'
const app = express()
const port = 3000

app.get('/api', (req: any, res: any) => {
  res.send('Hello from Express!')
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
