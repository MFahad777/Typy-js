const { Rule, Validation } = require("../../dist");

const request = require("supertest");

const {
    app,
    setRoute
} = require("../config");

describe("Array Not Empty Validation Rule",  () => {

    it("array not empty",async () => {

        const createUserRule = new Rule({
            skills:[
                Validation.arrayNotEmpty({
                    message:"The array can not be empty"
                })
            ],
            "skills.*":[            // To validate every element in the array use "<field>.*"
                Validation.isString()
            ]
        });

        setRoute("post","/arrayNotEmpty-createUserRule",createUserRule);

        const response = await request(app)
            .post("/arrayNotEmpty-createUserRule")
            .send({ skills:[] });

        expect(response.statusCode).toEqual(400);
        expect(response.body.errors[0].msg).toEqual('The array can not be empty');
        expect(response.body.errors[0].location).toEqual('body');
        expect(response.body.errors[0].path).toEqual('skills');
    })
})