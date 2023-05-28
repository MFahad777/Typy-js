import { ValidationGeneralDto } from "./validation.general.dto";

export interface IValidationRequiredIfNotDto extends Omit<ValidationGeneralDto, 'params' | 'customFunction'> {
    params: {
        secondField:string,
        secondFieldValue: string | "exists" | "notexists"
    }
}