export class Category {
    id: number;
    name: string;
    iconRouting: string;

    constructor(id: number, routing: string = "", name: string = "") {
        this.id = id;
        this.name = name;
        this.iconRouting = routing;
    }

    static getCategories(): Category[] {
        return JSON.parse(sessionStorage.getItem("categories") || "[]");
    }

    static saveCategories(categories: Category[]): void {
        sessionStorage.setItem("categories", JSON.stringify(categories));
    }

    static getAllCategoryNames(): string[] {
        return this.getCategories().map(category => category.name);
    }
}


// יצירת המערך של הקטגוריות
export const categoriesArray: Category[] = [
    new Category(1, "finance", "Personal Finance"),
    new Category(2, "time-management", "Time Management"),
    new Category(3, "public-speaking", "Public Speaking"),
    new Category(4, "productivity", "Productivity Hacks"),
    new Category(5, "cooking", "Cooking & Meal Prep"),
    new Category(6, "home-organization", "Home Organization"),
    new Category(7, "self-improvement", "Self-Improvement"),
    new Category(8, "first-aid", "Basic First Aid"),
    new Category(9, "fitness", "Fitness & Wellness"),
    new Category(10, "parenting", "Parenting Tips"),
    new Category(11, "stress-management", "Stress Management"),
    new Category(12, "writing", "Creative Writing"),
    new Category(13, "photography", "Photography Basics"),
    new Category(14, "diy", "DIY & Home Repair"),
    new Category(15, "job-skills", "Job Interview Skills")
];

