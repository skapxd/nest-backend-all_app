import { Routes } from "nest-router";
import { ApiV1Module } from './api-v1/api-v1.module';
import { StoresModule } from "./api-v1/stores/stores.module";
import { AuthModule } from './auth/auth.module';
import { GeoCodingModule } from 'src/api-v1/geo_coding/geo_coding.module';

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
                module: StoresModule
            },
            {
                path: 'geo-coding',
                module: GeoCodingModule
            }
        ]
    }
]