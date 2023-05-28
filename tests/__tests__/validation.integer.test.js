const { Rule, Validation } = require("../../dist");

const request = require("supertest");

const {
    app,
    setRoute
} = require("../config");

describe("Integer Validation Rule",  () => {

    it("Test if give 400 bad request on invalid payload",async () => {

        const getPostRule = new Rule({
            id:[
                Validation.integer({
                    checkIn:"query",
                    message:"The field :attribute must be of type integer, but you provided :value"
                })
            ]
        });

        setRoute("get","/get-post",getPostRule);

        const responseOne = await request(app)
            .get("/get-post")
            .query({ id:"A Title" })
            .set("Accept","application/json")


        // First Response Assertion
        expect(responseOne.statusCode).toEqual(400);
        expect(responseOne.body.errors[0].msg).toEqual('The field id must be of type integer, but you provided A Title');
        expect(responseOne.body.errors[0].location).toEqual('query');
        expect(responseOne.body.errors[0].param).toEqual('id');
    })

    it("Check required validation with a custom function",async () => {

        const getPostRule = new Rule({
            id:[
                Validation.integer({
                    checkIn:"query",
                    customFunction:({value, requestObject, field, param}) => {
                        return typeof value === "number" ? Promise.resolve() : Promise.reject("With Custom Function");
                    }
                })
            ]
        });

        setRoute("get","/get-post-data",getPostRule);

        const response = await request(app)
            .get("/get-post-data")
            .query({ id:"A Body" });

        expect(response.statusCode).toEqual(400);
        expect(response.body.errors[0].msg).toEqual('With Custom Function');
        expect(response.body.errors[0].location).toEqual('query');
        expect(response.body.errors[0].param).toEqual('id');
    })

    it("Multiple field validation", async () => {

        const postRule = new Rule({
            id:[
                Validation.integer({
                    message:"The id field must be of type integer"
                })
            ],
            userId:[
                Validation.integer({
                    message:"The userId field must be of type integer"
                })
            ]
        })

        setRoute("get","/post-multiple-fields",postRule);

        const response = await request(app)
            .get("/post-multiple-fields")
            .query({ id:"A Body",userId:"An Id" });


        expect(response.statusCode).toEqual(400);

        expect(response.body.errors[0].msg).toEqual('The id field must be of type integer');
        expect(response.body.errors[0].location).toEqual('query');
        expect(response.body.errors[0].param).toEqual('id');

        expect(response.body.errors[1].msg).toEqual('The userId field must be of type integer');
        expect(response.body.errors[1].location).toEqual('query');
        expect(response.body.errors[1].param).toEqual('userId');

    })

    it("Strict checking integer validation", async () => {

        const postRule = new Rule({
            id:[
                Validation.integer({
                    params:{
                        strict:true
                    }
                })
            ]
        })

        setRoute("post","/strictChecking-integer",postRule);

        const response = await request(app)
            .post("/strictChecking-integer")
            .send({ id:"1" });

        expect(response.statusCode).toEqual(400)

        expect(response.body.errors[0].msg).toEqual('The id field must be of type integer');
        expect(response.body.errors[0].location).toEqual('post');
        expect(response.body.errors[0].param).toEqual('id');


    })
})