import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfigService } from './config/db.config.service';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';
import { PublicacaoModule } from './publicacao/publicacao.module';
import { DenunciaModule } from './denuncia/denuncia.module';

@Module({
  imports: [UsuarioModule, AuthModule, PublicacaoModule, DenunciaModule, ConfigModule.forRoot({
    isGlobal:true
    }),
    TypeOrmModule.forRootAsync({
      useClass: dbConfigService, 
      inject:[dbConfigService]
    })
  ]
})
export class AppModule {}
