// ============================================================
// Admin Script — IEEE MBITS (Supabase-powered)
// ============================================================

// ── Auth ────────────────────────────────────────────────────
function checkAdminAuth() {
    if (localStorage.getItem('adminLoggedIn') !== 'true') {
        window.location.href = './admin.html';
    }
}

function logout() {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminLoginTime');
    window.location.href = './admin.html';
}

// ── UI Helpers ──────────────────────────────────────────────
function showMessage(elementId, message, type = 'success') {
    const element = document.getElementById(elementId);
    if (!element) return;
    element.textContent = message;
    element.className = type === 'success' ? 'success-message' : 'error-message';
    element.style.display = 'block';
    setTimeout(() => { element.style.display = 'none'; }, 4000);
}

function setLoading(buttonId, loading) {
    const btn = document.getElementById(buttonId);
    if (!btn) return;
    btn.disabled = loading;
    btn.style.opacity = loading ? '0.6' : '1';
}

// ── URL Normalizer (Google Drive / Dropbox) ─────────────────
function normalizeImageUrl(url) {
    const trimmed = url.trim();
    if (!trimmed) return trimmed;

    const driveFileMatch = trimmed.match(/https?:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)(?:\/.*)?/i);
    if (driveFileMatch) return `https://drive.google.com/uc?export=view&id=${driveFileMatch[1]}`;

    const driveOpenMatch = trimmed.match(/https?:\/\/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/i);
    if (driveOpenMatch) return `https://drive.google.com/uc?export=view&id=${driveOpenMatch[1]}`;

    const driveUcMatch = trimmed.match(/https?:\/\/drive\.google\.com\/uc\?(?:export=\w+&)?id=([a-zA-Z0-9_-]+)/i);
    if (driveUcMatch) return `https://drive.google.com/uc?export=view&id=${driveUcMatch[1]}`;

    const driveThumbMatch = trimmed.match(/https?:\/\/drive\.google\.com\/thumbnail\?id=([a-zA-Z0-9_-]+)/i);
    if (driveThumbMatch) return `https://drive.google.com/uc?export=view&id=${driveThumbMatch[1]}`;

    const dropboxMatch = trimmed.match(/https?:\/\/(?:www\.)?dropbox\.com\/s\/[\w-]+\/[^?]+(?:\?dl=0|\?dl=1)?/i);
    if (dropboxMatch) return trimmed.replace(/\?dl=0|\?dl=1$/, '?raw=1');

    return trimmed;
}

// Read a File object as a base64 data URL
function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
    });
}

// ── Upload file to Supabase Storage ────────────────────────
async function uploadFileToStorage(file) {
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { data, error } = await supabaseClient.storage
        .from('gallery')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (error) throw error;

    const { data: urlData } = supabaseClient.storage.from('gallery').getPublicUrl(data.path);
    return urlData.publicUrl;
}

// ═══════════════════════════════════════════════════════════
// GALLERY
// ═══════════════════════════════════════════════════════════

async function loadGalleryAdmin() {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;
    galleryGrid.innerHTML = `<p style="grid-column:1/-1;text-align:center;padding:1rem;">Loading...</p>`;

    const { data, error } = await supabaseClient
        .from('gallery_images')
        .select('id, src, alt')
        .order('created_at', { ascending: true });

    if (error) {
        galleryGrid.innerHTML = `<p style="grid-column:1/-1;color:red;">Error loading gallery: ${error.message}</p>`;
        return;
    }

    galleryGrid.innerHTML = '';
    if (!data || data.length === 0) {
        galleryGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:2rem;">No images yet. Add one above!</p>';
        return;
    }

    data.forEach((image) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item-preview';

        const img = document.createElement('img');
        img.src = image.src;
        img.alt = image.alt;
        img.onerror = function () { this.src = 'https://placehold.co/150?text=Error'; };

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.type = 'button';
        deleteBtn.title = 'Delete image';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.addEventListener('click', () => deleteGalleryImage(image.id, image.src));

        const label = document.createElement('div');
        label.style.cssText = 'font-size:0.7rem;padding:0.25rem 0.5rem;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;';
        label.textContent = image.alt;

        galleryItem.appendChild(img);
        galleryItem.appendChild(deleteBtn);
        galleryItem.appendChild(label);
        galleryGrid.appendChild(galleryItem);
    });
}

async function deleteGalleryImage(id, src) {
    if (!confirm('Delete this image from the gallery?')) return;

    // If it's a Supabase storage URL, also delete the file
    if (src && src.includes('supabase.co/storage')) {
        try {
            const path = src.split('/gallery/')[1];
            if (path) await supabaseClient.storage.from('gallery').remove([path]);
        } catch (e) {
            console.warn('Could not delete storage file:', e);
        }
    }

    const { error } = await supabaseClient.from('gallery_images').delete().eq('id', id);
    if (error) {
        showMessage('galleryErrorMsg', 'Error deleting image: ' + error.message, 'error');
        return;
    }
    showMessage('gallerySuccessMsg', 'Image deleted successfully!');
    loadGalleryAdmin();
}

document.getElementById('galleryForm')?.addEventListener('submit', async function (e) {
    e.preventDefault();

    const imageUrlInput = document.getElementById('galleryImage').value.trim();
    const galleryFile = document.getElementById('galleryFile');
    const altText = document.getElementById('galleryAlt').value.trim();
    const warnEl = document.getElementById('galleryLocalWarning');

    if ((!imageUrlInput && !galleryFile?.files?.length) || !altText) {
        showMessage('galleryErrorMsg', 'Please select a file or enter an image URL, and add a description.', 'error');
        return;
    }

    setLoading('gallerySubmitBtn', true);
    showMessage('gallerySuccessMsg', '⏳ Processing...');
    let srcValue = '';

    try {
        if (galleryFile?.files?.length) {
            // Upload to Supabase Storage → get public URL
            if (warnEl) warnEl.style.display = 'none';
            showMessage('gallerySuccessMsg', '⬆️ Uploading image to cloud...');
            try {
                srcValue = await uploadFileToStorage(galleryFile.files[0]);
            } catch (uploadErr) {
                // Storage bucket might not exist yet
                const msg = uploadErr.message || '';
                if (msg.includes('Bucket not found') || msg.includes('bucket') || msg.includes('storage')) {
                    showMessage('galleryErrorMsg',
                        '❌ Storage bucket not found. Go to Supabase → Storage → New Bucket → name it "gallery" → check Public → Create.',
                        'error');
                } else {
                    showMessage('galleryErrorMsg', '❌ Upload failed: ' + msg, 'error');
                }
                setLoading('gallerySubmitBtn', false);
                return;
            }
        } else {
            srcValue = normalizeImageUrl(imageUrlInput);
            if (!srcValue) {
                showMessage('galleryErrorMsg', 'Please enter a valid image URL.', 'error');
                setLoading('gallerySubmitBtn', false);
                return;
            }
        }

        const { error } = await supabaseClient.from('gallery_images').insert([{ src: srcValue, alt: altText }]);
        if (error) {
            // Table might not exist yet
            if (error.message.includes('relation') || error.message.includes('does not exist') || error.code === '42P01') {
                showMessage('galleryErrorMsg',
                    '❌ Table not found. Run the SQL setup in Supabase → SQL Editor first.',
                    'error');
            } else {
                showMessage('galleryErrorMsg', '❌ DB error: ' + error.message, 'error');
            }
            setLoading('gallerySubmitBtn', false);
            return;
        }

        this.reset();
        if (warnEl) warnEl.style.display = 'none';
        showMessage('gallerySuccessMsg', '✅ Image added! It will now appear for ALL visitors on the gallery page.');
        loadGalleryAdmin();
    } catch (err) {
        showMessage('galleryErrorMsg', '❌ Unexpected error: ' + err.message, 'error');
    } finally {
        setLoading('gallerySubmitBtn', false);
    }
});

// ═══════════════════════════════════════════════════════════
// EVENTS
// ═══════════════════════════════════════════════════════════

async function loadEventsAdmin() {
    const eventsList = document.getElementById('eventsList');
    if (!eventsList) return;
    eventsList.innerHTML = '<p style="text-align:center;padding:1rem;">Loading...</p>';

    const { data, error } = await supabaseClient
        .from('events')
        .select('id, date, title, description, image')
        .order('created_at', { ascending: false });

    if (error) {
        eventsList.innerHTML = `<p style="color:red;">Error loading events: ${error.message}</p>`;
        return;
    }

    eventsList.innerHTML = '';
    if (!data || data.length === 0) {
        eventsList.innerHTML = '<p style="text-align:center;padding:2rem;">No events added yet.</p>';
        return;
    }

    data.forEach((event) => {
        const eventItem = document.createElement('div');
        eventItem.className = 'event-item';
        eventItem.innerHTML = `
            <h3>${event.title}</h3>
            <p><strong>Date:</strong> ${event.date}</p>
            <p><strong>Description:</strong> ${event.description}</p>
            <p><strong>Image:</strong> <a href="${event.image}" target="_blank" rel="noopener" style="word-break:break-all;">${event.image}</a></p>
            <button class="delete-btn" onclick="deleteEvent('${event.id}')">
                <i class="fas fa-trash"></i> DELETE
            </button>
        `;
        eventsList.appendChild(eventItem);
    });
}

async function deleteEvent(id) {
    if (!confirm('Are you sure you want to delete this event?')) return;
    const { error } = await supabaseClient.from('events').delete().eq('id', id);
    if (error) {
        showMessage('eventErrorMsg', 'Error deleting event: ' + error.message, 'error');
        return;
    }
    showMessage('eventSuccessMsg', 'Event deleted successfully!');
    loadEventsAdmin();
}

document.getElementById('eventForm')?.addEventListener('submit', async function (e) {
    e.preventDefault();

    const date = document.getElementById('eventDate').value.trim();
    const title = document.getElementById('eventTitle').value.trim();
    const description = document.getElementById('eventDescription').value.trim();
    const image = document.getElementById('eventImage').value.trim();

    if (!date || !title || !description || !image) {
        showMessage('eventErrorMsg', 'Please fill all fields', 'error');
        return;
    }

    setLoading('eventSubmitBtn', true);
    try {
        const { error } = await supabaseClient.from('events').insert([{
            date,
            title,
            description,
            image: normalizeImageUrl(image)
        }]);
        if (error) throw error;

        this.reset();
        showMessage('eventSuccessMsg', '✅ Event added! It will now appear for ALL visitors.');
        loadEventsAdmin();
    } catch (err) {
        showMessage('eventErrorMsg', 'Error adding event: ' + err.message, 'error');
    } finally {
        setLoading('eventSubmitBtn', false);
    }
});

// ═══════════════════════════════════════════════════════════
// PASSWORD
// ═══════════════════════════════════════════════════════════

document.getElementById('passwordForm')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const storedPassword = localStorage.getItem('adminPassword') || 'admin123';

    if (currentPassword !== storedPassword) {
        showMessage('passwordErrorMsg', 'Current password is incorrect', 'error');
        return;
    }
    if (newPassword.length < 6) {
        showMessage('passwordErrorMsg', 'New password must be at least 6 characters', 'error');
        return;
    }
    if (newPassword !== confirmPassword) {
        showMessage('passwordErrorMsg', 'Passwords do not match', 'error');
        return;
    }

    localStorage.setItem('adminPassword', newPassword);
    this.reset();
    showMessage('passwordSuccessMsg', 'Password changed successfully!');
});

// ── Export (from Supabase) ──────────────────────────────────
document.getElementById('exportDataBtn')?.addEventListener('click', async function () {
    const [{ data: events }, { data: gallery }] = await Promise.all([
        supabaseClient.from('events').select('*').order('created_at', { ascending: true }),
        supabaseClient.from('gallery_images').select('*').order('created_at', { ascending: true })
    ]);

    const dataStr = JSON.stringify({ events: events || [], galleryImages: gallery || [] }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ieee-mbits-data-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
});

// ── Tab Switching ───────────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', function () {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        this.classList.add('active');
        document.getElementById(this.getAttribute('data-tab')).classList.add('active');
    });
});

// ── Logout ──────────────────────────────────────────────────
document.getElementById('logoutBtn')?.addEventListener('click', logout);

// ── Init ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    checkAdminAuth();
    loadEventsAdmin();
    loadGalleryAdmin();
});
