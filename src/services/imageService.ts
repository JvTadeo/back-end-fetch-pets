// src/services/imageService.ts
import { decode } from 'base64-arraybuffer';
import { promises as fs } from 'fs';
import path from 'path';
import supabase from '../config/supabaseClient';
import { supabaseUrl } from '../constants';

/**
 * Retorna a URL completa da imagem no Supabase Storage
 */
export const getImageSrc = (imagePath: string | null) => {
    return imagePath
        ? getSupabaseFileUrl(imagePath)
        : require('../assets/images/defaultUser.png');
};

/**
 * Retorna a URL pública da imagem no Supabase Storage
 */
export const getSupabaseFileUrl = (filePath: string) => {
    return filePath
        ? { uri: `${supabaseUrl}/storage/v1/object/public/uploads/${filePath}` }
        : null;
};

/**
 * Faz o upload do arquivo no Supabase Storage na pasta especificada
 */
export const uploadFile = async (
    folderName: string,
    filePath: string,
    isImage = true
) => {
    try {
        const fileName = getFilePath(folderName, isImage); // Define o nome do arquivo

        // Lê o arquivo local e converte para base64
        const fileBase64 = await fs.readFile(filePath, { encoding: 'base64' });

        // Converte o base64 para array buffer
        const imageData = decode(fileBase64);

        const { data, error } = await supabase.storage
            .from('uploads')
            .upload(fileName, imageData, {
                cacheControl: '3600',
                upsert: false,
                contentType: isImage ? 'image/*' : 'video/*',
            });

        if (error) {
            console.log('File upload error: ', error);
            return { success: false, msg: 'Não foi possível atualizar a imagem' };
        }

        return { success: true, data: data.path };
    } catch (error) {
        console.log('File upload error: ', error);
        return { success: false, msg: 'Não foi possível atualizar a imagem' };
    }
};

/**
 * Gera o caminho do arquivo no Supabase Storage
 */
export const getFilePath = (folderName: string, isImage: boolean) => {
    return `${folderName}/${Date.now()}${isImage ? '.png' : '.mp4'}`;
};
