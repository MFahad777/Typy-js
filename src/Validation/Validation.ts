/**
 * Importing DTOS
 */
import {
    ICustomValidationDTO,
    IIntegerValidationDTO,
    IIsArrayValidationDTO,
    IRequiredValidationDTO,
    IValidationMongoidDto,
    IValidationInDto
} from "./dtos";

/**
 * Third Party Import
 */
import {
    body,
    check,
    param,
    query,
    ValidationChain
} from "express-validator";

export class Validation {

    /**
     * For Requiring Any Field
     *
     * @param {IRequiredValidationDTO} validation_options
     * @return {ValidationChain}
     */
    protected _required(validation_options : IRequiredValidationDTO) {

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

        return toMatch
            .notEmpty()
            .withMessage((value : unknown) => message.replace(/(:value)|(:data)/ig,`${value}`));
    }

    /**
     * For Checking If Field Is An Integer
     *
     * @param {IIntegerValidationDTO} validation_options
     * @return {ValidationChain}
     */
    protected _integer(validation_options : IIntegerValidationDTO) {

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

        return toMatch
            .if((value : unknown) => value !== undefined)
            .isInt()
            .withMessage((value : unknown) => message.replace(/(:value)|(:data)/ig,`${value}`));
    }

    /**
     * For Checking If The Field Is An Array
     *
     * @param {IIsArrayValidationDTO} validation_options
     * @return {ValidationChain}
     * @protected
     */
    protected _isArray(validation_options : IIsArrayValidationDTO) {
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

        return toMatch
            .if((value : unknown) => value !== undefined)
            .isArray(params)
            .withMessage((value : unknown) => message.replace(/(:value)|(:data)/ig,`${value}`));
    }

    /**
     * For Custom Validation
     *
     * @param validation_options
     * @protected
     */
    protected _custom(validation_options : ICustomValidationDTO) {
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
     * To Check If The Field Is A Valid MongoDB ObjectId
     *
     * @param {IValidationMongoidDto} validation_options
     * @protected
     */
    protected _mongoID(validation_options : IValidationMongoidDto) {

        const {
            field,
            message = `The ${field} Must Be Of Type MongoDB ObjectID`,
            checkIn = "any"
        } = validation_options;

        const toMatch = checkIn === "any"
            ? check(field)
            : checkIn === "params"
                ? param(field)
                : checkIn === "query"
                    ? query(field)
                    : check(field)

        return toMatch
            .isMongoId()
            .if((value : unknown) => value !== undefined)
            .withMessage((value : unknown) => message.replace(/(:value)|(:data)/ig,`${value}`));
    }

    /**
     * To validate the field by the given values
     *
     * @param validation_options
     * @private
     */
    protected _in(validation_options : IValidationInDto) {
        const {
            field,
            checkIn = "any",
            params: {
                values = []
            },
            message = `The ${field} Must Be In ${values}`,
        } = validation_options;

        if (values.length === 0)
            throw new Error(`The 'in' validation must have params field with values`);

        const toMatch = checkIn === "any"
            ? check(field)
            : checkIn === "params"
                ? param(field)
                : checkIn === "query"
                    ? query(field)
                    : check(field)

        return toMatch
            .if((value : unknown) => value !== undefined)
            .isIn(values)
            .withMessage((value : unknown) => message.replace(/(:value)|(:data)/ig,`${value}`));
    }

}