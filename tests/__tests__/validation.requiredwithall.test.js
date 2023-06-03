const { Rule, Validation } = require("../../dist");

const request = require("supertest");

const {
    app,
    setRoute
} = require("../config");

describe("Required With All Validation Rule", () => {

    it("verifies it throws validation error when not passing field with all of its peers",async () => {

        const createUserRule = new Rule({
            first_name:[
                Validation.requiredWithAll({
                    params :{
                        fields:["last_name","middle_name"]
                    }
                })
            ],
            last_name:[
                Validation.isString()
            ],
            middle_name:[
                Validation.isString()
            ]
        });

        setRoute("post","/required-with-all",createUserRule);

        const responseOne = await request(app)
            .post("/required-with-all")
            .send({
                last_name:"Saenz",
                middle_name:"R"
            })
            .set("Accept","application/json")

        expect(responseOne.statusCode).toEqual(400);
        expect(responseOne.body.errors[0].msg).toEqual("The first_name required with all of the following fields last_name,middle_name");
        expect(responseOne.body.errors[0].location).toEqual('body');
        expect(responseOne.body.errors[0].path).toEqual('first_name');
    })

})