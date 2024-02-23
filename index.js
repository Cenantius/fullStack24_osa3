// Täytyy ottaa käyttöön ennen modelin person importtaamista
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./models/person')

const app = express()

// express.staticin kutsuminen siirretty ensimmäiseksi 
// viimeisestä
app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

morgan.token('body', req => {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// Tämän jos poistaa niin sattuu!!
let persons = [
    {
        id: 1,
        name: "Harri Harkimo",
        number: "050-3827481"
    },
    {
        id: 2,
        name: "Tohtori Koira",
        number: "040-1238572"
    },
    {
        id: 3,
        name: "Mikko Kuustonnine",
        number: "014-2746736"
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
    res.json(persons)
    })
})

app.get('/api/persons/:id', (req, res, next) => {

    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person)
            } else {
                res.status(404).end()
            }
        })
        // Siirretään virhetilanteen käsittely eteenpäin
        // funktiolla next
        .catch(error => next(error))

    /* VANHA TOTEUTUS
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
    */
})

// MUUTETTU KURSSIN VERSIOSTA ISOKSI RANDOM POOLIKSI
const generateId = () => {
    const maxId = Math.floor(Math.random() * (1000 - 1) + 1)
    return maxId
}

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'name or number missing'
        })
    }

    // some() -funktio kertoo onko kohteessa haettava
    if (persons.some(person => person.name === body.name)) {
        return res.status(400).json({
            error: 'name must be unique!'
        })
    }

    // Toisin kuin luentomateriaalissa. Tässä funktiossa on
    // edelleen id: generateId -toiminnallisuus
    const person = new Person({
        id: generateId(),
        name: body.name,
        number: body.number
    })

    // Tämä testissä, koska luentomateriaalissa ei ollut
    // persons = persons.concat(person)

    // Pyyntöön vastataan save -takaisinfunktion sisällä,
    // jotta operaation vastaus tapahtuu vain, jos operaatio
    // on onnistunut
    person.save().then(savedPerson => {
        res.json(savedPerson)
    })
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${Date()}</p>`)
})

const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id'})
    }

    next(error)
}

// Pitää ottaa käyttöön vasta kaikkien muiden middlewarejen
// ja routejen rekisteröinnin jälkeen
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
})

