import { Router } from "express";
const router = Router();

const products = [
  {
    id: 1,
    title: "Smartphone X",
    description: "A high-performance smartphone with 128GB storage.",
    code: "SPX128",
    price: 899,
    status: true,
    stock: 25,
    category: "Electronics",
  },
  {
    id: 2,
    title: "Wireless Headphones",
    description:
      "Noise-cancelling over-ear headphones with Bluetooth connectivity.",
    code: "WH500",
    price: 199,
    status: true,
    stock: 50,
    category: "Audio",
  },
  {
    id: 3,
    title: "Gaming Laptop",
    description: "High-performance laptop with NVIDIA RTX 3060 GPU.",
    code: "GL3060",
    price: 1499,
    status: true,
    stock: 10,
    category: "Computers",
  },
  {
    id: 4,
    title: "Electric Kettle",
    description: "1.7L stainless steel kettle with rapid boil function.",
    code: "EK17SS",
    price: 49,
    status: true,
    stock: 100,
    category: "Home Appliances",
  },
  {
    id: 5,
    title: "Running Shoes",
    description: "Lightweight and breathable shoes for long-distance running.",
    code: "RS2024",
    price: 120,
    status: true,
    stock: 75,
    category: "Footwear",
  },
];

//obtener lista de productos
router.get("/", (req, res) => {
  res.json(products);
});
//obtener id solicitado
router.get("/:pid", (req, res) => {
  const idBuscado = req.params.id;
  const product = products.find((product) => product.id === idBuscado);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json(product);
});

//crear/agregar producto
router.post("/", (req, res) => {
  let product = req.body;
  if (
    !product.title ||
    !product.description ||
    !product.code ||
    !product.price ||
    !product.status ||
    !product.stock ||
    !product.category
  ) {
    return res
      .status(400)
      .send({ status: "error", error: "Incomplete values" });
  }

  products.push({ ...products, id: (products.length + 1).toString() });
  res.send({ status: "success", message: "Product created" });
});
// actualizar producto
router.put("/:pid", (req, res) => {
  const prodId = req.params.id;
  const updateProd = req.body;

  const prodIndex = products.findIndex((item) => item.id === prodId);
  if (prodIndex === -1) {
    return res
      .status(404)
      .send({ status: "error", error: "Product not found" });
  }

  products[prodIndex] = { ...products[prodIndex], ...updateProd };
  res.send({ status: "success", message: "Product updated" });
});
//eliminar producto
router.delete("/:pid", (req, res) => {
  let prodId = req.params.id;
  const prodIndex = products.findIndex((item) => item.id === prodId);
  if (prodIndex === -1) {
    return res
      .status(404)
      .send({ status: "error", error: "Product not found" });
  }
  products.splice(prodIndex, 1);
  res.send({ status: "success", message: "Product deleted" });
});

export default router;
