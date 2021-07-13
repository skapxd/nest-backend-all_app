import { Routes } from "nest-router";
import { ApiV1Module } from './api-v1/api-v1.module';
import { StoresModule } from "./api-v1/stores/stores.module";
import { UsersModule } from './api-v1/users/users.module';
import { AuthModule } from './auth/auth.module';

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
                path: 'users', 
                module: UsersModule
            },
            {
                path: 'stores',
                module: StoresModule
            },
            
        ]
    }
]