// clientes-ms/index.js
const express = require('express');
const app = express();
const PORT = 3001;
app.use(express.json());

// Simulación de base de datos de clientes
const clientesDB = [
    { id: 1, nombre: 'Cliente A', email: 'a@mail.com' },
    { id: 2, nombre: 'Cliente B', email: 'b@mail.com' }
];


app.get('/api/clientes/:id', (req, res) => {
    const cliente = clientesDB.find(c => c.id === parseInt(req.params.id));
    if (!cliente) {
        
        return res.status(404).send('Cliente no encontrado');
    }
    res.json(cliente);
});

app.get('/', (req, res) => {
    res.send(' Clientes funcionando correctamente 🚀');
});

app.listen(PORT, () => {
    console.log(`Microservicio de Clientes corriendo en http://localhost:${PORT}`);
});
