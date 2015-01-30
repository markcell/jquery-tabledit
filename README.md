# jQuery-Tabledit
Inline editor for HTML tables.

## Options
The following options are supported:
* url: link to server script (default = window.location.href)
* inputClass: class for form inputs (default = 'form-control input-sm')
* eventType: type of trigger to when want change for edit mode (default = 'click')
* hideIdentifier: hide the column that has the identifier (default = false)
* textSelection: enable text selection on editable columns (default = true)

## Hooks
The following hooks are available:
* onDraw(): executed after draw the structure
* onComplete(response): executed when the ajax request is completed
* onError(): executed when occurred an error on ajax request

## Help
Soon with more examples.

## Examples
Only with the required options.

```js
$('table').Tabledit({
    url: 'example.php',
    columns: {
        identifier: [0, 'id'],                    
        editable: [[2, 'firstname'], [3, 'lastname']]
    }
});
```

## License
Code released under the MIT license.
