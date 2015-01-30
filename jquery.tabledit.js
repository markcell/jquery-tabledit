/*!
 * Tabledit v1.0.0 (https://github.com/markcell/jQuery-Tabledit)
 * Copyright (c) 2015 Celso Marques
 * Licensed under MIT (https://github.com/markcell/jQuery-Tabledit/blob/master/LICENSE)
 */

/**
 * @description Inline editor for HTML tables
 * @version 1.0.0
 * @author Celso Marques
 */

if (typeof jQuery === 'undefined') {
  throw new Error('Tabledit requires jQuery library.');
}

(function($) {
    'use strict';

    $.fn.Tabledit = function(options) {

        if (!this.is('table')) {
            throw new Error('Tabledit only works when applied to a table.');
        }

        var $table = this;

        var settings = $.extend({
            url: window.location.href,
            inputClass: 'form-control input-sm',
            eventType: 'click',
            hideIdentifier: false,
            textSelection: true,
            onDraw: function() { return; },
            onComplete: function() { return; },
            onError: function() { return; }
        }, options);

        /**
         * Change to view mode or edit mode with table td element as parameter.
         *
         * @type object
         */
        var Mode = {
            view: function(td) {
                // Disable identifier.
                $(td).parent('tr').find('.tabledit-input.tabledit-identifier').prop('disabled', true);
                // Hide and disable input element.
                $(td).find('.tabledit-input').blur().hide().prop('disabled', true);
                // Show span element.
                $(td).find('.tabledit-span').show();
                // Add "view" class and remove "edit" class in td element.
                $(td).addClass('tabledit-view-mode').removeClass('tabledit-edit-mode');
            },
            edit: function(td) {
                // Enable identifier.
                $(td).parent('tr').find('.tabledit-input.tabledit-identifier').prop('disabled', false);
                // Hide span element.
                $(td).find('.tabledit-span').hide();
                // Enable, show and focus input element.
                $(td).find('.tabledit-input').prop('disabled', false).show().focus();
                // Add "edit" class and remove "view" class in td element.
                $(td).addClass('tabledit-edit-mode').removeClass('tabledit-view-mode');
            }
        };

        /**
         * Available actions with table td element as parameter.
         *
         * @type object
         */
        var Action = {
            reset: function(td) {
                // Set input value with span text.
                $(td).find('.tabledit-input').val($(td).find('.tabledit-span').text());
                // Change to view mode.
                Mode.view(td);
            },
            submit: function(td) {
                // Send AJAX request to server.
                ajax('edit');
                // Get input element.
                var $input = $(td).find('.tabledit-input');
                // Set span text with input/select new value.
                if ($input.is('select')) {
                    $(td).find('.tabledit-span').text($input.find('option:selected').text());
                } else {
                    $(td).find('.tabledit-span').text($input.val());
                }
                // Change to view mode.
                Mode.view(td);
            }
        };

        /**
         * Draw Tabledit structure (identifier column, editable columns).
         *
         * @type {object}
         */
        var Draw = {
            form: function(url) {
                // Create form wrapped on table if not exists.
                if (!$table.parent('form.tabledit-form').length > 0) {
                    $table.wrap('<form action="' + url + '" method="post" class="tabledit-form"></form>');
                }
            },
            columns: {
                identifier: function() {
                    // Hide identifier column.
                    if (settings.hideIdentifier) {
                        $table.find('th:nth-child(' + parseInt(settings.columns.identifier[0]) + 1 + '), td:nth-child(' + parseInt(settings.columns.identifier[0]) + 1 + ')').hide();
                    }

                    var $td = $table.find('td:nth-child(' + (parseInt(settings.columns.identifier[0]) + 1) + ')');

                    $td.each(function() {
                        // Create hidden input with row identifier.
                        var span = '<span class="tabledit-span tabledit-identifier">' + $(this).text() + '</span>';
                        var input = '<input class="tabledit-input tabledit-identifier" type="hidden" name="' + settings.columns.identifier[1] + '" value="' + $(this).text() + '" disabled>';

                        // Add elements to table cell.
                        $(this).html(span + input);
                    });
                },
                editable: function() {
                    for (var i = 0; i < settings.columns.editable.length; i++) {
                        var $td = $table.find('td:nth-child(' + (parseInt(settings.columns.editable[i][0]) + 1) + ')');

                        $td.each(function() {
                            // Add pointer as cursor.
                            $(this).css('cursor', 'pointer');

                            // Create span element.
                            var span = '<span class="tabledit-span">' + $(this).text() + '</span>';

                            // Check if exists the third parameter of editable array.
                            if (typeof settings.columns.editable[i][2] !== 'undefined') {
                                // Create select element.
                                var input = '<select class="tabledit-input ' + settings.inputClass + '" name="' + settings.columns.editable[i][1] + '" style="display: none;" disabled>';

                                // Create options for select element.
                                $.each(jQuery.parseJSON(settings.columns.editable[i][2]), function(index, value) {
                                    input += '<option value="' + index + '">' + value + '</option>';
                                });

                                // Create last piece of select element.
                                input += '</select>';
                            } else {
                                // Create text input element.
                                var input = '<input class="tabledit-input ' + settings.inputClass + '" type="text" name="' + settings.columns.editable[i][1] + '" value="' + $(this).text() + '" style="display: none;" disabled>';
                            }

                            // Add elements and class "view" to table cell.
                            $(this).html(span + input);
                            $(this).addClass('tabledit-view-mode');
                       });
                    }

                    // Text selection in editable columns.
                    if (!settings.textSelection) {
                        $table.find('td.tabledit-view-mode').css('-webkit-touch-callout', 'none')
                                                            .css('-webkit-user-select', 'none')
                                                            .css('-khtml-user-select', 'none')
                                                            .css('-moz-user-select', 'none')
                                                            .css('-ms-user-select', 'none')
                                                            .css('user-select', 'none');
                    }
                }
            }
        };

        Draw.form(settings.url);
        Draw.columns.identifier();
        Draw.columns.editable();

        settings.onDraw();

        /**
         * Change to edit mode on table td element.
         *
         * @param {object} event
         */
        $table.on(settings.eventType, 'td.tabledit-view-mode', function(event) {
            event.preventDefault();
            // Reset all td's in edit mode.
            Action.reset($table.find('td.tabledit-edit-mode'));
            // Change to edit mode.
            Mode.edit(this);
        });

        /**
         * Change event when input is a select element.
         */
        $table.on('change', 'select.tabledit-input:visible', function() {
            Action.submit($(this).parent('td'));
        });

        /**
         * Click event on document element.
         *
         * @param {object} event
         */
        $(document).on('click', function(event) {
            var $editMode = $table.find('.tabledit-edit-mode');

            if (!$editMode.is(event.target) && $editMode.has(event.target).length === 0) {
                Action.reset($table.find('.tabledit-input:visible').parent('td'));
            }
        });

        /**
         * Keyup event on document element.
         *
         * @param {object} event
         */
        $(document).on('keyup', function(event) {
            // Get input element with focus.
            var $input = $table.find('.tabledit-input:focus');

            // If exists, check what key was pressed.
            if ($input.length > 0) {
                // Get span and td element.
                var $td = $input.parent('.tabledit-edit-mode');
                // Enter key pressed.
                if (event.keyCode === 13) {
                    Action.submit($td);
                }
                // Escape key pressed.
                if (event.keyCode === 27) {
                    Action.reset($td);
                }
            }
        });

        /**
         * Send AJAX request to server.
         *
         * @param {string} action
         */
        function ajax(action)
        {
            var data = '&action=' + action;

            return $.post(settings.url, $('form.tabledit-form').serialize() + data, function(response) {
                settings.onComplete(response);
            }, 'json').fail(function() {
                settings.onError();
            });
        }

    };

}(jQuery));