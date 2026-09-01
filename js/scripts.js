/* ============================================
   Traditional Techie - scripts.js
   ============================================ */

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

// Admin Panel
function openAdmin() {
    document.getElementById('adminOv').classList.add('open');
}

function closeAdmin() {
    document.getElementById('adminOv').classList.remove('open');
}

function doLogin() {
    var user = document.getElementById('aUser');
    var pass = document.getElementById('aPass');
    if (user && pass && user.value === 'admin' && pass.value === 'admin123') {
        document.getElementById('aLogin').style.display = 'none';
        document.getElementById('aDash').style.display = 'block';
    } else {
        alert('Invalid! Use admin / admin123');
    }
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

// Back to Top + Active Nav on Scroll
window.addEventListener('scroll', function () {
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

// Smooth Scroll for Anchor Links
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

// Mobile Nav Toggle
function toggleNav() {
    var nav = document.getElementById('nav');
    if (nav) nav.classList.toggle('open');
}

// Subscribe Form
function handleSubscribe(e) {
    e.preventDefault();
    alert('Thanks for subscribing!');
    e.target.reset();
}

// Copy Link
function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied!');
}

// Close Admin on Overlay Click
var adminOv = document.getElementById('adminOv');
if (adminOv) {
    adminOv.addEventListener('click', function (e) {
        if (e.target === this) closeAdmin();
    });
}
