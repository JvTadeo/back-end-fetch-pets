import { AuthService } from "../services/AuthService";
import { Request, Response } from "express-serve-static-core";

export class UserController {
    private supabaseService: AuthService;

    constructor() {
        this.supabaseService = new AuthService();
        // Use o bind para garantir que o this seja o mesmo dentro do método
        this.getUser = this.getUser.bind(this);
    }

    public async getUser(req: Request, res: Response) : Promise<void> {
        const { id } = req.params;
        const token = req.headers.authorization?.split(' ')[1];

        const { data, error } = await this.supabaseService.getUserData(id, token);
        
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

        console.log(data);

        res.status(200).json({ user: data });
    }
}