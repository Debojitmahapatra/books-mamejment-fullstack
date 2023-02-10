


const bookModel = require("../Models/bookModel");
const userModel = require("../Models/userModel");
const mongoose = require('mongoose')
 const reviewModel=require("../models/reviewModel")


// ========================================[createBook]==============================================================
const createBook = async function (req, res) {

    try {
        res.setHeader('Access-Control-Allow-Origin', '*')
        let data = req.body;
        let {title, price, image, excerpt,userId, ISBN, category, subcategory}=data
        let releasedAt = data.releasedAt
        releasedAt=Date.now()
        console.log(releasedAt);
        let obj={title, price, image, excerpt,userId, ISBN, category, subcategory,releasedAt}
        let createBook = await bookModel.create(obj);
        res.status(201).send({ status: true, message: 'Success', data: createBook })

    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }

}

// =========================================[getBookByQuery]===============================================================


const validateString = function (name) {
    if (typeof name == undefined || typeof name == null) return false;
    if (typeof name == "string" && name.trim().length == 0) return false;
    return true;
};

let isValidObjectId = function (ObjectId) {
    return mongoose.isValidObjectId(ObjectId)
}
const getBooks = async function (req, res) {
    try {
        res.setHeader('Access-Control-Allow-Origin', '*')
        const queryData = req.query
        let obj = { isDeleted: false }
        if (Object.keys(queryData).length !== 0) {
        let { userId, category, subcategory } = queryData

            if (userId) {
                if (!isValidObjectId(userId)) { return res.status(400).send({ status: false, message: "Invalid userId" })}
                obj.userId = userId
            }
            if (category && validateString(category)) { obj.category = category}
            if (subcategory && validateString(subcategory)) { obj.subcategory = { $in: subcategory } }

        }
        let find = await bookModel.find(obj).select({ ISBN: 0, subcategory: 0, createdAt: 0, updatedAt: 0, __v: 0, isDeleted: 0 })
        find.sort(function(a,b){return a.title.localeCompare(b.title)})
        if (find.length == 0) {
            return res.status(404).send({ status: false, message: "No such book found" })
        }
        res.status(200).send({ status: true, message: "Book List", data: find })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

// =============================================[get-book-by-id]===========================================================================

const getBookById = async function (req, res) {

    try {
        res.setHeader('Access-Control-Allow-Origin', '*')
         let bookId = req.params.bookId
         bookId=bookId.trim()

         if(!bookId){ return res.status(400).send({status:false,message:"BookId is require"})}
         if (!mongoose.isValidObjectId(bookId)) { return res.status(400).send({ status: false, message: "invalid bookid" }) }
       
         const checkbook = await bookModel.findById(bookId)

         if (!checkbook) return res.status(404).send({ status: false, message: "No book found" })
      //  const {title,excerpt,userId,category,subcategory,isDeleted,reviews,releasedAt,createdAt,updatedAt} =checkbook
        const reviewData = await reviewModel.find({bookId:bookId,isDeleted:false})
        // const countReview = await reviewModel.find({bookId:bookId,isDeleted:false}).count()

        let finalResult = {
            _id:checkbook._id,
            title: checkbook.title,
            excerpt: checkbook.excerpt, 
            userId: checkbook.userId, 
            category: checkbook.category, 
            subcategory: checkbook.subcategory,
            ISBN:checkbook.ISBN,
            price:checkbook.price,
            image:checkbook.image,
            isDeleted: checkbook.isDeleted, 
            reviews:checkbook.reviews , 
            releasedAt: checkbook.releasedAt, 
            createdAt: checkbook.createdAt, 
            updatedAt: checkbook.updatedAt, 
            reviewsData: reviewData
        }

        return res.status(200).send({ status: true, message: 'Books ', data: finalResult });

    } catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
}



// ==============================================[updateBook]=================================================================

const updateBook = async (req, res) => {
    try {
        res.setHeader('Access-Control-Allow-Origin', '*')
        let Id = req.params.bookId
        

        if (!Id) return res.status(400).send({ status: false, message: "plz provide bookId" })
        Id=Id.trim()
        let data = req.body
        let { title, excerpt, releasedAt, ISBN,image,category, subcategory, price } = data
        

        if (Object.keys(data).length == 0)
            return res.status(400).send({ status: false, message: "Invalid Parameters" })

        if ((!mongoose.isValidObjectId(Id))) {
            return res.status(400).send({ status: false, message: "Book Id is Invalid" })
        }

        let book = await bookModel.findById(Id)
        if (!book) {
            return res.status(404).send({ status: false, message: `User with Id- ${Id} is not present in collection` })
        }
        if (book.isDeleted == true) {
            return res.status(404).send({ status: false, message: 'Document already deleted' })
        }
       if(title!=book.title){
        const titleExist = await bookModel.findOne({ title: title })
       
        if (titleExist) {
            return res.status(400).send({ status: false, message: "Title already exits" })
        }
    }
    if(ISBN!=book.ISBN){
        const isbnExist = await bookModel.findOne({ ISBN: ISBN })

        if (isbnExist) {
            return res.status(400).send({ status: false, message: "ISBN already exits" })
        }
    }
        let updatedBook = await bookModel.findOneAndUpdate(
            { _id: Id, isDeleted: false },
            {
                title: title,
                excerpt: excerpt,
                image:image,
                releasedAt: releasedAt,
                ISBN: ISBN,
                category:category,
                subcategory:subcategory,
                price:price
            }, { new: true },
        )
        return res.status(200).send({ status: true, message: 'Success', data: updatedBook })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}
// ==========================================[deleteBook]===============================================================
const deleteBook = async function (req, res) {
    try {
        res.setHeader('Access-Control-Allow-Origin', '*')
        let bookId = req.params.bookId
        
        bookId=bookId.trim()

        if (!mongoose.isValidObjectId(bookId)) { return res.status(400).send({ status: false, message: "invalid bookId,Please Enter Valid bookId" }) }

        let data = await bookModel.find({ _id: bookId, isDeleted: false })
        if (data.length > 0) {
            let DeleteBlog = await bookModel.findOneAndUpdate({ _id: bookId }, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true })
            res.status(200).send({ status: true, message: "successfully deleted", data: DeleteBlog })
        }
        else return res.status(404).send({ status: false, message: "already deleted" })
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
}
const searchByKey = async function (req, res) {
    try {
      let key = req.params.key
      let result = await bookModel.find(
        {isDeleted:false,
          "$or": [
            { title: { $regex: key } },
            { category: { $regex: key } },
            { price: { $regex: key } }
          ]
        }
      )
      if(result.length>0){
         return res.status(200).send(result)
      }
      else{
        return res.status(404).send({ status: false, message: "No match found" })
      }
    }
    catch (err) {
      res.status(500).send({ message: err.message })
    }
  }

  const getBookByUserId = async function(req, res){

    try{ 
      let id = req.user.userId
    
      let products =await bookModel.find({userId:id,isDeleted:false})
     
      if(products.length>0){
     return res
       .status(200)
       .send( products );
      }else{
     res.status(404).send({ status: false, msg: "No product found" });
    }
  
    }
  catch(err){
        res.status(500).send({message : err.message})
    }
  }

module.exports = { createBook, getBooks, getBookById, updateBook, deleteBook ,validateString, searchByKey,getBookByUserId}
