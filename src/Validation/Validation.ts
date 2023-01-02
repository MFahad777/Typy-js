/**
 * Importing DTOS
 */
import {
    ICustomValidationDTO,
    IIntegerValidationDTO,
    IIsArrayValidationDTO,
    IRequiredValidationDTO,
    IValidationMongoidDto,
    IValidationInDto,
    IValidationNoinDto,
    IValidationRangeorbetweenDto,
    IValidationIsobjectDto,
    IValidationIfDto,
    IValidationArraynotemptyDto,
    IValidationCustomSanitizerDto,
    IValidationLowercaseDto,
    IValidationUppercaseDto,
    IValidationRequiredIfNotDto
} from "./dtos";

/**
 * Third Party Import
 */
import {
    body,
    check,
    param,
    query,
    ValidationChain,
    SanitizationChain
} from "express-validator";

import { get,isEqual } from "lodash";

export class Validation {

    /**
     * For Requiring Any Field
     *
     * @param {IRequiredValidationDTO} validation_options
     * @return {ValidationChain}
     * @protected
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
            const customFunctionParams : ICustomValidationDTO = {
                field,
                customFunction,
                checkIn
            }
            return this._custom(customFunctionParams)
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
     * @protected
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
            const customFunctionParams : ICustomValidationDTO = {
                field,
                customFunction,
                checkIn
            }

            return this._custom(customFunctionParams)
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
            const customFunctionParams : ICustomValidationDTO = {
                field,
                customFunction,
                params,
                checkIn
            }
            return this._custom(customFunctionParams)
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
            checkIn = "any",
            params,
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
                field,
                params
            }

            return customFunction(toSend)
        })
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
     * @protected
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

    /**
     * To validate that the field values not in the provided values
     *
     * @param validation_options
     * @protected
     */
    protected _notIn(validation_options : IValidationNoinDto) {
        const {
            field,
            checkIn = "any",
            params: {
                values = []
            },
            message = `The ${field} Must Not In ${values}`,
        } = validation_options;

        if (values.length === 0)
            throw new Error(`The 'notIn' validation must have params field with values`);

        const toMatch = checkIn === "any"
            ? check(field)
            : checkIn === "params"
                ? param(field)
                : checkIn === "query"
                    ? query(field)
                    : check(field)

        return toMatch
            .if((value : unknown) => value !== undefined)
            .not()
            .isIn(values)
            .withMessage((value : unknown) => message.replace(/(:value)|(:data)/ig,`${value}`));
    }

    /**
     * To validate that the field values is in between the given values
     *
     * @param validation_options
     * @protected
     */
    protected _rangeOrBetween(validation_options: IValidationRangeorbetweenDto) {
        const {
            field,
            checkIn = "any",
            params = {
                min : 1,
                max : 1,
                type : "number"
            },
            customFunction,
            message = `The Field ${field} Must Be Between ${params.min}${params.type === "field" ? "'value" : ''} and ${params.max}${params.type === "field" ? "'value" : ''}`,
        } = validation_options;

        const supportedTypes = ["number","date","field"];

        if (!params.min || params.min === "")
            throw new Error("'between' validation first param (min value) is required")

        if (!params.max || params.max === "")
            throw new Error("'between' validation second param (max value) is required")

        if (typeof params.min !== typeof params.max)
            throw new Error("'between' validation params (min and max) must be of same datatype")

        if (!supportedTypes.includes(params.type))
            throw new Error(`'between' validation third param (Optional) can only contain ${supportedTypes}`)

        const toMatch = checkIn === "any"
            ? check(field)
            : checkIn === "params"
                ? param(field)
                : checkIn === "query"
                    ? query(field)
                    : check(field)


        if (customFunction) {
            const customFunctionParams : ICustomValidationDTO = {
                field,
                customFunction,
                params,
                checkIn
            }
            return this._custom(customFunctionParams)
        }

        return toMatch.if((value : any) => value !== undefined).custom((value,{ req,location }) => {

            const getObject =
                location === "body"
                    ? req.body
                    : location === "query"
                    ? req.query
                    : req.params;

            const isBetweenNumber = params.type === "number"
                ? (value > +params.min) && (value < +params.max)
                : false;

            const isBetweenDate = params.type === "date"
                ? (new Date(value) > new Date(params.min)) && (new Date(value) < new Date(params.max))
                : false;

            let isBetweenFieldValue = false;

            if (params.type === "field") {
                // @ts-ignore
                const minValueOfTheField = get(getObject,params.min)
                // @ts-ignore
                const maxValueOfTheField = get(getObject,params.max);

                //To get a boolean value
                const isDate = !isNaN(Date.parse(minValueOfTheField)) && !isNaN(Date.parse(maxValueOfTheField));

                /**
                 * If isDate is true
                 */
                if (isDate) {
                    isBetweenFieldValue = (new Date(value) > new Date(minValueOfTheField)) && (new Date(value) < new Date(maxValueOfTheField))
                }
                else {
                    isBetweenFieldValue = (value > minValueOfTheField) && (value < maxValueOfTheField)
                }

            }

            const toCheck = params.type === "number"
                ? isBetweenNumber
                : params.type === "date"
                    ? isBetweenDate
                    : isBetweenFieldValue;

            return toCheck ? Promise.resolve : Promise.reject(message);
        }).withMessage((value : unknown) => message.replace(/(:value)|(:data)/ig,`${value}`));

    }

    /**
     * To validate that the field is a valid js object
     *
     * @param validation_options
     * @protected
     */
    protected _isObject(validation_options : IValidationIsobjectDto) {
        const {
            field,
            checkIn = "any",
            params = {
                strict:true
            },
            customFunction,
            message = `The Field ${field} Must Be Of Type Object`,
        } = validation_options;

        const toMatch = checkIn === "any"
            ? check(field)
            : checkIn === "params"
                ? param(field)
                : checkIn === "query"
                    ? query(field)
                    : check(field)

        if (customFunction) {
            const customFunctionParams : ICustomValidationDTO = {
                field,
                customFunction,
                params,
                checkIn
            }
            return this._custom(customFunctionParams)
        }

        return toMatch
            .if((value : any) => value !== undefined)
            .isObject(params)
            .withMessage((value : unknown) => message.replace(/(:value)|(:data)/ig,`${value}`));
    }

    /**
     * To validate a field on a condition
     *
     * @param validation_options
     * @protected
     */
    protected _if(validation_options: IValidationIfDto) {
        let {
            field,
            checkIn = "any",
            params = {
                secondField : "",
                secondFieldValue : "",
                appliedOnFieldValue : ""
            },
            message = `Invalid Value`,
        } = validation_options;


        if (params.secondField === "" || params.secondFieldValue === "" || params.appliedOnFieldValue === ""){
            throw new Error("Validation (If) Excepts All 3 params to be passed" +
                " params.secondField " +
                " params.secondFieldValue " +
                " params.appliedOnFieldValue ");
        }

        const toMatch = checkIn === "any"
            ? check(field)
            : checkIn === "params"
                ? param(field)
                : checkIn === "query"
                    ? query(field)
                    : check(field)

        return toMatch.custom((value,{ req, location }) => {

            /**
             * To use params in the messages
             */
            message = message
                .replace(/:secondField/,String(params.secondField))
                .replace(/:secondFieldValue/,String(params.secondFieldValue))
                .replace(/:appliedOnFieldValue/,String(params.appliedOnFieldValue));

            const getObject =
                location === "body"
                    ? req.body
                    : location === "query"
                    ? req.query
                    : req.params;

            const getFieldValue = get(
                getObject,
                params.secondField,
                "exist_false"
            );

            /**
             * If SecondFieldValue Is Set To Exists And The Actual Value Does Exist
             */
            if (params.secondFieldValue === "exists" && getFieldValue !== "exist_false") {

                /**
                 * If second Field Is Set To Exists and the applied Field Set To Exists
                 * But In The Payload It's Not Present
                 */
                if (params.appliedOnFieldValue === "exists" && value == null) {
                    return Promise.reject(message);
                }

                /**
                 * If Field Actual Value Is Not Equal To Desired Value
                 */
                if (!isEqual(String(value),String(params.appliedOnFieldValue))) {
                    return Promise.reject(message);
                }
            }

            /**
             * If SecondFieldValue Is Set To not Exists And The Actual Value Does Not Exist
             */
            if (params.secondFieldValue === "notexists" && getFieldValue === "exist_false") {

                /**
                 * If second Field Is Set To Exists and the applied Field Set To Exists
                 * But In The Payload It's Not Present
                 */
                if (params.appliedOnFieldValue === "notexists" && value != null) {
                    return Promise.reject(message);
                }

                /**
                 * If Field Actual Value Is Not Equal To Desired Value
                 */
                if (!isEqual(String(value),String(params.appliedOnFieldValue))) {
                    return Promise.reject(message);
                }
            }

            /**
             * If SecondFieldValue Passed By User And Actual Request Payload Value Matches
             */
            if (isEqual(String(params.secondFieldValue),String(getFieldValue))) {

                /**
                 * If second Field Is Set To Some Value and the applied Field Set To Exists
                 * But In The Payload It's Not Present
                 */
                if (params.appliedOnFieldValue === "exists" && value == null) {
                    return Promise.reject(message);
                }

                /**
                 * If Field Actual Value Is Not Equal To Desired Value
                 */
                if (!isEqual(String(value),String(params.appliedOnFieldValue))) {
                    return Promise.reject(message);
                }
            }

            /**
             * Pass the validation
             */
            return Promise.resolve();
        })
    }

    /**
     * To validate that the field does not contain an empty array
     *
     * @param validation_options
     * @protected
     */
    protected _arrayNotEmpty(validation_options: IValidationArraynotemptyDto) {
        const {
            field,
            checkIn = "any",
            message = `The ${field} must not be empty array`,
            customFunction
        } = validation_options;

        const toMatch = checkIn === "any"
            ? check(field)
            : checkIn === "params"
                ? param(field)
                : checkIn === "query"
                    ? query(field)
                    : check(field)

        if (customFunction) {

            const customFunctionParams : ICustomValidationDTO = {
                field,
                customFunction,
                checkIn
            }

            return this._custom(customFunctionParams)
        }


        return toMatch
            .if((value : unknown) => value !== undefined)
            .custom((value) => {
                return value.length > 0
                    ? Promise.resolve()
                    : Promise.reject(message);
            }).withMessage((value : unknown) => message.replace(/(:value)|(:data)/ig,`${value}`));

    }

    /**
     * For Custom Validation
     *
     * @param validation_options
     * @protected
     */
    protected _customSanitizer(validation_options : IValidationCustomSanitizerDto) {
        const {
            field,
            customFunction,
            checkIn = "any",
        } = validation_options;

        const toMatch = checkIn === "any"
            ? check(field)
            : checkIn === "params"
                ? param(field)
                : checkIn === "query"
                    ? query(field)
                    : check(field)

        if (!customFunction)
            throw new Error(`For validation type 'customSanitizer', customFunction is required`);

        return toMatch.customSanitizer((value,reqObject) => {

            const toSend = {
                value,
                reqObject,
                field
            }

            return customFunction(toSend)
        })
    }

    /**
     * To convert the field's value into lowercase
     *
     * @param validation_options
     * @protected
     * @sanitizer
     */
    protected _lowerCase(validation_options: IValidationLowercaseDto) {
        const {
            field,
            checkIn = "any",
        } = validation_options;

        const toMatch = checkIn === "any"
            ? check(field)
            : checkIn === "params"
                ? param(field)
                : checkIn === "query"
                    ? query(field)
                    : check(field)


        return toMatch
            .if((value : unknown) => value !== undefined)
            .toLowerCase()
    }

    /**
     * To convert the field's value into lowercase
     *
     * @param validation_options
     * @protected
     * @sanitizer
     */
    protected _upperCase(validation_options: IValidationUppercaseDto) {
        const {
            field,
            checkIn = "any",
        } = validation_options;

        const toMatch = checkIn === "any"
            ? check(field)
            : checkIn === "params"
                ? param(field)
                : checkIn === "query"
                    ? query(field)
                    : check(field)


        return toMatch
            .if((value : unknown) => value !== undefined)
            .toUpperCase()
    }

    /**
     * To validate that field is required if the other field value not exists/have some certain value.
     *
     * @param validation_options
     * @protected
     */
    protected _requiredIfNot(validation_options: IValidationRequiredIfNotDto) {

        const {
            field,
            checkIn = "any",
            params = {
                secondField:"",
                secondFieldValue:""
            }
        } = validation_options;

        let {
            message = "Invalid Value"
        } = validation_options;

        if (params.secondField === "" && !params.secondField)
            throw new Error(
                "'required_if_not' Validation Expect 'secondField' not empty"
            );

        if (params.secondFieldValue === "" && !params.secondFieldValue)
            throw new Error(
                "'required_if_not' Validation Expect 'secondFieldValue' not empty"
            );

        const toMatch = checkIn === "any"
            ? check(field)
            : checkIn === "params"
                ? param(field)
                : checkIn === "query"
                    ? query(field)
                    : check(field)

        return toMatch.custom((value, { req, location }) => {

            /**
             * To use params in the messages
             */
            message = message
                .replace(/:secondField/,String(params.secondField))
                .replace(/:secondFieldValue/,String(params.secondFieldValue))

            const getObject =
                location === "body"
                    ? req.body
                    : location === "query"
                    ? req.query
                    : req.params;

            const appliedFieldValueIsEmpty = value === undefined || value === null || value === "" || value?.length === 0;

            const paramValue = get(
                getObject,
                params.secondField,
                undefined
            );

            /**
             * If the secondFieldValue passed is 'exists'
             * and the actualValue is not undefined
             * but the field value is empty
             */
            if (params.secondFieldValue === "exists" && paramValue !== undefined && appliedFieldValueIsEmpty) {
                return Promise.reject(message);
            }

            /**
             * If the secondFieldValue passed is 'notexists'
             * and the actualValue is undefined
             * but the field value is empty
             */
            if (params.secondFieldValue === "notexists" && paramValue === undefined && appliedFieldValueIsEmpty) {
                return Promise.reject(message);
            }

            /**
             * If the secondFieldValue is equal to the request payload value
             * but the field value is empty
             */
            if (isEqual(String(paramValue),params.secondFieldValue) && appliedFieldValueIsEmpty) {
                return Promise.reject(message);
            }

            return Promise.resolve();
        });

    }
}