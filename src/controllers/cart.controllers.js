import CartModel from "../models/cart.model.js";
import ProductModel from "../models/products.model.js";
import CartService from "../service/cart.service.js";
import { calcularTotal } from "../util/util.js";

const crearCarrito = async (req, res) => {
  try {
    const carrito = await CartService.crearCarrito();
    res.status(201).json(carrito);
  } catch (error) {
    res.status(500).json({ error: "Error 500 al crear carrito :/" });
  }
};

const getCarritoById = async (req, res) => {
  try {
    const carrito = await CartService.getCarritoById(req.params.cartId);
    if (!carrito) {
      return res
        .status(404)
        .json({ error: "Error 400 , carrito no encontrado" });
    }
    res.status(200).json(carrito);
  } catch (error) {
    console.error("Error al obtener carrito", error);
    res.status(500).json({ error: "Error 500 al obtener carrito" });
  }
};

const agregarProductoAlCarrito = async (req, res) => {
  const { cartId, productId } = req.params;
  const { quantity } = req.body;
  try {
    const carrito = await CartService.agregarProductoAlCarrito(
      cartId,
      productId,
      quantity
    );
    res.status(200).json(carrito);
  } catch (error) {
    res.status(500).json({ error: "Error al agregar el producto al carrito" });
  }
};

const eliminarProductoDelCarrito = async (req, res) => {
  const { cartId, productId } = req.params;
  try {
    const carrito = await CartService.eliminarProductoDelCarrito(
      cartId,
      productId
    );
    res.status(200).json(carrito);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al eliminar el producto del carrito" });
  }
};

const eliminarTodosLosProductos = async (req, res) => {
  const { cartId } = req.params;
  try {
    const carrito = await CartService.eliminarTodosLosProductos(cartId);
    res.status(200).json(carrito);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al eliminar todos los productos del carrito" });
  }
};

const viewCarrito = async (req, res) => {
  try {
    const carrito = await CartService.getCarritoById(req.params.cartId);
    res.render("cart", {
      products: carrito.products,
      cartId: carrito.id,
    });
  } catch (error) {
    console.error("Error al obtener la vista del carrito:", error);
    res.status(500).render("error", { message: "Error al cargar el carrito" });
  }
};

const FinalizarCompra = async (req, res) => {
  const carritoId = req.params.cid;
  try {
    const carrito = await CartModel.findById(carritoId);
    const arrayProductos = carrito.products;

    const productosNoDisponibles = [];

    for (const item of arrayProductos) {
      const productId = item.product;
      const product = await ProductModel.findById(productId);
      if (product.stock > item.quantity) {
        product.stock -= item.quantity;
        await product.save();
      } else {
        productosNoDisponibles.push(productId);
      }

      const usuarioDelCarrito = await ProductModel.findOne({ cart: carritoId });

      const ticket = new TicketModel({
        purchase_datatime: new Date(),
        amount: calcularTotal(carrito.products),
        purchaser: usuarioDelCarrito.email,
      });
      await ticket.save();

      carrito.products = cart.products.filter((item) =>
        productosNoDisponibles.some((productId) =>
          productId.equals(item.product)
        )
      );
      await carrito.save();
      res.json({
        message: "Tu compra fue finalizada exitosamente",
        ticket: {
          id: ticket._id,
          amount: ticket.amount,
          purchase_datetime: ticket.purchase_datatime,
          purchaser: ticket.purchaser,
        },
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al eliminar todos los productos del carrito" });
  }
};

export default {
  crearCarrito,
  getCarritoById,
  agregarProductoAlCarrito,
  eliminarProductoDelCarrito,
  eliminarTodosLosProductos,
  viewCarrito,
  FinalizarCompra,
};
