/**
 * Third Party Import
 */
import {
    validationResult,
    ValidationChain
} from "express-validator";

import { Request,Response,NextFunction } from "express";

/**
 * Importing DTOs
 */
import {
    IRuleObjectSchemaDto
} from "./dtos";

export class Rule {

    private readonly schemaObj: IRuleObjectSchemaDto;

    constructor(Obj : IRuleObjectSchemaDto) {
        this.schemaObj = Obj;
    }

    /**
     * Create Validations Based On Given Rule
     */
    createValidation() : ValidationChain[] {

        const schema : any = this.schemaObj;

        const Data = Object.entries(schema);

        return Data.map((value) => {

            const [ field, validation ] : any = value;

            return validation.map((val: Function) => val(field))

        }).flatMap(val => val)
    }

    /**
     * Show Validation Errors Caught By The Rule
     *
     * @param customFunction If want to modify the existing errors response
     * @returns function<req,res,next>
     */
    showValidationErrors(customFunction? : Function) {

        return (req : Request,res : Response ,next: NextFunction) => {
            const errors = validationResult(req);

            if (customFunction) {
                return customFunction(errors,req,res,next)
            }

            if (!errors.isEmpty()) {
                // @ts-ignore
                return res.status(400).json({ errors: errors.array() });
            }

            next()
        }

    }

}
