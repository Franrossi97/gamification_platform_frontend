export abstract class Badge
{
  id_insignia: number;
  titulo: string;
  descripcion: string;
  puntaje_extra: number;
  tipo_insignia: number;

  constructor(id_insignia: number, puntaje_extra: number, tipo_insignia: number)
  {
    this.id_insignia=id_insignia;
    this.puntaje_extra=puntaje_extra;
    this.tipo_insignia=tipo_insignia;
  }

  abstract validBadge(param: any): number;
  abstract getDescription(): string;
}
