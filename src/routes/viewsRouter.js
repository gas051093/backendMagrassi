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
router.get("/profile", (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.redirect("/login");
    res.render("./profile", { user: user.user });
  })(req, res, next);
});
export default router;
