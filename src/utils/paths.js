export const getDefaultPath = (role) => {
    
} 

export const getAllowedPaths = (role) => {
    r
    return null;
}

export const checkImageUrl = (url, callback) => {
    const img = new Image();
    img.src = url;
    // img.onload = () => callback(true);
    // img.onerror = () => callback(false);
    const complete = img.complete;
    return callback(complete);   
}