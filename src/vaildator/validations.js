const bookModel = require("../Models/bookModel");
const userModel = require("../Models/userModel");
const mongoose = require('mongoose');

let email1 = /^[a-zA-Z][a-zA-Z0-9\-\_\.]+@[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,3}$/;
const validPassword = /^[a-zA-Z0-9'@&#.\s]{8,15}$/;
let mobile1 = /^[0]?[6789]\d{9}$/;
let pin = /^[1-9][0-9]{5}$/
let price1=/^(0|[1-9]\d*)(\.\d+)?$/
let matchName = /(^[A-Za-z]{3,16})([ ]{0,1})([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})/
let isbn = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/
let yearFormet = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/
let validCity = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/




let checkBody = async function (req, res, next) {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) { return res.status(400).send({ status: false, message: "Bad request- Please enter details in the request Body " }) }
        next()
    }
    catch (err) {
        res.status(500).send({ error: err.messsage })
    }
}

function x(data) {
    if (!data || data == null || data === undefined || data.trim() == 0) return false;
    return true
}

const validUserModel = async function (req, res, next) {
    try {
        res.setHeader('Access-Control-Allow-Origin', '*')
        let data = req.body

        let check = data.title
       
        if (!check) { return res.status(400).send({ status: false, message: "Please enter your Title" }) }

        let check2 = ["Mr", "Mrs", "Miss"]
        let checkEnum = await check2.find(element => element == check)
        if (!checkEnum) { return res.status(400).send({ status: false, message: "Enter your Title from this Only [Mr, Mrs,Miss]" }) }

        let name = data.name;
        
        if (!x(name)) return res.status(400).send({ status: false, message: "Please enter Name" })
        if (!matchName.test(name)) return res.status(400).send({ status: false, message: "Please Enter Valid name" })

        let phone = data.phone;
        if (!phone) return res.status(400).send({ status: false, message: "Please enter phone no" })
        if (!mobile1.test(phone)) return res.status(400).send({ status: false, message: "Please Enter Valid Mobile Number" })


        let email = data.email;
        
        if (!x(email)) return res.status(400).send({ status: false, message: "Please enter email" })
        if (!email1.test(email)) return res.status(400).send({ status: false, message: "Please Enter Valid email" })

        let password = data.password;
        if (!x(password)) return res.status(400).send({ status: false, message: "Please enter password" })
        if (!validPassword.test(password)) return res.status(400).send({ status: false, message: "password Strength is Weak" })

        let address = data.address
        if (address) {
            let street = address.street
            let city = address.city
            let pincode = address.pincode

            if (!x(street)) return res.status(400).send({ status: false, message: "Please enter street" })
            if (!x(city)) return res.status(400).send({ status: false, message: "Please enter city" })
            if (!validCity.test(city)) return res.status(400).send({ status: false, message: "Please Enter Valid city name" })

            if (!pincode) return res.status(400).send({ status: false, message: "Please enter pincode" })
            if (!pin.test(pincode)) return res.status(400).send({ status: false, message: "Please Enter Valid pincode" })

        }

        let usedmobile = await userModel.findOne({ phone: phone })
        if (usedmobile) return res.status(400).send({ status: false, message: "This mobile number has already been used" })
        let usedemail = await userModel.findOne({ email: email })
        if (usedemail) return res.status(400).send({ status: false, message: "This emailId has already been used" })

        next()
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
}


let validBookModel = async function (req, res, next) {
    try {
        res.setHeader('Access-Control-Allow-Origin', '*')
        let data = req.body

        let title = data.title
       
        if (!x(title)) { return res.status(400).send({ status: false, message: "Please enter your Title" }) }
         
        let price=data.price
        if (!x(price)) { return res.status(400).send({ status: false, message: "Please enter your price" }) }
        if (!price1.test(price)) return res.status(400).send({ status: false, message: "Please Enter Valid price" })

        let excerpt = data.excerpt;
        if (!x(excerpt)) return res.status(400).send({ status: false, message: "Please enter excerpt" })
        


        let userId = data.userId
        
        if (!userId) return res.status(400).send({ status: false, message: "Please enter userId" })
        if (!mongoose.isValidObjectId(userId)) { return res.status(400).send({ status: false, message: "invalid user id,Please Enter Valid userId" }) }
        

        let ISBN = data.ISBN
        
        if (!ISBN) return res.status(400).send({ status: false, message: "Please enter ISBN no" })
        if (!isbn.test(ISBN)) return res.status(400).send({ status: false, message: "Please Enter Valid ISBN Number" })
    

        let category = data.category
        if (!x(category)) return res.status(400).send({ status: false, message: "Please enter category" })

        let subcategory = data.subcategory
        if (!x(subcategory)) return res.status(400).send({ status: false, message: "Please enter subcategory" })

        // let releasedAt = data.releasedAt
        // releasedAt=Date.now()
        // console.log(releasedAt);
        // if (!releasedAt) return res.status(400).send({ status: false, message: "Please enter released date" })
        // if (!yearFormet.test(releasedAt)) return res.status(400).send({ status: false, message: "Please Enter year formet of yyyy-mm-dd" })

        // let bookCover=data.bookCover
        // if(!bookCover) return res.status(400).send({ status: false, message: "Please enter bookCover" })

        let usedTitle = await bookModel.findOne({ title: title })
        if (usedTitle) return res.status(400).send({ status: false, message: "This title has already been used" })

        let checkUserId = await userModel.findById(userId)
        if (!checkUserId) return res.status(404).send({ status: false, message: "No such User exists" })

        let usedISBN = await bookModel.findOne({ ISBN: ISBN })
        if (usedISBN) return res.status(400).send({ status: false, message: "This ISBN has already been used" })


        next()
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
}


module.exports = {
    checkBody, validUserModel, validBookModel
}