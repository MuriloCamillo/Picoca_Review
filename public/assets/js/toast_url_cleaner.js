// public/assets/js/toast_url_cleaner.js
document.addEventListener('DOMContentLoaded', function () {
    const url = new URL(window.location);
    const paramsToRemove = [
        'login_success', 'signup_success', 'logout_success', 'logout_error',
        'success_profile', 'success_password', 'success_avatar',
        'error_profile', 'error_password', 'error_avatar', 'error', 'success'
    ];
    let paramsChanged = false;
    paramsToRemove.forEach(param => {
        if (url.searchParams.has(param)) {
            url.searchParams.delete(param);
            paramsChanged = true;
        }
    });
    if (paramsChanged) {
        window.history.replaceState({}, document.title, url.pathname + url.search + url.hash);
    }
});