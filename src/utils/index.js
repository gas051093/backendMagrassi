import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = "csistemasapp"
export const createHash = (password) => { 
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
} 
export const isValidatePassword = (password, hash) => { 
    return bcrypt.compareSync(password, hash);
}
export const generateToken = (user) => {
    return jwt.sign({user}, JWT_SECRET, {expiresIn:"1h"})
}

export const verifyToken = (token) => { 
    try {
        return jwt.verify(token, JWT_SECRET)
    } catch (err) {
        return null
    }
}