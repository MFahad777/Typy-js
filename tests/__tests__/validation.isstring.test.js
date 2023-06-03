const { Rule, Validation } = require("../../dist");

const request = require("supertest");

const {
    app,
    setRoute
} = require("../config");

describe("Is String Validation Rule",  () => {

    it("Check if the field is of type string",async () => {

        const createUserRule = new Rule({
            name:[
                Validation.isString({
                    message:"The :attribute must be of type string"
                })
            ]
        });

        setRoute("post","/is-string-createUserRule",createUserRule);

        const response = await request(app)
            .post("/is-string-createUserRule")
            .send({ name:5 });

        expect(response.statusCode).toEqual(400);
        expect(response.body.errors[0].msg).toEqual('The name must be of type string');
        expect(response.body.errors[0].location).toEqual('body');
        expect(response.body.errors[0].path).toEqual('name');
    })

    it("Check if the field is of type string and has min character of 5 and maximum characters of 10",async () => {

        const createUserRule = new Rule({
            name:[
                Validation.isString({
                    message:"The :attribute must be of type string and must have :min and :max string length",
                    params:{
                        min:5,
                        max:10
                    }
                })
            ]
        });

        setRoute("post","/is-string-2-createUserRule",createUserRule);

        const response = await request(app)
            .post("/is-string-2-createUserRule")
            .send({ name:"Bob" });

        expect(response.statusCode).toEqual(400);
        expect(response.body.errors[0].msg).toEqual('The name must be of type string and must have 5 and 10 string length');
        expect(response.body.errors[0].location).toEqual('body');
        expect(response.body.errors[0].path).toEqual('name');
    })
})