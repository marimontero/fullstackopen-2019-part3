const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(bodyParser.json())
app.use(cors())

morgan.token('content-body', (request, response) => {
  return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content-body'))

let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1
  },
  {
    name: 'Adam Lovelace',
    number: '39-44-5323523',
    id: 2
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: 4
  },
  {
    name: 'Maria Montero',
    number: '34-65-63598119',
    id: 5
  }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const responseTime = new Date().toString()
  response.send(
    `
     <p>Phonebook has info for ${persons.length} people</p>
     <p>${responseTime}</p>
    `
  )
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

//New persons

app.post('/api/persons', (request, response) => {

  const nameExisted = persons.some(
    person => person.name.toLowerCase() === request.body.name.toLowerCase()
  )

  if (!request.body.name || !request.body.number) {
    return response.status(400).json({
      error: 'The name or number is missing'
    })
  } else if (nameExisted) {
    return response.status(400).json({
      error: 'The name already exists, it most be unique'
    })
  }

  const id = Math.floor(Math.random() * 10000)
  const person = {
    name: request.body.name,
    number: request.body.number,
    id
  }
  persons = persons.concat(person)
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})