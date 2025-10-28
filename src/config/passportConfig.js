import passport from "passport";
import local from "passport-local";
import userManager from "../manager/userManager.js";
import { createHash, isValidatePassword } from "../utils/index.js";
import jwt, { ExtractJwt } from "passport-jwt";
const managerUser = new userManager();
const JWTStrategy = jwt.Strategy,
  ExtractJWT = jwt.ExtractJwt;
const JWT_SECRET = "csistemas";
const localStrategy = local.Strategy;
export const initializePassport = () => {
  passport.use(
    "register",
    new localStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          const userFound = await managerUser.checkEmail(username);
            if (userFound) {
              
            return done(null, false, {
              message: "El usuario ya existe",
            });
          }
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
          };
          const user = await managerUser.createUser(newUser);
          return done(null, user);
        } catch (err) {
          return done(`Error al crear el usuario ${err.message}`, false);
        }
      }
    )
  );
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: JWT_SECRET,
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    const user = await managerUser.userById(id);
    done(null, user);
  });
};
const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["authCookie"];
  }
  return token;
};
