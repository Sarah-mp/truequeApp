import { CosasInterface } from "@/domain/interfaces/cosasInterface";

export class Cosas implements CosasInterface {
    getCosas(): Promise<any> {
        throw new Error("Method not implemented.");
    }
    saveCosas(datos: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}