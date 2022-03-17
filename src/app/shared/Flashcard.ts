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

  constructor(id_flashcard: number, titulo: string, nivel: string, id_materia: number, materia: string, cantidad_items: number, items: Array<FlashcardItem>)
  {
    this.id_flashcard=id_flashcard;
    this.titulo=titulo;
    this.nivel=nivel;
    this.id_materia=id_materia;
    this.materia=materia;
    this.cantidad_items=cantidad_items;
    this.items=items;
  }
}
