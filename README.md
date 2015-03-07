# jQuery-Tabledit v1.2.0
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

## Examples
See demo page with the examples below on this link:
http://markcell.github.io/jQuery-Tabledit

```js
/**
 * Example #1
 * Inline edit like a spreadsheet on two columns only.
 */
$('#example1').Tabledit({
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
 * Example #2
 * Inline edit like a spreadsheet with double click and "select" instead of text input.
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
 * Add toolbar column with all buttons.
 */
$('#example3').Tabledit({
  url: 'example.php',
  columns: {
    identifier: [0, 'id'],
    editable: [[1, 'nickname'], [2, 'firstname'], [3, 'lastname']]
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
v1.2.0 (2015/03/07):
* Added 'saveButton' and 'restoreButton' options.
* Added 'toolbarClass' and 'groupClass' options.
* Changed 'removeButton' option to 'deleteButton'.
* Changed 'remove' action to 'delete'.
* Removed 'textSelection' option, using CSS to prevent the text is selected with double click.
* Removed 'confirmText' option, because a button was created to confirm the removal.
* Removed form wrapped on table, because now it serialize inputs instead of the form.
* In 'buttons' option now have a new child 'action' to change name of action input ('edit', 'delete' and 'restore').
* Redesign of toolbox and changed name to toolbar.
* Minor code improvement.
* Fixed some bugs.

v1.1.1 (2015/03/05):
* Fixed bug when creates the form wrapped on table.

v1.1.0 (2015/02/08):
* Added toolbox column with edit and remove buttons.
* Added effect on table row when ajax request fails.
* Added effect on table row when changes are saved with success.
* Added 'onAlways()' hook, that is executed whenever there is an ajax request.
* Change 'onComplete(response)' hook to 'onSuccess(data, textStatus, jqXHR)'.
* Change 'onError()' hook to 'onFail(jqXHR, textStatus, errorThrown)'.
* Fixed some minor bugs.
* Minor code improvement.

v1.0.0 (2015/01/30):
* Initial release.

## License
Code released under the MIT license.