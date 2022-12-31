export interface RuleGeneralDto {
    type:string,
    field:string,
    message :string,
    customFunction : Function | null | undefined,
    checkIn:string
}