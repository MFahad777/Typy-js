const { Rule, Validation } = require("../../dist");

const request = require("supertest");

const {
    app,
    setRoute
} = require("../config");

const customFunctionToCustomizeTheErrorResponse = (errors, req, res, next) => {

    const validationErrors = errors.array();

    if (validationErrors && validationErrors.length > 0) {
        const allErrors = validationErrors.reduce((acc, e) => {
            if (acc[e.path]) {
                acc[e.path].push(e.msg);
            } else {
                acc[e.path] = [e.msg]
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
                'The name must be minimum 5 and maximum 10 character long',
            ],
            body: [
                'The field body is not of type string',
                'The body must be minimum 5 and maximum 600 character long',
            ]
        });
        expect(response.body.data).toMatchObject({})
    })

    it('should not validate further if the current validation fails', async () => {

        const createRule = new Rule({

            date:[
                Validation.isString({
                    bail: true
                }),
                Validation.isDate()
            ]

        });

        setRoute("post","/other-2-createRule",createRule);

        const response = await request(app)
            .post("/other-2-createRule")
            .send({ date:5 });

        expect(response.statusCode).toEqual(400);
        expect(response.body.errors.length).toEqual(1);
        expect(response.body.errors[0].msg).toEqual('The field date is not of type string');
        expect(response.body.errors[0].location).toEqual('body');
        expect(response.body.errors[0].path).toEqual('date');
    });
})