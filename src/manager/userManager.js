import userModel from "./models/usersModel.js";

class userManager { 
    async allUser() { 
       return await userModel.find() 
    }
    async createUser(data) { 
        return await userModel.create(data)
    }
    async checkEmail(email) { 
        return await userModel.findOne({email: email})
    }
}
export default userManager