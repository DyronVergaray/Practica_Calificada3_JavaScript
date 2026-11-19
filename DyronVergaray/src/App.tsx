import { useEffect, useState } from 'react'
import './App.css'

interface University {
  name: string
  country: string
  alpha_two_code: string
  'state-province': string | null
  web_pages: string[]
  domains: string[]
}

function App() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<University[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    const timer = setTimeout(() => {
      setLoading(true)
      setError('')
      fetch(`/api/universities?q=${encodeURIComponent(query)}`, {
        signal: controller.signal,
      })
        .then((res) => res.json())
        .then((data: University[]) => {
          setResults(data)
          setLoading(false)
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            setError('No se pudo conectar con la API')
            setLoading(false)
          }
        })
    }, 250)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [query])

  return (
    <div>
      <h1 className="title">Universidades de Perú</h1>

      <input
        className="search"
        type="text"
        placeholder="Buscar universidad..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading && <p className="status">Buscando...</p>}
      {error && <p className="status error">{error}</p>}
      {!loading && !error && <p className="status">{results.length} resultados</p>}

      <ul className="list">
        {results.map((u) => (
          <li key={u.name} className="card">
            <strong>{u.name}</strong>
            {u.web_pages[0] && (
              <a href={u.web_pages[0]} target="_blank" rel="noreferrer">
                sitio web
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App