const { Rule, Validation } = require("../../dist");

const request = require("supertest");

const {
    app,
    setRoute
} = require("../config");

describe("Is Valid Mongo Id Validation Rule",  () => {

    it("should throws validation error",async () => {

        const createUser = new Rule({
            user_id:[
                Validation.isValidMongoId()
            ],
        });

        setRoute("post","/is-mongoid-rule",createUser);

        const response = await request(app)
            .post("/is-mongoid-rule")
            .send({
                user_id: 2
            })
            .set("Accept","application/json")

        expect(response.statusCode).toEqual(400);
        expect(response.body.errors[0].msg).toEqual("The user_id's value is not a valid mongoDB Id");
        expect(response.body.errors[0].location).toEqual('body');
        expect(response.body.errors[0].param).toEqual('user_id');
    });

    it("should throws validation error",async () => {

        const createUser = new Rule({
            user_id:[
                Validation.isValidMongoId()
            ],
        });

        setRoute("post","/is-mongoid-2-rule",createUser);

        const response = await request(app)
            .post("/is-mongoid-2-rule")
            .send({
                user_id: "625e8d2db28f0c5bf3affa9a"
            })
            .set("Accept","application/json")

        expect(response.statusCode).toEqual(200);
    });

})