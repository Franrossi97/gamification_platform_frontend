import { FlashcardItem } from "./FlashcardItem";

export class Flashcard
{
  id_flashcard: number;
  titulo: string;
  edita: boolean;
  id_nivel: number;
  nivel: string;
  id_materia: number;
  materia: string;
  cantidad_items: number;
  items: Array<FlashcardItem>;
  creado_por: number;

  constructor(id_flashcard: number, titulo: string='',
  nivel: string='', id_materia: number=0, materia: string='',
  cantidad_items: number=0, items: Array<FlashcardItem>=null, createdBy: number = 0)
  {
    this.id_flashcard=id_flashcard;
    this.titulo=titulo;
    this.nivel=nivel;
    this.id_materia=id_materia;
    this.materia=materia;
    this.cantidad_items=cantidad_items;
    this.items=items;
    this.creado_por = createdBy;
  }
}
