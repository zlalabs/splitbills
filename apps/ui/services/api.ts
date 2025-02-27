import axios from 'axios'

const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
const prefix = process.env.NEXT_PUBLIC_API_PREFIX || '/'

const api = axios.create({
  baseURL: `${url}/${prefix}`,
})

export default api
