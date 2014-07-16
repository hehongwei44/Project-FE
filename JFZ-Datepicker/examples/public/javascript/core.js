$(document).ready(function() {

    $('#datepicker-example1').DatePicker();

    $('#datepicker-example2').DatePicker({
        direction: 1    // boolean true would've made the date picker future only
                        // but starting from today, rather than tomorrow
    });

    $('#datepicker-example3').DatePicker({
        direction: true,
        disabled_dates: ['* * * 0,6']   // all days, all monts, all years as long
                                        // as the weekday is 0 or 6 (Sunday or Saturday)
    });

    $('#datepicker-example4').DatePicker({
        direction: [1, 10]
    });

    $('#datepicker-example5').DatePicker({
        // remember that the way you write down dates
        // depends on the value of the "format" property!
        direction: ['2012-08-01', '2012-08-12']
    });

    $('#datepicker-example6').DatePicker({
        // remember that the way you write down dates
        // depends on the value of the "format" property!
        direction: ['2012-08-01', false]
    });

    $('#datepicker-example7-start').DatePicker({
        direction: true,
        pair: $('#datepicker-example7-end')
    });

    $('#datepicker-example7-end').DatePicker({
        direction: 1
    });

    $('#datepicker-example8').DatePicker({
        format: 'M d, Y'
    });

    $('#datepicker-example9').DatePicker({
        show_week_number: 'Wk'
    });

    $('#datepicker-example10').DatePicker({
        view: 'years'
    });

    $('#datepicker-example11').DatePicker({
        format: 'm Y'
    });

    $('#datepicker-example12').DatePicker({
        onChange: function(view, elements) {
            if (view == 'days') {
                elements.each(function() {
                    if ($(this).data('date').match(/\-24$/))
                        $(this).css({
                            background: '#C40000',
                            color:      '#FFF'
                        });
                });
            }
        }
    });

    $('#datepicker-example13').DatePicker({
        always_visible: $('#container')
    });

    $('#datepicker-example14').DatePicker();

});