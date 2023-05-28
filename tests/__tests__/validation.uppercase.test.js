const { Rule, Validation } = require("../../dist");

const request = require("supertest");

const {
    app,
    setRoute
} = require("../config");

describe("Uppercase Sanitizer Validation Rule",  () => {

    it("verifies if it returns the uppercase value",async () => {

        const createUserRule = new Rule({
            name:[
                Validation.upperCase()
            ]
        });

        setRoute("post","/uppercase-createUserRule",createUserRule, true);

        const response = await request(app)
            .post("/uppercase-createUserRule")
            .send({ name:"alexi" });

        expect(response.statusCode).toEqual(200);
        expect(response.body.name).toEqual('ALEXI');
    })
})