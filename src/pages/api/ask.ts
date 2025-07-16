// src/pages/api/ask.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { spawn } from 'child_process'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.body

  if (!query) {
    return res.status(400).json({ error: 'Missing query in request body' })
  }

  // Run Python script
  const python = spawn('python3', ['exa_scraper/query_aven.py'])

  let data = ''
  python.stdout.on('data', (chunk) => {
    data += chunk.toString()
  })

  python.stderr.on('data', (err) => {
    console.error('Python error:', err.toString())
  })

  python.on('close', () => {
    // Send response back to frontend
    res.status(200).json({ result: data.trim() })
  })

  // Send input to the Python script
  python.stdin.write(`${query}\n`)
  python.stdin.end()
}
