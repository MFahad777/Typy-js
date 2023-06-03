const { Rule, Validation } = require("../../dist");

const request = require("supertest");

const {
    app,
    setRoute
} = require("../config");

describe("After Or Equal Validation Rule",  () => {

    it("should throw validation error if current field date is not after or equal today",async () => {

        const createProductRule = new Rule({
            expire_date:[
                Validation.afterOrEqual({
                    params : {
                        date: "today"
                    }
                })
            ]
        });

        setRoute("post","/after-or-equal-createProductRule",createProductRule);

        const response = await request(app)
            .post("/after-or-equal-createProductRule")
            .send({ expire_date:"2023-05-30" });

        expect(response.statusCode).toEqual(400);
        expect(response.body.errors[0].msg).toEqual("The expire_date's date is not after or equal to today");
        expect(response.body.errors[0].location).toEqual('body');
        expect(response.body.errors[0].path).toEqual('expire_date');
    })

    it("should throw validation error if current field date is not after or equal to tomorrow's date",async () => {

        const createProductRule = new Rule({
            expire_date:[
                Validation.afterOrEqual({
                    params : {
                        date: "tomorrow"
                    }
                })
            ]
        });

        setRoute("post","/after-or-equal-2-createProductRule",createProductRule);

        const response = await request(app)
            .post("/after-or-equal-2-createProductRule")
            .send({ expire_date:"2023-05-31" });

        expect(response.statusCode).toEqual(400);
        expect(response.body.errors[0].msg).toEqual("The expire_date's date is not after or equal to tomorrow");
        expect(response.body.errors[0].location).toEqual('body');
        expect(response.body.errors[0].path).toEqual('expire_date');
    })

    it("should throw validation error if current field date is not after or equal to another field's date",async () => {

        const createProductRule = new Rule({
            date:[
                Validation.afterOrEqual({
                    params : {
                        date: "expire_date"
                    }
                })
            ],
            expire_date:[
                Validation.isString()
            ]
        });

        setRoute("post","/after-or-equal-3-createProductRule",createProductRule);

        const response = await request(app)
            .post("/after-or-equal-3-createProductRule")
            .send({ date:"2023-02-02",expire_date:"2023-05-10" });

        expect(response.statusCode).toEqual(400);
        expect(response.body.errors[0].msg).toEqual("The date's date is not after or equal to expire_date");
        expect(response.body.errors[0].location).toEqual('body');
        expect(response.body.errors[0].path).toEqual('date');
    })

})