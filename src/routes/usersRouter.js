import { Router } from "express";
import userManager from "../manager/userManager.js";
import {
  createHash,
  generateToken,
  isValidatePassword,
} from "../utils/index.js";

const managerUser = new userManager();
const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "Estamos ok" });
});
router.post("/user/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userExist = await managerUser.checkEmail(email);
    if (userExist) {
      const isValid = isValidatePassword(password, userExist.password);
      if (isValid) {
        const userPayload = {
          id: userExist._id,
          first_name: userExist.first_name,
          last_name: userExist.last_name,
          age: userExist.age,
          email: userExist.email,
        };
          const token = generateToken(userPayload);
          res.cookie("authCookie", token, { maxAge: 600000, httpOnly: true });
          res.status(200).json({message: 'Inicio aceptado'})
      } else {
        res.status(401).json({ message: "Error de credenciales" });
      }
    } 
  } catch (err) {
    res.status(500).json({ message: "Error en el servidor", err: err.message });
  }
});
router.post("/user/register", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;
  if (!last_name || !first_name || !email || !age || !password)
    return res.status(400).json({ error: "datos no compatibles" });
  try {
    const existEmail = await managerUser.checkEmail(email);
    if (existEmail)
      return res.status(409).json({ error: "el email ya existe" });
    const password_hash = createHash(password);
    const newUser = {
      first_name,
      last_name,
      email,
      age,
      password: password_hash,
    };
    const user = await managerUser.createUser(newUser);
    res.status(201).json({ message: `Usuario creado`, payload: user });
  } catch (err) {
    res.status(500).json({ message: "Error en el servidor", err: err.message });
  }
});
router.get("/user/check", async (req, res) => {
  try {
    const email = req.query.email;
    const checkEmail = await managerUser.checkEmail(email);
    if (checkEmail) return res.json({ exists: true });
    res.json({ exists: false });
  } catch (err) {
    res.status(500).json({ message: "Error en el servidor", err: err.message });
  }
});
export default router;
