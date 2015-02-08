/*!
 * Tabledit v1.1.0 (https://github.com/markcell/jQuery-Tabledit)
 * Copyright (c) 2015 Celso Marques
 * Licensed under MIT (https://github.com/markcell/jQuery-Tabledit/blob/master/LICENSE)
 */

/**
 * @description Inline editor for HTML tables
 * @version 1.1.0
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

        var defaults = {
            url: window.location.href,
            inputClass: 'form-control input-sm',
            dangerClass: 'danger',
            warningClass: 'warning',
            mutedClass: 'text-muted',
            eventType: 'click',
            confirmText: ' &nbsp; Confirm',
            hideIdentifier: false,
            textSelection: true,
            editButton: true,
            removeButton: true,
            buttons: {
                edit: {
                    class: 'btn btn-sm btn-warning',
                    html: '<span class="glyphicon glyphicon-pencil"></span>'
                },
                remove: {
                    class: 'btn btn-sm btn-danger',
                    html: '<span class="glyphicon glyphicon-trash"></span>'
                },
                save: {
                    class: 'btn btn-sm btn-success',
                    html: '<span class="glyphicon glyphicon-ok"></span> &nbsp; Save'
                },
                cancel: {
                    class: 'btn btn-sm btn-warning',
                    html: '<span class="glyphicon glyphicon-pencil"></span>'
                }
            },
            onDraw: function() { return; },
            onSuccess: function() { return; },
            onFail: function() { return; },
            onAlways: function() { return; }
        };

        var settings = $.extend({}, defaults, options);

        var $lastEditedRow = 'undefined';
        var $lastRemovedRow = 'undefined';

        /**
         * Draw Tabledit structure (identifier column, editable columns, toolbox column).
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

                        // Add attribute "id" to table row.
                        $(this).parent('tr').attr('id', $(this).text());
                    });
                },
                editable: function() {
                    for (var i = 0; i < settings.columns.editable.length; i++) {
                        var $td = $table.find('td:nth-child(' + (parseInt(settings.columns.editable[i][0]) + 1) + ')');

                        $td.each(function() {
                            // Add pointer as cursor.
                            if (!settings.editButton) {
                                $(this).css('cursor', 'pointer');
                            }

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
                },
                toolbox: function() {
                    if (settings.editButton || settings.removeButton) {
                        var editButton = '';
                        var removeButton = '';
                        var saveButton = '';
                        var cancelButton = '';

                        // Add toolbox column header if not exists.
                        if ($table.find('th.tabledit-toolbox-column').length === 0) {
                            $table.find('tr:first').append('<th class="tabledit-toolbox-column"></th>');
                        }

                        // Add class "active" to cancel button, if edit button is equal to cancel button.
                        if ((settings.buttons.edit.class === settings.buttons.cancel.class) && (settings.buttons.edit.html === settings.buttons.cancel.html)) {
                            settings.buttons.cancel.class += ' active';
                        }

                        // Create edit button.
                        if (settings.editButton) {
                            editButton = '<button type="button" class="tabledit-edit-button ' + settings.buttons.edit.class + '" style="margin-left: 5px;">' + settings.buttons.edit.html + '</button>';
                            saveButton = '<button type="button" class="tabledit-save-button ' + settings.buttons.save.class + '" style="margin-left: 5px; display: none;">' + settings.buttons.save.html + '</button>';
                            cancelButton = '<button type="button" class="tabledit-cancel-button ' + settings.buttons.cancel.class + '" style="margin-left: 5px; display: none;">' + settings.buttons.cancel.html + '</button>';
                        }

                        // Create remove button.
                        if (settings.removeButton) {
                            removeButton = '<button type="button" class="tabledit-remove-button ' + settings.buttons.remove.class + '" style="margin-left: 5px;">' + settings.buttons.remove.html + '</button>';
                        }

                        // Add toolbox column cells.
                        $table.find('tr:gt(0)').append('<td style="white-space: nowrap; width: 1px;"><div class="tabledit-toolbox" style="margin-left: -5px; text-align: right;">' + editButton + saveButton + cancelButton + removeButton + '</div></td>');
                    }
                }
            }
        };

        /**
         * Change to view mode or edit mode with table td element as parameter.
         *
         * @type object
         */
        var Mode = {
            view: function(td) {
                // Get table row.
                var $tr = $(td).parent('tr');
                // Disable identifier.
                $(td).parent('tr').find('.tabledit-input.tabledit-identifier').prop('disabled', true);
                // Hide and disable input element.
                $(td).find('.tabledit-input').blur().hide().prop('disabled', true);
                // Show span element.
                $(td).find('.tabledit-span').show();
                // Add "view" class and remove "edit" class in td element.
                $(td).addClass('tabledit-view-mode').removeClass('tabledit-edit-mode');
                // Update toolbox buttons.
                if (settings.editButton) {
                    $tr.find('button.tabledit-save-button, button.tabledit-cancel-button').hide();
                    $tr.find('button.tabledit-edit-button').show();
                }
            },
            edit: function(td) {
                Remove.reset();
                // Get table row.
                var $tr = $(td).parent('tr');
                // Enable identifier.
                $tr.find('.tabledit-input.tabledit-identifier').prop('disabled', false);
                // Hide span element.
                $(td).find('.tabledit-span').hide();
                // Enable, show and focus input element.
                $(td).find('.tabledit-input').prop('disabled', false).show().focus();
                // Add "edit" class and remove "view" class in td element.
                $(td).addClass('tabledit-edit-mode').removeClass('tabledit-view-mode');
                // Update toolbox buttons.
                if (settings.editButton) {
                    $tr.find('button.tabledit-edit-button').hide();
                    $tr.find('button.tabledit-save-button, button.tabledit-cancel-button').show();
                }
            }
        };

        /**
         * Available actions for edit function, with table td element as parameter or set of td elements.
         *
         * @type object
         */
        var Edit = {
            reset: function(td) {
                $(td).each(function() {
                    // Get input element.
                    var $input = $(this).find('.tabledit-input');
                    // Set input/select value with span text.
                    if ($input.is('select')) {
                        $input.find('option[text="' + $(this).find('.tabledit-span').text() + '"]').attr('selected', true);
                    } else {
                        $input.val($(this).find('.tabledit-span').text());
                    }
                    // Change to view mode.
                    Mode.view(this);
                });
            },
            submit: function(td) {
                // Send AJAX request to server.
                ajax('edit');

                $(td).each(function() {
                    // Get input element.
                    var $input = $(this).find('.tabledit-input');
                    // Set span text with input/select new value.
                    if ($input.is('select')) {
                        $(this).find('.tabledit-span').text($input.find('option:selected').text());
                    } else {
                        $(this).find('.tabledit-span').text($input.val());
                    }
                    // Change to view mode.
                    Mode.view(this);
                });

                // Set last edited column and row.
                $lastEditedRow = $(td).parent('tr');
            }
        };

        /**
         * Available actions for remove function, with button as parameter.
         *
         * @type object
         */
        var Remove = {
            reset: function() {
                // Reset remove button to initial status.
                $table.find('.tabledit-remove-button.tabledit-confirm').removeClass('tabledit-confirm').find('span.tabledit-confirm-text').remove();
            },
            submit: function(button) {
                Remove.reset();
                // Enable identifier hidden input.
                $(button).parents('tr').find('input.tabledit-identifier').attr('disabled', false);
                // Send AJAX request to server.
                ajax('remove');
                // Hide table row.
                $(button).parents('tr').addClass(settings.mutedClass).find('.tabledit-toolbox button').attr('disabled', true);
                // Disable identifier hidden input.
                $(button).parents('tr').find('input.tabledit-identifier').attr('disabled', true);
                // Set last removed row.
                $lastRemovedRow = $(button).parents('tr');
            },
            confirm: function(button) {
                Mode.view($(button).parents('tr').find('td.tabledit-edit-mode'));
                // Add confirmation text.
                $(button).html(settings.buttons.remove.html + '<span class="tabledit-confirm-text">' + settings.confirmText + '</span>').addClass('tabledit-confirm').blur();
            }
        };

        /**
         * Send AJAX request to server.
         *
         * @param {string} action
         */
        function ajax(action)
        {
            var data = '&action=' + action;

            var jqXHR = $.post(settings.url, $('form.tabledit-form').serialize() + data, function(data, textStatus, jqXHR) {
                if (action === 'edit') {
                    $lastEditedRow.removeClass(settings.dangerClass).addClass(settings.warningClass);
                    setTimeout(function() {
                        $lastEditedRow.removeClass(settings.warningClass);
                    }, 1400);
                }

                settings.onSuccess(data, textStatus, jqXHR);
            }, 'json');

            jqXHR.fail(function(jqXHR, textStatus, errorThrown) {
                if (action === 'remove') {
                    $lastRemovedRow.removeClass(settings.mutedClass).addClass(settings.dangerClass);
                    $lastRemovedRow.find('.tabledit-toolbox button').attr('disabled', false);
                } else if (action === 'edit') {
                    $lastEditedRow.addClass(settings.dangerClass);
                }

                settings.onFail(jqXHR, textStatus, errorThrown);
            });

            jqXHR.always(function() {
                settings.onAlways();
            });

            return jqXHR;
        }

        Draw.form(settings.url);

        Draw.columns.identifier();
        Draw.columns.editable();
        Draw.columns.toolbox();

        settings.onDraw();

        if (settings.removeButton) {
            /**
             * Remove one row.
             *
             * @param {object} event
             */
            $table.on('click', 'button.tabledit-remove-button', function(event) {
                if (event.handled !== true) {
                    event.preventDefault();

                    if ($(this).hasClass('tabledit-confirm')) {
                        Remove.submit(this);
                    } else {
                        Remove.reset();
                        Remove.confirm(this);
                    }

                    event.handled = true;
                }
            });

            /**
             * Click event on document element.
             *
             * @param {object} event
             */
            /*
            $(document).on('click', function(event) {
                var $removeButton = $table.find('.tabledit-remove-button');
                // Reset visible edit mode column.
                if (!$removeButton.is(event.target) && $removeButton.has(event.target).length === 0) {
                    Remove.reset();
                }
            });
            */
        }

        if (settings.editButton) {
            /**
             * Activate edit mode on all columns.
             *
             * @param {object} event
             */
            $table.on('click', 'button.tabledit-edit-button', function(event) {
                if (event.handled !== true) {
                    event.preventDefault();

                    // Change to view mode columns that are in edit mode.
                    Edit.reset($table.find('td.tabledit-edit-mode'));

                    // Change to edit mode for all columns in reverse way.
                    $($(this).parents('tr').find('td.tabledit-view-mode').get().reverse()).each(function() {
                        Mode.edit(this);
                    });

                    event.handled = true;
                }
            });

            /**
             * Save edited row.
             *
             * @param {object} event
             */
            $table.on('click', 'button.tabledit-save-button', function(event) {
                if (event.handled !== true) {
                    event.preventDefault();

                    // Submit and update all columns.
                    Edit.submit($(this).parents('tr').find('td.tabledit-edit-mode'));

                    event.handled = true;
                }
            });

            /**
             * Cancel edit mode.
             *
             * @param {object} event
             */
            $table.on('click', 'button.tabledit-cancel-button', function(event) {
                if (event.handled !== true) {
                    event.preventDefault();

                    // Reset and update all columns.
                    Edit.reset($(this).parents('tr').find('td.tabledit-edit-mode'));

                    event.handled = true;
                }
            });
        } else {
            /**
             * Change to edit mode on table td element.
             *
             * @param {object} event
             */
            $table.on(settings.eventType, 'td.tabledit-view-mode', function(event) {
                if (event.handled !== true) {
                    event.preventDefault();

                    // Reset all td's in edit mode.
                    Edit.reset($table.find('td.tabledit-edit-mode'));

                    // Change to edit mode.
                    Mode.edit(this);

                    event.handled = true;
                }
            });

            /**
             * Change event when input is a select element.
             */
            $table.on('change', 'select.tabledit-input:visible', function() {
                if (event.handled !== true) {
                    // Submit and update the column.
                    Edit.submit($(this).parent('td'));

                    event.handled = true;
                }
            });

            /**
             * Click event on document element.
             *
             * @param {object} event
             */
            $(document).on('click', function(event) {
                var $editMode = $table.find('.tabledit-edit-mode');
                // Reset visible edit mode column.
                if (!$editMode.is(event.target) && $editMode.has(event.target).length === 0) {
                    Edit.reset($table.find('.tabledit-input:visible').parent('td'));
                }
            });
        }

        /**
         * Keyup event on document element.
         *
         * @param {object} event
         */
        $(document).on('keyup', function(event) {
            // Get input element with focus or confirmation button.
            var $input = $table.find('.tabledit-input:focus');
            var $button = $table.find('.tabledit-remove-button.tabledit-confirm');

            // If exists, check what key was pressed.
            if ($input.length > 0 || $button.length > 0) {
                // Get td element.
                if (settings.editButton) {
                    var $td = $input.parents('tr').find('.tabledit-edit-mode');
                } else {
                    var $td = $input.parent('.tabledit-edit-mode');
                }
                // Key?
                switch (event.keyCode) {
                    case 13: // Enter.
                        Edit.submit($td);
                        break;
                    case 27: // Escape.
                        Edit.reset($td);
                        // Reset remove button.
                        Remove.reset();
                        break;
                }
            }
        });

        return this;
    };
}(jQuery));