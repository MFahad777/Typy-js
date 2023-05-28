/**
 * Importing DTOS
 */
import {
    ICustomValidationDto,
    IIntegerValidationDto,
    IIsArrayValidationDto,
    IValidationInDto,
    IValidationNoinDto,
    IValidationRangeorbetweenDto,
    IValidationIsobjectDto,
    IValidationIfDto,
    IValidationArraynotemptyDto,
    IValidationCustomSanitizerDto,
    IValidationLowercaseDto,
    IValidationUppercaseDto,
    IValidationRequiredIfNotDto,
    IValidationIsstringDto,
    IValidationDistinctDto,
    IValidationTrimDto,
    IValidationReplaceDto,
    IValidationIsjwtDto,
    IRequiredValidationDto
} from "./dtos";

import { get,isEqual,flattenDeep,uniqWith,map } from "lodash";

/**
 * Local Imports
 */
import { Util } from "../Utils/Util";

export class Validation {

    /**
     * For Requiring Any Field
     *
     * @param {IRequiredValidationDto} validation_options
     * @return {Function}
     */
    static required(validation_options : IRequiredValidationDto = {}) : Function {

        const {
            customFunction,
            checkIn = "any"
        } = validation_options;

        let {
            message = `The :attribute is required`,
        } = validation_options

        return (field : string) => {

            const toMatch = Util.returnBasedOnCheckIn(checkIn,field);

            message = Util.replaceMessageWithField(field, message);

            if (customFunction) {

                const customFunctionParams : ICustomValidationDto = {
                    customFunction,
                    checkIn
                }

                const executeCustomFunction = Validation.custom(customFunctionParams);

                return executeCustomFunction(field)
            }

            return toMatch
                .notEmpty()
                .withMessage((value : unknown) => message.replace(/(:value)|(:data)/ig,`${value}`));
        }
    }

    /**
     * For Checking If Field Is An Integer
     *
     * @param {IIntegerValidationDto} validation_options
     * @return { Function }
     */
    static integer(validation_options : IIntegerValidationDto = {}) : Function {

        const {
            customFunction,
            checkIn = "any",
            params,
        } = validation_options;

        let {
            message = `The :attribute must be of type integer`,
        } = validation_options;


        return (field : string) => {

            const toMatch = Util.returnBasedOnCheckIn(checkIn,field);

            message = Util.replaceMessageWithField(field, message);

            if (customFunction) {
                const customFunctionParams : ICustomValidationDto = {
                    customFunction,
                    checkIn
                }

                const executeCustomFunction = Validation.custom(customFunctionParams);

                return executeCustomFunction(field)
            }

            let checkIfIntegerBuilder = toMatch
                .if((value : unknown) => value !== undefined)
                .isInt(params);

            if (params && params.strict === true) {
                checkIfIntegerBuilder = checkIfIntegerBuilder.custom((value) => {
                    return typeof value !== "number"
                        ? Promise.reject(message)
                        : Promise.resolve()
                });
            }

            return checkIfIntegerBuilder
                .withMessage((value : unknown) => message.replace(/(:value)|(:data)/ig,`${value}`));
        }
    }

    /**
     * For Checking If The Field Is An Array
     *
     * @param {IIsArrayValidationDto} validation_options
     * @return { Function }
     */
    static isArray(validation_options : IIsArrayValidationDto = {}): Function {
        const {
            customFunction,
            checkIn = "any",
            params = {
                min:undefined,
                max:undefined
            }
        } = validation_options;

        let {
            message = `The :attribute must be of type array`,
        } = validation_options;

        if (params) {

            const allowedDataTypes = ["number","undefined","null"]

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
            .replace(/:min/g,String(params.min))
            .replace(/:max/g,String(params.max));

        return (field: string) => {

            const toMatch = Util.returnBasedOnCheckIn(checkIn,field);

            message = Util.replaceMessageWithField(field,message);

            if (customFunction) {
                const customFunctionParams : ICustomValidationDto = {
                    customFunction,
                    params,
                    checkIn
                }
                const executeCustomFunction = Validation.custom(customFunctionParams);

                return executeCustomFunction(field)
            }

            return toMatch
                .if((value : unknown) => value !== undefined)
                .isArray(params)
                .withMessage((value : unknown) => message.replace(/(:value)|(:data)/ig,`${value}`));
        }
    }

    /**
     * For Custom Validation
     *
     * @param validation_options
     */
    static custom(validation_options : ICustomValidationDto) : Function {

        const {
            customFunction,
            checkIn = "any",
            params,
        } = validation_options;


        if (!customFunction)
            throw new Error(`For validation type 'custom', customFunction is required`);

        return (field : string) => {

            const toMatch = Util.returnBasedOnCheckIn(checkIn,field);

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

    }

    /**
     * To validate the field by the given values
     *
     * @param validation_options
     */
    static in(validation_options : IValidationInDto) : Function {

        const {
            checkIn = "any",
            params = {
                values : []
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
        message = message.replace(/:values/g,String(params.values));

        return (field : string) => {

            const toMatch = Util.returnBasedOnCheckIn(checkIn,field);

            message = Util.replaceMessageWithField(field, message);

            return toMatch
                .if((value : unknown) => value !== undefined)
                .isIn(params.values)
                .withMessage((value : unknown) => message.replace(/(:value)|(:data)/ig,`${value}`));
        }
    }

    /**
     * To validate that the field values not in the provided values
     *
     * @param validation_options
     */
    static notIn(validation_options : IValidationNoinDto) : Function {
        const {
            checkIn = "any",
            params = {
                values : []
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
        message = message.replace(/:values/g,String(params.values));

        return (field : string) => {

            const toMatch = Util.returnBasedOnCheckIn(checkIn,field);

            message = Util.replaceMessageWithField(field, message)

            return toMatch
                .if((value : unknown) => value !== undefined)
                .not()
                .isIn(params.values)
                .withMessage((value : unknown) => message.replace(/(:value)|(:data)/ig,`${value}`));

        }
    }

    /**
     * To validate that the field values is in between the given values
     *
     * @param validation_options
     */
    static rangeOrBetween(validation_options: IValidationRangeorbetweenDto) : Function {
        const {
            checkIn = "any",
            params: { min = 1, max = 1, type = "number" } = {},
            customFunction,
        } = validation_options;

        let {
            message = `The Field :attribute Must Be Between ${min}${type === "field" ? "'value" : ''} and ${max}${type === "field" ? "'value" : ''}`,
        } = validation_options;

        const supportedTypes = ["number","date","field"];

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
            .replace(/:min/g,String(min))
            .replace(/:max/g,String(max))

        return (field : string) => {

            const toMatch = Util.returnBasedOnCheckIn(checkIn,field);

            message = Util.replaceMessageWithField(field, message);

            if (customFunction) {
                const customFunctionParams : ICustomValidationDto = {
                    customFunction,
                    params: validation_options.params,
                    checkIn
                }
                const executeCustomFunction = Validation.custom(customFunctionParams);

                return executeCustomFunction(field)
            }

            return toMatch.if((value : any) => value !== undefined).custom((value,{ req,location }) => {

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
                    const minValueOfTheField = get(getObject,min)
                    // @ts-ignore
                    const maxValueOfTheField = get(getObject,max);

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

                const toCheck = type === "number"
                    ? isBetweenNumber
                    : type === "date"
                        ? isBetweenDate
                        : isBetweenFieldValue;

                return toCheck ? Promise.resolve : Promise.reject(message);
            }).withMessage((value : unknown) => message.replace(/(:value)|(:data)/ig,`${value}`));
        }

    }

    /**
     * To validate that the field is a valid js object
     *
     * @param validation_options
     */
    static isObject(validation_options : IValidationIsobjectDto = {}) : Function {

        const {
            checkIn = "any",
            params = {
                strict:true
            },
            customFunction,
        } = validation_options;

        let {
            message = `The Field :attribute Must Be Of Type Object`,
        } = validation_options;

        return (field : string) => {

            const toMatch = Util.returnBasedOnCheckIn(checkIn,field);

            message = Util.replaceMessageWithField(field, message);

            if (customFunction) {
                const customFunctionParams : ICustomValidationDto = {
                    customFunction,
                    params,
                    checkIn
                }
                const executeCustomFunction = Validation.custom(customFunctionParams);

                return executeCustomFunction(field)
            }

            return toMatch
                .if((value : any) => value !== undefined)
                .isObject(params)
                .withMessage((value : unknown) => message.replace(/(:value)|(:data)/ig,`${value}`));
        }
    }

    /**
     * To validate a field on a condition
     *
     * @param validation_options
     */
    static if(validation_options: IValidationIfDto) : Function {
        const {
            checkIn = "any",
            params = {
                secondField : "",
                secondFieldValue : "",
                appliedOnFieldValue : ""
            },
        } = validation_options;

        let {
            message = `Invalid Value`,
        } = validation_options


        if (params.secondField === "" || params.secondFieldValue === "" || params.appliedOnFieldValue === ""){
            throw new Error("Validation (If) Excepts All 3 params to be passed" +
                " params.secondField " +
                " params.secondFieldValue " +
                " params.appliedOnFieldValue ");
        }

        /**
         * To use params in the messages
         */
        message = message
            .replace(/:secondField/g,String(params.secondField))
            .replace(/:secondFieldValue/g,String(params.secondFieldValue))
            .replace(/:appliedOnFieldValue/g,String(params.appliedOnFieldValue));

        return (field : string) => {

            const toMatch = Util.returnBasedOnCheckIn(checkIn,field);

            message = Util.replaceMessageWithField(field, message);

            return toMatch.custom((value,{ req, location }) => {

                const defaultValues = ["exists","notexists"];

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
                    if (getFieldValue === "exist_false" && value == null){
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
                    if (getFieldValue === "exist_false" && value != null){
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
                    if (isEqual(JSON.stringify(params.secondFieldValue),JSON.stringify(getFieldValue)) && value == null) {
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
                    if (isEqual(JSON.stringify(params.secondFieldValue),JSON.stringify(getFieldValue)) && value != null) {
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
            })
        }
    }

    /**
     * To validate that the field does not contain an empty array
     *
     * @param validation_options
     */
    static arrayNotEmpty(validation_options: IValidationArraynotemptyDto = {}) : Function {
        const {
            checkIn = "any",
            customFunction
        } = validation_options;

        let {
            message = `The :attribute must not be empty array`,
        } = validation_options


        return (field : string) => {

            const toMatch = Util.returnBasedOnCheckIn(checkIn,field);

            message = Util.replaceMessageWithField(field, message);

            if (customFunction) {

                const customFunctionParams : ICustomValidationDto = {
                    customFunction,
                    checkIn
                }

                const executeCustomFunction = Validation.custom(customFunctionParams);

                return executeCustomFunction(field)
            }

            return toMatch
                .if((value : unknown) => value !== undefined)
                .custom((value) => {
                    return value.length > 0
                        ? Promise.resolve()
                        : Promise.reject(message);
                }).withMessage((value : unknown) => message.replace(/(:value)|(:data)/ig,`${value}`));
        }
    }

    /**
     * For Custom Sanitizer
     *
     * @param validation_options
     */
    static customSanitizer(validation_options : IValidationCustomSanitizerDto) : Function {
        const {
            customFunction,
            checkIn = "any",
        } = validation_options;


        if (!customFunction)
            throw new Error(`For validation type 'customSanitizer', customFunction is required`);

        return (field : string) => {

            const toMatch = Util.returnBasedOnCheckIn(checkIn,field);

            return toMatch.customSanitizer((value,reqObject) => {

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
    static lowerCase(validation_options: IValidationLowercaseDto = {}) : Function {
        const {
            checkIn = "any",
        } = validation_options;

        return (field : string) => {

            const toMatch = Util.returnBasedOnCheckIn(checkIn,field);

            return toMatch
                .if((value : unknown) => value !== undefined)
                .toLowerCase()
        }
    }

    /**
     * To convert the field's value into lowercase
     *
     * @param validation_options
     * @sanitizer
     */
    static upperCase(validation_options: IValidationUppercaseDto = {}) : Function {
        const {
            checkIn = "any",
        } = validation_options;

        return (field : string) => {

            const toMatch = Util.returnBasedOnCheckIn(checkIn,field);

            return toMatch
                .if((value : unknown) => value !== undefined)
                .toUpperCase()

        }

    }

    /**
     * To validate that field is required if the other field value not exists/have some certain value.
     *
     * @param validation_options
     */
    static requiredIfNot(validation_options: IValidationRequiredIfNotDto) : Function {

        const {
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

        /**
         * To use params in the messages
         */
        message = message
            .replace(/:secondField/g,String(params.secondField))
            .replace(/:secondFieldValue/g,String(params.secondFieldValue))


        return (field : string) => {

            const toMatch = Util.returnBasedOnCheckIn(checkIn,field);

            message = Util.replaceMessageWithField(field, message)

            return toMatch.custom((value, { req, location }) => {
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
                if (!isEqual(JSON.stringify(paramValue),JSON.stringify(params.secondFieldValue)) && appliedFieldValueIsEmpty) {
                    return Promise.reject(message);
                }

                return Promise.resolve();
            })
                .withMessage((value : unknown) => message.replace(/(:value)|(:data)/ig,`${value}`));
        }
    }

    /**
     * To validate that the field is of type string.
     *
     * @param {IValidationIsstringDto} validation_options
     */
    static isString(validation_options: IValidationIsstringDto = {}) : Function {
        const {
            checkIn = "any",
            params = {
                min:undefined,
                max:undefined
            }
        } = validation_options;

        let {
            message = `The field :attribute is not of type string`
        } = validation_options;


        /**
         * Including the params value by replacing with a tag
         */
        message = message.replace(/(:min)/ig,`${params.min}`);
        message = message.replace(/(:max)/ig,`${params.max}`);


        return (field : string) => {

            const toMatch = Util.returnBasedOnCheckIn(checkIn,field);

            message = Util.replaceMessageWithField(field, message);

            return toMatch
                .if((value : unknown) => value !== undefined)
                .isString()
                .withMessage((value : unknown) => message.replace(/(:value)|(:data)/ig,`${value}`))
                .isLength(params)
                .withMessage((value : unknown) => message.replace(/(:value)|(:data)/ig,`${value}`));
        }
    }

    /**
     * To validate that the field has distinct values
     *
     * @param validation_options
     */
    static distinct(validation_options: IValidationDistinctDto) : Function {
        const {
            checkIn = "any",
            params = {
                fieldToCheckWith:"",
                uniqueCheckType:"unique_in"
            }
        } = validation_options;

        let {
            message = "Invalid Value"
        } = validation_options;

        if (
            params.uniqueCheckType !== "unique_out" &&
            params.uniqueCheckType !== "unique_in" &&
            params.uniqueCheckType !== "unique_in_out"
        )
            throw new Error(
                "UniqueCheckType (Second Argument) Values Can Only Be `unique_out (By Default), unique_in, unique_in_out`"
            );

        /**
         * Replacing the params value by a tag
         */
        message = message.replace(/(:fieldToCheckWith)/ig,`${params.fieldToCheckWith}`);
        message = message.replace(/(:uniqueCheckType)/ig,`${params.uniqueCheckType}`);

        return (field : string) => {

            const toMatch = Util.returnBasedOnCheckIn(checkIn,field);

            message = Util.replaceMessageWithField(field, message);

            return toMatch
                .if((value : unknown) => value !== undefined)
                .custom((value) => {
                    if (!Array.isArray(value))
                        throw new Error("Validation Only Accept Arrays Values");

                    if (value.length === 0)
                        throw new Error("Array Can't Be Empty")


                    //For Deep Level Checking
                    const pluckedValues = map(value, params.fieldToCheckWith);

                    if (params.uniqueCheckType === "unique_in") {
                        const isUniqueInside = pluckedValues.every(
                            (pluckedValue) => {
                                const uniqueSet = new Set(pluckedValue);

                                return uniqueSet.size === pluckedValue.length;
                            }
                        );

                        return isUniqueInside
                            ? Promise.resolve
                            : Promise.reject(message);
                    }

                    if (params.uniqueCheckType === "unique_in_out") {
                        const flattenArray = flattenDeep(pluckedValues);

                        const isUniqueOutSide =
                            new Set(flattenArray).size === flattenArray.length;

                        return isUniqueOutSide
                            ? Promise.resolve
                            : Promise.reject(message);
                    }

                    if (Array.isArray(pluckedValues[0])) {
                        const uniqueArrays = uniqWith(pluckedValues, isEqual);

                        return uniqueArrays.length === pluckedValues.length
                            ? Promise.resolve()
                            : Promise.reject(message);
                    }

                    const isUniqueData =
                        new Set(pluckedValues).size === pluckedValues.length;


                    return !isUniqueData
                        ? Promise.reject(message)
                        : Promise.resolve;
                })
                .withMessage((value : unknown) => message.replace(/(:value)|(:data)/ig,`${value}`));
        }
    }

    /**
     * To trim string
     *
     * @param validation_options
     * @sanitizer
     */
    static trim(validation_options: IValidationTrimDto) : Function {
        const {
            params = {
                chars:""
            },
            checkIn = "any",
        } = validation_options;

        return (field : string) => {

            const toMatch = Util.returnBasedOnCheckIn(checkIn,field);

            return toMatch
                .if((value : unknown) => value !== undefined)
                .trim(params.chars);
        }
    }

    /**
     * To replace field value
     *
     * @param validation_options
     */
    static replace(validation_options: IValidationReplaceDto) : Function {
        const {
            params = {
                values_to_replace: "",
                new_value: ""
            },
            checkIn = "any",
        } = validation_options;

        return (field : string) => {

            const toMatch = Util.returnBasedOnCheckIn(checkIn,field);

            return toMatch
                .if((value : unknown) => value !== undefined)
                .customSanitizer((value : string) => {
                    return value.replace(params.values_to_replace,params.new_value);
                })
        }
    }

    /**
     * To validate if the field's value is a valid jwt token
     *
     * @param validation_options
     */
    static isjwt(validation_options: IValidationIsjwtDto = {}) : Function {

        const {
            checkIn = "any",
        } = validation_options;

        let {
            message = "Invalid JWT Token"
        } = validation_options;


        return (field : string) => {

            const toMatch = Util.returnBasedOnCheckIn(checkIn,field);

            message = Util.replaceMessageWithField(field, message);

            return toMatch
                .isJWT()
                .withMessage((value : unknown) => message.replace(/(:value)|(:data)/ig,`${value}`));
        }
    }
}