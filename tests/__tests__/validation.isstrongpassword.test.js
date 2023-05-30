const { Rule, Validation } = require("../../dist");

const request = require("supertest");

const {
    app,
    setRoute
} = require("../config");

describe("Is Strong Password Validation Rule",  () => {

    it("verifies it throws validation error on a simple password",async () => {


        const createUserRule = new Rule({
            password:[
                Validation.isStrongPassword()
            ]
        });

        setRoute("post","/is-strong-password-createUserRule",createUserRule);

        const response = await request(app)
            .post("/is-strong-password-createUserRule")
            .send({ password:"asimplepassword" });

        expect(response.statusCode).toEqual(400);
        expect(response.body.errors[0].msg).toEqual("The password does not have a strong password");
        expect(response.body.errors[0].location).toEqual('body');
        expect(response.body.errors[0].param).toEqual('password');
    });

    it("passes because sending a strong password",async () => {


        const createUserRule = new Rule({
            password:[
                Validation.isStrongPassword()
            ]
        });

        setRoute("post","/is-strong-password-2-createUserRule",createUserRule);

        const response = await request(app)
            .post("/is-strong-password-2-createUserRule")
            .send({ password:"Abc@12345" });

        expect(response.statusCode).toEqual(200);
        expect(response.body.message).toEqual("Success");
    });
})