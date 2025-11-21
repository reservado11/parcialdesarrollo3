// productos-ms/index.js
const express = require('express');
const app = express();
const PORT = 3002;
app.use(express.json());

// Simulación de base de datos de productos e inventario
let productosDB = [
    { id: 101, nombre: 'Laptop', precio: 1000, stock: 50 },
    { id: 102, nombre: 'Mouse', precio: 20, stock: 200 }
];

// Endpoint: Verificar stock de un producto específico
// Usado por ventas-ms para validar antes de vender.
app.get('/api/productos/:id/stock', (req, res) => {
    const producto = productosDB.find(p => p.id === parseInt(req.params.id));
    const cantidadRequerida = parseInt(req.query.cantidad);

    if (!producto) {
        return res.status(404).send('Producto no encontrado');
    }

    if (producto.stock >= cantidadRequerida) {
        res.json({ id: producto.id, disponible: true });
    } else {
        res.status(400).json({ 
            id: producto.id, 
            disponible: false, 
            mensaje: 'Stock insuficiente' 
        });
    }
});


app.get('/api/productos', (req, res) => {
    res.json(productosDB);
});

app.listen(PORT, () => {
    console.log(`Microservicio de Productos corriendo en http://localhost:${PORT}`);
});
