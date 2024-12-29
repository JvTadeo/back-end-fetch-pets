import {VerifyOtpParams, UserAttributes, SignOut} from "@supabase/supabase-js";
import { createClient } from '@supabase/supabase-js';
import { User } from "../models/User";
import dotenv from "dotenv";
import {BaseService} from "./BaseService";

// Load environment variables
dotenv.config();

export class AuthService extends BaseService {

    public async signInWithPassword(email: string, password: string) : Promise<{ data: any; error: any }> {
        const supabase = await this.createAuthenticatedClient("");
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });
        return { data, error };
    }

    public async signOut(token: string) : Promise<{ data: any; error: any }> {
        const supabase = await this.createAuthenticatedClient(token);
        const { error } = await supabase.auth.signOut(token as SignOut);
        return { data: null, error };
    }

    public async signUp(email: string, password: string) : Promise<{ data: any; error: any }> {
        const supabase = await this.createAuthenticatedClient("");
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });
        return { data, error };
    }

    public async getUserData(id : string, token: string) : Promise<{ data: any; error: any }> {
        const supabase = await this.createAuthenticatedClient(token);

        const { data, error } = await supabase
        .from('users')
        .select()
        .eq('id', id)
        .single();
        return { data, error };
    }

    public async getUser(token: string) : Promise<{ data: any; error: any }> {
        const supabase = await this.createAuthenticatedClient(token);
        const { data:user, error:userErro } = await supabase.auth.getUser(token);
        
        if (userErro) {
            return { data: null, error: userErro };
        }

        const { data, error} = await this.getUserData(user.user.id, token);

        return { data, error };
    }

    public async requestPasswordReset(email: string) : Promise<{ error: any }> {
        const supabase = await this.createAuthenticatedClient('');
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) {
            return { error };
        }
        return { error: null };
    }

    public async verifyTokenOPT(token: VerifyOtpParams) : Promise<{ data: any; error: any }> {
        const supabase = await this.createAuthenticatedClient('');

        const { data, error } = await supabase.auth.verifyOtp(token)
        
        return { data, error };
    }

    public async resetPassword(email:string, password: string, user: Object) : Promise<{ data: any; error: any }> {
        const supabase = await this.createAuthenticatedClient("");

        await supabase.auth.setSession({
            access_token: user["access_token"],
            refresh_token: user["refresh_token"],
        });

        const userAtributtes : UserAttributes = {
            email: email,
            password: password
        }

        const { data, error } = await supabase.auth.updateUser(userAtributtes);

        return { data, error };
    }

    public async updateUserDb(user: User, token: string, uid: string) : Promise<{ data: any; error: any }> {
        const supabase = await this.createAuthenticatedClient(token);

        const dateObj = new Date(user.birthDate);
        const date = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
        
        const { data, error } = await supabase
        .from('users')
        .update({
            name: user.name,
            email: user.email,
            address: user.address,
            phoneNumber: user.phoneNumber,
            gender: user.gender,
            birthDate: user.birthDate,
            zip: user.zip,
            stateAndCity: user.stateAndCity,
            image: user.image,
            houseNumber: user.houseNumber,
        })
        .eq('id', uid)
        .select();

        return { data, error };
    }

    public async saveImageToSupabase(image: any, token: string, uid: string) : Promise<{ data: any; error: any }> {
        const supabase = await this.createAuthenticatedClient(token);

        const { data, error } = await supabase
        .from('users')
        .update({
            image: image,
        })
        .eq('id', uid)
        .select();

        return { data, error };
    }

    public async uploadEmailPassword(email: string, password: string, uid: string) : Promise<{ data: any; error: any }> {
        const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ROLE_KEY)

        const { data, error } = await supabase.auth.admin.updateUserById(uid, {
            email: email
        })

        if (password?.length > 0) {
            const { data: dataPass, error: errorPass } = await supabase.auth.admin.updateUserById(uid, {
                password: password
            })
        }

        return { data, error}
    }
    // public async uploadImage(image: Image, token: string) : Promise<{ data: any; error: any }> {
    //     const file = fs.readFileSync(image.path);

    //     const supabase = this.createAuthenticatedClient(token);

    //     const { data, error} = await supabase.storage
    //     .from('uploads/profiles')
    //     .upload(image.name, file, {
    //         cacheControl: '3600',
    //         upsert: false,
    //     });

    //     return { data, error };
    // }
}