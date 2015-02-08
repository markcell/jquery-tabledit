# jQuery-Tabledit [![GitHub version](https://badge.fury.io/gh/markcell%2FjQuery-Tabledit.svg)](http://badge.fury.io/gh/markcell%2FjQuery-Tabledit)
Inline editor for HTML tables compatible with Bootstrap.

## Options
The following options are supported:
* url: link to server script (default = window.location.href)
* inputClass: class for form inputs (default = 'form-control input-sm')
* dangerClass: class for row when ajax request fails (default = 'danger')
* warningClass: class for row when save changes (default = 'warning')
* mutedClass: class for row when is removed (default = 'text-muted')
* eventType: trigger to change for edit mode (default = 'click')
* confirmText: text to append on remove button to confirm action (default = ' &nbsp; Confirm')
* hideIdentifier: hide the column that has the identifier (default = false)
* textSelection: enable text selection on editable columns (default = true)
* editButton: activate edit button instead of spreadsheet style (default = true)
* removeButton: activate remove button (default = true)

## Hooks
The following hooks are available:
* onDraw(): executed after draw the structure
* onSuccess(data, textStatus, jqXHR): executed when the ajax request is completed
* onFail(jqXHR, textStatus, errorThrown): executed when occurred an error on ajax request
* onAlways(): executed whenever there is an ajax request

## Examples
See demo page with the examples below on this link: 
http://markcell.github.io/examples/jquery.tabledit.html

```js
// Example #1
$('#example1').Tabledit({
    url: 'example.php',
    editButton: false,
    removeButton: false,
    columns: {
        identifier: [0, 'id'],
        editable: [[2, 'firstname'], [3, 'lastname']]
    }
});
// Example #2
$('#example2').Tabledit({
    url: 'example.php',
    eventType: 'dblclick',
    editButton: false,
    removeButton: false,
    hideIdentifier: true,
    textSelection: false,
    columns: {
        identifier: [0, 'id'],
        editable: [[1, 'car'], [2, 'color', '{"1": "Red", "2": "Green", "3": "Blue"}']]
    }
});
// Example #3
$('#example3').Tabledit({
    url: 'example.php',
    columns: {
        identifier: [0, 'id'],
        editable: [[1, 'nickname'], [2, 'firstname'], [3, 'lastname']]
    }
});
// Example #4
$('#example4').Tabledit({
    url: 'example.php',
    editButton: false,
    hideIdentifier: true,
    columns: {
        identifier: [0, 'id'],
        editable: [[1, 'car'], [2, 'color', '{"1": "Red", "2": "Green", "3": "Blue"}']]
    }
});
// Example #5
$('#example5').Tabledit({
    url: 'example.php',
    removeButton: false,
    buttons: {
        edit: {
            class: 'btn btn-sm btn-primary',
            html: 'Edit'
        },
        remove: {
            class: 'btn btn-sm btn-danger',
            html: '<span class="glyphicon glyphicon-trash"></span>'
        },
        save: {
            class: 'btn btn-sm btn-success',
            html: 'Save'
        },
        cancel: {
            class: 'btn btn-sm btn-danger',
            html: 'Cancel'
        }
    },
    columns: {
        identifier: [0, 'id'],
        editable: [[1, 'nickname'], [2, 'firstname'], [3, 'lastname']]
    }
});
```

## License
Code released under the MIT license.