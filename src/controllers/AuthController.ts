import { Request, Response, NextFunction } from "express-serve-static-core";
import { SupaBaseService } from "../services/SupaBaseService";
import { Provider } from "@supabase/supabase-js";
import { UserData } from "../models/UserData";

export class AuthController {
    private supabaseService: SupaBaseService;

    constructor() {
        this.supabaseService = new SupaBaseService();

        // Use o bind para garantir que o this seja o mesmo dentro do método
        this.signIn = this.signIn.bind(this);
        this.signInWithAuth = this.signInWithAuth.bind(this);
        this.checkAuth = this.checkAuth.bind(this);
    }

    public async signIn(req: Request, res: Response) : Promise<void> {
        const { email, password } = req.body;
        let userData = new UserData({}, "");

        const { data, error } = await this.supabaseService.signInWithPassword(email, password);
        if (error) {
            res.status(400).json({ error: error });
            return
        }

        userData.setToken(data.session.access_token);
        userData.setUserData(data.user);

        res.status(200).json({ user: userData });
    }

    public async signInWithAuth(req: Request, res: Response) : Promise<void> {
        const { provider } = req.body;;
        const { data, error} = await this.supabaseService.signInWithAuth(provider.toLowerCase() as Provider);

        if (error) {
            res.status(400).json({ error: error.message });
        }
    }

    public async checkAuth(req: Request, res: Response, next: NextFunction) : Promise<void> {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            res.status(400).json({ error: "Token not provided" });
            return;
        }

        const { data, error } = await this.supabaseService.getUser(token);

        if (error) {
            res.status(400).json({ error: error.message });
            return;
        }

        res.status(200).json({ user: data });
        next()
    }
}