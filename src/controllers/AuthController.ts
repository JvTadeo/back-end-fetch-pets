import { Request, Response } from "express-serve-static-core";
import { SupaBaseService } from "../services/SupaBaseService";
import { Provider } from "@supabase/supabase-js";

export class AuthController {
    private supabaseService: SupaBaseService;

    constructor() {
        this.supabaseService = new SupaBaseService();

        // Use o bind para garantir que o this seja o mesmo dentro do método
        this.signIn = this.signIn.bind(this);
        this.signInWithAuth = this.signInWithAuth.bind(this);
    }

    public async signIn(req: Request, res: Response) : Promise<void> {
        const { email, password } = req.body;

        const { data, error } = await this.supabaseService.signInWithPassword(email, password);
        if (error) {
            res.status(400).json({ error: error.message });
        }
        res.status(200).json({ data });
    }

    public async signInWithAuth(req: Request, res: Response) : Promise<void> {
        const { provider } = req.body;;
        const { data, error} = await this.supabaseService.signInWithAuth(provider.toLowerCase() as Provider);

        if (error) {
            res.status(400).json({ error: error.message });
        }
    }
}