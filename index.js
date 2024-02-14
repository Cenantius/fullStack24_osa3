const express = require('express')
const app = express()

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
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${Date()}</p>`)
})

const PORT = 3001
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
})
