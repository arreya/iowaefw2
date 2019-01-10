// Values needs to be uppercase except for email
var W2 = {
    getFilename: function() {
        var filename= "IAW2-";
        filename += $('[name="ben"]').val();
        filename += '-';
        var date = new Date();
        filename += date.getFullYear();
        var pad = function(value) {
            if (value < 10) {
                value = '0' + value;
            }
            return value;
        };
        var month = pad(date.getMonth() + 1);
        filename += month;
        filename += date.getDate();
        filename += date.getHours();
        filename += date.getMinutes();
        filename += '.txt';
        return filename;
    },
    getFileContents: function() {
        var contents = '';
        $('form').each(function() {
            contents += W2.getRecordContents(this);
            contents += '\r\n';
        });
        return contents;
    },
    getRecordContents: function(form) {
        var contents = '';
        $(form).find('input').each(function() {
            contents += W2.formatValueFromField(this);
        });
        return contents;
    },
    formatValueFromField: function(field) {
        var value = field.value;
        if (field.className == 'money') {
            value = (value || '0').replace(/[\$\,]/g, '');
            value = parseFloat(value).toFixed(2).replace('.', '');
            value = '0'.repeat(field.maxLength - value.length) + value;
            return value;
        }
        if (field.className == 'right') {
            value = '0'.repeat(field.maxLength - value.length) + value;
            return value;
        }
        value += ' '.repeat(field.maxLength - value.length);
        if (field.name.indexOf('email') == -1) {
            value = value.toUpperCase();
        }
        return value;
    },
    restricNumeric: function(event) {
        if (event.metaKey || event.ctrlKey) {
            return true;
        }
        if (event.which === 32) {
            return false;
        }
        if (event.which === 0) {
            return true;
        }
        if (event.which < 33) {
            return true;
        }
        // allow decimal point if there isn't one already
        if (event.which === 46) {
            return this.value.indexOf('.') == -1;
        }
        input = String.fromCharCode(event.which);
        return !!/[\d\s]/.test(input);
    },
    test: function() {
        $('form').each(function() {
            var size = 0;
            $(this).find('input').each(function() {
                size += this.maxLength;
            });
            console.log(this.className, size);
        });
    }
};

$(document).ready(function() {
    $('.download').on('click', function() {
        this.download = W2.getFilename();
        var fileContents = W2.getFileContents();
        this.href = 'data:text/plain;charset=ascii,' + encodeURIComponent(fileContents);
    });
    $('body').on('click', '.add-employee', function() {
        var $lastEmployee = $('.employee-and-state').last();
        var $newEmployee = $lastEmployee.clone();
        $newEmployee.find('input').not('[type="hidden"]').val('');
        $lastEmployee.after($newEmployee);
        $('[name="number-of-rw-records"]').val($('.employee').length);
        $('[name="number-of-rs-records"]').val($('.state').length);
    })
    .on('change', '.employee .money, .state .money', function() {
        var total = 0;
        $('[name="' + this.name + '"]').each(function() {
            var value = this.value.replace(/[\$\,]/g, '');
            total += parseFloat(value);
        });
        $('[name="total-' + this.name + '"]').val(total.toFixed(2));
    });
    $('[name="ben"]').on('change', function() {
        $('[name="state-ben"]').val(this.value);
    });
    $('body').on('keypress', '[pattern]', W2.restricNumeric);
});
