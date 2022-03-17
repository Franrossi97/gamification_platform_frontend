export class Achievement
{
  id_logro: number;
  titulo: string;
  descripcion: string;
  incremento: number;
  id_materia: number;

  constructor(id_logro: number, titulo: string, descripcion: string, incremento: number, id_materia: number)
  {
    this.id_logro=id_logro;
    this.titulo=titulo;
    this.descripcion=descripcion;
    this.incremento=incremento;
    this.id_materia=id_materia;
  }
}
