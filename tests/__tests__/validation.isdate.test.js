const { Rule, Validation } = require("../../dist");

const request = require("supertest");

const {
    app,
    setRoute
} = require("../config");

describe("Is Date Validation Rule",  () => {

    it("should throw error on invalid date",async () => {

        const createUser = new Rule({
            dateOfBirth:[
                Validation.isDate()
            ]
        });

        setRoute("post","/is-date-rule",createUser);

        const response = await request(app)
            .post("/is-date-rule")
            .send({ dateOfBirth:"A Title" })
            .set("Accept","application/json")

        expect(response.statusCode).toEqual(400);
        expect(response.body.errors[0].msg).toEqual("The dateOfBirth's value is not a valid date");
        expect(response.body.errors[0].location).toEqual('body');
        expect(response.body.errors[0].path).toEqual('dateOfBirth');
    });

    it("should not throw an error valid date",async () => {

        const createUser = new Rule({
            dateOfBirth:[
                Validation.isDate({
                    params : {
                        format:"YYYY-MM-DD",
                        delimiters:["-"]
                    }
                })
            ]
        });

        setRoute("post","/is-date-2-rule",createUser);

        const response = await request(app)
            .post("/is-date-2-rule")
            .send({ dateOfBirth:"2023-05-05" })
            .set("Accept","application/json")

        expect(response.statusCode).toEqual(200);
    });
})