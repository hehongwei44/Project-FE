$(document).ready(function() {

    // create a session cookie (expires when the browser closes)
    $.cookie.write('cookie_name', 'cookie_value');

    // create a cookie that expires in 1 day
    $.cookie.write('cookie_name', 'cookie_value', 24 * 60 * 60);

    // read a cookie’s value
    // following the examples above, this should return "cookie_value"
    $.cookie.read('cookie_name');

    // the "read" method returns null if the cookie doesn’t exist
    $.cookie.read('non_existing_cookie_name');

    // delete a cookie
    $.cookie.destroy('cookie_name');

});