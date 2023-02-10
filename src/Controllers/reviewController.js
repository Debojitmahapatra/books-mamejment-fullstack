const bookModel = require("../Models/bookModel");
const userModel = require("../Models/userModel");
const mongoose = require('mongoose')
const reviewModel = require("../models/reviewModel")
let matchName = /(^[A-Za-z]{3,16})([ ]{0,1})([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})/

//=====================================CREATE REVIEW=============================================//

function x(data) {
    if (!data || data == null || data === undefined) return false;
    return true
}

const createReview = async function (req, res) {

    try {
        res.setHeader('Access-Control-Allow-Origin', '*')
        let data = req.body;

        let bookId = req.params.bookId
      

        if (!bookId) { return res.status(400).send({ status: false, message: "BookId is require" }) }
        bookId = bookId.trim()
        if (!mongoose.isValidObjectId(bookId)) { return res.status(400).send({ status: false, message: "invalid bookid" }) }

        const checkbook = await bookModel.findOne({_id:bookId,isDeleted:false})
        if (!checkbook) return res.status(404).send({ status: false, message: "No book found" })

        let rating1 = data.rating

        if (!(rating1 >= 1 && rating1 <= 5)) return res.status(404).send({ status: false, message: "Enter a valid reting" })

        let review = data.review
      //  review = review.trim()
        if (!x(review)) return res.status(400).send({ status: false, message: "Enter your's review " })

        if (!x(rating1)) return res.status(400).send({ status: false, message: "Enter your's rating " })
        if (!x(data.name)) return res.status(400).send({ status: false, message: "Please enter Name" })
        if (!matchName.test(data.name)) return res.status(400).send({ status: false, message: "Please Enter Valid name" })
        let newData = {
            bookId: bookId,
            reviewedBy: data.userId,
            reviewedAt: Date.now(),
            rating: data.rating,
            review: data.review,
            name:data.name,
            bookName: checkbook.title,
            bookImage: checkbook.image,

        }
        let createReview = await reviewModel.create(newData);
        // let finelResult = await reviewModel.findOne({ _id: createReview._id }).select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })
        const countReview = await reviewModel.find({bookId:bookId,isDeleted:false}).count()
      await bookModel.findByIdAndUpdate({_id:bookId},{$set:{reviews:countReview}})
      let newdata = await reviewModel
        .find(createReview)
        .select({ isDeleted: 0, updatedAt: 0, createdAt: 0, __v: 0 });
        res.status(201).send({ status: true, message: 'review recorded successfully', data: newdata })
       
        
        

    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }

}

const updatedReviewById = async function (req, res) {


    try {
        res.setHeader('Access-Control-Allow-Origin', '*')
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId;
        console.log(bookId)
        console.log(reviewId)
        bookId = bookId.trim()
        reviewId = reviewId.trim()
        let {review,rating,reviewedBy}=req.body
       
        //bookId validation
        if (!bookId) return res.status(400).send({ status: false, message: "Please give book id" });
        if (!mongoose.isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "Book Id is Invalid !!!!" })

        //bookId exist in our database
        const findBook = await bookModel.findOne({ _id: bookId, isDeleted: false }); //check id exist in book model
        if (!findBook) return res.status(404).send({ status: false, message: "BookId dont exist" });

        //review-
        if (!mongoose.isValidObjectId(reviewId)) return res.status(400).send({ status: false, message: "Review Id is Invalid !!!!" })

        const findReview = await reviewModel.findOne({ _id: reviewId, bookId: bookId, isDeleted: false, }); //check id exist in review model
        if (!findReview) return res.status(404).send({ status: false, message: "reviewId dont exist or deleted" });

        const updateReview = await reviewModel.findByIdAndUpdate({ _id: reviewId, bookId: bookId, isDeleted: false },{ $set: {review:review,rating:rating,reviewedBy:reviewedBy}}, { new: true });
       // let finelResult = await reviewModel.findOne({ _id: createReview._id }).select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })
        const countReview = await reviewModel.find({bookId:bookId,isDeleted:false}).count()

        let finalResult = {
            title: findBook.title, excerpt: findBook.excerpt, userId: findBook.userId, category: findBook.category, subcategory: findBook.subcategory,
            isDeleted: findBook.isDeleted, reviews:countReview , releasedAt: findBook.releasedAt, createdAt: findBook.createdAt, updatedAt: findBook.updatedAt, reviewData: updateReview
        }
        res.status(200).send({ status: true, message: 'Success', data: finalResult })       
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};

const deleteReview = async function (req, res) {


    try {
        res.setHeader('Access-Control-Allow-Origin', '*')
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId;
        bookId = bookId.trim()
        reviewId = reviewId.trim()
        //bookId validation
        if (!bookId) return res.status(400).send({ status: false, message: "Please give book id" });
        if (!mongoose.isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "Book Id is Invalid !!!!" })

        //bookId exist in our database
        const findBook = await bookModel.findOne({ _id: bookId, isDeleted: false }); //check id exist in book model
        if (!findBook) return res.status(404).send({ status: false, message: "BookId dont exist" });

        //review-
        if (!mongoose.isValidObjectId(reviewId)) return res.status(400).send({ status: false, message: "Review Id is Invalid !!!!" })

        const findReview = await reviewModel.findOne({ _id: reviewId, bookId: bookId, isDeleted: false, }); //check id exist in review model
        if (!findReview) return res.status(404).send({ status: false, message: "already deleted" });
   

        const decriseReview = await bookModel.findByIdAndUpdate({_id:bookId},{$inc:{reviews:-1}})

        const updateReview = await reviewModel.findByIdAndUpdate({ _id: reviewId, bookId: bookId }, { isDeleted: true }, { new: true });
       if(updateReview){
        res.status(200).send({ status: true, message: 'Successfully Deleted'})       
       }
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};
async function GetReviewById (req, res){

    let id = req.params.bookId
 
     console.log(id)
    let result = await reviewModel.find({ bookId: id })
    console.log(result)
    if(result.length>0){
      return res.status(200).send(result)
    
    }else{
      return res.status(400).send({
        status: false,
        message: "No review yet",
      });
    }
  }
  
  
  async function GetReviewByUserId (req, res){
  
    let id = req.params.userId

  
    let result = await reviewModel.find({ reviewedBy: id , isDeleted: false })
   
    if(result.length==0){
      return res.status(400).send({
        status: false,
        message: "No review yet",
      });
    }else{
      return res.status(200).send(result)
    }
  }
  
module.exports = { createReview, updatedReviewById, deleteReview,GetReviewByUserId,GetReviewById }