export class Option
{
  id_opcion: number;
  texto: string;
  porcentaje_puntaje: number;
  id_pregunta: number;

  constructor(texto, porcentaje_puntaje, id_pregunta, id_opcion?: number)
  {
    this.id_opcion=id_opcion;
    this.texto=texto;
    this.porcentaje_puntaje=porcentaje_puntaje;
    this.id_pregunta=id_pregunta;
  }
}
