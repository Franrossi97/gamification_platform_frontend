import { Unit } from "./Unit";

export class Level
{
  id_nivel:number;
  descripcion:string;
  fecha_recomendada_realizacion:Date;
  cantidad_preguntas:number;
  puntaje_maximo:number;
  penalizacion:number;
  cuestionario_disponible:boolean;
  creado_por:number;
  nombre:string;
  apellido:string;
  cantidad_estudiantes_intentos:number;
  fecha_creacion:Date;
  unitList: Unit[];
}
