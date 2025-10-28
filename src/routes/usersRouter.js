import { Router } from "express";
import userManager from "../manager/userManager.js";

const managerUser = new userManager()
const router = Router();

router.get("/",  (req, res) => { 
    res.status(200).json({ message: 'Estamos ok' });
})
router.post("/", async (req, res) => {
    const { first_name, last_name, email } = req.body;
    if (!last_name || !first_name || !email) return res.status(400).json({ error: 'datos no compatibles'});
    try {
        const existEmail = await managerUser.checkEmail(email)
        if (existEmail) return res.status(409).json({ error: "el email ya existe"})
        const newUser = {first_name: first_name, last_name: last_name, email: email}
      const user = await managerUser.createUser(newUser);
      res.status(201).json({message: `Usuario creado`, payload: user})
  } catch (err) {
      console.log(`error ${err.message}`);
      
  }
});




export default router