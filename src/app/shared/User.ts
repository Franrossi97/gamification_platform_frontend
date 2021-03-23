export class User
{
  id_usuario: number;
  nombre: string;
  apellido: string;
  matricula: string;
  mail: string;
  tipo_usuario: number;

  constructor(id ,nombre, apellido, matricula, mail, password, tipo_usuario)
  {
    this.id_usuario=id;
    this.nombre=nombre;
    this.apellido=apellido;
    this.matricula=matricula;
    this.mail=mail;
    this.tipo_usuario=tipo_usuario;
  }
}
