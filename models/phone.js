const mongoose = require('mongoose')

// const password = process.argv[2]
const password = 1234

const url = `mongodb+srv://plokm1234:${password}@phonebook.8wfirk5.mongodb.net/phonebook_database?retryWrites=true&w=majority`

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const phoneSchema = new mongoose.Schema({
    name: {
       type: String,
       required: true,
       minLength: 3
    },
    number: {
        type: String,
        required: true,
        minLength: 8,
        validate: {
            validator: function(v) {
              return /\d{2}|\d{3}-\d/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
          },
    }
})

phoneSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Phone', phoneSchema)