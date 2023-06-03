const { Rule, Validation } = require("../../dist");

const request = require("supertest");

const {
    app,
    setRoute
} = require("../config");

describe("NotIn Validation Rule",  () => {

    it("Check If the given payload is not in the blacklisted values",async () => {

        const createUserRule = new Rule({
            roleName:[
                Validation.notIn({
                    params:{
                        values:['Customer']
                    }
                })
            ]
        });

        setRoute("post","/notIn-createUserRule",createUserRule);

        const response = await request(app)
            .post("/notIn-createUserRule")
            .send({ roleName:['Customer'] });

        expect(response.statusCode).toEqual(400);
        expect(response.body.errors[0].msg).toEqual('The roleName Must Not In Customer');
        expect(response.body.errors[0].location).toEqual('body');
        expect(response.body.errors[0].path).toEqual('roleName');
    })
})