const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },


});


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();  
    console.log("Hashing password for:", this.email);

   // const salt = await bcrypt.genSalt(10);  
   // this.password = await bcrypt.hash(this.password, salt);

   // console.log("Hashed Password Saved:", this.password); 
    next();
});


userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_PRIVATE_KEY, { expiresIn: "30m" });
};

const User = mongoose.model("User", userSchema);


const validate = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().required().label("First Name"),
        lastName: Joi.string().required().label("Last Name"),
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("Password")
        
    });
    return schema.validate(data);
};

module.exports = { User, validate };

