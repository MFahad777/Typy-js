const { Rule, Validation } = require("../../dist");

const request = require("supertest");

const {
    app,
    setRoute
} = require("../config");

describe("Unique Validation Rule",  () => {

    it("should throw error if array of number are not unique",async () => {

        const createUserRule = new Rule({
            roleIds:[
                Validation.unique()
            ],
        });

        setRoute("post","/unique-1",createUserRule);

        const response = await request(app)
            .post("/unique-1")
            .send({ roleIds:[
                    1,2,3,4,4
                ] });

        expect(response.statusCode).toEqual(400);
        expect(response.body.errors[0].msg).toEqual("The roleIds's values are not unique");
        expect(response.body.errors[0].location).toEqual('body');
        expect(response.body.errors[0].path).toEqual('roleIds');
    });

    it("should throw error if array of strings are not unique",async () => {

        const createUserRule = new Rule({
            hobbies:[
                Validation.unique()
            ],
        });

        setRoute("post","/unique-2",createUserRule);

        const response = await request(app)
            .post("/unique-2")
            .send({ hobbies:["gaming", "gaming", "sports"] });

        expect(response.statusCode).toEqual(400);
        expect(response.body.errors[0].msg).toEqual("The hobbies's values are not unique");
        expect(response.body.errors[0].location).toEqual('body');
        expect(response.body.errors[0].path).toEqual('hobbies');
    });

    it("should throw error if array of objects are not unique",async () => {

        const createUserRule = new Rule({
            designations:[
                Validation.unique()
            ],
        });

        setRoute("post","/unique-3",createUserRule);

        const response = await request(app)
            .post("/unique-3")
            .send({ designations:[
                    {
                        id:1,
                        name: "First Post"
                    },
                    {
                        id:2,
                        name: "Second Post"
                    },
                    {
                        id:1,
                        name: "First Post"
                    }
                ] });

        expect(response.statusCode).toEqual(400);
        expect(response.body.errors[0].msg).toEqual("The designations's values are not unique");
        expect(response.body.errors[0].location).toEqual('body');
        expect(response.body.errors[0].path).toEqual('designations');
    });

})
