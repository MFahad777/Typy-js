const { Rule, Validation } = require("../../dist");

const request = require("supertest");

const {
    app,
    setRoute
} = require("../config");

describe("Trim Sanitizer Validation Rule",  () => {

    it("verifies if it trim the string",async () => {

        const createUserRule = new Rule({
            name:[
                Validation.trim({
                    params: {
                        chars:" "
                    }
                })
            ]
        });

        setRoute("post","/trim-createUserRule",createUserRule, true);

        const response = await request(app)
            .post("/trim-createUserRule")
            .send({ name:" jordan " });

        expect(response.statusCode).toEqual(200);
        expect(response.body.name).toEqual('jordan');
    })

    it("verifies if it trim the string with an special character",async () => {

        const createUserRule = new Rule({
            name:[
                Validation.trim({
                    params: {
                        chars:"$$"
                    }
                })
            ]
        });

        setRoute("post","/trim-2-createUserRule",createUserRule, true);

        const response = await request(app)
            .post("/trim-2-createUserRule")
            .send({ name:"$$jordan_jordan$$" });

        expect(response.statusCode).toEqual(200);
        expect(response.body.name).toEqual('jordan_jordan');
    })
})