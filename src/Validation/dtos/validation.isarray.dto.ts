import { ValidationGeneralDto } from "./validation.general.dto";

export interface IIsArrayValidationDTO extends Omit<ValidationGeneralDto, 'params'> {
    params?: {
        min?:number | undefined,
        max?:number | undefined
    }
}