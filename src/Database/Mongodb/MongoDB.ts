/**
 * Third Party Imports
 */
import {MongoClient, Collection, ObjectId} from "mongodb";
import { Model } from "mongoose";
import { findAndReplace } from "find-and-replace-anything";


interface IMongoDBOptions {
    databaseConnection: MongoClient,
    databaseName:string,
    collection:string
}

interface IMongooseOptions {
    model:any
}

let mongodbConnection : any = null;


export class MongoDB {
    private readonly database : string;
    private readonly mongoDBOptions: IMongoDBOptions | undefined;
    private readonly mongooseOptions : IMongooseOptions | undefined;

    constructor(database : string,params: IMongoDBOptions | IMongooseOptions) {
        this.database = database;

        if ("databaseConnection" in params) {
            this.mongoDBOptions = params;
        } else {
            this.mongooseOptions = params;
        }
    }

    /**
     * Initializing MongodbConnection
     */
    private async initializeConnection() : Promise<Collection | null> {
        const connectionObject = this.mongoDBOptions;

        let coll : Collection;

        if (typeof connectionObject !== "undefined"){

            mongodbConnection === null ? await connectionObject.databaseConnection.connect() : null;

            mongodbConnection = mongodbConnection === null ? connectionObject.databaseConnection.db(connectionObject.databaseName) : mongodbConnection;

            coll = mongodbConnection.collection(connectionObject.collection);

            return coll;

        }

        return null;
    }


    /**
     * Query To Find
     */
    async findQuery(query: Object,value: string | number,isFieldValueObjectId: boolean,mongooseModel : Model<any>) {

        const replaceWithValue = findAndReplace(query,":data_value",isFieldValueObjectId ? new ObjectId(value) : `${value}`)

        if (this.database === "mongoose") {

            return mongooseModel.findOne(replaceWithValue);

        }

        const coll : Collection | null = await this.initializeConnection();

        if (coll !== null) {

            return await coll.findOne(replaceWithValue);

        }

    }

}