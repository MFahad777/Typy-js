const { Rule, Validation } = require("../../dist");

const request = require("supertest");

const {
    app,
    setRoute
} = require("../config");

describe("IsEmail Validation Rule",  () => {

    it("throws validation error on invalid email address",async () => {

        const createUserRule = new Rule({
            email:[
                Validation.isEmail()
            ]
        });

        setRoute("post","/isEmail-createUserRule",createUserRule);

        const response = await request(app)
            .post("/isEmail-createUserRule")
            .send({ email:"alexi" });

        expect(response.statusCode).toEqual(400);
        expect(response.body.errors[0].msg).toEqual("The email is not a valid email address");
        expect(response.body.errors[0].location).toEqual('body');
        expect(response.body.errors[0].param).toEqual('email');
    })

})