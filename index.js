const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Phone = require('./models/phone')
// let persons = [
//     { 
//       "id": 1,
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": 2,
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": 3,
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": 4,
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]

app.use(express.static('build'))
app.use(cors())
morgan.token('custom', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :response-time :custom'))
app.use(express.json())

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  // response.json(persons)
  Phone.find({}).then(phones => {
    console.log(response)
    response.json(phones)
  })
})

app.get('/api/info', async (request, response) => {
  let length

  await Phone.find({}).then(phones => {
    length = phones.length
  })

  response.write(`<h1>Phonebook has info for ${length} people</h1>`)
  response.write('\n')
  response.write(`${new Date()}`)
  response.end()
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  // const person = persons.find(person => person.id == id)

  // if (person) {
  //     response.json(person)
  //   } else {
  //     response.status(404).end()
  //   }
  Phone.findById(id).then(phone => {
    if(phone){
      response.json(phone)
    }else{
      response.status(404).end()
    }
  })
    // .catch(error => {
    //   console.log(error)
    //   response.status(400).send({ error: 'malformatted id' })
    // })
    .catch(error => next(error))
})

app.post('/api/persons/', (request, response, next) => {
  const temp = request.body
  if (temp === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }
  let existence = 0

  // persons.forEach(
  //   (person) => {
  //     if(person.name === temp.name){
  //       existence = 1
  //     }
  //   }
  // )

  if(existence == 1){
    response.status(500).send({ error: 'name must be unique' }).end()
  }else if (temp.name == null || temp.number == null){
    response.status(500).send({ error: 'name / number must not be null' }).end()
  }else if(temp.name && temp.number){
    // const newPerson = {}
    // newPerson.id = Math.floor(Math.random() * 100)
    // newPerson.name = temp.name
    // newPerson.number = temp.number
    // persons = persons.concat(newPerson)

    // response.end()
    
    const phone = new Phone({
      name: temp.name,
      number: temp.number
    })
    
    phone.save().then(res => {
      response.json(res)
    })
      .catch(error => {
        console.log(error.response)
        next(error)
      })
  }
    
})

app.delete('/api/persons/:id', (request, response, next) => {
  // const id = Number(request.params.id)
  // persons = persons.filter(person => person.id !== id)

  // response.status(204).end()
  Phone.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  
  const phone = {
    name: body.name,
    number: body.number,
  }
  
  Phone.findByIdAndUpdate(
    request.params.id, phone, { new: true, runValidators: true })
    .then(updatedPhone => {
      response.json(updatedPhone)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  
  next(error)
}
  
// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
