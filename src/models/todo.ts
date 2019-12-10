export interface Todo {
    title: string,
    status: "planned" | "in progress" | "done" | "blocked",
    responsable: string,
    dueDate: Date,
    finnishedDate?: Date,
}