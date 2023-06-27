const { Rule, Validation } = require("../../dist");

const mysql2 = require("mysql2");

const { Client } = require("pg");

const request = require("supertest");

const {
    app,
    setRoute
} = require("../config");

describe("Exists Validation Rule",  () => {

    it("should return error if value does not exists in the database using MYSQL",async () => {

        // create the connection to database
        const connection = await mysql2.createConnection({
            host: 'localhost',
            port:3306,
            user: 'root',
            database: 'chef_stories'
        }).promise();

        const createPost = new Rule({
            id:[
                Validation.exists({
                    bail:true,
                    params:{
                        dbConnection:connection,
                        dialect:"mysql",
                        tableName:"beverages",
                        columnToCheckAgainst:"id"
                    }
                }),
            ]
        });

        setRoute("post","/exists-post",createPost);

        const responseOne = await request(app)
            .post("/exists-post")
            .send({ id:150 })

        expect(responseOne.statusCode).toEqual(400);
        expect(responseOne.body.errors[0].msg).toEqual("The id's value does not exists in the database");
        expect(responseOne.body.errors[0].location).toEqual('body');
        expect(responseOne.body.errors[0].path).toEqual('id');

        await connection.destroy();
    })

    it("should return error if value does not exists in the database using Postgres",async () => {

        // create the connection to database
        const pgClient = new Client({
            host:"localhost",
            port:5432,
            user:"postgres",
            password:"123456789",
            database:"postgres"
        })

        await pgClient.connect();

        const createPost = new Rule({
            id:[
                Validation.exists({
                    params:{
                        dbConnection:pgClient,
                        dialect:"abc",
                        tableName:"users",
                        columnToCheckAgainst:"id"
                    }
                }),
            ]
        });

        setRoute("post","/exists-2-post",createPost);

        const responseOne = await request(app)
            .post("/exists-2-post")
            .send({ id:152 })

        expect(responseOne.statusCode).toEqual(400);
        expect(responseOne.body.errors[0].msg).toEqual("The id's value does not exists in the database");
        expect(responseOne.body.errors[0].location).toEqual('body');
        expect(responseOne.body.errors[0].path).toEqual('id');
    })

})
