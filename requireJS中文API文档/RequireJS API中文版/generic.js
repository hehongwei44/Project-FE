(function() {
  var $leftmenu, $leftpageindex, $pageindex_bar, $sw_catelog, $sw_page, $toplevel_tag, el, idnum, idx, indent, indexArr, indexTags, tn, _i, _len,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  if ($('.float-container > .left-pageindex').length > 0) {
    indent = function(tn) {
      switch (tn) {
        case 'h2':
          return '&nbsp;&nbsp;';
        case 'h3':
          return '&nbsp;&nbsp;&nbsp;&nbsp;';
        case 'h4':
          return '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
        case 'h5':
          return '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
        default:
          return '';
      }
    };
    indexTags = $('.float-container > .left-pageindex').attr('indextags').toLowerCase().split(',');
    $toplevel_tag = $('.layout-right .content').find('>h1, >h2, >h3, >h4').first();
    indexArr = [];
    idnum = 0;
    while ($toplevel_tag.length > 0) {
      el = $toplevel_tag[0];
      tn = el.tagName.toLowerCase();
      if (__indexOf.call(indexTags, tn) >= 0) {
        el.id = el.id || ('pageindexid-' + idnum++);
        indexArr.push({
          title: indent(tn) + el.innerText,
          link: '#' + el.id
        });
      }
      $toplevel_tag = $toplevel_tag.next();
    }
    $pageindex_bar = $('.left-pageindex > ul.nav');
    for (_i = 0, _len = indexArr.length; _i < _len; _i++) {
      idx = indexArr[_i];
      $pageindex_bar.append("<li><a href='" + idx.link + "' title='" + idx.title + "'><i class='icon-chevron-right'></i>" + idx.title + "</a></li>");
    }
    $sw_catelog = $('.layout-left .switch span.catelog');
    $sw_page = $('.layout-left .switch span.page');
    $leftmenu = $('.layout-left .left-menu');
    $leftpageindex = $('.layout-left .left-pageindex');
    $sw_catelog.on('click', function() {
      if (!$sw_catelog.hasClass('active')) {
        $sw_catelog.addClass('active');
        $leftmenu.addClass('active');
      }
      if ($sw_page.hasClass('active')) {
        $sw_page.removeClass('active');
        return $leftpageindex.removeClass('active');
      }
    });
    $sw_page.on('click', function() {
      if (!$sw_page.hasClass('active')) {
        $sw_page.addClass('active');
        $leftpageindex.addClass('active');
      }
      if ($sw_catelog.hasClass('active')) {
        $sw_catelog.removeClass('active');
        return $leftmenu.removeClass('active');
      }
    });
  }

}).call(this);
