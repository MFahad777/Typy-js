const { Rule, Validation } = require("../../dist");

const request = require("supertest");

const {
    app,
    setRoute
} = require("../config");
const exp = require("constants");

const customFunctionToCustomizeTheErrorResponse = (errors, req, res, next) => {

    const validationErrors = errors.array();

    if (validationErrors && validationErrors.length > 0) {
        const allErrors = validationErrors.reduce((acc, e) => {
            if (acc[e.param]) {
                acc[e.param].push(e.msg);
            } else {
                acc[e.param] = [e.msg]
            }

            return acc;
        }, {});


        return res.status(422).json({
            response: false,
            status_code: 422,
            message: "Invalid Parameters",
            error_msgs: allErrors,
            data: {}
        })
    } else {
        next();
    }
}

describe("Some other features",  () => {

    // It only checks the pattern
    it("Passing a custom function to customize the error response",async () => {

        const createPostRule = new Rule({
            name:[
                Validation.isString({
                    params: {
                        min: 5,
                        max: 10
                    }
                })
            ],
            body: [
                Validation.isString({
                    params: {
                        min: 5,
                        max: 600
                    }
                })
            ]
        });

        setRoute("post","/other-1-createPostRule",createPostRule,false,customFunctionToCustomizeTheErrorResponse);

        const response = await request(app)
            .post("/other-1-createPostRule")
            .send({ name:4, body:5 });

        expect(response.statusCode).toEqual(422);
        expect(response.body.response).toEqual(false);
        expect(response.body.message).toEqual("Invalid Parameters");
        expect(response.body.error_msgs).toBeTruthy();
        expect(response.body.error_msgs).toMatchObject({
            name: [
                'The field name is not of type string',
                'The field name is not of type string',
            ],
            body: [
                'The field body is not of type string',
                'The field body is not of type string',
            ]
        });
        expect(response.body.data).toMatchObject({})
    })
})