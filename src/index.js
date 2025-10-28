import express from 'express';
import MongoStore from "connect-mongo";
import { engine } from "express-handlebars";
import session from "express-session";
import cookieParser from "cookie-parser";
import viewsRouter from "./routes/viewsRouter.js";
import usersRouter from './routes/usersRouter.js'
import connectDb from './config/db.js';
import passport from 'passport';
import { initializePassport } from './config/passportConfig.js';

const app = express();
const PORT = 3000
const url =
  "mongodb+srv://csistemasApp:14025843@cluster0.amq8wip.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const secret = "csistemas";
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: url,
      ttl: 60000,
    }),
    secret,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("hbs", engine({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.set("views", "./src/views");
app.use(express.static("./src/public"));
app.use("/", viewsRouter);
app.use('/', usersRouter)
app.use((req, res, next) => { 
    res.status(404).send("Pagina no encontrada")
})
initializePassport()
app.use(passport.initialize())
app.use(passport.session())
connectDb(
  "mongodb+srv://csistemasApp:14025843@cluster0.amq8wip.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  "csistemas"
);
app.listen(PORT, () => { 
    console.log(`Server online http://localhost:${PORT}`)
})