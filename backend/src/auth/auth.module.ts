import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsuarioService } from 'src/usuario/usuario.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PessoaEntity } from 'src/usuario/entities/pessoa.entity';
import { InstituicaoEntity } from 'src/usuario/entities/instituicao.entity';
import { UsuarioEntity } from 'src/usuario/entities/usuario.entity';
import { PublicacaoEntity } from '../publicacao/entities/publicacao.entity';
import { DenunciaEntity } from '../denuncia/entities/denuncia.entity';
import { PublicacaoModule } from '../publicacao/publicacao.module';
import { PublicacaoService } from 'src/publicacao/publicacao.service';
import { DenunciaModule } from 'src/denuncia/denuncia.module';

@Module({
  imports:[PassportModule, UsuarioModule, PublicacaoModule, DenunciaModule, ConfigModule.forRoot(), JwtModule.register({
    privateKey: process.env.JWT_SECRET,
    secret: process.env.JWT_SECRET,
    signOptions:{expiresIn:'25000s'}}),
    TypeOrmModule.forFeature([UsuarioEntity, PessoaEntity, PublicacaoEntity, InstituicaoEntity, DenunciaEntity])],
  controllers: [AuthController],
  providers: [AuthService, UsuarioService, PublicacaoService],
})
export class AuthModule {}
