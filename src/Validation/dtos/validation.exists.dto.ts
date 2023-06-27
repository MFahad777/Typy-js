import { ValidationGeneralDto } from "./validation.general.dto";
import { Connection as MySQLConnection } from "mysql2";
import { Client as PGClient } from "pg";

export interface IValidationExistsDto extends Omit<ValidationGeneralDto, 'params' | 'customFunction'> {
    params: {
        dbConnection: MySQLConnection | PGClient,
        negate?: Boolean,
        dialect:"mysql" | "pg",
        tableName: string,
        columnToCheckAgainst: string
    }
}
