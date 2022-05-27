import { Badge } from "./Badge";

export class BadgeAttempts extends Badge //3
{

  id_insignia: number;
  intentos_maximos: number;

  constructor(id_insignia, puntaje_extra, maxAttempts: number, tipo)
  {
    super(id_insignia, puntaje_extra, tipo);
    this.id_insignia=id_insignia;
    this.intentos_maximos=maxAttempts;
  }

  validBadge(actualAttempts: number): number
  {
    return (actualAttempts>this.intentos_maximos) ? 0 : this.puntaje_extra;
  }

  getDescription(): string
  {
    return `Intentos máximos: ${this.intentos_maximos}`;
  }
}
