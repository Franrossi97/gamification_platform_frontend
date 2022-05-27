export class User
{
  id_usuario: number;
  nombre: string;
  apellido: string;
  matricula: string;
  mail: string;
  validado: boolean;
  externo: boolean;
  perfil: number;

  constructor(id: number, nombre: string, apellido: string, matricula: string, mail: string, password: string, perfil: number)
  {
    this.id_usuario=id;
    this.nombre=nombre;
    this.apellido=apellido;
    this.matricula=matricula;
    this.mail=mail;
    this.perfil=perfil;
  }
}
