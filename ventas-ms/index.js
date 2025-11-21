
const express = require('express');
const axios = require('axios'); 
const app = express();
const PORT = 3003;
app.use(express.json());


const CLIENTES_URL = 'http://localhost:3001/api/clientes';
const PRODUCTOS_URL = 'http://localhost:3002/api/productos';


const ventasDB = [];


app.post('/api/ventas', async (req, res) => {
    const { cliente_id, items } = req.body;

    try {
       
        console.log(`Validando cliente ${cliente_id}...`);
        await axios.get(`${CLIENTES_URL}/${cliente_id}`);
        
       
        console.log('Validando stock de productos...');
        for (const item of items) {
            await axios.get(`${PRODUCTOS_URL}/${item.producto_id}/stock?cantidad=${item.cantidad}`);
            
        }

        
        const nuevaVenta = { 
            id: ventasDB.length + 1, 
            cliente_id, 
            items, 
            fecha: new Date().toISOString() 
        };
        ventasDB.push(nuevaVenta);
        
        console.log('Venta registrada exitosamente.');
        res.status(201).json(nuevaVenta);

    } catch (error) {
        
        if (error.response) {
            
            return res.status(error.response.status).json({ 
                error: `Error de dependencia: ${error.response.data}` 
            });
        }
        console.error('Error interno del servidor:', error.message);
        res.status(500).json({ error: 'Error interno del servidor de ventas.' });
    }
});


app.get('/api/ventas', (req, res) => {
    res.json(ventasDB);
});

app.get('/', (req, res) => {
    res.send(' Ventas funcionando correctamente 🚀');
});

app.listen(PORT, () => {
    console.log(`Microservicio de Ventas corriendo en http://localhost:${PORT}`);
});
