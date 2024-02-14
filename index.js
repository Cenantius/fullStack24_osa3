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

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

const PORT = 3001
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
})
