import logger from "../utils/logger";
import {INotification} from "../interfaces/NotificationInterface";
import {BaseService} from "./BaseService";
import {ParsedQs} from "qs";

export class NotificationService extends BaseService {


    public async getById(id: string, token: string): Promise<{ data: INotification; error: any }> {
        const supabase = await this.createAuthenticatedClient(token);
        const {data, error} = await supabase
            .from('notifications')
            .select()
            .eq('id', id)
            .single();

        if (error) {
            logger.error(`Error fetching notification by id: ${id}, error: ${error.message}`);
        }
        return {data, error};
    }

    public async getByUserId(id: string, token: string, filters?: ParsedQs): Promise<{ data: INotification[]; error: any }> {
        const supabase = await this.createAuthenticatedClient(token);
        let query = supabase
            .from('notifications')
            .select("*, receiver:receiverId(name), sender:senderId(name)")
            .eq('receiverId', id).order('read', { ascending: true }).order('created_at', { ascending: false });

        // Verifica se `filters` possui a propriedade `species` e ela não é nula
        if (filters && 'read' in filters && filters.read !== null) {
            query = query.eq('read', filters.read);
        }

        const { data, error } = await query;

        if (error) {
            logger.error(`Error fetching notification by user id: ${id}, error: ${error.message}`);
        }
        return {data, error};
    }

    public async delete(id: string, token: string): Promise<{ data: INotification; error: any }> {
        const supabase = await this.createAuthenticatedClient(token);
        const { data, error } = await supabase
            .from('notifications')
            .delete()
            .eq('id', id).select('*')
            .single();
        if (error) {
            logger.error(`Error deleting post by id: ${id}, error: ${error.message}`);
        }
        return { data, error };
    }

    public async create(notification: INotification, token: string): Promise<{ data: INotification; error: any }> {
        const supabase = await this.createAuthenticatedClient(token);
        const { data, error } = await supabase
            .from('notifications')
            .insert(notification)
            .select('*')
            .single();

        if (error) {
            logger.error(`Error creating notification, error: ${error.message}`);
        }
        return { data, error };
    }

    public async update(notification: INotification, token: string): Promise<{ data: INotification; error: any }> {
        const supabase = await this.createAuthenticatedClient(token);
        const { data, error } = await supabase
            .from('notifications')
            .update(notification)
            .eq('id', notification.id).select('*')
            .single();

        if (error) {
            logger.error(`Error updating notification by id: ${notification.id}, error: ${error.message}`);
        }
        return { data, error };
    }
}