import { Injectable, NotFoundException } from '@nestjs/common';
import { CriaDenunciaDTO } from './dto/criaDenuncia.dto';
import { ListaDenunciasDTO } from './dto/listaDenuncias.dto';
import { UsuarioEntity } from '../usuario/entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DenunciaEntity } from './entities/denuncia.entity';
import { UsuarioService } from '../usuario/usuario.service';
import { Repository } from 'typeorm';

@Injectable()
export class DenunciaService {
  constructor(
    @InjectRepository(DenunciaEntity) private readonly denunciaRepository: Repository<DenunciaEntity>,
    private readonly usuarioService: UsuarioService
  ){}
  
  async criar(denuncia: CriaDenunciaDTO) {
    const usuarioRemetente: UsuarioEntity = await this.usuarioService.buscar(denuncia.idUsuarioRemetente)
    const usuarioDenunciado: UsuarioEntity = await this.usuarioService.buscar(denuncia.idUsuarioDenunciado)

    let publicacao: UsuarioEntity 
    denuncia.idPublicacao ? publicacao = await this.usuarioService.buscar(denuncia.idPublicacao) : null

    if(!usuarioRemetente || !usuarioDenunciado)
      throw new NotFoundException('Usuário não encontrado.')

    return 'This action adds a new denuncia';
  }

  async listar() {
    return `This action returns all denuncia`;
  }

  async buscar(id: number) {
    return `This action returns a #${id} denuncia`;
  }

  async alterar(id: number, updateDenunciaDto: ListaDenunciasDTO) {
    return `This action updates a #${id} denuncia`;
  }

  async deletar(id: number) {
    return `This action removes a #${id} denuncia`;
  }
}
