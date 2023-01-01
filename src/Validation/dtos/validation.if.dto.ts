import { ValidationGeneralDto } from "./validation.general.dto";

export interface IValidationIfDto extends Omit<ValidationGeneralDto, 'params'> {
    params: {
        secondField:string,
        secondFieldValue:string,
        appliedOnFieldValue:string
    }
}