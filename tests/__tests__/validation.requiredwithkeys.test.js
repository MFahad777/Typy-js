const { Rule, Validation } = require("../../dist");

const request = require("supertest");

const {
    app,
    setRoute
} = require("../config");

describe("Required With Keys Validation Rule",  () => {

    it("should throw error if required array keys are not passed in the payload",async () => {

        // Use this with isArray({ bail:true }), use this as first validation element
        // Set bail true, so that if the field is not an array it will not further validate
        // Which can avoid unnecessary errors
        const createUserRule = new Rule({
            designations:[
                Validation.isArray({
                    bail:true
                }),
                Validation.requiredWithKeys({
                    params :{
                        keys: ["id","name"]
                    }
                })
            ]
        });

        setRoute("post","/required-with-keys-1",createUserRule);

        const response = await request(app)
            .post("/required-with-keys-1")
            .send({
                designations:[
                    {
                        id:1,
                        name:"First"
                    },
                    {
                        id:2
                    }
                ]
            });

        expect(response.statusCode).toEqual(400);
        expect(response.body.errors[0].msg).toEqual("The designations's array must have these field id,name");
        expect(response.body.errors[0].location).toEqual('body');
        expect(response.body.errors[0].path).toEqual('designations');
    })
})
