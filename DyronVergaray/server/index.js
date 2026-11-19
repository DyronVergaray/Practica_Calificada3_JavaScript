import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

let universities = [];

async function loadData() {
  const res = await fetch('http://universities.hipolabs.com/search?country=Peru');
  universities = await res.json();
  console.log(`Cargadas ${universities.length} universidades`);
}

app.get('/api/universities', (req, res) => {
  const q = String(req.query.q || '').toLowerCase().trim();
  const result = q
    ? universities.filter((u) => u.name.toLowerCase().includes(q))
    : universities;
  res.json(result);
});

loadData()
  .then(() => app.listen(3000, '0.0.0.0', () => console.log('API en http://localhost:3000')))
  .catch((err) => console.error('No se pudo cargar la API de Hipolabs:', err));