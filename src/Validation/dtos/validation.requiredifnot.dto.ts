import { ValidationGeneralDto } from "./validation.general.dto";

export interface IValidationRequiredIfNotDto extends Omit<ValidationGeneralDto, 'type' | 'customFunction'> {
    params: {
        secondField:string,
        secondFieldValue: string
    }
}