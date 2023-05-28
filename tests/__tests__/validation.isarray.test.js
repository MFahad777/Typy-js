const { Rule, Validation } = require("../../dist");

const request = require("supertest");

const {
    app,
    setRoute
} = require("../config");

describe("Is Array Validation Rule",  () => {

    it("Test if give 400 bad request on invalid payload",async () => {

        const createUser = new Rule({
            hobbies:[
                Validation.isArray()
            ]
        });

        setRoute("post","/create-user-rule",createUser);

        const response = await request(app)
            .post("/create-user-rule")
            .send({ hobbies:"A Title" })
            .set("Accept","application/json")

        expect(response.statusCode).toEqual(400);
        expect(response.body.errors[0].msg).toEqual('The hobbies must be of type array');
        expect(response.body.errors[0].location).toEqual('body');
        expect(response.body.errors[0].param).toEqual('hobbies');
    });

    it("Check if the field has minimum of 2 values",async () => {

        const createUser = new Rule({
            hobbies:[
                Validation.isArray({
                    message:"The field must be of type array and must have minimum of :min values",
                    params:{
                        min:2,
                    }
                })
            ]
        });

        setRoute("post","/create-user-rule-min",createUser);

        const response = await request(app)
            .post("/create-user-rule-min")
            .send({ hobbies:["A Title"] })
            .set("Accept","application/json")


        expect(response.statusCode).toEqual(400);
        expect(response.body.errors[0].msg).toEqual('The field must be of type array and must have minimum of 2 values');
        expect(response.body.errors[0].location).toEqual('body');
        expect(response.body.errors[0].param).toEqual('hobbies');
    })

    it("Check if the field can only have maximum of 2 values",async () => {

        const createUser = new Rule({
            hobbies:[
                Validation.isArray({
                    message:"The field must be of type array and must have maximum of :max values",
                    params:{
                        max:2,
                    }
                })
            ]
        });

        setRoute("post","/create-user-rule-max",createUser);

        const response = await request(app)
            .post("/create-user-rule-max")
            .send({ hobbies:["gaming","running","traveling","Another Hobby"] })
            .set("Accept","application/json")


        expect(response.statusCode).toEqual(400);
        expect(response.body.errors[0].msg).toEqual('The field must be of type array and must have maximum of 2 values');
        expect(response.body.errors[0].location).toEqual('body');
        expect(response.body.errors[0].param).toEqual('hobbies');
    })

})