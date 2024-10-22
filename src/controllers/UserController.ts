import { SupaBaseService } from "../services/SupaBaseService";
import { Request, Response } from "express-serve-static-core";

export class UserController {
    private supabaseService: SupaBaseService;

    constructor() {
        this.supabaseService = new SupaBaseService();
        // Use o bind para garantir que o this seja o mesmo dentro do método
        this.getUser = this.getUser.bind(this);
    }

    public async getUser(req: Request, res: Response) : Promise<void> {
        const { id } = req.params;
        
        const { data, error } = await this.supabaseService.getUserData(id);

        // Verificação de erro
        if (error) {
            res.status(400).json({ error: error.message });
            console.log("Error fetching user:", error.message);
            return; 
        }

        if (!data) {
            res.status(404).json({ error: 'User not found' });
            console.log("User not found");
            return;
        }

        res.status(200).json({ user: data });
    }
}