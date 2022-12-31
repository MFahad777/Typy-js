import {
    check,
    body,
    param,
    query,
    validationResult
} from "express-validator";

import { Request,Response,NextFunction } from "express";

/**
 * Importing DTOs
 */
import {
    IRequiredValidationDTO,
    IIntegerValidationDTO,
    IIsArrayValidationDTO,
    ICustomValidationDTO,
    IRuleObjectSchemaDto
} from "./dtos";

type ISchemaObject = IRequiredValidationDTO | IIntegerValidationDTO | IIsArrayValidationDTO | ICustomValidationDTO;

export class Rule {
    private readonly schemaObj: IRuleObjectSchemaDto;

    constructor(Obj : IRuleObjectSchemaDto) {
        this.schemaObj = Obj;
    }

    apply() {

        const schema : any = this.schemaObj;

        const Data = Object.entries(schema);

        return Data.map((value) => {

            const [ field, validation ] = value;

            // @ts-ignore
            return validation.map((all_vals: ISchemaObject) => {

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

                    default:
                        return []
                }
            });
            }).flatMap(val => val).filter(val => val.length > 0);
    }

    /**
     * For Requiring Any Field
     *
     * @param {IRequiredValidationDTO} validation_options
     * @return {ValidationChain}
     */
    private _required(validation_options : IRequiredValidationDTO) {

        const {
            field,
            message = `The ${field} is required`,
            customFunction,
            checkIn = "any"
        } = validation_options;

        const toMatch = checkIn === "any"
            ? check(field)
            : checkIn === "params"
                ? param(field)
                : checkIn === "query"
                    ? query(field)
                    : checkIn === "body"
                        ? body(field)
                        : check(field)

        if (customFunction) {

            return toMatch.custom((value,reqObject) => {

                const toSend = {
                    value,
                    reqObject,
                    field
                }

                return customFunction(toSend)
            });
        }

        return toMatch.notEmpty().withMessage(message);
    }

    /**
     * For Checking If Field Is An Integer
     *
     * @param {IIntegerValidationDTO} validation_options
     * @return {ValidationChain}
     */
    private _integer(validation_options : IIntegerValidationDTO) {

        const {
            field,
            message = `The ${field} must be of type integer`,
            customFunction,
            checkIn = "any"
        } = validation_options;

        const toMatch = checkIn === "any"
            ? check(field)
            : checkIn === "params"
                ? param(field)
                : checkIn === "query"
                    ? query(field)
                    : check(field)

        if (customFunction) {
            return toMatch.if((value : unknown) => value !== undefined).custom((value,reqObject) => {

                const toSend = {
                    value,
                    reqObject,
                    field
                }

                return customFunction(toSend)
            });
        }

        return toMatch.if((value : unknown) => value !== undefined).isInt().withMessage(message);
    }

    /**
     * For Checking If The Field Is An Array
     *
     * @param {IIsArrayValidationDTO} validation_options
     * @return {ValidationChain}
     * @private
     */
    private _isArray(validation_options : IIsArrayValidationDTO) {
        const {
            field,
            message = `The ${field} must be of type array`,
            customFunction,
            checkIn = "any",
            params = {
                min:undefined,
                max:undefined
            }
        } = validation_options;

        if (params) {

            const allowedDataTypes = ["number","undefined","null"]

            if (!params.hasOwnProperty("min") || !params.hasOwnProperty("max")) {
                throw new Error(`The array validation only accepts 'min' and 'max' keys`);
            }

            if (!allowedDataTypes.includes(typeof params["min"]) || !allowedDataTypes.includes(typeof params["max"])) {
                throw new Error(`The array validation params can only be of the following types ${allowedDataTypes}`)
            }

        }

        const toMatch = checkIn === "any"
            ? check(field)
            : checkIn === "params"
                ? param(field)
                : checkIn === "query"
                    ? query(field)
                    : check(field)

        if (customFunction) {
            return toMatch.if((value : unknown) => value !== undefined).custom((value,reqObject) => {

                const toSend = {
                    value,
                    reqObject,
                    field,
                    params
                }

                return customFunction(toSend)
            })
        }

        return toMatch.if((value : unknown) => value !== undefined).isArray(params).withMessage(message);
    }

    /**
     * For Custom Validation
     *
     * @param validation_options
     * @private
     */
    private _custom(validation_options : ICustomValidationDTO) {
        const {
            field,
            customFunction,
            checkIn = "any"
        } = validation_options;

        const toMatch = checkIn === "any"
            ? check(field)
            : checkIn === "params"
                ? param(field)
                : checkIn === "query"
                    ? query(field)
                    : check(field)

        if (!customFunction)
            throw new Error(`For validation type 'custom', customFunction is required`);

        return toMatch.custom((value,reqObject) => {

            const toSend = {
                value,
                reqObject,
                field
            }

            return customFunction(toSend)
        });
    }

    /**
     * Show Validation Errors Caught By The Rule
     *
     * @param customFunction If want to modifiy the existing errors response
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