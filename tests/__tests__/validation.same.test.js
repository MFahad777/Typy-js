const { Rule, Validation } = require("../../dist");

const request = require("supertest");

const {
    app,
    setRoute
} = require("../config");

describe("Same Validation Rule",  () => {

    it("verifies if one field value is same as the other field's value",async () => {

        const createUserRule = new Rule({
            password:[
                Validation.same({
                    params:{
                        otherField: "confirmPassword"
                    }
                }),
            ],
            confirmPassword:[
                Validation.isString()
            ]
        });

        setRoute("post","/same-createUserRule",createUserRule, true);

        const response = await request(app)
            .post("/same-createUserRule")
            .send({ password:"123456789", confirmPassword:"1234562789" });

        expect(response.statusCode).toEqual(400);
        expect(response.body.errors[0].msg).toEqual("The password is not same as confirmPassword's value");
        expect(response.body.errors[0].location).toEqual('body');
        expect(response.body.errors[0].param).toEqual('password');
    })

    it("verifies if one field value is not same as the other field's value",async () => {

        const createUserRule = new Rule({
            password:[
                Validation.same({
                    params:{
                        otherField: "confirmPassword"
                    }
                }),
                Validation.same({
                    message:"The :attribute's value must not be same as temporaryPassword's value",
                    params: {
                        negate:true, // This reverse the validation check, password must not be same as temporary password
                        otherField:"temporaryPassword"
                    }
                })
            ],
            confirmPassword:[
                Validation.isString()
            ],
            temporaryPassword:[
                Validation.isString()
            ]
        });

        setRoute("post","/same-2-createUserRule",createUserRule, true);

        const response = await request(app)
            .post("/same-2-createUserRule")
            .send({ password:"123456789", confirmPassword:"123456789", temporaryPassword : "123456789" });

        expect(response.statusCode).toEqual(400);
        expect(response.body.errors[0].msg).toEqual("The password's value must not be same as temporaryPassword's value");
        expect(response.body.errors[0].location).toEqual('body');
        expect(response.body.errors[0].param).toEqual('password');
    })

})