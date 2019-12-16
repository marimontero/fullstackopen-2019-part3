const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

mongoose.connect(url, { useNewUrlParser: true })

const PhonebookSchema = new mongoose.Schema({
  name: String,
  number: String
})

PhonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Phonebook = mongoose.model('Phonebook', PhonebookSchema)

module.exports = Phonebook
