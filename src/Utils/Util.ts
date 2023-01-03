import { omit } from "lodash";

/**
 * Third Party Import
 */
import {
    body,
    check,
    param,
    query,
    header,
    ValidationChain,
} from "express-validator";

export class Util {

    /**
     * To check if the array values are falsy
     *
     * @param array
     */
    static checkFalsyValues(array : Array<any>) {
        return array.some(value => !value);
    }

    /**
     * Remove/Omit n number of fields from an omit and returns a new object
     *
     * @param obj
     * @param fields
     * @return Partial<ObjectConstructor>
     */
    static omitNNumberOfField(obj : Object,fields: Array<string>) {
        return omit(Object,fields)
    }

    /**
     * To specify where to look in the request payload.
     *
     * @param checkIn
     * @param field
     */
    static returnBasedOnCheckIn(checkIn:string,field:string) : ValidationChain {

        const allRequestPayloadLocation : any = {
            params:param(field),
            query:query(field),
            header:header(field),
            body:body(field),
            any:check(field)
        }

        return allRequestPayloadLocation[checkIn];
    }

}