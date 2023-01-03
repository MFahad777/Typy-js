import { omit } from "lodash";

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

}