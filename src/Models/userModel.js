const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      enum: ['Mr', 'Mrs', 'Miss']
    },
  
    name: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      type : String,
      require: true
  },

    phone: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      trim: true
    },

    address: {
      street: { type: String,trim:true },
      city: { type: String,trim:true },
      pincode: { type: String,trim:true },
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);