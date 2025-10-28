import { Router } from "express";
import { verifyToken } from "../utils/index.js";
import passport from "passport";
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
router.get("/profile", passport.authenticate('jwt', {session: false}), (req, res) => {
  res.render('./profile', { user: req.user.user})
});
export default router;
