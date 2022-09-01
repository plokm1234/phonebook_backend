const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


  app.use(cors())
  morgan.token('custom', function (req, res) { return JSON.stringify(req.body) })
  app.use(morgan(':method :url :status :response-time :custom'));
  app.use(express.json())

  app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })

  app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

  app.get('/api/info', (request, response) => {
    response.write(`<h1>Phonebook has info for ${persons.length} people</h1>`)
    response.write(`\n`)
    response.write(`${new Date()}`)
    response.end()
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id == id)

    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
  })

  app.post('/api/persons/', (request, response) => {
    const temp = request.body
    let existence = 0

    persons.forEach(
      (person) => {
        if(person.name === temp.name){
          existence = 1
        }
      }
    )

    if(existence == 1){
      response.status(500).send({ error: 'name must be unique' }).end()
    }else if (temp.name == null || temp.number == null){
      response.status(500).send({ error: 'name / number must not be null' }).end()
    }else if(temp.name && temp.number){
      const newPerson = {}
      newPerson.id = Math.floor(Math.random() * 100)
      newPerson.name = temp.name
      newPerson.number = temp.number
      persons = persons.concat(newPerson)

      response.end()
    }
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