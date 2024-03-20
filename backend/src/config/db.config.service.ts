import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";

@Injectable()
export class dbConfigService implements TypeOrmOptionsFactory{
    constructor(private configService: ConfigService){}

    createTypeOrmOptions(): TypeOrmModuleOptions{
        return{
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root' ,
            password: '1234',
            database:  'db_projeto',
            entities: [__dirname + '/../**/*.entity{.js,.ts}'],
            synchronize: true
        }
    }   
    
} 