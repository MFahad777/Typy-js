const { Rule, Validation } = require("../../dist");

const request = require("supertest");

const {
    app,
    setRoute
} = require("../config");

describe("Is UUID Validation Rule",  () => {

    it("should throws validation error",async () => {

        const createUser = new Rule({
            user_id:[
                Validation.isUUID({
                    params:{
                        version:"all"
                    }
                })
            ],
        });

        setRoute("post","/is-uuid-createUser",createUser);

        const response = await request(app)
            .post("/is-uuid-createUser")
            .send({
                user_id: 2
            })
            .set("Accept","application/json")

        expect(response.statusCode).toEqual(400);
        expect(response.body.errors[0].msg).toEqual("The user_id's value is not a valid UUID");
        expect(response.body.errors[0].location).toEqual('body');
        expect(response.body.errors[0].path).toEqual('user_id');
    });

    it("should not throw validation error",async () => {

        const createUser = new Rule({
            user_id:[
                Validation.isUUID({
                    params:{
                        version:"all"
                    }
                })
            ],
        });

        setRoute("post","/is-uuid-2-createUser",createUser);

        const response = await request(app)
            .post("/is-uuid-2-createUser")
            .send({
                user_id: '9e271ecc-6e7d-469c-0c1c-d7b8cb108004'
            })
            .set("Accept","application/json")

        expect(response.statusCode).toEqual(200);
    });
})