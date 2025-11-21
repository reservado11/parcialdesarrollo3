// productos-ms/index.js
const express = require("express");
const app = express();
const PORT = 3002;
app.use(express.json());

let productosDB = [];

// Crear un nuevo producto
app.post("/api/productos", (req, res) => {
  const { nombre, precio, stock } = req.body;

  if (!nombre || precio === undefined || stock === undefined) {
    return res
      .status(400)
      .json({ error: "Faltan datos obligatorios: nombre, precio o stock" });
  }
  // Disminuir stock después de una venta
  app.patch("/api/productos/:id/reducir-stock", (req, res) => {
    const { cantidad } = req.body;
    const producto = productosDB.find((p) => p.id === parseInt(req.params.id));

    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    if (producto.stock < cantidad) {
      return res.status(400).json({ error: "Stock insuficiente para reducir" });
    }

    producto.stock -= cantidad;

    res.json({
      mensaje: "Stock actualizado correctamente",
      producto,
    });
  });

  // Generar nuevo id incremental
  const nuevoId = productosDB.length
    ? Math.max(...productosDB.map((p) => p.id)) + 1
    : 100;

  const nuevoProducto = {
    id: nuevoId,
    nombre,
    precio,
    stock,
  };

  productosDB.push(nuevoProducto);

  res.status(201).json(nuevoProducto);
});

// Endpoint: Verificar stock de un producto específico
// Usado por ventas-ms para validar antes de vender.
app.get("/api/productos/:id/stock", (req, res) => {
  const producto = productosDB.find((p) => p.id === parseInt(req.params.id));
  const cantidadRequerida = parseInt(req.query.cantidad);

  if (!producto) {
    return res.status(404).send("Producto no encontrado");
  }

  if (producto.stock >= cantidadRequerida) {
    res.json({ id: producto.id, disponible: true });
  } else {
    res.status(400).json({
      id: producto.id,
      disponible: false,
      mensaje: "Stock insuficiente",
    });
  }
});

app.get("/", (req, res) => {
  res.send(" Productos funcionando correctamente 🚀");
});

app.get("/api/productos", (req, res) => {
  res.json(productosDB);
});

app.listen(PORT, () => {
  console.log(
    `Microservicio de Productos corriendo en http://localhost:${PORT}`
  );
});
