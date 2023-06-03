const { Rule, Validation } = require("../../dist");

const request = require("supertest");

const {
    app,
    setRoute
} = require("../config");

describe("Required If Not Validation Rule",  () => {

    it("field is required if email does not exists",async () => {

        const createUserRule = new Rule({
            username:[
                Validation.requiredIfNot({
                    message:"The :attribute is required if email does not exists",
                    params:{
                        secondField:"email",
                        secondFieldValue:"exists"
                    }
                }),
            ],
            email:[
                Validation.isString()
            ]
        });

        setRoute("post","/required-if-not-createUserRule",createUserRule);

        const response = await request(app)
            .post("/required-if-not-createUserRule")
            .send({ notemail:"abc@gmail.com" });

        expect(response.statusCode).toEqual(400);
        expect(response.body.errors[0].msg).toEqual('The username is required if email does not exists');
        expect(response.body.errors[0].location).toEqual('body');
        expect(response.body.errors[0].path).toEqual('username');
    })

    it("field is required if email is not equal to a test email",async () => {

        const createUserRule = new Rule({
            username:[
                Validation.requiredIfNot({
                    message:"The :attribute is required if email is not equal to testuser@gmail.com",
                    params:{
                        secondField:"email",
                        secondFieldValue:"testuser@gmail.com"
                    }
                }),
            ],
            email:[
                Validation.required(),
                Validation.isString()
            ]
        });

        setRoute("post","/required-if-not-2-createUserRule",createUserRule);

        const response = await request(app)
            .post("/required-if-not-2-createUserRule")
            .send({ email:"abc@gmail.com" });

        expect(response.statusCode).toEqual(400);
        expect(response.body.errors[0].msg).toEqual('The username is required if email is not equal to testuser@gmail.com');
        expect(response.body.errors[0].location).toEqual('body');
        expect(response.body.errors[0].path).toEqual('username');
    })
})