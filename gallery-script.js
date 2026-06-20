// ============================================================
// Gallery Script — defaults always shown + Supabase images appended
// ============================================================

const defaultGalleryImages = [
    { src: 'gallery/_Z3A5935.JPG', alt: '_Z3A5935.JPG' },
    { src: 'gallery/1.jpg', alt: '1.jpg' },
    { src: 'gallery/139009.jpg', alt: '139009.jpg' },
    { src: 'gallery/139010.jpg', alt: '139010.jpg' },
    { src: 'gallery/139011.jpg', alt: '139011.jpg' },
    { src: 'gallery/139012.jpg', alt: '139012.jpg' },
    { src: 'gallery/139013.jpg', alt: '139013.jpg' },
    { src: 'gallery/139014.jpg', alt: '139014.jpg' },
    { src: 'gallery/139015.jpg', alt: '139015.jpg' },
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
    { src: 'gallery/signal.jpg', alt: 'signal.jpg' },
    { src: 'gallery/Yess nit Calicut .jpg', alt: 'Yess nit Calicut .jpg' }
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
            // Silently hide broken images instead of showing error placeholder
            this.closest('.gallery-item') && (this.closest('.gallery-item').style.display = 'none');
        };

        const container = document.createElement('div');
        container.className = 'gallery-img-container';
        container.appendChild(img);
        galleryItem.appendChild(container);
        galleryGrid.appendChild(galleryItem);
    });
}

// Fetch gallery images from Supabase and MERGE with defaults
// Defaults always show; Supabase images are appended after them
async function loadGallery() {
    // Render defaults immediately (fast, no waiting)
    renderGalleryGrid(defaultGalleryImages);

    try {
        if (typeof supabaseClient === 'undefined') return;

        const { data, error } = await supabaseClient
            .from('gallery_images')
            .select('id, src, alt')
            .order('created_at', { ascending: true });

        if (error) {
            console.warn('Supabase gallery error:', error.message);
            return; // Keep showing defaults
        }

        if (data && data.length > 0) {
            // Merge: defaults first, then admin-added images appended after
            renderGalleryGrid([...defaultGalleryImages, ...data]);
        }
        // If Supabase is empty, defaults are already showing — do nothing
    } catch (err) {
        console.warn('Supabase gallery fetch failed, showing defaults only:', err.message);
        // Defaults already rendered above — nothing more to do
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadGallery);
