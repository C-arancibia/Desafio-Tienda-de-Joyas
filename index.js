const express = require('express');
const joyas = require('./data/joyas');
const app = express();

app.listen(3000, () => console.log('Your app listening on port 3000'));

app.get('/', (req, res) => {
res.send('Oh wow! this is working =)');
});

app.get('/joyas', (req, res) => {
const { page = 1, limit = 10, order = 'asc', name, metal, category } = req.query;
let filteredJoyas = joyas;

  // Filtrar por campos
if (name) {
    filteredJoyas = filteredJoyas.filter(joya => joya.name.toLowerCase().includes(name.toLowerCase()));
}
if (metal) {
    filteredJoyas = filteredJoyas.filter(joya => joya.metal.toLowerCase() === metal.toLowerCase());
}
if (category) {
    filteredJoyas = filteredJoyas.filter(joya => joya.category.toLowerCase() === category.toLowerCase());
}

  // Ordenar por valor
const sortedJoyas = [...filteredJoyas].sort((a, b) => {
    return order === 'asc' ? a.value - b.value : b.value - a.value;
});

  // Paginación
  const start = (page - 1) * limit;
  const end = page * limit;
const paginatedJoyas = sortedJoyas.slice(start, end);

  // Estructura HATEOAS
const hateoasJoyas = paginatedJoyas.map(joya => {
    return {
    ...joya,
    links: {
        self: `http://localhost:3000/joyas/${joya.id}`,
        category: `http://localhost:3000/joyas/categoria/${joya.category}`
    }
    };
});

res.json(hateoasJoyas);
});

app.get('/joyas/categoria/:categoria', (req, res) => {
const { categoria } = req.params;
const joyasCategoria = joyas.filter(joya => joya.category === categoria);
if (joyasCategoria.length > 0) {
    res.json(joyasCategoria);
} else {
    res.status(404).json({ error: 'No se encontraron joyas en esa categoría' });
}
});

app.get('/joyas/:id', (req, res) => {
const { id } = req.params;
const joya = joyas.find(joya => joya.id == id);
if (joya) {
    res.json(joya);
} else {
    res.status(404).json({ error: 'La joya con ese ID no existe' });
}
});
