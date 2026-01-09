import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(): Promise<import("../../entities").Product[]>;
    findOne(id: string): Promise<import("../../entities").Product>;
    create(createProductDto: CreateProductDto): Promise<import("../../entities").Product>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<import("../../entities").Product>;
    remove(id: string): Promise<import("../../entities").Product>;
}
