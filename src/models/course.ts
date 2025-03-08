export class Course {
    id!: number;
    title!: string;
    description: string="";
    categoryId!: number;
    amount!: number;
    beginDate: Date=new Date();
    syllabus: string[]=[];
    learningType: LearningType=LearningType.Frontal;
    lecturerId?: number;
 }
 
 export enum LearningType {
     Frontal = 1,
     Digital = 2
 }