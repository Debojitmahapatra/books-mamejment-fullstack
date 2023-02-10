const bookModel = require("../Models/bookModel");
const userModel = require("../Models/userModel");
const jwt = require("jsonwebtoken");

const createUser = async function (req, res) {

  try {
    res.setHeader('Access-Control-Allow-Origin', '*')
    let data = req.body;
    let createUser = await userModel.create(data);
    res.status(201).send({ status: true, message: 'Success', data: createUser })

  }
  catch (err) {
    res.status(500).send({ error: err.message })
  }

}
// ===================================================[loginUser]================================================================

const loginUser = async function (req, res) {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*')
    let userName = req.body.email;
    let password = req.body.password;
  //   let users = await userModel.findById({ email: userName})
  // console.log(users)
  //  userName=userName.trim()
  //   password=password.trim()
  if (!userName) { return res.status(400).send({ status: false, message: "Please enter your userName" }) }
  if (!password) { return res.status(400).send({ status: false, message: "Please enter your password" }) }

    let user = await userModel.findOne({ email: userName, password: password }).select("-password")
    
    if (!user)
      return res.status(400).send({
        status: false,
        message: "username or the password is not corerct",
      });
    let token = jwt.sign(
      {
        userId: user._id.toString(),

      },
      "functionup-radon", { expiresIn: '2d' }
    );
    res.setHeader("authorization", token);
    res.status(200).send({ status: true,user,auth: token, message:"User Loggedin Successfully" });
  }
  catch (err) {
    console.log("This is the error :", err.message)
    res.status(500).send({ message: "Error", error: err.message })
  }
}
module.exports = {createUser, loginUser}