const { Rule, Validation } = require("../../dist");

const request = require("supertest");

const {
    app,
    setRoute
} = require("../config");

describe("Custom Sanitizer Validation Rule",  () => {

    it("verifies if it returns the lowercase value",async () => {

        const createUserRule = new Rule({
            name:[
                Validation.customSanitizer({
                    customFunction:(({ value, reqObject, field }) => {
                        return value.toLowerCase();
                    })
                })
            ]
        });

        setRoute("post","/custom-createUserRule",createUserRule, true);

        const response = await request(app)
            .post("/custom-createUserRule")
            .send({ name:"ALEXI" });

        expect(response.statusCode).toEqual(200);
        expect(response.body.name).toEqual('alexi');
    })
})