import { ValidationGeneralDto } from "./validation.general.dto";

/**
 * Default Regex : ^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$
 *
 * Min 1 uppercase
 * Min 1 lowercase
 * Min 1 Special Character
 * Min 1 Digit
 */
export interface IValidationIsStrongPasswordDto extends Omit<ValidationGeneralDto, 'customFunction' | "params" >{
    params?: {
        pattern?: RegExp
    }
}