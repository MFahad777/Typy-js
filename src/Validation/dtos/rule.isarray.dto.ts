import { RuleGeneralDto } from "./rule.general.dto";

export interface IIsArrayValidationDTO extends RuleGeneralDto {
    params?: {
        min?:number | undefined,
        max?:number | undefined
    }
}