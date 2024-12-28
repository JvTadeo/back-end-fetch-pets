export const getFilePath = (filePath: string, isImage: boolean)=>{
    return `/${filePath}/${(new Date()).getTime()}${isImage? '.png': '.mp4'}`;
}

export const determineFilePath = (mimetype: string): { isImage: boolean; filePath: string } => {
    const isImage = /^image\//.test(mimetype);
    const filePath = isImage ? "postImages" : /^video\//.test(mimetype) ? "postVideos" : null;
    if (!filePath) {
        throw new Error("Tipo de arquivo não suportado");
    }
    return { isImage, filePath };
}