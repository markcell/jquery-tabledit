# jQuery-Tabledit [![GitHub version](https://badge.fury.io/gh/markcell%2FjQuery-Tabledit.svg)](http://badge.fury.io/gh/markcell%2FjQuery-Tabledit)
Inline editor for HTML tables compatible with Bootstrap.

## Options
The following options are supported:
* url: link to server script (default = window.location.href)
* inputClass: class for form inputs (default = 'form-control input-sm')
* eventType: trigger to change for edit mode (default = 'click')
* hideIdentifier: hide the column that has the identifier (default = false)
* textSelection: enable text selection on editable columns (default = true)

## Hooks
The following hooks are available:
* onDraw(): executed after draw the structure
* onComplete(response): executed when the ajax request is completed
* onError(): executed when occurred an error on ajax request

## Examples
Only with the required options.

```js
$('#example1').Tabledit({
  url: 'example.php',
  columns: {
    identifier: [0, 'id'],                    
    editable: [[2, 'firstname'], [3, 'lastname']]
  }
});
```

With non required options and a third parameter in editable columns to create a select instead of input.

```js
$('#example2').Tabledit({
  url: 'example.php',
  eventType: 'dblclick',
  hideIdentifier: true,
  textSelection: false,
  columns: {
    identifier: [0, 'id'],                    
    editable: [[1, 'car'], [2, 'color', '{"1": "Red", "2": "Green", "3": "Blue"}']]
  }
});
```

See demo page with the examples above on this link: 
http://markcell.github.io/examples/jquery.tabledit.html

## License
Code released under the MIT license.
