import express from "express";
import ___dirname from "./utilis.js";
import indexRouter from "./routes/index.js";
import cartRouter from "./routes/cart.js";
const app = express();
const port = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.listen(port, () => {
  console.log(`servidor escuchando en el puerto ${port}`);
});
app.get("/Bienvenida", (req, res) => {
  res.send("Bienvenido a mi app express!!");
});
app.use("/api/products", indexRouter);
app.use("/api/cart", cartRouter);
app.use("static", express.static(___dirname + "public"));
