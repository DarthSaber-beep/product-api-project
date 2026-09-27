const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Initial array of 2 product objects as required
let products = [
    { productId: 1, name: "Wireless Mouse", brand: "Logitech", price: 29.99 },
    { productId: 2, name: "Mechanical Keyboard", brand: "Keychron", price: 99.99 }
];

// 1. Read all products
app.get('/products', (req, res) => {
    res.json(products);
});

// 2. Read a product by productId
app.get('/products/:productId', (req, res) => {
    const id = parseInt(req.params.productId);
    const product = products.find(p => p.productId === id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
});

// 3. Read products by brand
app.get('/products/brand/:brand', (req, res) => {
    const brand = req.params.brand.toLowerCase();
    const filteredProducts = products.filter(p => p.brand.toLowerCase() === brand);
    res.json(filteredProducts);
});

// 4. Create a new product
app.post('/products', (req, res) => {
    const { productId, name, brand, price } = req.body;
    if (!productId || !name || !brand || !price) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    const newProduct = { productId, name, brand, price };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

// 5. Update a product by productId
app.put('/products/:productId', (req, res) => {
    const id = parseInt(req.params.productId);
    const productIndex = products.findIndex(p => p.productId === id);
    if (productIndex === -1) return res.status(404).json({ error: "Product not found" });

    // Update the product while retaining the original productId
    products[productIndex] = { ...products[productIndex], ...req.body, productId: id };
    res.json(products[productIndex]);
});

// 6. Delete a product by productId
app.delete('/products/:productId', (req, res) => {
    const id = parseInt(req.params.productId);
    const initialLength = products.length;
    products = products.filter(p => p.productId !== id);
    
    if (products.length === initialLength) {
        return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});