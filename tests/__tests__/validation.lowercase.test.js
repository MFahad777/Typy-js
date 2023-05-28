const { Rule, Validation } = require("../../dist");

const request = require("supertest");

const {
    app,
    setRoute
} = require("../config");

describe("Lowercase Sanitizer Validation Rule",  () => {

    it("verifies if it returns the lowercase value",async () => {

        const createUserRule = new Rule({
            name:[
                Validation.lowerCase()
            ]
        });

        setRoute("post","/lowerCase-createUserRule",createUserRule, true);

        const response = await request(app)
            .post("/lowerCase-createUserRule")
            .send({ name:"ALEXI" });

        expect(response.statusCode).toEqual(200);
        expect(response.body.name).toEqual('alexi');
    })
})