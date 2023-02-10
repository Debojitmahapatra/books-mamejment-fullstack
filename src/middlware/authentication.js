const jwt = require('jsonwebtoken')
const bookModel = require('../Models/bookModel')
const userModel = require("../Models/userModel");

const mongoose = require('mongoose');



const authentication = function (req, res, next) {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*')
    let token = req.headers["authorization"]
    if (!token)
      return res.status(400).send({ status: false, message: "token must be present" })

   jwt.verify(token, "functionup-radon", (err, user) => {
      if (err)
        return res.status(401).send({ message: "invalid token" });
       req.user = user;
      //  console.log(user)

      next();
    });
  }
  catch (err) {
    res.status(500).send(err.message)
  }
}


let authoriseParams = async function (req, res, next) {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*')
    let bookId = req.params.bookId
    
    if (!bookId) { return res.status(400).send({ status: false, message: "BookId is require" }) }
    bookId=bookId.trim()
    if (!mongoose.isValidObjectId(bookId)) { return res.status(400).send({ status: false, message: "invalid bookId" }) }
    let data1 = await bookModel.findById({ _id: bookId }).select({ userId: 1, _id: 0 })

    if (!data1) { return res.status(404).send({ status: false, message: "bookId doesnot exists" }) }
    let userId = data1.userId.valueOf()
    let userId1 = req.user.userId
    //let d = userId
    if (userId1 != userId)
      return res.status(403).send({ status: false, message: "Not allowed to modify another data" })

    next()
  }
  catch (err) {
    res.status(500).send({ error: err.messsage })
  }
}


let authoriseBook = async function (req, res, next) {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*')
    let userId = req.body.userId
    userId = userId.trim()

    if (!mongoose.isValidObjectId(userId)) { return res.status(400).send({ status: false, message: "invalid user id" }) }
    let data = await userModel.findById({ _id: userId })

    if (!data) { return res.status(404).send({ status: false, message: "userId doesnot exists" }) }

    let userId1 = req.user.userId
    if (userId != userId1)
      return res.status(403).send({ status: false, message: "Not allowed to modify another data" })

    next()
  }
  catch (err) {
    res.status(500).send({ error: err.messsage })
  }

}


module.exports = { authoriseParams, authoriseBook, authentication }
