import {Favorite} from "./FavoriteInterface";

export interface FavoriteServiceInterface {
    create(favorite: Favorite, token: string): Promise<{ data: Favorite; error: any }>;
    delete(id: string, token: string): Promise<{ data: Favorite; error: any }>;
    getByUserId(id: string, token: string): Promise<{ data: Favorite[]; error: any }>;
    getById(id: string, token: string): Promise<{ data: Favorite[]; error: any }>;
}