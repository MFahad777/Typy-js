const { Rule, Validation } = require("../../dist");

const request = require("supertest");

const {
    app,
    setRoute
} = require("../config");

describe("If Validation Rule",  () => {

    it("verifies if it won't let it pass if other field value does not match with the appliedOnField Value",async () => {

        const createUserRule = new Rule({
            roleName:[
                Validation.if({ // It will let it pass if secondField (allowName)'s value ( secondFieldValue ) is equal to appliedOnFieldValue (self) value
                    message:"The :attribute field's value must be same as allowName field's value",
                    params:{
                        secondField:"allowName",
                        secondFieldValue:"Admin",
                        appliedOnFieldValue:"Admin"
                    }
                })
            ],
            allowName:[
                Validation.isString(),
                Validation.in({
                    params:{
                        values:["Admin"]
                    }
                })
            ]
        });

        setRoute("post","/if-createUserRule",createUserRule);

        const response = await request(app)
            .post("/if-createUserRule")
            .send({ roleName:'Adminn',allowName:"Admin" });

        expect(response.statusCode).toEqual(400);

        expect(response.body.errors[0].msg).toEqual("The roleName field's value must be same as allowName field's value");
        expect(response.body.errors[0].location).toEqual('body');
        expect(response.body.errors[0].param).toEqual('roleName');
    })

    it("verifies that current field must exists if another field exists",async () => {

        const createUserRule = new Rule({
            roleName:[
                Validation.if({ // Check's if secondField exists in the payload but the current value is absent.
                    message:"The field :attribute must exists if allowName exists",
                    params:{
                        secondField:"allowName",
                        secondFieldValue:"exists",
                        appliedOnFieldValue:"exists"
                    }
                })
            ],
            allowName:[
                Validation.isString(),
            ]
        });

        setRoute("post","/if-2-createUserRule",createUserRule);

        const response = await request(app)
            .post("/if-2-createUserRule")
            .send({ allowName:"true" }); // roleName not being sent to payload.

        expect(response.statusCode).toEqual(400);
        expect(response.body.errors[0].msg).toEqual("The field roleName must exists if allowName exists");
        expect(response.body.errors[0].location).toEqual('body');
        expect(response.body.errors[0].param).toEqual('roleName');
    })

    it("verifies that if second field exists then the current field must not exists",async () => {

        const createUserRule = new Rule({
            roleName:[
                Validation.if({
                    message:"The :attribute should not exists if allowName is present in the payload",
                    params:{
                        secondField:"allowName",
                        secondFieldValue:"exists",
                        appliedOnFieldValue:"notexists"
                    }
                })
            ],
            allowName:[
                Validation.isString(),
            ]
        });

        setRoute("post","/if-3-createUserRule",createUserRule);

        const response = await request(app)
            .post("/if-3-createUserRule")
            .send({ allowName:"true", roleName:"true"}); // roleName being sent to payload.

        expect(response.statusCode).toEqual(400);
        expect(response.body.errors[0].msg).toEqual("The roleName should not exists if allowName is present in the payload");
        expect(response.body.errors[0].location).toEqual('body');
        expect(response.body.errors[0].param).toEqual('roleName');
    })

    it("verifies that if second field does not exist then the current field must exists",async () => {

        const createUserRule = new Rule({
            roleName:[
                Validation.if({
                    message:"The :attribute must exists if allowName does not exist",
                    params:{
                        secondField:"allowName",
                        secondFieldValue:"notexists",
                        appliedOnFieldValue:"exists"
                    }
                })
            ],
            allowName:[
                Validation.isString(),
            ]
        });

        setRoute("post","/if-4-createUserRule",createUserRule);

        const response = await request(app)
            .post("/if-4-createUserRule")
            .send({ }); // roleName being sent to payload.

        expect(response.statusCode).toEqual(400);
        expect(response.body.errors[0].msg).toEqual("The roleName must exists if allowName does not exist");
        expect(response.body.errors[0].location).toEqual('body');
        expect(response.body.errors[0].param).toEqual('roleName');
    })

    it("verifies that if second field does not exist then the current field must exists",async () => {

        const createUserRule = new Rule({
            roleName:[
                Validation.if({
                    message:"The :attribute field can not exists without the allowName Field",
                    params:{
                        secondField:"allowName",
                        secondFieldValue:"notexists",
                        appliedOnFieldValue:"notexists"
                    }
                })
            ],
            allowName:[
                Validation.isString(),
            ]
        });

        setRoute("post","/if-createUserRule-5",createUserRule);

        const response = await request(app)
            .post("/if-createUserRule-5")
            .send({ roleName:"asdasd" });


        expect(response.statusCode).toEqual(400);
        expect(response.body.errors[0].msg).toEqual("The roleName field can not exists without the allowName Field");
        expect(response.body.errors[0].location).toEqual('body');
        expect(response.body.errors[0].param).toEqual('roleName');
    })

    it("verifies that if second field does not exist then the current field must exists",async () => {

        const createUserRule = new Rule({
            roleName:[
                Validation.if({
                    message:"The :attribute should exists if allowName value is { a:1 }",
                    params:{
                        secondField:"allowName",
                        secondFieldValue:{
                            a:1
                        },
                        appliedOnFieldValue:"exists"
                    }
                })
            ],
            allowName:[
                Validation.isObject(),
            ]
        });

        setRoute("post","/if-createUserRule-6",createUserRule);

        const response = await request(app)
            .post("/if-createUserRule-6")
            .send({ allowName: { a: 1 } });

        expect(response.statusCode).toEqual(400);
        expect(response.body.errors[0].msg).toEqual("The roleName should exists if allowName value is { a:1 }");
        expect(response.body.errors[0].location).toEqual('body');
        expect(response.body.errors[0].param).toEqual('roleName');
    })
})