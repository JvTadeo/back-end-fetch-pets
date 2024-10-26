export interface Post {
    id: number;
    body: string;
    file: File;
    userId: number;
    pet_name: string;
    sex: "Macho" | "Fêmea";
    species: string;
    breed: string;
    age: number;
    weight_kg: number;
    health_status: string;
    behavior: string;
    special_preferences: string;
    opt_in: boolean;
}