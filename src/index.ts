import express, { Request,Response }  from "express";
const app = express()
const port : number = 3000

app.use(express.json());

import { Rule } from "./Validation/Rule";

const postw = new Rule({
    id:[
        {
            type:"mongoid"
        }
    ]
})

app.post('/',postw.apply(),postw.showValidationErrors(),(req: Request, res : Response) => {
    // @ts-ignore
    res.json({ "a":"HELLO" })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})