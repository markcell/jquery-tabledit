# jQuery-Tabledit v1.2.1
Inline editor for HTML tables compatible with Bootstrap.

## Options
The following options are supported:
* __url:__ link to server script (default = window.location.href)
* __inputClass:__ class for form inputs (default = 'form-control input-sm')
* __toolbarClass:__ class for buttons toolbar (default = 'btn-toolbar')
* __groupClass:__ class for buttons group (default = btn-group btn-group-sm)
* __dangerClass:__ class for row when ajax request fails (default = 'danger')
* __warningClass:__ class for row when save changes (default = 'warning')
* __mutedClass:__ class for row when is deleted (default = 'text-muted')
* __eventType:__ trigger to change for edit mode (default = 'click')
* __hideIdentifier:__ hide the column that has the identifier (default = false)
* __autoFocus:__ activate focus on first input of a row when click in save button (default = true)
* __editButton:__ activate edit button instead of spreadsheet style (default = true)
* __deleteButton:__ activate delete button (default = true)
* __saveButton:__ activate save button when click on edit button (default = true)
* __restoreButton:__ activate restore button to undo delete action (default = true)

## Hooks
The following hooks are available:
* __onDraw():__ executed after draw the structure
* __onSuccess(data, textStatus, jqXHR):__ executed when the ajax request is completed
* __onFail(jqXHR, textStatus, errorThrown):__ executed when occurred an error on ajax request
* __onAlways():__ executed whenever there is an ajax request
* __onAjax(action, serialize):__ executed before the ajax request

## Examples
See demo page with the examples below on this link:
http://markcell.github.io/jQuery-Tabledit

```js
/**
 * Example #1
 * Add toolbar column with all buttons.
 */
$('#example1').Tabledit({
  url: 'example.php',
  columns: {
    identifier: [0, 'id'],
    editable: [[1, 'nickname'], [2, 'firstname'], [3, 'lastname']]
  }
});
```

```js
/**
 * Example #2
 * Inline edit like a spreadsheet with dblclick and "select" instead of text input.
 */
$('#example2').Tabledit({
  url: 'example.php',
  eventType: 'dblclick',
  editButton: false,
  deleteButton: false,
  hideIdentifier: true,
  columns: {
    // Column used to identify table row.
    // [column_index, input_name]
    identifier: [0, 'id'],
    // Columns to transform in editable cells.
    // [[column_index, input_name], [column_index, input_name, select_options]]
    editable: [[1, 'car'], [2, 'color', '{"1": "Red", "2": "Green", "3": "Blue"}']]
  }
});
```

```js
/**
 * Example #3
 * Inline edit like a spreadsheet on two columns only.
 */
$('#example3').Tabledit({
  url: 'example.php',
  editButton: false,
  deleteButton: false,
  columns: {
    // Column used to identify table row. 
    // [column_index, input_name]
    identifier: [0, 'id'],
    // Columns to transform in editable cells.
    // [[column_index, input_name], [column_index, input_name]]
    editable: [[2, 'firstname'], [3, 'lastname']]
  }
});
```

```js
/**
 * Example #4
 * Inline edit like a spreadsheet and add toolbar column with delete button only.
 */
$('#example4').Tabledit({
  url: 'example.php',
  editButton: false,
  restoreButton: false,
  hideIdentifier: true,
  columns: {
    identifier: [0, 'id'],
    editable: [[1, 'car'], [2, 'color', '{"1": "Red", "2": "Green", "3": "Blue"}']]
  }
});
```

```js
/**
 * Example #5
 * Toolbox column with custom buttons and edit button only.
 */
$('#example5').Tabledit({
  url: 'example.php',
  deleteButton: false,
  buttons: {
    edit: {
      class: 'btn btn-sm btn-primary',
      html: '<span class="glyphicon glyphicon-pencil"></span>&nbsp; Edit',
      action: 'edit'
    },
    delete: {
      class: 'btn btn-sm btn-primary',
      html: '<span class="glyphicon glyphicon-trash"></span>&nbsp; Delete',
      action: 'delete'
    },
    save: {
      class: 'btn btn-sm btn-success',
      html: 'Save'
    },
    restore: {
      class: 'btn btn-sm btn-warning',
      html: 'Restore',
      action: 'restore'
    },
    confirm: {
      class: 'btn btn-sm btn-danger',
      html: 'Confirm'
    }
  },
  columns: {
    identifier: [0, 'id'],
    editable: [[1, 'nickname'], [2, 'firstname'], [3, 'lastname']]
  }
});
```

## Changelog
See CHANGELOG.md file.

## License
Code released under the MIT license.