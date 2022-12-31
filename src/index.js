const express = require('express')
const app = express()
const port = 3000

app.use(express.json());

const Rule = require("../Validation/Rule");

const postw = new Rule({
    first_name:[
        {
            type:"array",
            params: {
                min:1,
                max:5
            }
        }
    ],
    age:[
        {
            type:"integer"
        }
    ]
})

app.post('/',postw.apply(),postw.showValidationErrors(),(req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})