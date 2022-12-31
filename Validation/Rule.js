const {
    check,
    body,
    param,
    query,
    validationResult
} = require("express-validator");

class Rule {

    constructor(Obj,options = {}) {
        this.schemaObj = Obj;
    }

    apply() {

        const schema = this.schemaObj;

        const Data = Object.entries(schema);

        return Data.map((value,index) => {

            const [ field, validation ] = value;

            return validation.map(all_vals => {

                const { type } = all_vals

                Object.assign(all_vals,{ field })

                switch (true) {

                    case /^required$/i.test(type):

                        return this.#_required(all_vals);

                    case /^integer$/i.test(type):

                        return this.#_integer(all_vals);

                    case /^isArray$/i.test(type):
                    case /^array$/i.test(type):

                        return this.#_isArray(all_vals);
                }
            });
            }).flatMap(val => val)
    }

    /**
     * For Requiring Any Field
     *
     * @param validation_options
     * @return {ValidationChain}
     */
     #_required(validation_options) {

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
     * @param validation_options
     * @return {ValidationChain}
     */
    #_integer(validation_options) {

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
            return toMatch.if((value) => value !== undefined).custom((value,reqObject) => {

                const toSend = {
                    value,
                    reqObject,
                    field
                }

                return customFunction(toSend)
            });
        }

        return toMatch.if((value) => value !== undefined).isInt().withMessage(message);
    }


    #_isArray(validation_options) {
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
            return toMatch.if((value) => value !== undefined).custom((value,reqObject) => {

                const toSend = {
                    value,
                    reqObject,
                    field,
                    params
                }

                return customFunction(toSend)
            })
        }

        return toMatch.if((value) => value !== undefined).isArray(params).withMessage(message);
    }

    showValidationErrors(customFunction = null) {

        return (req,res,next) => {
            const errors = validationResult(req);

            if (customFunction) {
                return customFunction(errors,req,res,next)
            }

            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            next()
        }

    }
}

module.exports = Rule;