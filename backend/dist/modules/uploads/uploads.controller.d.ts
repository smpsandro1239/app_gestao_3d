import { Response } from 'express';
export declare class UploadsController {
    uploadFile(file: Express.Multer.File): {
        url: string;
    };
    seeUploadedFile(image: any, res: Response): void;
}
