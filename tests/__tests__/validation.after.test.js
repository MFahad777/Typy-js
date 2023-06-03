const { Rule, Validation } = require("../../dist");

const request = require("supertest");

const {
    app,
    setRoute
} = require("../config");

describe("After Validation Rule",  () => {

    it("should throw validation error if current field date is not after today",async () => {

        const createProductRule = new Rule({
            expire_date:[
                Validation.after({
                    params : {
                        date: "today"
                    }
                })
            ]
        });

        setRoute("post","/after-createProductRule",createProductRule);

        const response = await request(app)
            .post("/after-createProductRule")
            .send({ expire_date:"2023-05-05" });

        expect(response.statusCode).toEqual(400);
        expect(response.body.errors[0].msg).toEqual("The expire_date's date is not after today");
        expect(response.body.errors[0].location).toEqual('body');
        expect(response.body.errors[0].path).toEqual('expire_date');
    })

    it("should throw validation error if current field date is not after tomorrow's date",async () => {

        const createProductRule = new Rule({
            expire_date:[
                Validation.after({
                    params : {
                        date: "tomorrow"
                    }
                })
            ]
        });

        setRoute("post","/after-2-createProductRule",createProductRule);

        const response = await request(app)
            .post("/after-2-createProductRule")
            .send({ expire_date:"2023-05-10" });

        expect(response.statusCode).toEqual(400);
        expect(response.body.errors[0].msg).toEqual("The expire_date's date is not after tomorrow");
        expect(response.body.errors[0].location).toEqual('body');
        expect(response.body.errors[0].path).toEqual('expire_date');
    })

    it("should throw validation error if current field date is not after another field's date",async () => {

        const createProductRule = new Rule({
            date:[
                Validation.after({
                    params : {
                        date: "expire_date"
                    }
                })
            ],
            expire_date:[
                Validation.isString()
            ]
        });

        setRoute("post","/after-3-createProductRule",createProductRule);

        const response = await request(app)
            .post("/after-3-createProductRule")
            .send({ date:"2023-02-02",expire_date:"2023-05-10" });

        expect(response.statusCode).toEqual(400);
        expect(response.body.errors[0].msg).toEqual("The date's date is not after expire_date");
        expect(response.body.errors[0].location).toEqual('body');
        expect(response.body.errors[0].path).toEqual('date');
    })

})