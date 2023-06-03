const { Rule, Validation } = require("../../dist");

const request = require("supertest");

const {
    app,
    setRoute
} = require("../config");

describe("Custom Validation Rule",  () => {

    it("Writing A Custom Function To Validate A String Length",async () => {

        const createUserRule = new Rule({
            name:[
                Validation.custom({
                    customFunction:({value, requestObject, field, param}) => {
                        return value.length > 5 ? Promise.resolve() : Promise.reject(`${field} length must be greater than 5`);
                    }
                })
            ]
        });

        setRoute("post","/custom-createUserRule",createUserRule);

        const response = await request(app)
            .post("/custom-createUserRule")
            .send({ name:"na" });

        expect(response.statusCode).toEqual(400);
        expect(response.body.errors[0].msg).toEqual('name length must be greater than 5');
        expect(response.body.errors[0].location).toEqual('body');
        expect(response.body.errors[0].path).toEqual('name');
    })
})