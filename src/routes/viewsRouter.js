import { Router } from "express";
import { verifyToken } from "../utils/index.js";
const router = Router();

router.get("/", (req, res) => {
  res.render("home");
});
router.get("/register", (req, res) => {
  res.render("register");
});
router.get("/login", (req, res) => {
  res.render("login");
});
router.get("/update", (req, res) => {
  res.render("update");
});
router.get("/profile", (req, res) => {
  const token = req.cookies?.authCookie;
  if (!token) return res.redirect("/login");
  try {
    const user = verifyToken(token);
    res.render("profile", { user: user.user });
  } catch (err) {
    return res.redirect("/login");
  }
});
export default router;
