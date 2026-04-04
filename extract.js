const fs = require('fs');

try {
    const html = fs.readFileSync('index.html', 'utf8');

    const officeStart = html.indexOf('<!-- Office Bearers Section -->');
    let officeEnd = html.indexOf('</section>', html.indexOf('id="office-bearers"'));
    if (officeEnd !== -1) officeEnd += 10; // Include </section>

    const activitiesStart = html.indexOf('<!-- Activities Section -->');
    let activitiesEnd = html.indexOf('</section>', html.indexOf('id="activities"'));
    if (activitiesEnd !== -1) activitiesEnd += 10;

    if (officeStart === -1 || activitiesStart === -1) {
        console.error('Could not find sections.');
        process.exit(1);
    }

    const officeContent = html.substring(officeStart, officeEnd);
    const activitiesContent = html.substring(activitiesStart, activitiesEnd);

    // Prepare nav component with absolute/relative pathing
    let headContent = html.substring(0, html.indexOf('</nav>') + 6);
    headContent = headContent
        .replace(/href="#home"/g, 'href="index.html#home"')
        .replace(/href="#about"/g, 'href="index.html#about"')
        .replace(/href="#ieee-benefits"/g, 'href="index.html#ieee-benefits"')
        .replace(/href="#faq"/g, 'href="index.html#faq"')
        .replace(/href="#join-now"/g, 'href="index.html#join-now"')
        .replace(/href="#contact"/g, 'href="index.html#contact"')
        .replace(/href="#office-bearers"/g, 'href="execom.html"')
        .replace(/href="#activities"/g, 'href="activities.html"');
        
    const footerContent = html.substring(html.indexOf('<!-- Footer -->'));

    // Create the new pages
    const execomHtml = headContent + '\n<main style="padding-top: 100px; min-height: 80vh;">\n' + officeContent + '\n</main>\n' + footerContent;
    const activitiesHtml = headContent + '\n<main style="padding-top: 100px; min-height: 80vh;">\n' + activitiesContent + '\n</main>\n' + footerContent;

    fs.writeFileSync('execom.html', execomHtml);
    fs.writeFileSync('activities.html', activitiesHtml);

    // Clean index.html
    let restOfHtml = html.substring(html.indexOf('</nav>') + 6);
    // Remove the extracted sections
    let newRest = restOfHtml.replace(officeContent, '');
    newRest = newRest.replace(activitiesContent, '');
    
    let newIndex = headContent + newRest;

    // Contact Us Restructure
    const oldContactSection = `            <div class="slide-in-right">
                <div class="contact-form-section">
                    <h3 style="color: #000; margin-bottom: 2rem; font-size: 1.8rem; font-weight: 900;">Get In Touch</h3>
                    <p style="color: #000; line-height: 1.7; margin-bottom: 2rem; font-weight: 600;">
                        Have questions about IEEE MBITS or want to know more about our activities?
                        We'd love to hear from you! Reach out to us through any of the contact methods
                        or follow us on social media for the latest updates.
                    </p>
                    <div style="display: grid; gap: 1rem; font-weight: bold; color: #000;">
                        <div style="display: flex; align-items: center;">
                            <span style="margin-right: 1rem; font-size: 1.5rem;">🕒</span>
                            <span>Office Hours: Mon-Fri, 9:00 AM - 5:00 PM</span>
                        </div>
                        <div style="display: flex; align-items: center;">
                            <span style="margin-right: 1rem; font-size: 1.5rem;">💬</span>
                            <span>Quick Response on WhatsApp & Email</span>
                        </div>
                        <div style="display: flex; align-items: center;">
                            <span style="margin-right: 1rem; font-size: 1.5rem;">🌐</span>
                            <span>Follow us for event updates</span>
                        </div>
                    </div>
                </div>
            </div>`;

    const newContactGrid = `
        <div class="contact-layout-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 3rem;">
            <!-- Left Tall Box: Map -->
            <div class="brutal-card bg-yellow" style="padding: 2rem; display: flex; flex-direction: column;">
                <h3 style="font-size: 2rem; margin-bottom: 1.5rem;">Find Us</h3>
                <div style="margin-bottom: 1.5rem; border: 4px solid #000; flex-grow: 1;">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.499029664069!2d76.6711249!3d10.058134200000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b07e8c21773f2f9!2sMar%20Baselios!5e0!3m2!1sen!2sin!4v1753464726332!5m2!1sen!2sin" width="100%" height="400" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
                </div>
                <div style="font-weight: bold; font-size: 1.1rem; border-top: 4px solid #000; padding-top: 1rem;">
                    📍 Mar Baselios Institute of Technology & Science<br>
                    Kothamangalam, Kerala, India
                </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 2rem;">
                <!-- Right Top Box: Contact Info -->
                <div class="brutal-card bg-pink" style="padding: 2rem;">
                    <h3 style="font-size: 2rem; margin-bottom: 1.5rem;">Get In Touch</h3>
                    <div style="font-weight: 800; font-size: 1.2rem; display: flex; flex-direction: column; gap: 1rem;">
                        <div>📧 ieeesbmbits@gmail.com</div>
                        <div>📱 +91 7907863486</div>
                        <div>🕒 Mon-Fri, 9:00 AM - 5:00 PM</div>
                    </div>
                </div>

                <!-- Right Bottom Box: Socials -->
                <div class="brutal-card bg-lime" style="padding: 2rem; flex-grow: 1;">
                    <h3 style="font-size: 2rem; margin-bottom: 1.5rem;">Follow Us</h3>
                    <p style="font-weight: bold; margin-bottom: 1.5rem;">Stay updated with our latest events and activities on our social channels!</p>
                    <div class="social-links" style="margin-top: 0;">
                        <a href="#" class="social-link"><i class="fab fa-linkedin-in"></i></a>
                        <a href="#" class="social-link"><i class="fab fa-instagram"></i></a>
                        <a href="#" class="social-link"><i class="fab fa-youtube"></i></a>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Replace old contact layout
    let contactStart = newIndex.indexOf('<div class="contact-info slide-in-left">');
    let contactEnd = newIndex.indexOf('</div>', newIndex.indexOf('</div>', newIndex.indexOf(oldContactSection) + 10) + 10) + 6;
    
    if (contactStart !== -1) {
        newIndex = newIndex.substring(0, contactStart) + newContactGrid + newIndex.substring(contactEnd);
    }

    fs.writeFileSync('index.html', newIndex);
    console.log('Success');
} catch (e) {
    console.error(e);
}
