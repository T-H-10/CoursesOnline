export class User {
    constructor(
        public id?: number,
        public name?: string,
        public address?: string,
        public email?: string,
        public password?: string,
        public isLecturer: boolean=false,//---
        public course: string="",//---
        public role: RoleType="student"
    ) { }

}

export type RoleType = "admin" | "teacher" | "student";