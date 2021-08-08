import { Routes } from "nest-router";
import { ApiV1Module } from './api-v1/api-v1.module';
import { StoresModule } from "./api-v1/stores/stores.module";
import { AuthModule } from './auth/auth.module';
import { GeoCodingModule } from 'src/api-v1/geo_coding/geo_coding.module';
import { ProductModule } from "./api-v1/stores/product/product.module";

export const routes: Routes = [
    {
        path: 'auth',
        module: AuthModule
    },
    {
        path: 'api-v1',
        module: ApiV1Module,
        children: [
            {
                path: 'stores',
                module: StoresModule,
                children: [
                    {
                        path: 'product',
                        module: ProductModule
                    }
                ]
            },
            {
                path: 'geo-coding',
                module: GeoCodingModule
            }
        ]
    }
]