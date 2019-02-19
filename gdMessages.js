// ---------------------------------------------------------------------------------------------
// gdMessages v1.0.0 2018-12-23
// @license Copyright 2018, geedub59, License: MIT, see https://github.com/geedub59/gdMessages/ 
// ---------------------------------------------------------------------------------------------

var gdMessages = {

    windowResize: function () {

        if (gdMessages.notify.inPlay) {
            gdMessages.resizeMessage($('#gd-notify'), gdMessages.notify.options.dir);
        }
        if (gdMessages.confirm.inPlay) {
            gdMessages.resizeMessage($('#gd-confirm'), gdMessages.confirm.options.dir);
        }
        if (gdMessages.dialog.inPlay) {
            gdMessages.resizeMessage($('#gd-dialog'), gdMessages.dialog.options.dir);
        }
    },

    resizeMessage: function ($obj, dir) {
        var viewportW = document.documentElement.clientWidth - 22;
        var viewportH = document.documentElement.clientHeight;

        var top = ((viewportH / 2) - ($obj.height() / 2));
        var left = ((viewportW / 2) - ($obj.width() / 2));

        if (dir == "centre") {
            $obj.css({
                top: top + "px",
                left: left + "px"
            });
        } else if (dir == "topcentre") {
            $obj.css({
                left: left + "px"
            });
        } else if (dir == "bottomcentre") {
            $obj.css({
                left: left + "px"
            });
        }
    },

    version: "1.1",

    maxZ: function () {
        var zindex = Math.max.apply(null,
            $.map($('body *'), function (e, n) {
                if ($(e).css('position') != 'static') {
                    return parseInt($(e).css('z-index')) || 1;
                }
            }));
        if (zindex === Number.NEGATIVE_INFINITY) {
            return 333;
        } else {
            return zindex;
        }
    },

    popup: {

        inPlay: false,
        options: null,

        open: function (options) {

            if (gdMessages.popup.inPlay) {
                this.close();
                this.inPlay = true;
            } else {
                gdMessages.popup.inPlay = true;
            }

            var defaults = {
                msg: "Hi there!",
                className: "popupDefault",
                position: "coords",
                cursorPos: {
                    cursorX: 0,
                    cursorY: 0
                },
                width: "400px",
                autoClose: false,
                // autoClose: {
                //     time: 10,
                //     resetOnHover: true
                // },
                afterOpen: null,
                afterClose: null
            };

            options = $.extend(true, defaults, options);

            var zIndex = gdMessages.maxZ() + 1;

            var $popupHtml = $('<div id="gd-popup">\
                                <div id="gd-popup-inner">\
                                    <div id="gd-popup-message"></div>\
                                </div>\
                            </div>');

            var position = "coords";
            switch (options.position) {
                case "top left":
                    position = "topleft";
                    break;
                case "top centre":
                    position = "topcentre";
                    break;
                case "top right":
                    position = "topright";
                    break;
                case "centre":
                    position = "centre";
                    break;
                case "bottom left":
                    position = "bottomleft";
                    break;
                case "bottom centre":
                    position = "bottomcentre";
                    break;
                case "bottom right":
                    position = "bottomright";
                    break;
                case "coords":
                    position = "coords";
                    break;
                default:
                    break;
            }

            var posObj = {};
            if (position == "coords") {
                var viewportW = document.documentElement.clientWidth - 22;
                var viewportH = document.documentElement.clientHeight;

                if (options.cursorPos.cursorX < (viewportW / 2)) {
                    if (options.cursorPos.cursorY < (viewportH / 2)) {
                        posObj = {
                            top: (options.cursorPos.cursorY + 10) + "px",
                            left: (options.cursorPos.cursorX + 10) + "px",
                            visibility: "visible"
                        }
                    } else {
                        posObj = {
                            bottom: (viewportH - options.cursorPos.cursorY + 10) + "px",
                            left: (options.cursorPos.cursorX + 10) + "px",
                            visibility: "visible"
                        }
                    }
                } else {
                    if (options.cursorPos.cursorY < (viewportH / 2)) {
                        posObj = {
                            top: (options.cursorPos.cursorY + 10) + "px",
                            right: (viewportW - options.cursorPos.cursorX + 10) + "px",
                            visibility: "visible"
                        }
                    } else {
                        posObj = {
                            bottom: (viewportH - options.cursorPos.cursorY + 10) + "px",
                            right: (viewportW - options.cursorPos.cursorX + 10) + "px",
                            visibility: "visible"
                        }
                    }
                }
            }

            gdMessages.popup.options = options;

            var typeClasses = options.className;

            $popupHtml.find('#gd-popup-inner').addClass(typeClasses);

            $popupHtml.find('#gd-popup-message').html(options.msg);

            $popupHtml.css({
                "width": options.width,
                "z-index": zIndex + 1
            });

            // Show the popupation
            $("body").append($popupHtml);
            var $gdpopup = $('#gd-popup');

            if (position == "coords") {
                $gdpopup.css(posObj);
                postShowpopup($gdpopup);
            } else {
                $gdpopup.addClass(position).css("visibility", "visible");
                postShowpopup($gdpopup);
            }

            function postShowpopup($gdpopup) {
                $('#gd-popup').on("click", function () {
                    removePopup();
                });
                $gdpopup.css({
                    top: $gdpopup.offset().top,
                    left: $gdpopup.offset().left,
                    transform: "none"
                });

                if (typeof options.afterOpen === "function") {
                    options.afterOpen($gdpopup);
                }
            }

            function removePopup(retMsg) {
                var $gdpopup = $("#gd-popup").clone(true);
                $('#gd-popup').remove();
                gdMessages.popup.inPlay = false;
                if (typeof options.afterClose === "function") {
                    options.afterClose(retMsg, $gdpopup);
                }
            }
        },

        close: function () {
            var $gdpopup = $("#gd-popup").clone(true);
            $('#gd-popup').remove();
            gdMessages.popup.inPlay = false;
            if (typeof gdMessages.popup.options.afterClose === "function") {
                gdMessages.popup.options.afterClose("cancel", $gdpopup);
            }
        }

    },

    notify: {

        inPlay: false,
        timer: 0,
        options: null,
        aniClassesOut: "",

        open: function (options) {

            if (gdMessages.notify.inPlay) {
                return;
            } else {
                gdMessages.notify.inPlay = true;
            }

            var defaults = {
                title: "",
                msg: "Success!",
                animation: true,
                audio: true,
                className: 'info',
                width: "300px",
                position: 'bottom left',
                dir: "",
                autoClose: {
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

            var $notifyHtml = $('<div id="gd-notify">\
                                <div id="gd-notify-inner">\
                                  <div id="gd-notify-header"></div>\
                                  <hr>\
                                  <div id="gd-notify-body"></div>\
                                </div>\
                              </div>');

            var position = "bottomright";
            options.dir = "right";
            switch (options.position) {
                case "top left":
                    position = "topleft";
                    options.dir = "left";
                    break;
                case "top centre":
                    position = "topcentre";
                    options.dir = "topcentre";
                    break;
                case "top right":
                    position = "topright";
                    options.dir = "right";
                    break;
                case "centre":
                    position = "centre";
                    options.dir = "centre";
                    break;
                case "bottom left":
                    position = "bottomleft";
                    options.dir = "left";
                    break;
                case "bottom centre":
                    position = "bottomcentre";
                    options.dir = "bottomcentre";
                    break;
                case "bottom right":
                    position = "bottomright";
                    options.dir = "right";
                    break;
            }

            var aniClassesIn = "gd-slideInLeft";
            var aniClassesOut = "gd-slideOutLeft";
            switch (options.dir) {
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
            gdMessages.notify.aniClassesOut = aniClassesOut;

            var pause = 3000;
            var resetOnHover = false;
            if (options.autoClose == false) {
                var pause = 0;
            } else {
                if (typeof options.autoClose.time == "number") {
                    if (options.autoClose.time > 0) {
                        pause = options.autoClose.time * 1000;
                    }
                }
                if (typeof options.autoClose.resetOnHover === "boolean") {
                    resetOnHover = options.autoClose.resetOnHover;
                }
            }
            options.autoClose.resetOnHover = resetOnHover;

            gdMessages.notify.options = options;

            var typeClasses = "";
            var typeIcon = "";
            var objAudio = null;
            switch (options.className) {
                case "success":
                    typeClasses = "successStyle";
                    typeIcon = '<i class="fas fa-check"></i>';
                    objAudio = document.getElementById("audio-success");
                    break;
                case "info":
                    typeClasses = "infoStyle";
                    typeIcon = '<i class="fas fa-info"></i>';
                    objAudio = document.getElementById("audio-info");
                    break;
                case "warning":
                    typeClasses = "warningStyle";
                    typeIcon = '<i class="fas fa-exclamation"></i>';
                    objAudio = document.getElementById("audio-warning");
                    break;
                case "error":
                    typeClasses = "errorStyle";
                    typeIcon = '<i class="fas fa-times-circle"></i>';
                    objAudio = document.getElementById("audio-error");
                    break;
            }

            $notifyHtml.find('#gd-notify-inner').addClass(typeClasses);

            if (options.title == "") {
                $notifyHtml.find('#gd-notify-header').html(typeIcon + "&nbsp;&nbsp;&nbsp;Notification");
            } else {
                $notifyHtml.find('#gd-notify-header').html(typeIcon + "&nbsp;&nbsp;&nbsp;" + options.title);
            }
            $notifyHtml.find('#gd-notify-body').html(options.msg);

            $notifyHtml.css({
                "width": options.width,
                "z-index": gdMessages.maxZ() + 1
            });

            // Show the notification
            $("body").append($notifyHtml);
            var $gdNotify = $('#gd-notify');

            // adjust the top/left position of the notification
            var viewportW = document.documentElement.clientWidth - 22;
            var viewportH = document.documentElement.clientHeight;

            var top = (viewportH / 2) - ($gdNotify.height() / 2);
            var left = (viewportW / 2) - ($gdNotify.width() / 2);

            if (options.dir == "centre") {
                $gdNotify.css({
                    top: top + "px",
                    left: left + "px"
                });
            } else if (options.dir == "topcentre") {
                $gdNotify.css({
                    left: left + "px"
                });
            } else if (options.dir == "bottomcentre") {
                $gdNotify.css({
                    left: left + "px"
                });
            }

            if (options.audio) {
                objAudio.play();
            }
            if (options.animation) {
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
                    gdMessages.notify.timer = setTimeout(function () {
                        removeNotify();
                    }, pause);
                    if (options.autoClose.resetOnHover) {
                        $('#gd-notify').hover(
                            function () {
                                clearTimeout(gdMessages.notify.timer);
                            },
                            function () {
                                gdMessages.notify.timer = setTimeout(function () {
                                    removeNotify();
                                }, pause);
                            }
                        );
                    }
                }
            }

            function removeNotify() {
                clearTimeout(gdMessages.notify.timer);
                if (options.animation) {
                    $('#gd-notify').addClass(gdMessages.notify.aniClassesOut).one("animationend", function () {
                        $(this).remove();
                        gdMessages.notify.inPlay = false;
                        if (typeof options.afterClose === "function") {
                            options.afterClose();
                        }
                    });
                } else {
                    $('#gd-notify').remove();
                    gdMessages.notify.inPlay = false;
                    if (typeof options.afterClose === "function") {
                        options.afterClose();
                    }
                }
            }
        },

        close: function () {
            clearTimeout(gdMessages.notify.timer);
            if (gdMessages.notify.options.animation) {
                $('#gd-notify').addClass(gdMessages.notify.aniClassesOut).one("animationend", function () {
                    $(this).remove();
                    gdMessages.notify.inPlay = false;
                    if (typeof gdMessages.notify.options.afterClose === "function") {
                        gdMessages.notify.options.afterClose();
                    }
                });
            } else {
                $('#gd-notify').remove();
                gdMessages.notify.inPlay = false;
                if (typeof gdMessages.notify.options.afterClose === "function") {
                    gdMessages.notify.options.afterClose();
                }
            }
        }

    },

    confirm: {

        inPlay: false,
        timer: 0,
        options: null,
        aniClassesOut: "",

        open: function (options) {

            if (gdMessages.confirm.inPlay) {
                return;
            } else {
                gdMessages.confirm.inPlay = true;
            }

            var defaults = {
                msg: "Click OK to proceed",
                animation: true,
                className: 'stdconfirm',
                width: "400px",
                position: 'top centre',
                dir: "",
                backdrop: true,
                autoClose: false,
                // autoClose: {
                //     time: 10,
                //     resetOnHover: true
                // },
                okBtn: {
                    className: 'btn btn-primary',
                    label: 'Ok',
                    onClick: null
                },
                cancelBtn: {
                    className: 'btn btn-danger',
                    label: 'Cancel',
                    onClick: null
                },
                otherBtn: false,
                // {
                //     className: 'btn btn-warning',
                //     label: 'Other',
                //     onClick: null
                // },
                afterOpen: null,
                beforeClose: null,
                afterClose: null
            };

            options = $.extend(true, defaults, options);

            var zIndex = gdMessages.maxZ() + 1;

            if (options.backdrop) {
                var $backdropHtml = $('<div id="gd-confirm-backdrop"></div>');
                $backdropHtml.css("z-index", zIndex);
                if (options.animation) {
                    $backdropHtml.addClass("gd-fadeIn");
                }
                $("body").append($backdropHtml);
            }

            var $confirmHtml = $('<div id="gd-confirm">\
                              <div id="gd-confirm-inner">\
                                  <div id="gd-exit"><span><i class="fas fa-times"></i><span></div>\
                                  <div id="gd-confirm-msg"></div>\
                                  <hr>\
                                  <div id="gd-confirm-buttons"></div>\
                              </div>\
                          </div>');

            var position = "centre";
            options.dir = "centre";
            switch (options.position) {
                case "top left":
                    position = "topleft";
                    options.dir = "left";
                    break;
                case "top centre":
                    position = "topcentre";
                    options.dir = "topcentre";
                    break;
                case "top right":
                    position = "topright";
                    options.dir = "right";
                    break;
                case "centre":
                    position = "centre";
                    options.dir = "centre";
                    break;
                case "bottom left":
                    position = "bottomleft";
                    options.dir = "left";
                    break;
                case "bottom centre":
                    position = "bottomcentre";
                    options.dir = "bottomcentre";
                    break;
                case "bottom right":
                    position = "bottomright";
                    options.dir = "right";
                    break;
                default:
                    break;
            }

            var aniClassesIn = "gd-slideInLeft";
            var aniClassesOut = "gd-slideOutLeft";
            switch (options.dir) {
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
            gdMessages.confirm.aniClassesOut = aniClassesOut;

            var pause = 3000;
            var resetOnHover = false;
            if (options.autoClose == false) {
                var pause = 0;
            } else {
                if (typeof options.autoClose.time == "number") {
                    if (options.autoClose.time > 0) {
                        pause = options.autoClose.time * 1000;
                    }
                }
                if (typeof options.autoClose.resetOnHover === "boolean") {
                    resetOnHover = options.autoClose.resetOnHover;
                }
            }
            options.autoClose.resetOnHover = resetOnHover;

            gdMessages.confirm.options = options;

            var typeClasses = options.className;

            $confirmHtml.find('#gd-confirm-inner').addClass(typeClasses);

            $confirmHtml.find('#gd-confirm-msg').html(options.msg);

            var otherButton = "";
            if (options.otherBtn != false) {
                otherButton = '<button class="' + options.otherBtn.className + ' gd-other">' + options.otherBtn.label + '</button>';
            }
            var okButton = "";
            if (options.okBtn != false) {
                okButton = '<button class="' + options.okBtn.className + ' gd-ok">' + options.okBtn.label + '</button>';
            }
            var cancelButton = "";
            if (options.cancelBtn != false) {
                cancelButton = '<button class="' + options.cancelBtn.className + ' gd-cancel">' + options.cancelBtn.label + '</button>';
            }
            $confirmHtml.find('#gd-confirm-buttons').html(cancelButton + okButton + otherButton);

            if (cancelButton + okButton + otherButton == "") {
                $confirmHtml.html($confirmHtml.html().replace("<hr>", ""));
            }

            $confirmHtml.css({
                "width": options.width,
                "z-index": zIndex + 1
            });

            // Show the Confirmation
            $("body").append($confirmHtml);
            var $gdConfirm = $('#gd-confirm');

            // adjust the top/left position of the confirmation
            var viewportW = document.documentElement.clientWidth - 22;
            var viewportH = document.documentElement.clientHeight;

            var top = (viewportH / 2) - ($gdConfirm.height() / 2);
            var left = (viewportW / 2) - ($gdConfirm.width() / 2);

            if (options.dir == "centre") {
                $gdConfirm.css({
                    top: top + "px",
                    left: left + "px"
                });
            } else if (options.dir == "topcentre") {
                $gdConfirm.css({
                    left: left + "px"
                });
            } else if (options.dir == "bottomcentre") {
                $gdConfirm.css({
                    left: left + "px"
                });
            }

            if (options.animation) {
                $gdConfirm.addClass(position)
                    .css("visibility", "visible")
                    .addClass(aniClassesIn)
                    .one("animationend", function () {
                        $(this).removeClass(aniClassesIn);
                        postShowConfirm($gdConfirm);
                    });
            } else {
                $gdConfirm.addClass(position).css("visibility", "visible");
                postShowConfirm($gdConfirm);
            }

            function postShowConfirm($gdConfirm) {

                if (typeof options.afterOpen === "function") {
                    options.afterOpen($gdConfirm);
                }
                $(".gd-ok").on("click", function () {
                    if (typeof options.okBtn.onClick === "function") {
                        var res = options.okBtn.onClick($gdConfirm);
                        if (res) removeConfirm("ok");
                    } else {
                        removeConfirm("ok");
                    }
                });
                $("#gd-exit, .gd-cancel").on("click", function () {
                    if (typeof options.cancelBtn.onClick === "function") {
                        var res = options.cancelBtn.onClick($gdConfirm);
                        if (res) removeConfirm("cancel");
                    } else {
                        removeConfirm("cancel");
                    }
                });
                $(".gd-other").on("click", function () {
                    if (typeof options.otherBtn.onClick === "function") {
                        var res = options.otherBtn.onClick($gdConfirm);
                        if (res) removeConfirm("other");
                    } else {
                        removeConfirm("other");
                    }
                });
                if (pause > 0) {
                    gdMessages.confirm.timer = setTimeout(function () {
                        removeConfirm("timeout");
                    }, pause);
                    if (options.autoClose.resetOnHover) {
                        $(this).hover(
                            function () {
                                clearTimeout(gdMessages.confirm.timer);
                            },
                            function () {
                                gdMessages.confirm.timer = setTimeout(function () {
                                    removeConfirm("timeout");
                                }, pause);
                            }
                        );
                    }
                }
            }

            function removeConfirm(retMsg) {
                var $gdConfirm = $("#gd-confirm").clone(true);
                clearTimeout(gdMessages.confirm.timer);
                if (options.animation) {
                    if (options.backdrop) {
                        $("#gd-confirm-backdrop").removeClass("gd-fadeIn");
                    }
                    $('#gd-confirm').addClass(gdMessages.confirm.aniClassesOut).one("animationend", function () {
                        $(this).remove();
                        if (options.backdrop) {
                            $("#gd-confirm-backdrop").addClass("gd-fadeOutQuickly").one("animationend", function () {
                                $("#gd-confirm-backdrop").remove();
                            });
                        }
                        gdMessages.confirm.inPlay = false;
                        if (typeof options.afterClose === "function") {
                            options.afterClose(retMsg, $gdConfirm);
                        }
                    });
                } else {
                    $('#gd-confirm').remove();
                    if (options.backdrop) {
                        $("#gd-confirm-backdrop").remove();
                    }
                    gdMessages.confirm.inPlay = false;
                    if (typeof options.afterClose === "function") {
                        options.afterClose(retMsg, $gdConfirm);
                    }
                }
            }
        },

        close: function () {
            var $gdConfirm = $("#gd-confirm").clone(true);
            clearTimeout(gdMessages.confirm.timer);
            if (gdMessages.confirm.options.animation) {
                if (gdMessages.confirm.options.backdrop) {
                    $("#gd-confirm-backdrop").removeClass("gd-fadeIn");
                }
                $('#gd-confirm').addClass(gdMessages.confirm.aniClassesOut).one("animationend", function () {
                    $(this).remove();
                    if (gdMessages.confirm.options.backdrop) {
                        $("#gd-confirm-backdrop").addClass("gd-fadeOutQuickly").one("animationend", function () {
                            $("#gd-confirm-backdrop").remove();
                        });
                    }
                    gdMessages.confirm.inPlay = false;
                    if (typeof gdMessages.confirm.options.afterClose === "function") {
                        gdMessages.confirm.options.afterClose("cancel", $gdConfirm);
                    }
                });
            } else {
                $('#gd-confirm').remove();
                if (gdMessages.confirm.options.backdrop) {
                    $("#gd-confirm-backdrop").remove();
                }
                gdMessages.confirm.inPlay = false;
                if (typeof gdMessages.confirm.options.afterClose === "function") {
                    gdMessages.confirm.options.afterClose("cancel", $gdConfirm);
                }
            }
        }

    },

    dialog: {

        inPlay: false,
        timer: 0,
        options: null,
        aniClassesOut: "",

        open: function (options) {

            if (gdMessages.dialog.inPlay) {
                return;
            } else {
                gdMessages.dialog.inPlay = true;
            }

            var defaults = {
                title: "",
                msg: "",
                animation: true,
                className: 'stddialog',
                width: "400px",
                position: 'centre',
                dir: "",
                backdrop: true,
                saveBtn: {
                    className: 'btn btn-primary',
                    label: 'Save',
                    onClick: null
                },
                deleteBtn: {
                    className: 'btn btn-danger',
                    label: 'Delete',
                    onClick: null
                },
                cancelBtn: {
                    className: 'btn btn-warning',
                    label: 'Cancel',
                    onClick: null
                },
                otherBtn: {
                    className: 'btn btn-secondary',
                    label: 'Other',
                    onClick: null
                },
                afterOpen: null,
                beforeClose: null,
                afterClose: null
            };

            options = $.extend(true, defaults, options);

            var zIndex = gdMessages.maxZ() + 1;

            if (options.backdrop) {
                var $backdropHtml = $('<div id="gd-dialog-backdrop"></div>');
                $backdropHtml.css("z-index", zIndex);
                if (options.animation) {
                    $backdropHtml.addClass("gd-fadeIn");
                }
                $("body").append($backdropHtml);
            }

            var $dialogHtml = $('<div id="gd-dialog">\
                              <div id="gd-dialog-inner">\
                                  <div id="gd-exit"><span><i class="fas fa-times"></i><span></div>\
                                  <div id="gd-dialog-title"></div>\
                                  <hr>\
                                  <div id="gd-dialog-msg"></div>\
                                  <hr>\
                                  <div id="gd-dialog-buttons"></div>\
                              </div>\
                          </div>');

            var position = "centre";
            options.dir = "centre";
            switch (options.position) {
                case "top left":
                    position = "topleft";
                    options.dir = "left";
                    break;
                case "top centre":
                    position = "topcentre";
                    options.dir = "topcentre";
                    break;
                case "top right":
                    position = "topright";
                    options.dir = "right";
                    break;
                case "centre":
                    position = "centre";
                    options.dir = "centre";
                    break;
                case "bottom left":
                    position = "bottomleft";
                    options.dir = "left";
                    break;
                case "bottom centre":
                    position = "bottomcentre";
                    options.dir = "bottomcentre";
                    break;
                case "bottom right":
                    position = "bottomright";
                    options.dir = "right";
                    break;
            }

            var aniClassesIn = "gd-slideInLeft";
            var aniClassesOut = "gd-slideOutLeft";
            switch (options.dir) {
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
            gdMessages.dialog.aniClassesOut = aniClassesOut;

            gdMessages.dialog.options = options;

            var typeClasses = options.className;

            $dialogHtml.find('#gd-dialog-inner').addClass(typeClasses);

            $dialogHtml.find('#gd-dialog-title').html(options.title);

            $dialogHtml.find('#gd-dialog-msg').html(options.msg);

            var otherButton = "";
            if (options.otherBtn != false) {
                otherButton = '<button class="' + options.otherBtn.className + ' gd-other">' + options.otherBtn.label + '</button>';
            }
            var deleteButton = "";
            if (options.deleteBtn != false) {
                deleteButton = '<button class="' + options.deleteBtn.className + ' gd-delete">' + options.deleteBtn.label + '</button>';
            }
            var saveButton = "";
            if (options.saveBtn != false) {
                saveButton = '<button class="' + options.saveBtn.className + ' gd-save">' + options.saveBtn.label + '</button>';
            }
            var cancelButton = "";
            if (options.cancelBtn != false) {
                cancelButton = '<button class="' + options.cancelBtn.className + ' gd-cancel">' + options.cancelBtn.label + '</button>';
            }
            $dialogHtml.find('#gd-dialog-buttons').html(cancelButton + saveButton + deleteButton + otherButton);

            $dialogHtml.css({
                "width": options.width,
                "z-index": zIndex + 1
            });

            // Show the dialog
            $("body").append($dialogHtml);
            var $gdDialog = $('#gd-dialog');

            // adjust the top/left position of the dialog
            var viewportW = document.documentElement.clientWidth - 22;
            var viewportH = document.documentElement.clientHeight;

            var top = (viewportH / 2) - ($gdDialog.height() / 2);
            var left = (viewportW / 2) - ($gdDialog.width() / 2);

            if (options.dir == "centre") {
                $gdDialog.css({
                    top: top + "px",
                    left: left + "px"
                });
            } else if (options.dir == "topcentre") {
                $gdDialog.css({
                    left: left + "px"
                });
            } else if (options.dir == "bottomcentre") {
                $gdDialog.css({
                    left: left + "px"
                });
            }

            if (options.animation) {
                $gdDialog.addClass(position)
                    .css("visibility", "visible")
                    .addClass(aniClassesIn)
                    .one("animationend", function () {
                        $(this).removeClass(aniClassesIn);
                        postShowDialog($gdDialog);
                    });
            } else {
                $gdDialog.addClass(position).css("visibility", "visible");
                postShowDialog($gdDialog);
            }

            function postShowDialog($gdDialog) {

                if (typeof options.afterOpen === "function") {
                    options.afterOpen($gdDialog);
                }

                $(".gd-save").on("click", function () {
                    if (typeof options.saveBtn.onClick === "function") {
                        var res = options.saveBtn.onClick($gdDialog);
                        if (res) removeDialog("ok");
                    } else {
                        removeDialog("ok");
                    }
                });
                $(".gd-delete").on("click", function () {
                    if (typeof options.deleteBtn.onClick === "function") {
                        var res = options.deleteBtn.onClick($gdDialog);
                        if (res) removeDialog("delete");
                    } else {
                        removeConfirm("delete");
                    }
                });
                $("#gd-exit, .gd-cancel").on("click", function () {
                    if (typeof options.cancelBtn.onClick === "function") {
                        var res = options.cancelBtn.onClick($gdDialog);
                        if (res) removeDialog("cancel");
                    } else {
                        removeDialog("cancel");
                    }
                });
                $(".gd-other").on("click", function () {
                    if (typeof options.otherBtn.onClick === "function") {
                        var res = options.otherBtn.onClick($gdDialog);
                        if (res) removeDialog("other");
                    } else {
                        removeDialog("other");
                    }
                });
            }

            function removeDialog(retMsg) {
                var $gdDialog = $("#gd-dialog").clone(true);
                if (options.animation) {
                    if (options.backdrop) {
                        $("#gd-dialog-backdrop").removeClass("gd-fadeIn");
                    }
                    $('#gd-dialog').addClass(gdMessages.dialog.aniClassesOut).one("animationend", function () {
                        $(this).remove();
                        if (options.backdrop) {
                            $("#gd-dialog-backdrop").addClass("gd-fadeOutQuickly").one("animationend", function () {
                                $("#gd-dialog-backdrop").remove();
                            });
                        }
                        gdMessages.dialog.inPlay = false;
                        if (typeof options.afterClose === "function") {
                            options.afterClose(retMsg, $gdDialog);
                        }
                    });
                } else {
                    $('#gd-dialog').remove();
                    if (options.backdrop) {
                        $("#gd-dialog-backdrop").remove();
                    }
                    gdMessages.dialog.inPlay = false;
                    if (typeof options.afterClose === "function") {
                        options.afterClose(retMsg, $gdDialog);
                    }
                }
            }
        },

        close: function () {
            var $gdDialog = $("#gd-dialog").clone(true);
            if (gdMessages.dialog.options.animation) {
                if (gdMessages.dialog.options.backdrop) {
                    $("#gd-dialog-backdrop").removeClass("gd-fadeIn");
                }
                $('#gd-dialog').addClass(gdMessages.dialog.aniClassesOut).one("animationend", function () {
                    $('#gd-dialog').remove();
                    if (gdMessages.dialog.options.backdrop) {
                        $("#gd-dialog-backdrop").addClass("gd-fadeOutQuickly").one("animationend", function () {
                            $("#gd-dialog-backdrop").remove();
                        });
                    }
                    gdMessages.dialog.inPlay = false;
                    if (typeof gdMessages.dialog.options.afterClose === "function") {
                        gdMessages.dialog.options.afterClose("cancel", $gdDialog);
                    }
                });
            } else {
                $('#gd-dialog').remove();
                if (gdMessages.dialog.options.backdrop) {
                    $("#gd-dialog-backdrop").remove();
                }
                gdMessages.dialog.inPlay = false;
                if (typeof gdMessages.dialog.options.afterClose === "function") {
                    gdMessages.dialog.options.afterClose("cancel", $gdDialog);
                }
            }
        }

    }

}


$(document).ready(function () {
    let audioHtml = '\
      <audio id = "audio-XXXXXX" style = "display: none;" >\
          <source src="http://www.stratacaresolutions.com.au/sounds/XXXXXX.mp3" type="audio/mpeg">\
          <source src="httpo://www.stratacaresolutions.com.au/sounds/XXXXXX.wav" type="audio/wav">\
          <!-- Your browser does not support the audio element. -->\
      </audio>\
      ';
    var audioRegex = /XXXXXX/g;
    let audioSuccessHtml = audioHtml.replace(audioRegex, "success");
    let audioInfoHtml = audioHtml.replace(audioRegex, "info");
    let audioWarningHtml = audioHtml.replace(audioRegex, "warning");
    let audioErrorHtml = audioHtml.replace(audioRegex, "error");

    $("body").append(audioSuccessHtml).append(audioInfoHtml).append(audioWarningHtml).append(audioErrorHtml);

    $(window).on("resize", gdMessages.windowResize);

});