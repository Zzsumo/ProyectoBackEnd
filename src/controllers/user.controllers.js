import userService from "../service/user.service.js";
import jwt from "jsonwebtoken";
import passport from "passport";
import UserDTO from "../dto/user.dto.js";
class UserController {
  async register(req, res) {
    const { first_name, last_name, email, age, password } = req.body;

    try {
      const nuevoUsuario = await userService.registerUser({
        first_name,
        last_name,
        email,
        age,
        password,
      });

      const token = jwt.sign(
        {
          usuario: `${nuevoUsuario.first_name} ${nuevoUsuario.last_name}`,
          email: nuevoUsuario.email,
          role: nuevoUsuario.role,
        },
        "passticket",
        { expiresIn: "2h" }
      );

      res.cookie("passticketCookieToken", token, {
        maxAge: 7200000,
        httpOnly: true,
      });
      res.redirect("/api/sessions/home");
    } catch (error) {
      res.status(500).send("Error interno del servidor 500 ;/");
    }
  }

  async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await userService.loginUser(email, password);

      const token = jwt.sign(
        {
          usuario: `${user.first_name} ${user.last_name}`,
          email: user.email,
          role: user.role,
        },
        "passticket",
        { expiresIn: "2h" }
      );

      res.cookie("passticketCookieToken", token, {
        maxAge: 7200000,
        httpOnly: true,
      });

      res.redirect("/api/sessions/home");
    } catch (error) {
      res.status(500).send("Error interno del servidor 500 ;/");
    }
  }

  async current(req, res) {
    if (req.user) {
      const user = req.user;

      const userDTO = new UserDTO(user);
      res.render("current", { user: userDTO });
    } else {
      res.send("No autorizado");
    }
  }

  logout(req, res) {
    res.clearCookie("passticketCookieToken");
    res.redirect("/login");
  }
}

export default new UserController();
