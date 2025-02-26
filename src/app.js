import express from "express";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import cookieParser from "cookie-parser";
import passport from "passport";
import displayRoutes from "express-routemap";
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import viewsRouter from "./routes/views.routes.js";
import sessionsRouter from "./routes/sessions.routes.js";
import "./database.js";
import initializePassport from "./config/passport.config.js";
import ProductController from "./controllers/products.controllers.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const puerto = process.env.PORT;

app.use(cookieParser());
app.use(passport.initialize());
initializePassport();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));
app.use("/", viewsRouter);

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionsRouter);

const http = app.listen(puerto, () => {
  displayRoutes(app);
  console.log(`Servidor activo en el puerto ${puerto}`);
});

const io = new Server(http);

io.on("connection", async (socket) => {
  console.log("Un Cliente se ha conectado");

  const productos = await ProductController.getProducts();
  socket.emit("productos", productos.payload);

  socket.on("agregarProducto", async (producto) => {
    await ProductController.addProduct(producto);
    const productosActualizados = await ProductController.getProducts();
    io.sockets.emit("productos", productosActualizados.payload);
  });

  socket.on("eliminarProducto", async (id) => {
    await ProductController.deleteProduct(id);
    const productosActualizados = await ProductController.getProducts();
    io.sockets.emit("productos", productosActualizados.payload);
  });
});
