const { Rule, Validation } = require("../../dist");

const request = require("supertest");

const {
    app,
    setRoute
} = require("../config");

describe("In Validation Rule",  () => {

    it("Check If the given payload is in the allowed values",async () => {

        const createUserRule = new Rule({
            roleName:[
                Validation.in({
                    params:{
                        values:['Admin','User']
                    }
                })
            ]
        });

        setRoute("post","/in-createUserRule",createUserRule);

        const response = await request(app)
            .post("/in-createUserRule")
            .send({ roleName:['NotAdmin'] });

        expect(response.statusCode).toEqual(400);
        expect(response.body.errors[0].msg).toEqual('The roleName Must Be In Admin,User');
        expect(response.body.errors[0].location).toEqual('body');
        expect(response.body.errors[0].path).toEqual('roleName');
    })
})