import { SubjectClass } from 'src/app/shared/Subject';

export function generateMapOfImageOfSubjectsId(images: Array<{subjectId: number, image: Array<any>}>): Map<number, Array<any>> {

  let imageOfSubjectId: Map<number, Array<any>>= new Map<number, Array<any>>();

  images.forEach(imageInfo =>
  {
    imageOfSubjectId.set(imageInfo.subjectId, imageInfo.image);
  });

  return imageOfSubjectId;
}

export async function  generateArrayOfSubjectsId(subjects: Array<SubjectClass>): Promise<Array<number>> {
  let res: Array<number>= new Array<number>();

  subjects.forEach(subject =>
  {
    res.push(subject.id_materia);
  });

  return res;
}
