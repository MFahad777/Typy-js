import { ValidationGeneralDto } from "./validation.general.dto";

export interface IValidationArraynotemptyDto extends Omit<ValidationGeneralDto, 'params' | 'type'> { }