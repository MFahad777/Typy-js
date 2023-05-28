const { Rule, Validation } = require("../../dist");

const request = require("supertest");

const {
    app,
    setRoute
} = require("../config");

describe("IsJWT Validation Rule",  () => {

    // It only checks the pattern
    it("Check if the provided value is a valid jwt",async () => {

        const createPostRule = new Rule({
            jwt_token:[
                Validation.isJwt({
                    message:"The :attribute's value is not a valid jwt token"
                })
            ]
        });

        setRoute("post","/isjwt-createUserRule",createPostRule);

        const response = await request(app)
            .post("/isjwt-createUserRule")
            .send({ jwt_token:"a_jwt_token" });

        expect(response.statusCode).toEqual(400);
        expect(response.body.errors[0].msg).toEqual("The jwt_token's value is not a valid jwt token");
        expect(response.body.errors[0].location).toEqual('body');
        expect(response.body.errors[0].param).toEqual('jwt_token');
    })
})