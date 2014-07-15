(function() {
  $('#search').on('keypress', function(event) {
    if (event.which !== 13) {
      return;
    }
    event.preventDefault();
    return $('#google').submit();
  });

}).call(this);
