// clientes-ms/index.js
const express = require('express');
const app = express();
const PORT = 3001;
app.use(express.json());

// Simulación de base de datos de clientes
const clientesDB = [];

// Crear un nuevo cliente
app.post('/api/clientes', (req, res) => {
    const { nombre, email } = req.body;

    if (!nombre || !email) {
        return res.status(400).json({ error: 'Faltan datos obligatorios: nombre o email' });
    }

    // Generar nuevo id incremental
    const nuevoId = clientesDB.length ? Math.max(...clientesDB.map(c => c.id)) + 1 : 1;

    const nuevoCliente = {
        id: nuevoId,
        nombre,
        email
    };

    clientesDB.push(nuevoCliente);

    res.status(201).json(nuevoCliente);
});


app.get('/api/clientes', (req, res) => {
    res.json(clientesDB);
});

app.get('/api/clientes/:id', (req, res) => {
    const cliente = clientesDB.find(c => c.id === parseInt(req.params.id));
    if (!cliente) {
        
        return res.status(404).send('Cliente no encontrado');
    }
    res.json(cliente);
});

// eliminar cliente
app.delete('/api/clientes/:id', (req, res) => {
    const clienteIndex = clientesDB.findIndex(c => c.id === parseInt(req.params.id));
    if (clienteIndex === -1) {
        return res.status(404).send('Cliente no encontrado');
    }
    clientesDB.splice(clienteIndex, 1);
    return res.status(200).send('Cliente eliminado exitosamente');
});

app.get('/', (req, res) => {
    res.send(' Clientes funcionando correctamente 🚀');
});

app.listen(PORT, () => {
    console.log(`Microservicio de Clientes corriendo en http://localhost:${PORT}`);
});
