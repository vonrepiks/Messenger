$(function () {
    $('.error').click(function () {
        $(this).fadeOut();
    });
    setTimeout(function () {
        $('.success').fadeOut();
    }, 3000);
});