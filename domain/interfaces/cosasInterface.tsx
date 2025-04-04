export interface CosasInterface {
    getCosas():Promise<any>;
    saveCosas(datos: string):Promise<void>;
}