var gdMessages = {

    msgInPlay: false,

    notifyTimer: 0,
    notifyOptions: null,

    confirmTimer: 0,
    confirmOptions: null,

    dialogTimer: 0,
    dialogOptions: null,

    aniClassesOut: "",
    bodyOverflow: "",
    resetBO: false,

    maxZ: function () {
        var zindex = Math.max.apply(null,
            $.map($('body *'), function (e, n) {
                if ($(e).css('position') != 'static')
                    return parseInt($(e).css('z-index')) || 1;
            }));
        if (zindex === Number.NEGATIVE_INFINITY) {
            return 333;
        } else {
            return zindex;
        }
    },

    notify: function (options) {

        if (gdMessages.msgInPlay) {
            return;
        } else {
            gdMessages.msgInPlay = true;
        }

        var defaults = {
            title: "",
            msg: "Success!",
            animation: true,
            className: 'info',
            width: "300px",
            position: 'bottom left',
            closeAfter: {
                time: 3,
                resetOnHover: true
            },
            afterClose: null
        };

        switch (options.className) {
            case "success":
                defaults.title = "Success!";
                break;
            case "info":
                defaults.title = "Information";
                break;
            case "warning":
                defaults.title = "Warning!";
                break;
            case "error":
                defaults.title = "Error!";
                break;
        }

        options = $.extend(true, defaults, options);

        var notifyHtml = '<div id="gd-notify">\
                                <div id="gd-notify-inner">\
                                  <div id="gd-notify-header"></div>\
                                  <hr>\
                                  <div id="gd-notify-body"></div>\
                                </div>\
                              </div>';
        $("body").append(notifyHtml);

        var $gdNotify = $('#gd-notify');
        var $gdNotifyInner = $('#gd-notify-inner');
        var $gdNotifyHeader = $('#gd-notify-header');
        var $gdNotifyBody = $('#gd-notify-body');

        var position = "bottomright";
        var dir = "right";
        switch (options.position) {
            case "top left":
                position = "topleft";
                dir = "left";
                break;
            case "top centre":
                position = "topcentre";
                dir = "topcentre";
                break;
            case "top right":
                position = "topright";
                dir = "right";
                break;
            case "centre":
                position = "centre";
                dir = "centre";
                break;
            case "bottom left":
                position = "bottomleft";
                dir = "left";
                break;
            case "bottom centre":
                position = "bottomcentre";
                dir = "bottomcentre";
                break;
            case "bottom right":
                position = "bottomright";
                dir = "right";
                break;
        }

        var aniClassesIn = "gd-slideInLeft";
        var aniClassesOut = "gd-slideOutLeft";
        switch (dir) {
            case "left":
                aniClassesIn = "gd-slideInLeft";
                aniClassesOut = "gd-slideOutLeft";
                break;
            case "right":
                aniClassesIn = "gd-slideInRight";
                aniClassesOut = "gd-slideOutRight";
                break;
            case "centre":
                aniClassesIn = "gd-fadezoomIn";
                aniClassesOut = "gd-fadezoomOut";
                break;
            case "topcentre":
                aniClassesIn = "gd-slideInDown";
                aniClassesOut = "gd-slideOutUp";
                break;
            case "bottomcentre":
                aniClassesIn = "gd-slideInUp";
                aniClassesOut = "gd-slideOutDown";
                break;
        }
        gdMessages.aniClassesOut = aniClassesOut;

        var pause = 3000;
        var resetOnHover = false;
        if (options.closeAfter == false) {
            var pause = 0;
        } else {
            if (typeof options.closeAfter.time == "number") {
                if (options.closeAfter.time > 0) {
                    pause = options.closeAfter.time * 1000;
                }
            }
            if (typeof options.closeAfter.resetOnHover === "boolean") {
                resetOnHover = options.closeAfter.resetOnHover;
            }
        }
        options.closeAfter.resetOnHover = resetOnHover;

        gdMessages.notifyOptions = options;

        var typeClasses = "";
        var typeIcon = "";
        switch (options.className) {
            case "success":
                typeClasses = "successStyle";
                typeIcon = '<i class="fas fa-check"></i>';
                break;
            case "info":
                typeClasses = "infoStyle";
                typeIcon = '<i class="fas fa-info"></i>';
                break;
            case "warning":
                typeClasses = "warningStyle";
                typeIcon = '<i class="fas fa-exclamation"></i>';
                break;
            case "error":
                typeClasses = "errorStyle";
                typeIcon = '<i class="fas fa-times-circle"></i>';
                break;
        }

        $gdNotifyInner.addClass(typeClasses);

        if (options.title == "") {
            $gdNotifyHeader.html(typeIcon + "&nbsp;&nbsp;&nbsp;Notification");
        } else {
            $gdNotifyHeader.html(typeIcon + "&nbsp;&nbsp;&nbsp;" + options.title);
        }
        $gdNotifyBody.html(options.msg);

        $gdNotify.css({
            "width": options.width,
            "z-index": gdMessages.maxZ() + 1
        });

        gdMessages.bodyOverflow = $("body").css("overflow");
        if (dir == "right" || dir == "left" || dir == "bottomcentre") {
            gdMessages.resetBO = true;
        }

        // Show the notification
        if (options.animation) {
            if (gdMessages.resetBO) {
                $("body").css("overflow", "hidden")
            }
            $gdNotify.addClass(position)
                .addClass(aniClassesIn)
                .one("animationend", function () {
                    $(this).css("visibility", "visible").removeClass(aniClassesIn);
                    postShowNotify();
                });
        } else {
            $gdNotify.addClass(position).css("visibility", "visible");
            postShowNotify();
        }

        function postShowNotify() {
            $('#gd-notify').on("click", function () {
                removeNotify();
            });
            if (pause > 0) {
                gdMessages.notifyTimer = setInterval(function () {
                    removeNotify();
                }, pause);
                if (options.closeAfter.resetOnHover) {
                    $('#gd-notify').hover(
                        function () {
                            clearInterval(gdMessages.notifyTimer);
                        },
                        function () {
                            gdMessages.notifyTimer = setInterval(function () {
                                removeNotify();
                            }, pause);
                        }
                    );
                }
            }
        }

        function removeNotify() {
            clearInterval(gdMessages.notifyTimer);
            if (options.animation) {
                $('#gd-notify').addClass(gdMessages.aniClassesOut).one("animationend", function () {
                    $(this).remove();
                    gdMessages.msgInPlay = false;
                    if (gdMessages.resetBO) {
                        $("body").css("overflow", gdMessages.bodyOverflow)
                    }
                    if (typeof options.afterClose === "function") {
                        options.afterClose();
                    }
                });
            } else {
                $('#gd-notify').remove();
                gdMessages.msgInPlay = false;
                if (typeof options.afterClose === "function") {
                    options.afterClose();
                }
            }
        }

    },

    closeNotify: function () {
        clearInterval(gdMessages.notifyTimer);
        if (gdMessages.notifyOptions.animation) {
            $('#gd-notify').addClass(gdMessages.aniClassesOut).one("animationend", function () {
                $(this).remove();
                gdMessages.msgInPlay = false;
                if (gdMessages.resetBO) {
                    $("body").css("overflow", gdMessages.bodyOverflow)
                }
                if (typeof gdMessages.notifyOptions.afterClose === "function") {
                    gdMessages.notifyOptions.afterClose();
                }
            });
        } else {
            $('#gd-notify').remove();
            gdMessages.msgInPlay = false;
            if (typeof gdMessages.notifyOptions.afterClose === "function") {
                gdMessages.notifyOptions.afterClose();
            }
        }
    },

    confirm: function (options) {

        if (gdMessages.msgInPlay) {
            return;
        } else {
            gdMessages.msgInPlay = true;
        }

        var defaults = {
            msg: "Click OK to proceed",
            animation: true,
            className: 'stdconfirm',
            width: "400px",
            position: 'bottom left',
            backdrop: true,
            // closeAfter: false,
            closeAfter: {
                time: 10,
                resetOnHover: true
            },
            okBtn: {
                className: 'btn btn-primary',
                label: 'Ok'
            },
            cancelBtn: {
                className: 'btn btn-danger',
                label: 'Cancel'
            },
            otherBtn: false,
            // {
            //     className: 'btn btn-warning',
            //     label: 'Other'
            // },
            beforeClose: null,
            afterClose: null
        };

        options = $.extend(true, defaults, options);

        var zIndex = gdMessages.maxZ() + 1;

        if (options.backdrop) {
            var $backdropHtml = $('<div id="gd-backdrop"></div>');
            $backdropHtml.css("z-index", zIndex);
            if (options.animation) {
                $backdropHtml.addClass("gd-fadeIn");
            }
            $("body").append($backdropHtml);
            // var $gdBackdrop = $("#gd-backdrop");
        }

        var confirmHtml = '<div id="gd-confirm">\
                              <div id="gd-confirm-inner">\
                                  <div id="gd-exit"><span><i class="fas fa-times"></i><span></div>\
                                  <div id="gd-confirm-msg"></div>\
                                  <hr>\
                                  <div id="gd-confirm-buttons"></div>\
                              </div>\
                          </div>';
        $("body").append(confirmHtml);

        var $gdConfirm = $('#gd-confirm');
        var $gdConfirmInner = $('#gd-confirm-inner');
        var $gdConfirmMsg = $('#gd-confirm-msg');
        var $gdConfirmButtons = $('#gd-confirm-buttons');

        var position = "centre";
        var dir = "centre";
        switch (options.position) {
            case "top left":
                position = "topleft";
                dir = "left";
                break;
            case "top centre":
                position = "topcentre";
                dir = "topcentre";
                break;
            case "top right":
                position = "topright";
                dir = "right";
                break;
            case "centre":
                position = "centre";
                dir = "centre";
                break;
            case "bottom left":
                position = "bottomleft";
                dir = "left";
                break;
            case "bottom centre":
                position = "bottomcentre";
                dir = "bottomcentre";
                break;
            case "bottom right":
                position = "bottomright";
                dir = "right";
                break;
        }

        var aniClassesIn = "gd-slideInLeft";
        var aniClassesOut = "gd-slideOutLeft";
        switch (dir) {
            case "left":
                aniClassesIn = "gd-slideInLeft";
                aniClassesOut = "gd-slideOutLeft";
                break;
            case "right":
                aniClassesIn = "gd-slideInRight";
                aniClassesOut = "gd-slideOutRight";
                break;
            case "centre":
                aniClassesIn = "gd-fadezoomIn";
                aniClassesOut = "gd-fadezoomOut";
                break;
            case "topcentre":
                aniClassesIn = "gd-slideInDown";
                aniClassesOut = "gd-slideOutUp";
                break;
            case "bottomcentre":
                aniClassesIn = "gd-slideInUp";
                aniClassesOut = "gd-slideOutDown";
                break;
        }
        gdMessages.aniClassesOut = aniClassesOut;

        var pause = 3000;
        var resetOnHover = false;
        if (options.closeAfter == false) {
            var pause = 0;
        } else {
            if (typeof options.closeAfter.time == "number") {
                if (options.closeAfter.time > 0) {
                    pause = options.closeAfter.time * 1000;
                }
            }
            if (typeof options.closeAfter.resetOnHover === "boolean") {
                resetOnHover = options.closeAfter.resetOnHover;
            }
        }
        options.closeAfter.resetOnHover = resetOnHover;

        gdMessages.confirmOptions = options;

        var typeClasses = options.className;

        $gdConfirmInner.addClass(typeClasses);

        $gdConfirmMsg.html(options.msg);

        var otherButton = "";
        if (options.otherBtn != false) {
            otherButton = ' <button class="' + options.otherBtn.className + ' gd-other">' + options.otherBtn.label + '</button>';
        }
        $gdConfirmButtons.html('<button class="' + options.cancelBtn.className + ' gd-cancel">' + options.cancelBtn.label + '</button>\
                               <button class="' + options.okBtn.className + ' gd-ok">' + options.okBtn.label + '</button>' + otherButton);

        $gdConfirm.css({
            "width": options.width,
            "z-index": zIndex + 1
        });
        gdMessages.bodyOverflow = $("body").css("overflow");
        if (dir == "right" || dir == "left" || dir == "bottomcentre") {
            gdMessages.resetBO = true;
        }

        // Show the Confirmation
        if (options.animation) {
            if (gdMessages.resetBO) {
                $("body").css("overflow", "hidden")
            }
            $gdConfirm.addClass(position)
                .css("visibility", "visible")
                .addClass(aniClassesIn)
                .one("animationend", function () {
                    $(this).removeClass(aniClassesIn);
                    postShowConfirm();
                });
        } else {
            $gdConfirm.addClass(position).css("visibility", "visible");
            postShowConfirm();
        }

        function postShowConfirm() {
            $(".gd-ok").on("click", function () {
                if (typeof options.beforeClose === "function") {
                    if (options.beforeClose()) {
                        removeConfirm("ok");
                    }
                } else {
                    removeConfirm("ok");
                }
            });
            $("#gd-exit, .gd-cancel").on("click", function () {
                removeConfirm("cancel");
            });
            $(".gd-other").on("click", function () {
                removeConfirm("other");
            });
            if (pause > 0) {
                gdMessages.confirmTimer = setInterval(function () {
                    removeConfirm("timeout");
                }, pause);
                if (options.closeAfter.resetOnHover) {
                    $(this).hover(
                        function () {
                            clearInterval(gdMessages.confirmTimer);
                        },
                        function () {
                            gdMessages.confirmTimer = setInterval(function () {
                                removeConfirm("timeout");
                            }, pause);
                        }
                    );
                }
            }
        }

        function removeConfirm(retMsg) {
            clearInterval(gdMessages.confirmTimer);
            if (options.animation) {
                if (options.backdrop) {
                    $("#gd-backdrop").removeClass("gd-fadeIn");
                }
                $('#gd-confirm').addClass(gdMessages.aniClassesOut).one("animationend", function () {
                    $(this).remove();
                    if (options.backdrop) {
                        $("#gd-backdrop").addClass("gd-fadeOutQuickly").one("animationend", function () {
                            $("#gd-backdrop").remove();
                        });
                    }
                    gdMessages.msgInPlay = false;
                    if (gdMessages.resetBO) {
                        $("body").css("overflow", gdMessages.bodyOverflow)
                    }
                    if (typeof options.afterClose === "function") {
                        options.afterClose(retMsg);
                    }
                });
            } else {
                $('#gd-confirm').remove();
                if (options.backdrop) {
                    $("#gd-backdrop").remove();
                }
                gdMessages.msgInPlay = false;
                if (typeof options.afterClose === "function") {
                    options.afterClose(retMsg);
                }
            }
        }
    },

    closeConfirm: function () {
        clearInterval(gdMessages.confirmTimer);
        if (gdMessages.confirmOptions.animation) {
            if (gdMessages.confirmOptions.backdrop) {
                $("#gd-backdrop").removeClass("gd-fadeIn");
            }
            $('#gd-confirm').addClass(gdMessages.aniClassesOut).one("animationend", function () {
                $(this).remove();
                if (gdMessages.confirmOptions.backdrop) {
                    $("#gd-backdrop").addClass("gd-fadeOutQuickly").one("animationend", function () {
                        $("#gd-backdrop").remove();
                    });
                }
                gdMessages.msgInPlay = false;
                if (gdMessages.resetBO) {
                    $("body").css("overflow", gdMessages.bodyOverflow)
                }
                if (typeof gdMessages.confirmOptions.afterClose === "function") {
                    gdMessages.confirmOptions.afterClose("cancel");
                }
            });
        } else {
            $('#gd-confirm').remove();
            if (gdMessages.confirmOptions.backdrop) {
                $("#gd-backdrop").remove();
            }
            gdMessages.msgInPlay = false;
            if (typeof gdMessages.confirmOptions.afterClose === "function") {
                gdMessages.confirmOptions.afterClose("cancel");
            }
        }
    },

    dialog: function (options) {

        if (gdMessages.msgInPlay) {
            return;
        } else {
            gdMessages.msgInPlay = true;
        }

        var defaults = {
            title: "",
            msg: "",
            returnSelector: "",
            animation: true,
            className: 'stddialog',
            width: "400px",
            position: 'centre',
            backdrop: true,
            closeAfter: false,
            // closeAfter: {
            //     time: 300,
            //     resetOnHover: true
            // },
            okBtn: {
                className: 'btn btn-primary',
                label: 'Ok'
            },
            cancelBtn: {
                className: 'btn btn-danger',
                label: 'Cancel'
            },
            otherBtn: {
                className: 'btn btn-warning',
                label: 'Other'
            },
            beforeClose: null,
            afterClose: null
        };

        options = $.extend(true, defaults, options);

        var zIndex = gdMessages.maxZ() + 1;

        if (options.backdrop) {
            var $backdropHtml = $('<div id="gd-backdrop"></div>');
            $backdropHtml.css("z-index", zIndex);
            if (options.animation) {
                $backdropHtml.addClass("gd-fadeIn");
            }
            $("body").append($backdropHtml);
            // var $gdBackdrop = $("#gd-backdrop");
        }

        var dialogHtml = '<div id="gd-dialog">\
                              <div id="gd-dialog-inner">\
                                  <div id="gd-exit"><span><i class="fas fa-times"></i><span></div>\
                                  <div id="gd-dialog-title"></div>\
                                  <hr>\
                                  <div id="gd-dialog-msg"></div>\
                                  <hr>\
                                  <div id="gd-dialog-buttons"></div>\
                              </div>\
                          </div>';
        $("body").append(dialogHtml);

        var $gdDialog = $('#gd-dialog');
        var $gdDialogInner = $('#gd-dialog-inner');
        var $gdDialogTitle = $('#gd-dialog-title');
        var $gdDialogMsg = $('#gd-dialog-msg');
        var $gdDialogButtons = $('#gd-dialog-buttons');

        var position = "centre";
        var dir = "centre";
        switch (options.position) {
            case "top left":
                position = "topleft";
                dir = "left";
                break;
            case "top centre":
                position = "topcentre";
                dir = "topcentre";
                break;
            case "top right":
                position = "topright";
                dir = "right";
                break;
            case "centre":
                position = "centre";
                dir = "centre";
                break;
            case "bottom left":
                position = "bottomleft";
                dir = "left";
                break;
            case "bottom centre":
                position = "bottomcentre";
                dir = "bottomcentre";
                break;
            case "bottom right":
                position = "bottomright";
                dir = "right";
                break;
        }

        var aniClassesIn = "gd-slideInLeft";
        var aniClassesOut = "gd-slideOutLeft";
        switch (dir) {
            case "left":
                aniClassesIn = "gd-slideInLeft";
                aniClassesOut = "gd-slideOutLeft";
                break;
            case "right":
                aniClassesIn = "gd-slideInRight";
                aniClassesOut = "gd-slideOutRight";
                break;
            case "centre":
                aniClassesIn = "gd-fadezoomIn";
                aniClassesOut = "gd-fadezoomOut";
                break;
            case "topcentre":
                aniClassesIn = "gd-slideInDown";
                aniClassesOut = "gd-slideOutUp";
                break;
            case "bottomcentre":
                aniClassesIn = "gd-slideInUp";
                aniClassesOut = "gd-slideOutDown";
                break;
        }
        gdMessages.aniClassesOut = aniClassesOut;

        var pause = 3000;
        var resetOnHover = false;
        if (options.closeAfter == false) {
            var pause = 0;
        } else {
            if (typeof options.closeAfter.time == "number") {
                if (options.closeAfter.time > 0) {
                    pause = options.closeAfter.time * 1000;
                }
            }
            if (typeof options.closeAfter.resetOnHover === "boolean") {
                resetOnHover = options.closeAfter.resetOnHover;
            }
        }
        options.closeAfter.resetOnHover = resetOnHover;

        gdMessages.dialogOptions = options;

        var typeClasses = options.className;

        $gdDialogInner.addClass(typeClasses);

        $gdDialogTitle.html(options.title);

        $gdDialogMsg.html(options.msg);

        var otherButton = "";
        if (options.otherBtn != false) {
            otherButton = ' <button class="' + options.otherBtn.className + ' gd-other">' + options.otherBtn.label + '</button>';
        }
        $gdDialogButtons.html('<button class="' + options.cancelBtn.className + ' gd-cancel">' + options.cancelBtn.label + '</button>\
                               <button class="' + options.okBtn.className + ' gd-ok">' + options.okBtn.label + '</button>' + otherButton);

        $gdDialog.css({
            "width": options.width,
            "z-index": zIndex + 1
        });
        gdMessages.bodyOverflow = $("body").css("overflow");
        if (dir == "right" || dir == "left" || dir == "bottomcentre") {
            gdMessages.resetBO = true;
        }

        if (options.animation) {
            if (dir == "right" || dir == "left") {
                $("body").css("overflow", "hidden")
            }
            $gdDialog.addClass(position)
                .css("visibility", "visible")
                .addClass(aniClassesIn)
                .one("animationend", function () {
                    $(this).removeClass(aniClassesIn);
                    postShowDialog();
                });
        } else {
            $gdDialog.addClass(position).css("visibility", "visible");
            postShowDialog();
        }


        function postShowDialog() {
            $(".gd-ok").on("click", function () {
                if (typeof options.beforeClose === "function") {
                    if (options.beforeClose()) {
                        clearInterval(gdMessages.dialogTimer);
                        removeDialog("ok", $(options.returnSelector).clone(true));
                    }
                } else {
                    clearInterval(gdMessages.dialogTimer);
                    removeDialog("ok", $(options.returnSelector).clone(true));
                }
            });
            $("#gd-exit, .gd-cancel").on("click", function () {
                clearInterval(gdMessages.dialogTimer);
                removeDialog("cancel", $(options.returnSelector).clone(true));
            });
            $(".gd-other").on("click", function () {
                clearInterval(gdMessages.dialogTimer);
                removeDialog("other", $(options.returnSelector).clone(true));
            });
            if (pause > 0) {
                gdMessages.dialogTimer = setInterval(function () {
                    clearInterval(gdMessages.dialogTimer);
                    removeDialog("timeout", $(options.returnSelector).clone(true));
                }, pause);
                if (options.closeAfter.resetOnHover) {
                    $(this).hover(
                        function () {
                            clearInterval(gdMessages.dialogTimer);
                        },
                        function () {
                            gdMessages.dialogTimer = setInterval(function () {
                                clearInterval(gdMessages.dialogTimer);
                                removeDialog("timeout", $(options.returnSelector).clone(true));
                            }, pause);
                        }
                    );
                    $(this).keypress(
                        function () {
                            clearInterval(gdMessages.dialogTimer);
                            gdMessages.dialogTimer = setInterval(function () {
                                clearInterval(gdMessages.dialogTimer);
                                removeDialog("timeout", $(options.returnSelector).clone(true));
                            }, pause);
                        }
                    );
                }
            }
        }

        function removeDialog(retMsg, $data) {
            if (options.animation) {
                if (options.backdrop) {
                    $("#gd-backdrop").removeClass("gd-fadeIn");
                }
                $('#gd-dialog').addClass(gdMessages.aniClassesOut).one("animationend", function () {
                    $('#gd-dialog').remove();
                    if (options.backdrop) {
                        $("#gd-backdrop").addClass("gd-fadeOutQuickly").one("animationend", function () {
                            $("#gd-backdrop").remove();
                        });
                    }
                    gdMessages.msgInPlay = false;
                    if (dir == "right" || dir == "left") {
                        $("body").css("overflow", gdMessages.bodyOverflow);
                    }
                    if (typeof options.afterClose === "function") options.afterClose(retMsg, $data);
                });
            } else {
                $('#gd-dialog').remove();
                if (options.backdrop) {
                    $("#gd-backdrop").remove();
                }
                gdMessages.msgInPlay = false;
                if (typeof options.afterClose === "function") options.afterClose(retMsg, $data);
            }
        }

    },

    closeDialog: function () {
        var $data = $(gdMessages.dialogOptions.returnSelector).clone(true);
        if (gdMessages.dialogOptions.animation) {
            if (gdMessages.dialogOptions.backdrop) {
                $("#gd-backdrop").removeClass("gd-fadeIn");
            }
            $('#gd-dialog').addClass(gdMessages.aniClassesOut).one("animationend", function () {
                $('#gd-dialog').remove();
                if (gdMessages.dialogOptions.backdrop) {
                    $("#gd-backdrop").addClass("gd-fadeOutQuickly").one("animationend", function () {
                        $("#gd-backdrop").remove();
                    });
                }
                gdMessages.msgInPlay = false;
                if (gdMessages.resetBO) {
                    $("body").css("overflow", gdMessages.bodyOverflow);
                }
                if (typeof gdMessages.dialogOptions.afterClose === "function") {
                    gdMessages.dialogOptions.afterClose("cancel", $data);
                }
            });
        } else {
            $('#gd-dialog').remove();
            if (gdMessages.dialogOptions.backdrop) {
                $("#gd-backdrop").remove();
            }
            gdMessages.msgInPlay = false;
            if (typeof gdMessages.dialogOptions.afterClose === "function") {
                gdMessages.dialogOptions.afterClose("cancel", $data);
            }
        }
    }

}