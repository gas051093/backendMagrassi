import express from 'express';
import { engine } from "express-handlebars";
import viewsRouter from "./routes/viewsRouter.js";
import usersRouter from './routes/usersRouter.js'
import connectDb from './config/db.js';
const app = express();
const PORT = 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("hbs", engine({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.set("views", "./src/views");
app.use(express.static("./src/public"));
app.use("/", viewsRouter);
app.use((req, res, next) => { 
    res.status(404).send("Pagina no encontrada")
})

connectDb(
  "mongodb+srv://csistemasApp:14025843@cluster0.amq8wip.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  "csistemas"
);
app.listen(PORT, () => { 
    console.log(`Server online http://localhost:${PORT}`)
})