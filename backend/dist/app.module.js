"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const client_entity_1 = require("./entities/client.entity");
const finance_entity_1 = require("./entities/finance.entity");
const order_item_entity_1 = require("./entities/order-item.entity");
const order_entity_1 = require("./entities/order.entity");
const product_entity_1 = require("./entities/product.entity");
const user_entity_1 = require("./entities/user.entity");
const auth_module_1 = require("./modules/auth/auth.module");
const clients_module_1 = require("./modules/clients/clients.module");
const finance_module_1 = require("./modules/finance/finance.module");
const orders_module_1 = require("./modules/orders/orders.module");
const products_module_1 = require("./modules/products/products.module");
const reports_module_1 = require("./modules/reports/reports.module");
const uploads_module_1 = require("./modules/uploads/uploads.module");
const users_module_1 = require("./modules/users/users.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DATABASE_HOST'),
                    port: configService.get('DATABASE_PORT'),
                    username: configService.get('DATABASE_USER'),
                    password: configService.get('DATABASE_PASSWORD'),
                    database: configService.get('DATABASE_NAME'),
                    entities: [user_entity_1.User, client_entity_1.Client, product_entity_1.Product, order_entity_1.Order, order_item_entity_1.OrderItem, finance_entity_1.Finance],
                    synchronize: true,
                    logging: true,
                }),
                inject: [config_1.ConfigService],
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            clients_module_1.ClientsModule,
            products_module_1.ProductsModule,
            orders_module_1.OrdersModule,
            finance_module_1.FinanceModule,
            reports_module_1.ReportsModule,
            uploads_module_1.UploadsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map