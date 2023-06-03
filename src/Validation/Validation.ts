/**
 * Importing DTOS
 */
import {
    ICustomValidationDto,
    IIntegerValidationDto,
    IValidationSameDto,
    IIsArrayValidationDto,
    IValidationIsUUIDDto,
    IValidationAfterDto,
    IValidationInDto,
    IValidationIsValidMongoIdDto,
    IValidationNoinDto,
    IValidationIsDateDto,
    IValidationRequiredWithDto,
    IValidationRangeorbetweenDto,
    IValidationIsobjectDto,
    IValidationIfDto,
    IValidationArraynotemptyDto,
    IValidationCustomSanitizerDto,
    IValidationLowercaseDto,
    IValidationUppercaseDto,
    IValidationRequiredIfNotDto,
    IValidationIsstringDto,
    IValidationTrimDto,
    IValidationReplaceDto,
    IValidationIsjwtDto,
    IRequiredValidationDto,
    IValidationIsStrongPasswordDto,
    IValidationIsEmailDto
} from "./dtos";

import {get, isEqual} from "lodash";

/**
 * Local Imports
 */
import {Util} from "../Utils/Util";
import {ValidationChain} from "express-validator";

export class Validation {

    /**
     * For Requiring Any Field
     *
     * @param {IRequiredValidationDto} validation_options
     * @return {Function}
     */
    static required(validation_options: IRequiredValidationDto = {}): Function {

        const {
            customFunction,
            bail = false,
            checkIn = "any"
        } = validation_options;

        let {
            message = `The :attribute is required`,
        } = validation_options

        return (field: string) => {

            const toMatch = Util.returnBasedOnCheckIn(checkIn, field);

            message = Util.replaceMessageWithField(field, message);

            if (customFunction) {

                const customFunctionParams: ICustomValidationDto = {
                    customFunction,
                    checkIn,
                    bail
                }

                const executeCustomFunction = Validation.custom(customFunctionParams);

                return executeCustomFunction(field)
            }

            let chain: ValidationChain = toMatch
                .notEmpty()
                .withMessage((value: unknown) => message.replace(/(:value)|(:data)/ig, `${value}`));

            if (bail) {
                return chain.bail({level: "request"});
            }

            return chain;
        }
    }

    /**
     * For Checking If Field Is An Integer
     *
     * @param {IIntegerValidationDto} validation_options
     * @return { Function }
     */
    static integer(validation_options: IIntegerValidationDto = {}): Function {

        const {
            customFunction,
            checkIn = "any",
            bail = false,
            params,
        } = validation_options;

        let {
            message = `The :attribute must be of type integer`,
        } = validation_options;


        return (field: string) => {

            const toMatch = Util.returnBasedOnCheckIn(checkIn, field);

            message = Util.replaceMessageWithField(field, message);

            if (customFunction) {
                const customFunctionParams: ICustomValidationDto = {
                    customFunction,
                    checkIn,
                    bail
                }

                const executeCustomFunction = Validation.custom(customFunctionParams);

                return executeCustomFunction(field)
            }

            let checkIfIntegerBuilder: ValidationChain = toMatch
                .if((value: unknown) => value !== undefined)
                .isInt(params);

            if (params && params.strict === true) {
                checkIfIntegerBuilder = checkIfIntegerBuilder.custom((value) => {
                    return typeof value !== "number"
                        ? Promise.reject(message)
                        : Promise.resolve()
                });
            }

            checkIfIntegerBuilder = checkIfIntegerBuilder
                .withMessage((value: unknown) => message.replace(/(:value)|(:data)/ig, `${value}`));

            if (bail) {
                return checkIfIntegerBuilder.bail({level: "request"})
            }

            return checkIfIntegerBuilder;
        }
    }

    /**
     * For Checking If The Field Is An Array
     *
     * @param {IIsArrayValidationDto} validation_options
     * @return { Function }
     */
    static isArray(validation_options: IIsArrayValidationDto = {}): Function {
        const {
            customFunction,
            checkIn = "any",
            bail = false,
            params = {
                min: undefined,
                max: undefined
            }
        } = validation_options;

        let {
            message = `The :attribute must be of type array`,
        } = validation_options;

        if (params) {

            const allowedDataTypes = ["number", "undefined", "null"]

            const onlyMinOrMaxShouldExists = Object.keys(params).every(key => key === 'min' || key === 'max');

            if (
                !onlyMinOrMaxShouldExists
            ) {
                throw new Error(`The array validation only accepts 'min' and 'max' keys`);
            }

            if (!allowedDataTypes.includes(typeof params["min"]) || !allowedDataTypes.includes(typeof params["max"])) {
                throw new Error(`The array validation params can only be of the following types ${allowedDataTypes}`)
            }

        }

        /**
         * Replace with a tag
         */
        message = message
            .replace(/:min/g, String(params.min))
            .replace(/:max/g, String(params.max));

        return (field: string) => {

            const toMatch = Util.returnBasedOnCheckIn(checkIn, field);

            message = Util.replaceMessageWithField(field, message);

            if (customFunction) {
                const customFunctionParams: ICustomValidationDto = {
                    customFunction,
                    params,
                    checkIn,
                    bail
                }
                const executeCustomFunction = Validation.custom(customFunctionParams);

                return executeCustomFunction(field)
            }

            let chain: ValidationChain = toMatch
                .if((value: unknown) => value !== undefined)
                .isArray(params)
                .withMessage((value: unknown) => message.replace(/(:value)|(:data)/ig, `${value}`));

            if (bail) {
                return chain.bail({level: "request"})
            }

            return chain;
        }
    }

    /**
     * For Custom Validation
     *
     * @param validation_options
     */
    static custom(validation_options: ICustomValidationDto): Function {

        const {
            customFunction,
            checkIn = "any",
            bail = false,
            params,
        } = validation_options;


        if (!customFunction)
            throw new Error(`For validation type 'custom', customFunction is required`);

        return (field: string) => {

            const toMatch = Util.returnBasedOnCheckIn(checkIn, field);

            let chain: ValidationChain = toMatch.custom((value, reqObject) => {

                const toSend = {
                    value,
                    reqObject,
                    field,
                    params
                }

                return customFunction(toSend)
            });

            if (bail) {
                return chain.bail({level: "request"})
            }

            return chain;
        }

    }

    /**
     * To validate the field by the given values
     *
     * @param validation_options
     */
    static in(validation_options: IValidationInDto): Function {

        const {
            checkIn = "any",
            bail = false,
            params = {
                values: []
            }
        } = validation_options;

        let {
            message = `The :attribute Must Be In ${params.values}`,
        } = validation_options;

        if (params.values.length === 0)
            throw new Error(`The 'in' validation must have params field with values`);

        /**
         * Replace with a tag
         */
        message = message.replace(/:values/g, String(params.values));

        return (field: string) => {

            const toMatch = Util.returnBasedOnCheckIn(checkIn, field);

            message = Util.replaceMessageWithField(field, message);

            let chain: ValidationChain = toMatch
                .if((value: unknown) => value !== undefined)
                .isIn(params.values)
                .withMessage((value: unknown) => message.replace(/(:value)|(:data)/ig, `${value}`));

            if (bail) {
                return chain.bail({level: "request"})
            }

            return chain;
        }
    }

    /**
     * To validate that the field values not in the provided values
     *
     * @param validation_options
     */
    static notIn(validation_options: IValidationNoinDto): Function {
        const {
            checkIn = "any",
            bail = false,
            params = {
                values: []
            },
        } = validation_options;

        let {
            message = `The :attribute Must Not In ${params.values}`,
        } = validation_options;

        if (params.values.length === 0)
            throw new Error(`The 'notIn' validation must have params field with values`);


        /**
         * Replace the params value with a tag
         */
        message = message.replace(/:values/g, String(params.values));

        return (field: string) => {

            const toMatch = Util.returnBasedOnCheckIn(checkIn, field);

            message = Util.replaceMessageWithField(field, message)

            let chain: ValidationChain = toMatch
                .if((value: unknown) => value !== undefined)
                .not()
                .isIn(params.values)
                .withMessage((value: unknown) => message.replace(/(:value)|(:data)/ig, `${value}`));


            if (bail) {
                return chain.bail({level: "request"})
            }

            return chain;
        }
    }

    /**
     * To validate that the field values is in between the given values
     *
     * @param validation_options
     */
    static rangeOrBetween(validation_options: IValidationRangeorbetweenDto): Function {
        const {
            checkIn = "any",
            bail = false,
            params: {min = 1, max = 1, type = "number"} = {},
            customFunction,
        } = validation_options;

        let {
            message = `The Field :attribute Must Be Between ${min}${type === "field" ? "'value" : ''} and ${max}${type === "field" ? "'value" : ''}`,
        } = validation_options;

        const supportedTypes = ["number", "date", "field"];

        if (!min || min === "")
            throw new Error("'between' validation first param (min value) is required")

        if (!max || max === "")
            throw new Error("'between' validation second param (max value) is required")

        if (typeof min !== typeof max)
            throw new Error("'between' validation params (min and max) must be of same datatype")

        if (!supportedTypes.includes(type))
            throw new Error(`'between' validation third param (Optional) can only contain ${supportedTypes}`)


        /**
         * To use params in the messages
         */
        message = message
            .replace(/:min/g, String(min))
            .replace(/:max/g, String(max))

        return (field: string) => {

            const toMatch = Util.returnBasedOnCheckIn(checkIn, field);

            message = Util.replaceMessageWithField(field, message);

            if (customFunction) {
                const customFunctionParams: ICustomValidationDto = {
                    customFunction,
                    params: validation_options.params,
                    checkIn,
                    bail,
                }

                const executeCustomFunction = Validation.custom(customFunctionParams);

                return executeCustomFunction(field)
            }

            let chain: ValidationChain = toMatch.if((value: any) => value !== undefined).custom((value, {
                req,
                location
            }) => {

                const getObject =
                    location === "body"
                        ? req.body
                        : location === "query"
                            ? req.query
                            : req.params;

                const isBetweenNumber = type === "number"
                    ? (value > +min) && (value < +max)
                    : false;

                const isBetweenDate = type === "date"
                    ? (new Date(value) > new Date(min)) && (new Date(value) < new Date(max))
                    : false;

                let isBetweenFieldValue = false;

                if (type === "field") {
                    // @ts-ignore
                    const minValueOfTheField = get(getObject, min)
                    // @ts-ignore
                    const maxValueOfTheField = get(getObject, max);

                    //To get a boolean value
                    const isDate = !isNaN(Date.parse(minValueOfTheField)) && !isNaN(Date.parse(maxValueOfTheField));

                    /**
                     * If isDate is true
                     */
                    if (isDate) {
                        isBetweenFieldValue = (new Date(value) > new Date(minValueOfTheField)) && (new Date(value) < new Date(maxValueOfTheField))
                    } else {
                        isBetweenFieldValue = (value > minValueOfTheField) && (value < maxValueOfTheField)
                    }

                }

                const toCheck = type === "number"
                    ? isBetweenNumber
                    : type === "date"
                        ? isBetweenDate
                        : isBetweenFieldValue;

                return toCheck ? Promise.resolve : Promise.reject(message);
            }).withMessage((value: unknown) => message.replace(/(:value)|(:data)/ig, `${value}`));

            if (bail) {
                return chain.bail({level: "request"})
            }

            return chain;
        }

    }

    /**
     * To validate that the field is a valid js object
     *
     * @param validation_options
     */
    static isObject(validation_options: IValidationIsobjectDto = {}): Function {

        const {
            checkIn = "any",
            bail = false,
            params = {
                strict: true
            },
            customFunction,
        } = validation_options;

        let {
            message = `The Field :attribute Must Be Of Type Object`,
        } = validation_options;

        return (field: string) => {

            const toMatch = Util.returnBasedOnCheckIn(checkIn, field);

            message = Util.replaceMessageWithField(field, message);

            if (customFunction) {
                const customFunctionParams: ICustomValidationDto = {
                    customFunction,
                    params,
                    checkIn,
                    bail
                }
                const executeCustomFunction = Validation.custom(customFunctionParams);

                return executeCustomFunction(field)
            }

            let chain: ValidationChain = toMatch
                .if((value: any) => value !== undefined)
                .isObject(params)
                .withMessage((value: unknown) => message.replace(/(:value)|(:data)/ig, `${value}`));

            if (bail) {
                return chain.bail({level: "request"})
            }

            return chain;
        }
    }

    /**
     * To validate a field on a condition
     *
     * @param validation_options
     */
    static if(validation_options: IValidationIfDto): Function {
        const {
            checkIn = "any",
            params = {
                secondField: "",
                secondFieldValue: "",
                appliedOnFieldValue: ""
            },
            bail = false,
        } = validation_options;

        let {
            message = `Invalid Value`,
        } = validation_options


        if (params.secondField === "" || params.secondFieldValue === "" || params.appliedOnFieldValue === "") {
            throw new Error("Validation (If) Excepts All 3 params to be passed" +
                " params.secondField " +
                " params.secondFieldValue " +
                " params.appliedOnFieldValue ");
        }

        /**
         * To use params in the messages
         */
        message = message
            .replace(/:secondField/g, String(params.secondField))
            .replace(/:secondFieldValue/g, String(params.secondFieldValue))
            .replace(/:appliedOnFieldValue/g, String(params.appliedOnFieldValue));

        return (field: string) => {

            const toMatch = Util.returnBasedOnCheckIn(checkIn, field);

            message = Util.replaceMessageWithField(field, message);

            let chain: ValidationChain = toMatch.custom((value, {req, location}) => {

                const defaultValues = ["exists", "notexists"];

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
                 * If secondFieldValue is set to exists and appliedOnFieldValue is set to exists
                 */
                if (params.secondFieldValue === "exists" && params.appliedOnFieldValue === "exists") {

                    /**
                     * If the actual value and the secondFieldValue does exists
                     */
                    if (value == null && getFieldValue !== "exist_false") {
                        return Promise.reject(message)
                    }

                }

                /**
                 * If secondFieldValue is set to exists and the appliedOnFieldValue is set to notexists
                 */
                if (params.secondFieldValue === "exists" && params.appliedOnFieldValue === "notexists") {

                    /**
                     * If the current/actual value exists and the secondField value exists
                     */
                    if (value != null && getFieldValue !== "exist_false") {
                        return Promise.reject(message)
                    }

                }

                /**
                 * If secondFieldValue is set to notexists and appliedOnFieldValue is set to exists
                 */
                if (params.secondFieldValue === "notexists" && params.appliedOnFieldValue === "exists") {

                    /**
                     * If the secondField value is null/or does not exists and
                     * the actual value/appliedOnValue is null
                     */
                    if (getFieldValue === "exist_false" && value == null) {
                        return Promise.reject(message)
                    }

                }

                /**
                 * If secondFieldValue is set to notexists and appliedOnFieldValue is set to notexists
                 */
                if (params.secondFieldValue === "notexists" && params.appliedOnFieldValue === "notexists") {

                    /**
                     * If secondValue is null but the actual/appliedOnField Value exists
                     */
                    if (getFieldValue === "exist_false" && value != null) {
                        return Promise.reject(message)
                    }

                }

                /**
                 * If secondFieldValue is set to exists and the appliedOnFieldValue is neither set to exists nor notexists
                 */
                if (params.secondFieldValue === "exists" && !defaultValues.includes(params.appliedOnFieldValue)) {

                    /**
                     * If secondFieldValue is not null and the current value is not equal to appliedOnFieldValue
                     */
                    if (getFieldValue !== "exist_false" && value !== params.appliedOnFieldValue) {
                        return Promise.reject(message)
                    }

                }

                /**
                 * If secondFieldValue is set to notexists and the appliedOnFieldValue is neither set to exists nor notexists
                 */
                if (params.secondFieldValue === "notexists" && !defaultValues.includes(params.appliedOnFieldValue)) {

                    /**
                     * If secondFieldValue is null and the current value is not equal to appliedOnFieldValue
                     */
                    if (getFieldValue === "exist_false" && value !== params.appliedOnFieldValue) {
                        return Promise.reject(message)
                    }

                }

                /**
                 * If appliedOnFieldValue is set to exists and the secondFieldValue is neither set to exists nor notexists
                 */
                if (params.appliedOnFieldValue === "exists" && !defaultValues.includes(params.secondFieldValue)) {

                    /**
                     * If current value is not null and the secondFieldValue is not equal to the actual second Field Value
                     */
                    if (value != null && !isEqual(JSON.stringify(params.secondFieldValue), JSON.stringify(getFieldValue))) {
                        return Promise.reject(message)
                    }

                }

                /**
                 * If appliedOnFieldValue is set to notexists and the secondFieldValue is neither set to exists nor notexists
                 */
                if (params.appliedOnFieldValue === "notexists" && !defaultValues.includes(params.secondFieldValue)) {

                    /**
                     * If current value is not null and the secondFieldValue is not equal to the actual second Field Value
                     */
                    if (value == null && !isEqual(JSON.stringify(params.secondFieldValue), JSON.stringify(getFieldValue))) {
                        return Promise.reject(message)
                    }

                }

                /**
                 * If secondFieldValue value is neither set to exists nor notexists and appliedOnFieldValue is set to exists
                 */
                if (!defaultValues.includes(params.secondFieldValue) && params.appliedOnFieldValue === "exists") {

                    /**
                     * If secondFieldValue is equal to the actual secondField Value
                     * But the appliedOnValue value does not exists
                     */
                    if (isEqual(JSON.stringify(params.secondFieldValue), JSON.stringify(getFieldValue)) && value == null) {
                        return Promise.reject(message)
                    }

                }

                /**
                 * If secondFieldValue value is neither set to exists nor notexists and appliedOnFieldValue is set to notexists
                 */
                if (!defaultValues.includes(params.secondFieldValue) && params.appliedOnFieldValue === "notexists") {

                    /**
                     * If secondFieldValue is equal to the actual secondField Value
                     * But the appliedOnValue value exists
                     */
                    if (isEqual(JSON.stringify(params.secondFieldValue), JSON.stringify(getFieldValue)) && value != null) {
                        return Promise.reject(message)
                    }

                }

                /**
                 * If secondFieldValue is same as appliedOnFieldValue
                 */
                if (params.secondFieldValue === params.appliedOnFieldValue) {

                    if (value !== getFieldValue) {
                        return Promise.reject(message)
                    }
                }

                /**
                 * Pass the validation
                 */
                return Promise.resolve();
            });

            if (bail) {
                return chain.bail({level: "request"})
            }

            return chain;
        }
    }

    /**
     * To validate that the field does not contain an empty array
     *
     * @param validation_options
     */
    static arrayNotEmpty(validation_options: IValidationArraynotemptyDto = {}): Function {
        const {
            checkIn = "any",
            customFunction,
            bail = false,
        } = validation_options;

        let {
            message = `The :attribute must not be empty array`,
        } = validation_options


        return (field: string) => {

            const toMatch = Util.returnBasedOnCheckIn(checkIn, field);

            message = Util.replaceMessageWithField(field, message);

            if (customFunction) {

                const customFunctionParams: ICustomValidationDto = {
                    customFunction,
                    checkIn,
                    bail
                }

                const executeCustomFunction = Validation.custom(customFunctionParams);

                return executeCustomFunction(field)
            }

            let chain: ValidationChain = toMatch
                .if((value: unknown) => value !== undefined)
                .custom((value) => {
                    return value.length > 0
                        ? Promise.resolve()
                        : Promise.reject(message);
                }).withMessage((value: unknown) => message.replace(/(:value)|(:data)/ig, `${value}`));

            if (bail) {
                return chain.bail({level: "request"});
            }

            return chain;
        }
    }

    /**
     * For Custom Sanitizer
     *
     * @param validation_options
     */
    static customSanitizer(validation_options: IValidationCustomSanitizerDto): Function {
        const {
            customFunction,
            checkIn = "any",
        } = validation_options;


        if (!customFunction)
            throw new Error(`For validation type 'customSanitizer', customFunction is required`);

        return (field: string) => {

            const toMatch = Util.returnBasedOnCheckIn(checkIn, field);

            return toMatch.customSanitizer((value, reqObject) => {

                const toSend = {
                    value,
                    reqObject,
                    field
                }

                return customFunction(toSend)
            })
        }
    }

    /**
     * To convert the field's value into lowercase
     *
     * @param validation_options
     * @sanitizer
     */
    static lowerCase(validation_options: IValidationLowercaseDto = {}): Function {
        const {
            checkIn = "any",
        } = validation_options;

        return (field: string) => {

            const toMatch = Util.returnBasedOnCheckIn(checkIn, field);

            return toMatch
                .if((value: unknown) => value !== undefined)
                .toLowerCase()
        }
    }

    /**
     * To convert the field's value into lowercase
     *
     * @param validation_options
     * @sanitizer
     */
    static upperCase(validation_options: IValidationUppercaseDto = {}): Function {
        const {
            checkIn = "any",
        } = validation_options;

        return (field: string) => {

            const toMatch = Util.returnBasedOnCheckIn(checkIn, field);

            return toMatch
                .if((value: unknown) => value !== undefined)
                .toUpperCase()

        }

    }

    /**
     * To validate that field is required if the other field value not exists/have some certain value.
     *
     * @param validation_options
     */
    static requiredIfNot(validation_options: IValidationRequiredIfNotDto): Function {

        const {
            checkIn = "any",
            bail = false,
            params = {
                secondField: "",
                secondFieldValue: ""
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

        /**
         * To use params in the messages
         */
        message = message
            .replace(/:secondField/g, String(params.secondField))
            .replace(/:secondFieldValue/g, String(params.secondFieldValue))


        return (field: string) => {

            const toMatch = Util.returnBasedOnCheckIn(checkIn, field);

            message = Util.replaceMessageWithField(field, message)

            let chain: ValidationChain = toMatch.custom((value, {req, location}) => {
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
                 * and the actualValue is undefined
                 * but the field value is empty
                 */
                if (params.secondFieldValue === "exists" && paramValue === undefined && appliedFieldValueIsEmpty) {
                    return Promise.reject(message);
                }

                /**
                 * If the secondFieldValue passed is 'notexists'
                 * and the actualValue not is undefined
                 * but the field value is empty
                 */
                if (params.secondFieldValue === "notexists" && paramValue !== undefined && appliedFieldValueIsEmpty) {
                    return Promise.reject(message);
                }

                /**
                 * If the secondFieldValue is equal to the request payload value
                 * and the current field value is empty
                 */
                if (!isEqual(JSON.stringify(paramValue), JSON.stringify(params.secondFieldValue)) && appliedFieldValueIsEmpty) {
                    return Promise.reject(message);
                }

                return Promise.resolve();
            })
                .withMessage((value: unknown) => message.replace(/(:value)|(:data)/ig, `${value}`));

            if (bail) {
                return chain.bail({level: "request"})
            }

            return chain;
        }
    }

    /**
     * To validate that the field is of type string.
     *
     * @param {IValidationIsstringDto} validation_options
     */
    static isString(validation_options: IValidationIsstringDto = {}): Function {
        const {
            checkIn = "any",
            bail = false,
            params = {
                min: undefined,
                max: undefined
            }
        } = validation_options;

        let {
            message = `The field :attribute is not of type string`
        } = validation_options;


        /**
         * Including the params value by replacing with a tag
         */
        message = message.replace(/(:min)/ig, `${params.min}`);
        message = message.replace(/(:max)/ig, `${params.max}`);


        return (field: string) => {

            const toMatch = Util.returnBasedOnCheckIn(checkIn, field);

            message = Util.replaceMessageWithField(field, message);

            let chain: ValidationChain = toMatch
                .if((value: unknown) => value !== undefined)
                .isString()
                .withMessage((value: unknown) => message.replace(/(:value)|(:data)/ig, `${value}`))
                .isLength(params)
                .withMessage((value: unknown) => message.replace(/(:value)|(:data)/ig, `${value}`));

            if (bail) {
                return chain.bail({level: "request"})
            }

            return chain;
        }
    }

    /**
     * To trim string
     *
     * @param validation_options
     * @sanitizer
     */
    static trim(validation_options: IValidationTrimDto): Function {
        const {
            params = {
                chars: ""
            },
            checkIn = "any",
        } = validation_options;

        return (field: string) => {

            const toMatch = Util.returnBasedOnCheckIn(checkIn, field);

            return toMatch
                .if((value: unknown) => value !== undefined)
                .trim(params.chars);
        }
    }

    /**
     * To replace field value
     *
     * @param validation_options
     * @sanitizer
     */
    static replace(validation_options: IValidationReplaceDto): Function {
        const {
            params = {
                value_to_replace: "",
                new_value: ""
            },
            checkIn = "any",
        } = validation_options;

        return (field: string) => {

            const toMatch = Util.returnBasedOnCheckIn(checkIn, field);

            return toMatch
                .if((value: unknown) => value !== undefined)
                .customSanitizer((value: string) => {
                    return value.replace(params.value_to_replace, params.new_value);
                })
        }
    }

    /**
     * To validate if the field's value is a valid jwt token
     *
     * @param validation_options
     */
    static isJwt(validation_options: IValidationIsjwtDto = {}): Function {

        const {
            checkIn = "any",
            bail = false,
        } = validation_options;

        let {
            message = "Invalid JWT Token"
        } = validation_options;


        return (field: string) => {

            const toMatch = Util.returnBasedOnCheckIn(checkIn, field);

            message = Util.replaceMessageWithField(field, message);

            let chain: ValidationChain = toMatch
                .isJWT()
                .withMessage((value: unknown) => message.replace(/(:value)|(:data)/ig, `${value}`));

            if (bail) {
                return chain.bail({level: "request"})
            }

            return chain;
        }
    }

    /**
     * Check if the string is a strong password
     *
     * @param {IValidationIsStrongPasswordDto} [validation_options]
     * @validation
     */
    static isStrongPassword(validation_options: IValidationIsStrongPasswordDto = {}): Function {

        const {
            checkIn = "any",
            bail = false,
            params = {
                pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
            }
        } = validation_options;

        let {
            message = `The :attribute does not have a strong password`
        } = validation_options;

        if (params.pattern != null && !(params.pattern instanceof RegExp)) {
            throw new Error(`(isStrongPassword) validation pattern must be a regex`)
        }

        return (field: string) => {

            const toMatch = Util.returnBasedOnCheckIn(checkIn, field);

            message = Util.replaceMessageWithField(field, message);

            let chain: ValidationChain = toMatch
                .custom((value) => {
                    if (params.pattern !== undefined) {

                        return params.pattern.test(value)
                            ? Promise.resolve()
                            : Promise.reject(message)
                    }
                })
                .withMessage((value: unknown) => message.replace(/(:value)|(:data)/ig, `${value}`));

            if (bail) {
                return chain.bail({level: "request"})
            }

            return chain;

        }

    }

    /**
     * To check if the string is a valid email address
     *
     * @param {IValidationIsEmailDto} [validation_options]
     */
    static isEmail(validation_options: IValidationIsEmailDto = {}): Function {

        const {
            checkIn = "any",
            bail = false,
            params = {
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            }
        } = validation_options;

        let {
            message = `The :attribute is not a valid email address`
        } = validation_options;

        if (params.pattern != null && !(params.pattern instanceof RegExp)) {
            throw new Error(`(isEmail) validation pattern must be a regex`)
        }

        return (field: string) => {

            const toMatch = Util.returnBasedOnCheckIn(checkIn, field);

            message = Util.replaceMessageWithField(field, message);

            let chain: ValidationChain = toMatch
                .custom((value) => {
                    if (params.pattern !== undefined) {

                        return params.pattern.test(value)
                            ? Promise.resolve()
                            : Promise.reject(message)
                    }
                })
                .withMessage((value: unknown) => message.replace(/(:value)|(:data)/ig, `${value}`));

            if (bail) {
                return chain.bail({level: "request"})
            }

            return chain;
        }
    }

    /**
     * Check if the field value is same or not same as the current field value
     *
     * @param validation_options
     */
    static same(validation_options: IValidationSameDto): Function {

        const {
            checkIn = "any",
            bail = false,
            params = {
                negate: false,
                otherField: ""
            }
        } = validation_options;

        let {
            message = `The :attribute is not same as ${params.otherField}'s value`
        } = validation_options;

        if (!Boolean(params.otherField)) {
            throw new Error(`(same) validation method expect params.otherField to be defined`);
        }

        return (field: string) => {

            const toMatch = Util.returnBasedOnCheckIn(checkIn, field);

            message = Util.replaceMessageWithField(field, message);

            let chain: ValidationChain = toMatch.custom((value, {req, location}) => {

                const requestObject =
                    location === "body"
                        ? req.body
                        : location === "query"
                            ? req.query
                            : location === "headers"
                                ? req.headers
                                : req.params;

                const getOtherFieldValue = get(requestObject, params.otherField, false);

                const isSame = JSON.stringify(getOtherFieldValue) === JSON.stringify(value);

                /**
                 * If params.negate is true and the values are same then Reject, else
                 * if params.negate is false and the values are not same then Reject, else
                 * Pass
                 */
                return params.negate && isSame
                    ? Promise.reject(message)
                    : !params.negate && !isSame
                        ? Promise.reject(message)
                        : Promise.resolve()
            })

            if (bail) {
                return chain.bail({level: "request"})
            }

            return chain;

        }
    }

    /**
     * To check if the field exist if any of its peers exists too.
     *
     * @param validation_options
     */
    static requiredWith(validation_options: IValidationRequiredWithDto): Function {

        const {
            checkIn = "any",
            bail = false,
            params = {
                fields: []
            }
        } = validation_options;

        let {
            message = `The :attribute required with any one of the following fields ${params.fields}`
        } = validation_options;

        if (!Boolean(params.fields)) {
            throw new Error(`(requiredWith) validation, params.fields must not be empty array`);
        }

        if (!Array.isArray(params.fields)) {
            throw new Error(`(requiredWith) validation, params.fields must be of type array`);
        }

        return (field: string) => {

            const toMatch = Util.returnBasedOnCheckIn(checkIn, field);

            message = Util.replaceMessageWithField(field, message);

            let chain: ValidationChain = toMatch.custom((value, {req, location}) => {

                const requestObject =
                    location === "body"
                        ? req.body
                        : location === "query"
                            ? req.query
                            : location === "headers"
                                ? req.headers
                                : req.params;

                const anyOfTheOtherFieldExists = params.fields.some((otherField: string) =>
                    Boolean(
                        get(requestObject, otherField, false)
                    )
                );

                const doesCurrentFieldExist = Boolean(value);

                if (anyOfTheOtherFieldExists && !doesCurrentFieldExist) {
                    return Promise.reject(message);
                }

                return Promise.resolve();
            });

            if (bail) {
                return chain.bail({level: "request"})
            }

            return chain;

        }
    }

    /**
     * To check if the field exist if all of its peers exists too.
     *
     * @param validation_options
     */
    static requiredWithAll(validation_options: IValidationRequiredWithDto): Function {

        const {
            checkIn = "any",
            bail = false,
            params = {
                fields: []
            }
        } = validation_options;

        let {
            message = `The :attribute required with all of the following fields ${params.fields}`
        } = validation_options;

        if (!Boolean(params.fields)) {
            throw new Error(`(requiredWithAll) validation, params.fields must not be empty array`);
        }

        if (!Array.isArray(params.fields)) {
            throw new Error(`(requiredWithAll) validation, params.fields must be of type array`);
        }

        return (field: string) => {

            const toMatch = Util.returnBasedOnCheckIn(checkIn, field);

            message = Util.replaceMessageWithField(field, message);

            let chain: ValidationChain = toMatch.custom((value, {req, location}) => {

                const requestObject = Util.getRequestObject(req, location);

                const allOfTheFieldsExists = params.fields.every((otherField: string) =>
                    Boolean(
                        get(requestObject, otherField, false)
                    )
                );

                const doesCurrentFieldExist = Boolean(value);

                if (allOfTheFieldsExists && !doesCurrentFieldExist) {
                    return Promise.reject(message);
                }

                return Promise.resolve();
            });

            if (bail) {
                return chain.bail({level: "request"})
            }

            return chain;

        }
    }

    /**
     * To validate date is after a specified date.
     *
     * @param validation_options
     */
    static after(validation_options: IValidationAfterDto): Function {

        const {
            checkIn = "any",
            bail = false,
            params = {
                date: ""
            }
        } = validation_options;

        let {
            message = `The :attribute's date is not after ${params.date}`
        } = validation_options;

        if (typeof params.date !== 'string') {
            throw new Error(`(after) validation, params.date must be of type string`);
        }

        return (field: string) => {

            const toMatch = Util.returnBasedOnCheckIn(checkIn, field);

            message = Util.replaceMessageWithField(field, message);

            /**
             * If date is set to tomorrow
             */
            if (params.date === "tomorrow") {
                const today = new Date();
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);
                let chain: ValidationChain = toMatch
                    .if((value: any) => value !== undefined)
                    .isAfter(tomorrow.toString())
                    .withMessage((value: unknown) => message.replace(/(:value)|(:data)/ig, `${value}`));

                if (bail) {
                    return chain.bail({level: "request"})
                }

                return chain;
            }

            /**
             * If date is set to day
             */
            if (params.date === "today") {
                const today = new Date();
                let chain: ValidationChain = toMatch
                    .if((value: any) => value !== undefined)
                    .isAfter(today.toString())
                    .withMessage((value: unknown) => message.replace(/(:value)|(:data)/ig, `${value}`));

                if (bail) {
                    return chain.bail({level: "request"})
                }

                return chain;
            }

            /**
             * If set a specific date
             */
            if (!isNaN(Date.parse(params.date))) {
                let chain: ValidationChain = toMatch
                    .if((value: any) => value !== undefined)
                    .isAfter(params.date)
                    .withMessage((value: unknown) => message.replace(/(:value)|(:data)/ig, `${value}`));

                if (bail) {
                    return chain.bail({level: "request"})
                }

                return chain;
            }

            /**
             * If matching with another field
             */
            let chain: ValidationChain = toMatch.custom((value, {req, location}) => {

                const requestObject = Util.getRequestObject(req, location);

                const getOtherFieldValue = new Date(get(requestObject, params.date, false));

                const getCurrentDate = new Date(value);

                getOtherFieldValue.setUTCHours(0, 0, 0, 0);

                getCurrentDate.setUTCHours(0, 0, 0, 0);

                if (
                    !(getCurrentDate > getOtherFieldValue)
                ) {
                    return Promise.reject(message);
                }

                return Promise.resolve();

            }).withMessage((value: unknown) => message.replace(/(:value)|(:data)/ig, `${value}`));


            if (bail) {
                return chain.bail({level: "request"})
            }

            return chain;
        }
    }

    /**
     * To validate date is after or equal a specified date.
     *
     * @param validation_options
     */
    static afterOrEqual(validation_options: IValidationAfterDto): Function {

        const {
            checkIn = "any",
            bail = false,
            params = {
                date: ""
            }
        } = validation_options;

        let {
            message = `The :attribute's date is not after or equal to ${params.date}`
        } = validation_options;

        if (typeof params.date !== 'string') {
            throw new Error(`(after) validation, params.date must be of type string`);
        }

        return (field: string) => {

            const toMatch = Util.returnBasedOnCheckIn(checkIn, field);

            message = Util.replaceMessageWithField(field, message);

            /**
             * If date is set to tomorrow
             */
            if (params.date === "tomorrow") {
                const today = new Date();

                today.setUTCHours(0, 0, 0, 0);

                const tomorrow = new Date(today);

                tomorrow.setUTCHours(0, 0, 0, 0);

                tomorrow.setDate(tomorrow.getDate() + 1);

                let chain: ValidationChain = toMatch.custom((value) => {

                    const getCurrentFieldDate = new Date(value);

                    getCurrentFieldDate.setUTCHours(0, 0, 0, 0);

                    if (!(getCurrentFieldDate >= tomorrow)) {
                        return Promise.reject(message)
                    }

                    return Promise.resolve();

                });

                if (bail) {
                    return chain.bail({level: "request"})
                }

                return chain;
            }

            /**
             * If date is set to today
             */
            if (params.date === "today") {

                const today = new Date();

                today.setUTCHours(0, 0, 0, 0);

                let chain: ValidationChain = toMatch.custom((value) => {

                    const getCurrentFieldDate = new Date(value);

                    getCurrentFieldDate.setUTCHours(0, 0, 0, 0);

                    if (!(getCurrentFieldDate >= today)) {
                        return Promise.reject(message)
                    }

                    return Promise.resolve();

                });

                if (bail) {
                    return chain.bail({level: "request"})
                }

                return chain;
            }

            /**
             * If set a specific date
             */
            if (!isNaN(Date.parse(params.date))) {

                const passedDate = new Date(params.date);

                passedDate.setUTCHours(0, 0, 0, 0);

                let chain: ValidationChain = toMatch.custom((value) => {

                    const getCurrentFieldDate = new Date(value);

                    getCurrentFieldDate.setUTCHours(0, 0, 0, 0);

                    if (!(getCurrentFieldDate >= passedDate)) {
                        return Promise.reject(message)
                    }

                    return Promise.resolve();

                });

                if (bail) {
                    return chain.bail({level: "request"})
                }

                return chain;
            }

            /**
             * If matching with another field
             */
            let chain: ValidationChain = toMatch.custom((value, {req, location}) => {

                const requestObject = Util.getRequestObject(req, location);

                const getOtherFieldValue = new Date(get(requestObject, params.date, false));

                const getCurrentDate = new Date(value);

                getOtherFieldValue.setUTCHours(0, 0, 0, 0);

                getCurrentDate.setUTCHours(0, 0, 0, 0);

                if (!(getCurrentDate >= getOtherFieldValue)) {
                    return Promise.reject(message);
                }

                return Promise.resolve();

            }).withMessage((value: unknown) => message.replace(/(:value)|(:data)/ig, `${value}`));

            if (bail) {
                return chain.bail({level: "request"})
            }

            return chain;
        }
    }

    /**
     * Check if the value is a valid UUID
     *
     * @param validation_options
     */
    static isUUID(validation_options: IValidationIsUUIDDto): Function {

        const {
            checkIn = "any",
            bail = false,
            params = {
                version: "all"
            }
        } = validation_options;

        let {
            message = `The :attribute's value is not a valid UUID`
        } = validation_options;


        return (field: string) => {

            const toMatch = Util.returnBasedOnCheckIn(checkIn, field);

            message = Util.replaceMessageWithField(field, message);

            let chain: ValidationChain = toMatch
                .isUUID(params.version)
                .withMessage((value: unknown) => message.replace(/(:value)|(:data)/ig, `${value}`));

            if (bail) {
                return chain.bail({level: "request"})
            }

            return chain;
        }
    }

    /**
     * Check if valid date
     *
     * @param validation_options
     */
    static isDate(validation_options: IValidationIsDateDto = {}): Function {

        const {
            checkIn = "any",
            bail = false,
            params = {
                format: "YYYY-MM-DD",
                delimiters: ["-"],
                strictMode: false
            }
        } = validation_options;

        let {
            message = `The :attribute's value is not a valid date`
        } = validation_options;

        return (field: string) => {

            const toMatch = Util.returnBasedOnCheckIn(checkIn, field);

            message = Util.replaceMessageWithField(field, message);

            let chain: ValidationChain = toMatch
                .isDate(params)
                .withMessage((value: unknown) => message.replace(/(:value)|(:data)/ig, `${value}`));

            if (bail) {
                return chain.bail({level: "request"})
            }

            return chain;
        }
    }

    /**
     * Check if the passed value is a valid mongodb id
     *
     * @param validation_options
     */
    static isValidMongoId(validation_options: IValidationIsValidMongoIdDto = {}): Function {

        const {
            checkIn = "any",
            bail = false
        } = validation_options;

        let {
            message = `The :attribute's value is not a valid mongoDB Id`
        } = validation_options;


        return (field: string) => {

            const toMatch = Util.returnBasedOnCheckIn(checkIn, field);

            message = Util.replaceMessageWithField(field, message);

            let chain: ValidationChain = toMatch
                .isMongoId()
                .withMessage((value: unknown) => message.replace(/(:value)|(:data)/ig, `${value}`));

            if (bail) {
                return chain.bail({level: "request"})
            }

            return chain;
        }
    }
}