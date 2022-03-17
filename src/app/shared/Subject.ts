export class SubjectClass
{
  id_materia: number;
  nombre: string;
  cuatrimestre: number;
  anio: number;
  carrera: string;
  studentsCount: number;
  disponible: boolean;
  show_menu: boolean;
  image;

  constructor(nombre: string='', cuatrimestre: number=0, anio: number=0,
    carrera: string='', studentsCount: number=-1, disponible: boolean=true, show_menu: boolean=true, image: any=null)
  {
    this.nombre=nombre;
    this.cuatrimestre=cuatrimestre;
    this.anio=anio;
    this.carrera=carrera;
    this.studentsCount=studentsCount;
    this.disponible=disponible;
    this.show_menu=show_menu;
    this.image=image;
  }
}
