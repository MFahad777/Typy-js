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
     * Replace the message with the actual field
     *
     * @param field
     * @param message
     */
    static replaceMessageWithField(field : string ,message : string) : string {
        return message.replace(/(:field)|(:attribute)/ig,field);
    }

    /**
     * To check if the array values are falsy
     *
     * @param array
     */
    static checkFalsyValues(array : Array<any>) : boolean {
        return array.some(value => !value);
    }

    /**
     * Remove/Omit n number of fields from an omit and returns a new object
     *
     * @param obj
     * @param fields
     * @return Partial<ObjectConstructor>
     */
    static omitNNumberOfField(obj : Object,fields: Array<string>) : object {
        return omit(obj,fields)
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