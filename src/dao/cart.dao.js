import CartModel from "../models/cart.model.js";
import CartDTO from "../dto/cart.dto.js";

class CartDAO {
  async crearCarrito() {
    const nuevoCarrito = new CartModel({ products: [] });
    const savedCart = await nuevoCarrito.save();
    console.log("Carrito guardado en CartDAO:", savedCart);
    return savedCart;
  }

  async getCarritoById(cartId) {
    return await CartModel.findById(cartId).populate("products.product");
  }

  async obtenerCarritos() {
    return await CartModel.find();
  }

  async actualizarCarrito(cartId, productos) {
    return await CartModel.findByIdAndUpdate(
      cartId,
      { products: productos },
      { new: true }
    );
  }

  async eliminarTodosLosProductos(cartId) {
    return await CartModel.findByIdAndUpdate(
      cartId,
      { products: [] },
      { new: true }
    );
  }
}

export default new CartDAO();
