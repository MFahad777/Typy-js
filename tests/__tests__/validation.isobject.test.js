const { Rule, Validation } = require("../../dist");

const request = require("supertest");

const {
    app,
    setRoute
} = require("../config");

describe("Is Object Validation Rule",  () => {

    it("Test if give 400 bad request on invalid payload",async () => {

        const createUser = new Rule({
            user_data:[
                Validation.isObject() // Since this uses express-validator under the hood for detail please vist `https://express-validator.github.io/docs/api/validation-chain/#isobject`
            ],
            "user_data.id":[
                Validation.required(),
                Validation.integer()
            ],
            "user_data.name":[
                Validation.required(),
                Validation.isString() // check validation.isstring.test.js
            ]
        });

        setRoute("post","/isobject-user-rule",createUser);

        const response = await request(app)
            .post("/isobject-user-rule")
            .send({
                    user_data: []
                })
            .set("Accept","application/json")

        expect(response.statusCode).toEqual(400);
        expect(response.body.errors[0].msg).toEqual('The Field user_data Must Be Of Type Object');
        expect(response.body.errors[0].location).toEqual('body');
        expect(response.body.errors[0].param).toEqual('user_data');
    });

})