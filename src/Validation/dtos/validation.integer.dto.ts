import { ValidationGeneralDto } from "./validation.general.dto";

export interface IIntegerValidationDto extends Omit<ValidationGeneralDto, "params"> {
    params? : {
        allow_leading_zeroes?: boolean,
        strict?:boolean
    }
}