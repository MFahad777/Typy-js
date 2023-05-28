const { Rule, Validation } = require("../../dist");

const request = require("supertest");

const {
    app,
    setRoute
} = require("../config");

describe("Replace Sanitizer Validation Rule",  () => {

    it("verifies if it replaces the string with the provided values",async () => {

        const createUserRule = new Rule({
            name:[
                Validation.replace({
                    params:{
                        new_value:"Hello!",
                        value_to_replace:"greetings"
                    }
                })
            ]
        });

        setRoute("post","/replace-createUserRule",createUserRule, true);

        const response = await request(app)
            .post("/replace-createUserRule")
            .send({ name:"greetings Alexi" });

        expect(response.statusCode).toEqual(200);
        expect(response.body.name).toEqual('Hello! Alexi');
    })

    it("verifies if it replaces the string with the provided regex",async () => {

        const createUserRule = new Rule({
            name:[
                Validation.replace({
                    params:{
                        new_value:"Hello!",
                        value_to_replace:/greeting/ig
                    }
                })
            ]
        });

        setRoute("post","/replace-2-createUserRule",createUserRule, true);

        const response = await request(app)
            .post("/replace-2-createUserRule")
            .send({ name:"greeting Alexi greeting" });

        expect(response.statusCode).toEqual(200);
        expect(response.body.name).toEqual('Hello! Alexi Hello!');
    })
})