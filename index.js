require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Phonebook = require('./mongo')

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('content-body', (request, response) => {
  return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content-body'))

//Persons GET
app.get('/api/persons', (request, response, next) => {
  Phonebook.find({}).then(personsbd => {
    response.json(personsbd)
  })
  .catch(error => next(error))
})

//Info GET
app.get('/info', (request, response) => {
  const responseTime = new Date().toString()
  response.send(
    `
     <p>Phonebook has info for ${persons.length} people</p>
     <p>${responseTime}</p>
    `
  )
})

//Person id GET
app.get('/api/persons/:id', (request, response, next) => {

  Phonebook.findById(request.params.id)
    .then(result => {
      if (result) {
        response.json(result.toJSON())
      } else {
        response.status(404).send({error: 'User not found'})
      }
    })
    .catch(error => next(error))
})

//Person POST
app.post('/api/persons', (request, response, next) => {

  if (!request.body.name || !request.body.number) {
    return response.status(400).send({
      error: 'The name or number is missing'
    })
  }

  const person = new Phonebook({
    name: request.body.name,
    number: request.body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson.toJSON())
  })
  .catch(error => next(error))
})

//Delete
app.delete('/api/persons/:id', (request, response, next) => {
  Phonebook.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

//PUT
app.put('/api/persons/:id', (request, response, next) => {

  const person = {
    name: request.body.name,
    number: request.body.number
  }

  Phonebook.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(result => {
      response.json(result.toJSON())
    })
    .catch(error => next(error))
})

//Error Handler
const errorHandler = (error, request, response, next) => {
  console.error('errorHandler: ', error.message)
  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})