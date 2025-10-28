import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.render("home");
});
router.get("/register", (req, res) => { 
    res.render("register")
})
router.get("/login", (req, res) => {
  res.render("login");
});
router.get("/update", (req, res) => {
  res.render("update");
});
export default router;
