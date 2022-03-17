import { Badge } from "./Badge";

export class BadgeDate extends Badge //2
{
  id_insignia: number;
  hasta_dia: Date;

  constructor(id_insignia, puntaje_extra, limitDate: Date, tipo)
  {
    super(id_insignia, puntaje_extra, tipo);
    this.id_insignia=id_insignia;
    this.hasta_dia=limitDate;
  }

  validBadge(actualDate: Date): number
  {
    return (actualDate > this.hasta_dia) ? 0 : this.puntaje_extra;
  }

  getDescription(): string
  {
    let auxTil=new Date(this.hasta_dia);

    return `Fecha límite: ${auxTil.getDate()}/${auxTil.getMonth()}/${auxTil.getFullYear()}`
  }
}
