export interface ValidationGeneralDto {
    type:string,
    field:string,
    message :string,
    params?: {
        [key : string] : any
    },
    customFunction : Function | null | undefined,
    checkIn:string
}