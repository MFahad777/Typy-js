import { ValidationGeneralDto } from "./validation.general.dto";

export interface IIsArrayValidationDTO extends ValidationGeneralDto {
    params?: {
        min?:number | undefined,
        max?:number | undefined
    }
}