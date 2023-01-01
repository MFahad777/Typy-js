import { ValidationGeneralDto } from "./validation.general.dto";

export interface ICustomValidationDTO extends Omit<ValidationGeneralDto, 'type' | 'message'> {}