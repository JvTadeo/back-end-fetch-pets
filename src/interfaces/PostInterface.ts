export interface Post {
    id?: number;
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
    image: string,
    adopter?: string;
}