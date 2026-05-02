/**
 * Deterministically picks a premium image fallback based on an ID
 * @param {string} id - The unique ID of the salon
 * @param {string[]} images - Array of available premium image paths
 * @returns {string} - The selected image path
 */
export const getPremiumImage = (id, images) => {
    if (!id || !images || images.length === 0) return null;
    
    // Fallback if ID is dummy or missing
    if (id.startsWith('dummy')) {
        const num = parseInt(id.split('-').pop()) || 0;
        return images[num % images.length];
    }

    // Simple hash from string
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = ((hash << 5) - hash) + id.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
    }
    return images[Math.abs(hash) % images.length];
};
