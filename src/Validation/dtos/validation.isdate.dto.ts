import { ValidationGeneralDto } from "./validation.general.dto";

/**
 * Defaults to {
 *     format:"YYYY-MM-DD",
*      delimiters:["-"],
 *     strictMode:false
 * }
 */
export interface IValidationIsDateDto extends Omit<ValidationGeneralDto, 'params' | 'customFunction'> {
    params?: {
        format?: string,
        delimiters?: string[],
        strictMode?: boolean
    }
}