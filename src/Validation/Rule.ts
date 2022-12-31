/**
 * Third Party Import
 */
import {
    validationResult
} from "express-validator";

import { Request,Response,NextFunction } from "express";


/**
 * Local Import
 */
import { Validation } from "./Validation"

/**
 * Importing DTOs
 */
import {
    IRuleObjectSchemaDto,
} from "./dtos";

export class Rule extends Validation {
    private readonly schemaObj: IRuleObjectSchemaDto;

    constructor(Obj : IRuleObjectSchemaDto) {
        super();
        this.schemaObj = Obj;
    }

    /**
     * Create Validations Based On Given Rule
     */
    apply() {

        const schema : any = this.schemaObj;

        const Data = Object.entries(schema);

        return Data.map((value) => {

            const [ field, validation ] = value;

            // @ts-ignore
            return validation.map((all_vals: any) => {

                const {
                    type,
                    message
                } = all_vals

                /**
                 * Replace :field or :attribute with the actual Field
                 */
                const replacedMessage = message?.replace(/(:field)|(:attribute)/ig,field);

                /**
                 * Assigning The Object
                 */
                Object.assign(all_vals, { field });
                Object.assign(all_vals, { message:replacedMessage });

                switch (true) {

                    case /^required$/i.test(type):
                        return this._required(all_vals);

                    case /^integer$/i.test(type):
                        return this._integer(all_vals);

                    case /^isArray$/i.test(type):
                    case /^array$/i.test(type):
                        return this._isArray(all_vals);

                    case /^custom$/i.test(type):
                        return this._custom(all_vals);

                    case /^mongoid$/i.test(type):
                        return this._mongoID(all_vals);

                    default:
                        return []
                }
            });
            }).flatMap(val => val).filter(val => val.length > 0);
    }

    /**
     * Show Validation Errors Caught By The Rule
     *
     * @param customFunction If want to modify the existing errors response
     * @returns function<req,res,next>
     */
    showValidationErrors(customFunction? : Function | null | undefined) {

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