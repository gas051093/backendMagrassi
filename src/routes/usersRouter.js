import { Router } from "express";
import userManager from "../manager/userManager.js";
import passport from "passport";
import {
  createHash,
  generateToken,
  isValidatePassword,
} from "../utils/index.js";

const managerUser = new userManager();
const router = Router();
router.post("/user/login", (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info.message });
    const userPayload = {
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      age: user.age,
      email: user.email,
    };
    const token = generateToken(userPayload);
    res.cookie("authCookie", token, { maxAge: 600000, httpOnly: true });
    res.status(200).json({ message: "Inicio aceptado" });
  })(req, res, next);
});

router.post("/user/register", (req, res, next) => {
  passport.authenticate("register", (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: err });
    }
    if (!user) {
      return res.status(400).json({ message: info.message });
    }
    res.status(201).json({
      message: "Usuario creado correctamente",
      payload: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        age: user.age,
        email: user.email,
      },
    });
  })(req, res, next);
});
router.get("/user/check", async (req, res) => {
  try {
    const email = req.query.email;
    const checkEmail = await managerUser.checkEmail(email);
    if (checkEmail) return res.json({ exists: true });
    res.json({
      exists: false,
      message: "os datos ingresados no son correstos",
    });
  } catch (err) {
    res.status(500).json({ message: "Error en el servidor", err: err.message });
  }
});
router.get("/logout", (req, res) => {
  res.clearCookie("authCookie", { httpOnly: true });
  res.redirect("/login");
});
router.post("/user/update", async (req, res) => {
  const { email, password} = req.body;

  if (!email || !password) {
    return res.status(400).json({message: "Completa todos los campos"});
  }
  try {
    const user = await managerUser.checkEmail(email);
    if (!user) {
      return res.status(404).json({message: "Usuario no encontrado"});
    }
    const newPasswordHash = createHash(password);
    await managerUser.updateUser(user._id, { password: newPasswordHash });
    res.status(200).json({ message: "la contrasena de modifico", email: user.email });
  } catch (err) {
    res.status(500).json({message: `Error del servidor: ${err.message}`});
  }
});
export default router;
