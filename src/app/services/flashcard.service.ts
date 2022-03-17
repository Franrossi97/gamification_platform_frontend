import { BehaviorSubject } from 'rxjs';
import { baseURL } from './../shared/baseUrl';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Flashcard } from '../shared/Flashcard';
import { FlashcardItem } from '../shared/FlashcardItem';

@Injectable({
  providedIn: 'root'
})
export class FlashcardService {

  title: BehaviorSubject<string>=new BehaviorSubject('Título no encontrado');
  constructor(private http: HttpClient) { }

  getFlahscard(idUser: number, filter: number)
  {
    //const getUrl: string=`${baseURL}/flashcard`;
    const getUrl: string=`${baseURL}/flashcard/user/${idUser}/filter/${filter}`;

    return this.http.get<Array<Flashcard>>(getUrl);
  }

  getFlahscardBySearch(idUser: number, paramSearch: string)
  {
    //const getUrl: string=`${baseURL}/flashcard`;
    const getUrl: string=`${baseURL}/flashcard/user/${idUser}/search/${paramSearch}`;

    return this.http.get<Array<Flashcard>>(getUrl);
  }

  getFlashcardById(idFlashcard: number)
  {
    const getUrl: string=`${baseURL}/flashcard/${idFlashcard}`;

    return this.http.get<Flashcard>(getUrl);
  }

  getFlashcardItems(idFlashcard: number)
  {
    const getUrl: string=`${baseURL}/flashcard/${idFlashcard}/items`;

    return this.http.get<Array<FlashcardItem>>(getUrl);
  }

  postFlashcard(newFlashcard: Flashcard)
  {
    const postUrl: string=`${baseURL}/flashcard`;

    return this.http.post(postUrl, newFlashcard);
  }

  postFlashcardItem(idFlashcard: number, newItem: Array<FlashcardItem>)
  {
    const postUrl: string=`${baseURL}/flashcard/${idFlashcard}`;

    return this.http.post(postUrl, newItem);
  }

  editFlashcard(idFlashcard: number, title: string)
  {
    const patchUrl: string=`${baseURL}/flashcard/${idFlashcard}`;

    return this.http.patch(patchUrl, title);
  }

  editFlashcardItem(idItem: number, content: string)
  {
    const patchUrl: string=`${baseURL}/flashcard/item/${idItem}`;

    return this.http.patch(patchUrl, content);
  }

  deleteFlashcard(idFlashcard: number)
  {
    const deleteUrl: string=`${baseURL}/flashcard/${idFlashcard}`;

    return this.http.delete(deleteUrl);
  }

  deleteFlashcardItem(idItem: number)
  {
    const deleteUrl: string=`${baseURL}/flashcard/item/${idItem}`;

    return this.http.delete(deleteUrl);
  }

  setFlashcardTitle(title: string)
  {
    this.title=new BehaviorSubject(title);
  }

  getFlashcardTitle()
  {
    return this.title.asObservable();
  }

  registerFlashcardResult(idItem: number, idStudent: number, result: number)
  {
    const postUrl: string=`${baseURL}/flashcard/${idItem}/student/${idStudent}`;

    return this.http.post(postUrl, result);
  }

  getFlashcardResult(idFlashcard: number, minMonth: number, maxMonth: number, year: number)
  {
    const getUrl: string=`${baseURL}/flashcard/${idFlashcard}/month/${minMonth}/${maxMonth}/year/${year}`;

    return this.http.get(getUrl);
  }

  canEditFlashcard(idFlashcard: number, idUser: number)
  {
    const getEditUrl: string=`${baseURL}/flashcard/${idFlashcard}/user/${idUser}/edit`;
    console.log(getEditUrl);

    return this.http.get<number>(getEditUrl).toPromise();
  }
}
