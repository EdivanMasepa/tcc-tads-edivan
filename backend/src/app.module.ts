import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfigService } from './config/db.config.service';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';
import { AcaoModule } from './acao/acao.module';

@Module({
  imports: [UsuarioModule, AuthModule, AcaoModule, ConfigModule.forRoot({
    isGlobal:true
  }),
  TypeOrmModule.forRootAsync({
    useClass: dbConfigService, 
    inject:[dbConfigService]
  })]
})
export class AppModule {}
