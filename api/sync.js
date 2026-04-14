import dotenv from 'dotenv'

dotenv.config()

const GOOGLE_SHEETS_URL = process.env.GOOGLE_SHEETS_URL

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const bodyToSend = {
        caixas: Array.isArray(req.body.caixas) ? req.body.caixas : [],
        pontas: Array.isArray(req.body.pontas) ? req.body.pontas : [],
      }

      const response = await fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyToSend),
      })

      const data = await response.json()
      return res.status(200).json(data)
    } catch (err) {
      return res.status(500).json({ error: 'Falha ao sincronizar' })
    }
  }

  if (req.method === 'GET') {
    try {
      const response = await fetch(GOOGLE_SHEETS_URL)
      const data = await response.json()
      console.log('URL:', GOOGLE_SHEETS_URL)
      return res.status(200).json(data)
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao buscar dados' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}