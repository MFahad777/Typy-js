const { Rule, Validation } = require("../../dist");

const request = require("supertest");

const {
    app,
    setRoute
} = require("../config");


describe("Required Validation Rule", () => {

    it("Test if give 400 bad request on invalid payload",async () => {

        const samplePostData = new Rule({
            name:[
                Validation.isString({
                    bail:true,
                }),
                Validation.isDate()
            ],
            // body:[
            //     Validation.required()
            // ]
        });

        setRoute("post","/post",samplePostData);

        const responseOne = await request(app)
            .post("/post")
            .send({ name:5 })
            .set("Accept","application/json")

        console.log(responseOne.body);

        // const responseTwo = await request(app)
        //     .post("/post")
        //     .send({ body:"A Body" })
        //     .set("Accept","application/json")

        // First Response Assertion
        expect(responseOne.statusCode).toEqual(400);
        // expect(responseOne.body.errors[0].msg).toEqual('The body is required');
        // expect(responseOne.body.errors[0].location).toEqual('body');
        // expect(responseOne.body.errors[0].path).toEqual('body');

        // Second Response Assertion
        // expect(responseTwo.statusCode).toEqual(400);
        // expect(responseTwo.body.errors[0].msg).toEqual('The name is required');
        // expect(responseTwo.body.errors[0].location).toEqual('body');
        // expect(responseTwo.body.errors[0].path).toEqual('name');

    })

    // it("Check if payload invalid in Query",async () => {
    //
    //     const samplePostData = new Rule({
    //         name:[
    //             Validation.required({
    //                 checkIn:"query"
    //             })
    //         ],
    //         body:[
    //             Validation.required({
    //                 checkIn:"query"
    //             })
    //         ]
    //     });
    //
    //     setRoute("get","/post-query",samplePostData);
    //
    //     const response = await request(app)
    //         .get("/post-query")
    //         .query({ body:"A Body" });
    //
    //     expect(response.statusCode).toEqual(400);
    //     expect(response.body.errors[0].msg).toEqual('The name is required');
    //     expect(response.body.errors[0].location).toEqual('query');
    //     expect(response.body.errors[0].path).toEqual('name');
    //
    // })

    // it("Check required validation with a custom function",async () => {
    //
    //     const samplePostData = new Rule({
    //         name:[
    //             Validation.required({
    //                 customFunction:({value, requestObject, field, param}) => {
    //                     return Boolean(value) ? Promise.resolve() : Promise.reject("With Custom Function");
    //                 }
    //             })
    //         ],
    //         body:[
    //             Validation.required({
    //                 customFunction:({value, requestObject, field, param}) => {
    //                     return Boolean(value) ? Promise.resolve() : Promise.reject("With Custom Function");
    //                 }
    //             })
    //         ]
    //     });
    //
    //     setRoute("post","/post-data",samplePostData);
    //
    //     const response = await request(app)
    //         .post("/post-data")
    //         .send({ body:"A Body" });
    //
    //     expect(response.statusCode).toEqual(400);
    //     expect(response.body.errors[0].msg).toEqual('With Custom Function');
    //     expect(response.body.errors[0].location).toEqual('body');
    //     expect(response.body.errors[0].path).toEqual('name');
    // })
})