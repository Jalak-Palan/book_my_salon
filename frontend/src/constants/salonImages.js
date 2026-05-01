// Shared premium salon image URLs used as fallbacks across the app
export const premiumImages = [
    'https://plus.unsplash.com/premium_photo-1664048712891-f9b6b0c62369?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1626383137804-ff908d2753a2?w=600&auto=format&fit=crop&q=60',
    '/images/salons/salon1.png',
    '/images/salons/salon2.png',
    '/images/salons/salon3.png',
    '/images/salons/salon4.png',
    '/images/salons/salon5.png',
    'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=600&h=800',
    'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=600&h=800',
    'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&q=80&w=600&h=800',
    'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=600&h=800',
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=600&h=800',
    'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1595476108010-bca908230722?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1493246318656-5bbd4afb0947?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=600&auto=format&fit=crop&q=60'
];

export const salonNames = [
    'Stylo Unisex Salon', 'Luxe Beauty Lounge', 'Glamour Hair Studio',
    'The Velvet Touch', 'Royal Grooming Co', 'Urban Chic Salon'
];

// Returns a deterministic image from the premiumImages pool based on an ID
export const getSafeImage = (idOrIndex) => {
    if (!idOrIndex) return premiumImages[0];
    const str = String(idOrIndex);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return premiumImages[Math.abs(hash) % premiumImages.length];
};
