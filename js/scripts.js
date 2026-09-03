/* ============================================
   Traditional Techie - scripts.js
   ============================================ */

// ==============================
// EMAILJS SETUP  (for auto-sending emails)
// ==============================
// To activate auto-emails (subscribe welcome + contact thank-you):
//   1. Create a FREE account at https://www.emailjs.com
//   2. Connect your Gmail (techietraditional@gmail.com) as an Email Service
//   3. Create 2 templates: one for "subscribe", one for "contact"
//   4. Fill in the 3 values below:
//      - EMAILJS_PUBLIC_KEY   (Account > General > Public Key)
//      - EMAILJS_SERVICE_ID   (Email Services > your service ID, like service_xxxxx)
//      - EMAILJS_TEMPLATE_SUBSCRIBE  (the subscribe template ID)
//      - EMAILJS_TEMPLATE_CONTACT    (the contact template ID)
//   5. Make sure the EmailJS SDK script is loaded (it is added in each HTML page)
var EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY_HERE';
var EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID_HERE';
var EMAILJS_TEMPLATE_SUBSCRIBE = 'YOUR_SUBSCRIBE_TEMPLATE_ID_HERE';
var EMAILJS_TEMPLATE_CONTACT = 'YOUR_CONTACT_TEMPLATE_ID_HERE';

if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY.indexOf('YOUR_') === -1) {
    emailjs.init(EMAILJS_PUBLIC_KEY);
}

// Like Button
function toggleLike() {
    var b = document.getElementById('likeBtn');
    var c = document.getElementById('likeCount');
    if (!b || !c) return;
    var liked = b.classList.toggle('liked');
    b.innerHTML = liked
        ? '<i class="fas fa-heart"></i> Liked!'
        : '<i class="fas fa-heart"></i> Like';
    c.textContent = (liked ? '2,459' : '2,458') + ' likes';
}

// ==============================
// ADMIN PANEL (password stored as unreadable hash)
// ==============================
// The login check hashes what you type and compares it to the stored
// hashes below. The real credentials are NEVER stored in this file,
// so even if someone reads the code they cannot recover the password.
//
// TO CHANGE PASSWORD/USERNAME:
//   1. Generate a SHA-256 hash of your new value (many free online tools)
//   2. Replace the 64-character lowercase hex hash below
//   (The hashes are all stored/lowercased consistently so they match.)
function sha256hex(str) {
    var buffer = new TextEncoder().encode(str);
    return crypto.subtle.digest('SHA-256', buffer).then(function (buf) {
        var a = new Uint8Array(buf);
        var h = '';
        for (var i = 0; i < a.length; i++) {
            h += a[i].toString(16).padStart(2, '0');
        }
        return h;
    });
}
var ADMIN_USER_HASH = 'fa2e4b1381866562e173a46a3b6855b4f68a8e7bef480766d052d19781c2d230';
var ADMIN_PASS_HASH = 'fa3ae498f6dfe277abfe2c7bfe7119ca732e23c178926028b46f8bc4f51f1b6a';

function openAdmin() {
    document.getElementById('adminOv').classList.add('open');
}

function closeAdmin() {
    document.getElementById('adminOv').classList.remove('open');
}

function doLogin() {
    var user = document.getElementById('aUser');
    var pass = document.getElementById('aPass');
    if (!user || !pass || !user.value || !pass.value) { alert('Please enter username and password'); return; }

    var uname = user.value;
    var pword = pass.value;

    Promise.all([sha256hex(uname), sha256hex(pword)]).then(function (hashes) {
        var userOk = (hashes[0] === ADMIN_USER_HASH);
        var passOk = (hashes[1] === ADMIN_PASS_HASH);
        if (userOk && passOk) {
            document.getElementById('aLogin').style.display = 'none';
            document.getElementById('aDash').style.display = 'block';
            loadUploadedVideos();
        } else {
            alert('Invalid credentials!');
            user.value = '';
            pass.value = '';
        }
    }).catch(function () {
        alert('Login error - please try again');
    });
}

function doLogout() {
    var aLogin = document.getElementById('aLogin');
    var aDash = document.getElementById('aDash');
    var aUser = document.getElementById('aUser');
    var aPass = document.getElementById('aPass');
    if (aLogin) aLogin.style.display = 'block';
    if (aDash) aDash.style.display = 'none';
    if (aUser) aUser.value = '';
    if (aPass) aPass.value = '';
}

// ==============================
// VIDEO UPLOAD SYSTEM
// ==============================
function uploadVideo() {
    var title = document.getElementById('vidTitle');
    var cat = document.getElementById('vidCategory');
    var desc = document.getElementById('vidDesc');
    var url = document.getElementById('vidUrl');

    if (!title || !title.value.trim()) { alert('Please enter video title'); return; }
    if (!url || !url.value.trim()) { alert('Please enter YouTube URL'); return; }

    // Extract YouTube video ID from URL
    var videoId = extractYouTubeId(url.value.trim());
    if (!videoId) { alert('Please enter a valid YouTube URL'); return; }

    var video = {
        title: title.value.trim(),
        category: cat ? cat.value : 'Cooking',
        description: desc ? desc.value.trim() : '',
        videoId: videoId,
        thumbnail: 'https://img.youtube.com/vi/' + videoId + '/mqdefault.jpg',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        views: '0'
    };

    // Save to localStorage
    var videos = getUploadedVideos();
    videos.unshift(video);
    localStorage.setItem('tt_videos', JSON.stringify(videos));

    // Clear form
    title.value = '';
    if (desc) desc.value = '';
    if (url) url.value = '';

    alert('Video saved on THIS browser!\n\nYour video is now in "Uploaded Videos" below — click its picture or title to play it.\n\nTo show it on your website for ALL visitors:\n1. Click "Get HTML Code"\n2. Paste the copied code into your index.html\n3. Upload index.html to GitHub');

    loadUploadedVideos();
    renderMyVideos();
}

function extractYouTubeId(url) {
    var regExp = /^.*(youtu\.be\/|v\/|shorts\/|live\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    var match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function getUploadedVideos() {
    try {
        return JSON.parse(localStorage.getItem('tt_videos')) || [];
    } catch (e) {
        return [];
    }
}

function loadUploadedVideos() {
    var list = document.getElementById('uploadedList');
    if (!list) return;

    var videos = getUploadedVideos();
    var countEl = document.getElementById('vidCount');
    if (countEl) countEl.textContent = videos.length;

    if (videos.length === 0) {
        list.innerHTML = '<p style="font-size:12px;color:var(--text-light);text-align:center;padding:20px;">No videos uploaded yet. Use the form above to add videos.</p>';
        return;
    }

    var html = '';
    videos.forEach(function (v, i) {
        html += '<div style="display:flex;gap:12px;align-items:center;padding:10px;border:1px solid var(--border);border-radius:8px;margin-bottom:8px;">';
        html += '<a href="https://youtube.com/watch?v=' + v.videoId + '" target="_blank" title="Click to play"><img src="' + v.thumbnail + '" style="width:80px;height:45px;object-fit:cover;border-radius:4px;" alt=""></a>';
        html += '<div style="flex:1;">';
        html += '<a href="https://youtube.com/watch?v=' + v.videoId + '" target="_blank" title="Click to play" style="color:var(--title);text-decoration:none;"><h4 style="font-size:12px;font-weight:600;color:var(--title);margin-bottom:2px;">' + v.title + '</h4></a>';
        html += '<span style="font-size:10px;color:var(--text-light);">' + v.category + ' | ' + v.date + ' | <a href="https://youtube.com/watch?v=' + v.videoId + '" target="_blank" style="color:var(--primary);">Play &#9654;</a></span>';
        html += '</div>';
        html += '<button onclick="deleteVideo(' + i + ')" style="background:#c0392b;color:white;border:none;padding:4px 10px;border-radius:4px;font-size:10px;cursor:pointer;">Delete</button>';
        html += '</div>';
    });
    list.innerHTML = html;
}

function deleteVideo(index) {
    if (!confirm('Delete this video?')) return;
    var videos = getUploadedVideos();
    videos.splice(index, 1);
    localStorage.setItem('tt_videos', JSON.stringify(videos));
    loadUploadedVideos();
    renderMyVideos();
}

function exportVideos() {
    var videos = getUploadedVideos();
    if (videos.length === 0) { alert('No videos to export'); return; }

    var html = '<!-- PASTE THIS IN index.html inside the video-grid div -->\n';
    videos.forEach(function (v) {
        html += '<div class="v-card">\n';
        html += '    <a href="https://youtube.com/watch?v=' + v.videoId + '" target="_blank" style="display:block;">\n';
        html += '        <div class="v-thumb">\n';
        html += '            <img src="' + v.thumbnail + '" alt="' + v.title + '">\n';
        html += '            <div class="v-play"><i class="fas fa-play"></i></div>\n';
        html += '            <span class="v-tag">' + v.category + '</span>\n';
        html += '        </div>\n';
        html += '    </a>\n';
        html += '    <div class="v-body">\n';
        html += '        <h3><a href="https://youtube.com/watch?v=' + v.videoId + '" target="_blank">' + v.title + '</a></h3>\n';
        html += '        <div class="v-meta"><span><i class="fas fa-eye"></i> ' + v.views + '</span><span>' + v.date + '</span></div>\n';
        html += '    </div>\n';
        html += '</div>\n\n';
    });

    // Copy to clipboard
    navigator.clipboard.writeText(html).then(function () {
        alert('HTML code copied to clipboard!\n\nPaste it in your index.html file inside the video-grid div.');
    }).catch(function () {
        // Fallback: show in textarea
        var ta = document.getElementById('exportCode');
        if (ta) {
            ta.value = html;
            ta.style.display = 'block';
            ta.select();
            alert('Select all the code below and copy it (Ctrl+C), then paste in index.html');
        }
    });
}

// ==============================
// BLOG POST SYSTEM
// ==============================
function uploadBlog() {
    var title = document.getElementById('blogTitle');
    var cat = document.getElementById('blogCategory');
    var content = document.getElementById('blogContent');

    if (!title || !title.value.trim()) { alert('Please enter blog title'); return; }
    if (!content || !content.value.trim()) { alert('Please enter blog content'); return; }

    var post = {
        title: title.value.trim(),
        category: cat ? cat.value : 'Cooking',
        content: content.value.trim(),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    var posts = getUploadedPosts();
    posts.unshift(post);
    localStorage.setItem('tt_posts', JSON.stringify(posts));

    title.value = '';
    if (content) content.value = '';

    alert('Blog post saved on THIS browser!\n\nIt appears in the list below. To show it on your website for ALL visitors:\n1. Click "Get HTML Code"\n2. Paste the copied code into your index.html\n3. Upload index.html to GitHub');
    loadUploadedPosts();
}

function getUploadedPosts() {
    try {
        return JSON.parse(localStorage.getItem('tt_posts')) || [];
    } catch (e) {
        return [];
    }
}

function loadUploadedPosts() {
    var list = document.getElementById('blogList');
    if (!list) return;

    var posts = getUploadedPosts();
    if (posts.length === 0) {
        list.innerHTML = '<p style="font-size:12px;color:var(--text-light);text-align:center;padding:20px;">No posts yet.</p>';
        return;
    }

    var html = '';
    posts.forEach(function (p, i) {
        var snippet = p.content.length > 90 ? p.content.substring(0, 90) + '...' : p.content;
        html += '<div style="padding:10px;border:1px solid var(--border);border-radius:8px;margin-bottom:8px;">';
        html += '<div style="display:flex;justify-content:space-between;align-items:start;">';
        html += '<div><h4 style="font-size:12px;font-weight:600;color:var(--title);margin-bottom:2px;">' + p.title + '</h4>';
        html += '<span style="font-size:10px;color:var(--text-light);">' + p.category + ' | ' + p.date + '</span>';
        html += '<p style="font-size:11px;color:var(--text-light);margin-top:4px;">' + snippet + '</p></div>';
        html += '<button onclick="deletePost(' + i + ')" style="background:#c0392b;color:white;border:none;padding:4px 10px;border-radius:4px;font-size:10px;cursor:pointer;">Delete</button>';
        html += '</div></div>';
    });
    list.innerHTML = html;
}

function deletePost(index) {
    if (!confirm('Delete this post?')) return;
    var posts = getUploadedPosts();
    posts.splice(index, 1);
    localStorage.setItem('tt_posts', JSON.stringify(posts));
    loadUploadedPosts();
}

function exportPosts() {
    var posts = getUploadedPosts();
    if (posts.length === 0) { alert('No posts to export'); return; }

    var html = '<!-- PASTE THIS IN index.html inside the blog-grid div -->\n';
    posts.forEach(function (p) {
        html += '<div class="b-card">\n';
        html += '    <div class="b-thumb">\n';
        html += '        <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=250&fit=crop" alt="' + p.title + '">\n';
        html += '        <span class="b-tag">' + p.category + '</span>\n';
        html += '    </div>\n';
        html += '    <div class="b-body">\n';
        html += '        <h3><a href="#">' + p.title + '</a></h3>\n';
        html += '        <p>' + p.content + '</p>\n';
        html += '        <div class="b-foot"><span>' + p.date + '</span></div>\n';
        html += '    </div>\n';
        html += '</div>\n\n';
    });

    navigator.clipboard.writeText(html).then(function () {
        alert('HTML code copied to clipboard!\n\nPaste it in your index.html file inside the blog-grid div.');
    }).catch(function () {
        var ta = document.getElementById('exportCode');
        if (ta) {
            ta.value = html;
            ta.style.display = 'block';
            ta.select();
            alert('Select all the code below and copy it (Ctrl+C), then paste in index.html');
        }
    });
}

// ==============================
// MY UPLOADED VIDEOS PREVIEW (this browser only)
// ==============================
function renderMyVideos() {
    var old = document.getElementById('myVideoPreviews');
    if (old) old.parentNode.removeChild(old);

    var grid = document.querySelector('.video-grid');
    if (!grid) return;

    var videos = getUploadedVideos();
    if (videos.length === 0) return;

    var wrap = document.createElement('div');
    wrap.id = 'myVideoPreviews';
    wrap.style.cssText = 'margin-top:32px;';

    var head = '<h2 style="text-align:center;font-size:20px;color:var(--title);margin-bottom:4px;">Your Uploaded Videos</h2>';
    head += '<p style="text-align:center;font-size:12px;color:var(--text-light);margin-bottom:18px;">Preview (only you see this). To publish for everyone: admin panel &gt; Get HTML Code &gt; paste into index.html.</p>';

    var rows = '';
    videos.forEach(function (v) {
        rows += '<div style="margin:0 auto 26px;max-width:560px;">';
        rows += '<div style="position:relative;padding-top:56.25%;">';
        rows += '<iframe style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" src="https://www.youtube.com/embed/' + v.videoId + '?rel=0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
        rows += '</div>';
        rows += '<h3 style="font-size:14px;color:var(--title);margin-top:8px;font-weight:600;">' + v.title + '</h3>';
        rows += '</div>';
    });

    wrap.innerHTML = head + rows;
    grid.parentNode.insertBefore(wrap, grid.nextSibling);
}

document.addEventListener('DOMContentLoaded', renderMyVideos);

// ==============================
// SCROLL & NAV
// ==============================window.addEventListener('scroll', function () {
    var btt = document.getElementById('btt');
    if (btt) {
        btt.classList.toggle('show', window.scrollY > 400);
    }

    var sections = document.querySelectorAll('section[id]');
    var links = document.querySelectorAll('.nav a');
    var cur = '';
    sections.forEach(function (s) {
        if (window.scrollY >= s.offsetTop - 120) {
            cur = s.id;
        }
    });
    links.forEach(function (l) {
        if (l.getAttribute('href') === '#' + cur) {
            l.classList.add('active');
        } else {
            l.classList.remove('active');
        }
    });
});

document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (href === '#') return;
        var target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            var nav = document.getElementById('nav');
            if (nav) nav.classList.remove('open');
        }
    });
});

function toggleNav() {
    var nav = document.getElementById('nav');
    if (nav) nav.classList.toggle('open');
}

function handleSubscribe(e) {
    e.preventDefault();
    var form = e.target;
    var emailInput = form.querySelector('input[type="email"]');
    var email = emailInput ? emailInput.value.trim() : '';

    if (!email) { alert('Please enter your email address.'); return; }

    // Send "Thank you for subscribing" email to the visitor via EmailJS
    var statusEl = form.querySelector('.sub-status');
    if (!statusEl) {
        statusEl = document.createElement('p');
        statusEl.className = 'sub-status';
        statusEl.style.cssText = 'margin-top:8px;font-size:13px;color:var(--primary);';
        form.appendChild(statusEl);
    }
    statusEl.textContent = 'Sending...';

    var params = {
        to_email: email,
        from_name: 'Traditional Techie',
        to_name: email
    };

    var showResult = function (ok) {
        if (ok) {
            statusEl.textContent = 'Thank you for subscribing! A confirmation email has been sent to ' + email + '.';
            form.reset();
        } else {
            statusEl.textContent = 'Could not send right now. Please try again or contact us on WhatsApp.';
        }
    };

    try {
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_SUBSCRIBE, params)
            .then(function () { showResult(true); })
            .catch(function () { showResult(false); });
    } catch (err) {
        alert('Subscribe: ' + email + ' (Set up EmailJS to auto-send the welcome email)');
        form.reset();
    }
}

// Send a Message form (contact page)
function handleContact(e) {
    e.preventDefault();
    var form = e.target;
    var name = (document.getElementById('cName') || {}).value || '';
    var visitorEmail = (document.getElementById('cEmail') || {}).value || '';
    var subject = (document.getElementById('cSubject') || {}).value || '';
    var message = (document.getElementById('cMessage') || {}).value || '';
    var statusEl = document.getElementById('contactStatus');
    if (statusEl) statusEl.textContent = 'Sending...';

    var params = {
        from_name: name,
        reply_to: visitorEmail,
        to_email: visitorEmail,
        subject: subject,
        message: message,
        site: 'Traditional Techie'
    };

    var showResult = function (ok) {
        if (!statusEl) return;
        if (ok) {
            statusEl.textContent = 'Message sent! Thank you for reaching out. You will get a reply soon.';
            form.reset();
        } else {
            statusEl.textContent = 'Could not send right now. Please try again or WhatsApp us directly.';
        }
    };

    try {
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_CONTACT, params)
            .then(function () { showResult(true); })
            .catch(function () { showResult(false); });
    } catch (err) {
        if (statusEl) {
            statusEl.textContent = 'Message from ' + name + ' (' + visitorEmail + '): ' + subject + ' - ' + message;
        }
        form.reset();
    }
}

function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied!');
}

var adminOv = document.getElementById('adminOv');
if (adminOv) {
    adminOv.addEventListener('click', function (e) {
        if (e.target === this) closeAdmin();
    });
}

// ==============================
// CATEGORY FILTER (for the home page category cards)
// ==============================
function filterCategory(cat) {
    var cards = document.querySelectorAll('.video-grid .v-card');
    var count = 0;
    cards.forEach(function (card) {
        var tag = card.querySelector('.v-tag');
        var tagText = tag ? tag.textContent.trim().toLowerCase() : '';
        var match = !cat || tagText === cat.toLowerCase();
        card.style.display = match ? '' : 'none';
        if (match) count++;
    });

    var header = document.getElementById('videoCatTitle');
    if (header) header.textContent = cat || 'Latest Videos';

    var msg = document.getElementById('videoFilterMsg');
    if (msg) {
        if (count === 0) { msg.style.display = 'block'; }
        else { msg.style.display = 'none'; }
    }

    var videos = document.getElementById('videos');
    if (videos) videos.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function attachCategoryFilters() {
    // Hero category cards (Section 3)
    document.querySelectorAll('.hero-card').forEach(function (card) {
        card.addEventListener('click', function (e) {
            e.preventDefault();
            var cat = this.getAttribute('data-cat');
            filterCategory(cat);
        });
    });
    // Explore Categories cards (Section 5)
    document.querySelectorAll('.cat-item').forEach(function (item) {
        item.addEventListener('click', function () {
            var cat = this.querySelector('.ov h3');
            if (cat) filterCategory(cat.textContent);
        });
    });
}

document.addEventListener('DOMContentLoaded', attachCategoryFilters);

// ==============================
// PROJECT DETAILS MODAL
// ==============================
function showProjectDetails(btn, title, desc, videoUrl) {
    var overlay = document.getElementById('projModal');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'projModal';
        overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.75);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;';
        overlay.innerHTML =
            '<div style="background:var(--white,#fff);border-radius:12px;max-width:520px;width:100%;padding:28px;position:relative;color:var(--title,#333);">' +
            '<button onclick="closeProjectDetails()" style="position:absolute;top:12px;right:14px;background:none;border:none;font-size:22px;cursor:pointer;color:#999;">&times;</button>' +
            '<h3 id="projTitle" style="font-size:20px;font-weight:700;color:var(--primary,#8B1A1A);margin-bottom:12px;"></h3>' +
            '<p id="projDesc" style="font-size:14px;line-height:1.6;color:#555;margin-bottom:20px;"></p>' +
            '<a id="projWatch" href="#" target="_blank" style="display:inline-block;background:var(--primary,#8B1A1A);color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:14px;">' +
            '<i class="fas fa-play"></i> Watch Video</a>' +
            '</div>';
        document.body.appendChild(overlay);
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) closeProjectDetails();
        });
    }
    document.getElementById('projTitle').textContent = title;
    document.getElementById('projDesc').textContent = desc;
    var watch = document.getElementById('projWatch');
    watch.setAttribute('href', videoUrl || '#');
    overlay.style.display = 'flex';
}

function closeProjectDetails() {
    var overlay = document.getElementById('projModal');
    if (overlay) overlay.style.display = 'none';
}
