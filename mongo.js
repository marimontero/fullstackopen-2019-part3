require('dotenv').config()
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const url = `mongodb+srv://marimontero:${process.env.MONGODB_URI}@cluster0-tnsll.mongodb.net/test?retryWrites=true&w=majority`;

mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true })

const PhonebookSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
    unique: true
  },
  number: {
    type: String,
    minlength: 8,
    required: true
  }
})

PhonebookSchema.plugin(uniqueValidator)

PhonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Phonebook = mongoose.model('Phonebook', PhonebookSchema)
module.exports = Phonebook
