const { Rule, Validation } = require("../../dist");

const request = require("supertest");

const {
    app,
    setRoute
} = require("../config");

describe("RangeOrBetween Validation Rule",  () => {

    it("should pass validation for a valid number within range",async () => {

        const createUserRule = new Rule({
            age:[
                Validation.rangeOrBetween({
                    params:{
                        min:10,
                        max:20,
                    }
                })
            ]
        });

        setRoute("post","/rangeorbetween-createUserRule",createUserRule);

        const response = await request(app)
            .post("/rangeorbetween-createUserRule")
            .send({ age:4 });

        expect(response.statusCode).toEqual(400);
        expect(response.body.errors[0].msg).toEqual('The Field age Must Be Between 10 and 20');
        expect(response.body.errors[0].location).toEqual('body');
        expect(response.body.errors[0].param).toEqual('age');
    })

    it("should pass validation for a valid date within range",async () => {

        const checkBirthDateRangeRule = new Rule({
            birthDate:[
                Validation.rangeOrBetween({
                    params:{
                        min: '2023-01-01',
                        max: '2023-12-31',
                        type:"date"
                    }
                })
            ]
        });

        setRoute("post","/checkBirthDateRangeRule-createUserRule",checkBirthDateRangeRule);

        const response = await request(app)
            .post("/checkBirthDateRangeRule-createUserRule")
            .send({ birthDate:"2024-02-01" });

        expect(response.statusCode).toEqual(400);
        expect(response.body.errors[0].msg).toEqual('The Field birthDate Must Be Between 2023-01-01 and 2023-12-31');
        expect(response.body.errors[0].location).toEqual('body');
        expect(response.body.errors[0].param).toEqual('birthDate');
    })

    it("should pass validation for a valid date within range defined by another field",async () => {

        const checkBirthDateRangeRule = new Rule({
            birthDate:[
                Validation.rangeOrBetween({
                    params:{
                        min: 'allowedDates.min', // uses lodash_.get to get the field value.
                        max: 'allowedDates.max', // uses lodash_.get to get the field value.
                        type:"field"
                    }
                })
            ],
            allowedDates:[
                Validation.required(),
                Validation.isObject(), // see validation.isobject.test.js for more detail
            ],
            "allowedDates.min":[        // Validating nested field
                Validation.required(),
            ],
            "allowedDates.max":[        // Validating nested field
                Validation.required(),
            ],
        });

        setRoute("post","/rangeOrBetweenWithAnotherField-createUserRule",checkBirthDateRangeRule);

        const response = await request(app)
            .post("/rangeOrBetweenWithAnotherField-createUserRule")
            .send({ birthDate:"2024-02-01", allowedDates:{ min:"2023-01-01", max:"2023-05-05" } });

        expect(response.statusCode).toEqual(400);
        expect(response.body.errors[0].msg).toEqual('The Field birthDate Must Be Between allowedDate.min\'value and allowedDate.max\'value');
        expect(response.body.errors[0].location).toEqual('body');
        expect(response.body.errors[0].param).toEqual('birthDate');
    })
})