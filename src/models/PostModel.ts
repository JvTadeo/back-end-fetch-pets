export interface Post {
    id: number;
    body: string;                  // Texto do post
    file: File;                    // Arquivo associado ao post
    userId: number;                // ID do usuário
    pet_name: string;              // Nome do pet
    sex: "Macho" | "Fêmea";        // Sexo do pet, restrito a "Macho" ou "Fêmea"
    species: string;               // Espécie do pet (ex: "Cachorro", "Gato")
    breed: string;                 // Raça do pet
    age: number;                   // Idade do pet
    weight_kg: number;             // Peso do pet em kg
    health_status: string;         // Estado de saúde do pet
    behavior: string;              // Comportamento do pet
    special_preferences: string;   // Preferências especiais do pet
    opt_in: boolean;               // Preferência do usuário para receber notificações ou informações
}