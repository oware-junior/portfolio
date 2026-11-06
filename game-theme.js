// Light/dark theme for the game pages. Uses the same saved 'theme' setting as
// the portfolio, so a choice made on one page applies to all of them.
// Loaded in <head> without defer so the right theme is set before first paint.
(function () {
    var root = document.documentElement;

    function savedTheme() {
        try {
            var theme = localStorage.getItem('theme');
            return theme === 'light' || theme === 'dark' ? theme : null;
        } catch (err) {
            return null; // storage blocked
        }
    }

    function systemTheme() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);
        var meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', theme === 'dark' ? '#071a2a' : '#0b5f92');
        var toggle = document.getElementById('themeToggle');
        if (toggle) {
            toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
            toggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
        }
    }

    root.setAttribute('data-theme', savedTheme() || systemTheme());

    document.addEventListener('DOMContentLoaded', function () {
        applyTheme(root.getAttribute('data-theme'));
        document.getElementById('themeToggle').addEventListener('click', function () {
            var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            applyTheme(next);
            try { localStorage.setItem('theme', next); } catch (err) { /* storage blocked */ }
        });
    });

    // Another open tab changed the theme
    window.addEventListener('storage', function (e) {
        if (e.key === 'theme') applyTheme(savedTheme() || systemTheme());
    });

    // Follow the system setting until the visitor picks a theme themselves
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
            if (!savedTheme()) applyTheme(e.matches ? 'dark' : 'light');
        });
    }
})();
