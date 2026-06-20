// ============================================================
// Gallery Script — reads from Supabase, falls back to defaults
// ============================================================

const defaultGalleryImages = [
    { src: 'gallery/1.jpg', alt: '1.jpg' },
    { src: 'gallery/1D8A3893.jpg', alt: '1D8A3893.jpg' },
    { src: 'gallery/2.jpg', alt: '2.jpg' },
    { src: 'gallery/3.jpg', alt: '3.jpg' },
    { src: 'gallery/4.jpg', alt: '4.jpg' },
    { src: 'gallery/IMG-20250302-WA0109.jpg', alt: 'IMG-20250302-WA0109.jpg' },
    { src: 'gallery/IMG-20250704-WA0089.jpg', alt: 'IMG-20250704-WA0089.jpg' },
    { src: 'gallery/IMG-20250705-WA0062.jpg', alt: 'IMG-20250705-WA0062.jpg' },
    { src: 'gallery/IMG-20250712-WA0111.jpg', alt: 'IMG-20250712-WA0111.jpg' },
    { src: 'gallery/IMG-20250712-WA0117.jpg', alt: 'IMG-20250712-WA0117.jpg' },
    { src: 'gallery/IMG-20250730-WA0151.jpg', alt: 'IMG-20250730-WA0151.jpg' },
    { src: 'gallery/IMG-20250730-WA0153.jpg', alt: 'IMG-20250730-WA0153.jpg' },
    { src: 'gallery/IMG-20250812-WA0145 (1).jpg', alt: 'IMG-20250812-WA0145 (1).jpg' },
    { src: 'gallery/IMG-20260101-WA0121.jpg', alt: 'IMG-20260101-WA0121.jpg' },
    { src: 'gallery/IMG-20260119-WA0017.jpg', alt: 'IMG-20260119-WA0017.jpg' },
    { src: 'gallery/IMG-20260126-WA0360.jpg', alt: 'IMG-20260126-WA0360.jpg' },
    { src: 'gallery/IMG-20260126-WA0362.jpg', alt: 'IMG-20260126-WA0362.jpg' },
    { src: 'gallery/Khm .jpg', alt: 'Khm .jpg' },
    { src: 'gallery/Yess nit Calicut .jpg', alt: 'Yess nit Calicut .jpg' },
    { src: 'gallery/signal.jpg', alt: 'signal.jpg' }
];

// Show loading state
function showGalleryLoading() {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;
    galleryGrid.innerHTML = `
        <div style="grid-column:1/-1; text-align:center; padding:3rem; font-family:'Space Grotesk',sans-serif;">
            <div style="display:inline-block; width:48px; height:48px; border:5px solid #000; border-top-color:#ffde59; border-radius:50%; animation:spin 0.8s linear infinite;"></div>
            <p style="margin-top:1rem; font-weight:600;">Loading gallery...</p>
        </div>
        <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
    `;
}

// Render gallery grid from an array of image objects
function renderGalleryGrid(images) {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;
    galleryGrid.innerHTML = '';

    if (!images || images.length === 0) {
        galleryGrid.innerHTML = '<p style="text-align:center;padding:2rem;font-weight:600;">No images in gallery yet.</p>';
        return;
    }

    images.forEach((image, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item brutal-card';

        const img = document.createElement('img');
        img.src = image.src;
        img.alt = image.alt || 'Gallery photo';
        img.loading = index < 5 ? 'eager' : 'lazy';
        img.onerror = function () {
            this.src = 'https://placehold.co/400x300?text=Image+Error';
            this.alt = 'Broken image';
            if (!this.nextElementSibling || !this.nextElementSibling.classList.contains('broken-image-link')) {
                const linkNote = document.createElement('div');
                linkNote.className = 'broken-image-link';
                linkNote.innerHTML = `
                    <p style="margin:0.75rem 0 0; font-size:0.9rem; color:#111; background:#fff; padding:0.5rem; border:2px dashed #000;">
                        Unable to load image. <a href="${encodeURI(image.src)}" target="_blank" rel="noopener noreferrer">View image</a>
                    </p>
                `;
                this.parentElement.appendChild(linkNote);
            }
        };

        const container = document.createElement('div');
        container.className = 'gallery-img-container';
        container.appendChild(img);
        galleryItem.appendChild(container);
        galleryGrid.appendChild(galleryItem);
    });
}

// Fetch gallery images from Supabase, fall back to defaults if empty/error
async function loadGallery() {
    showGalleryLoading();

    try {
        const { data, error } = await supabaseClient
            .from('gallery_images')
            .select('id, src, alt')
            .order('created_at', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
            renderGalleryGrid(data);
        } else {
            // Supabase table is empty — show hardcoded defaults
            renderGalleryGrid(defaultGalleryImages);
        }
    } catch (err) {
        console.warn('Supabase gallery fetch failed, using defaults:', err.message);
        renderGalleryGrid(defaultGalleryImages);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadGallery);
