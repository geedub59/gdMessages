$(document).ready(function () {

  var frmCalEvent = '\
  <div id="gd-simple-event-bf">\
  <div class="modal-body">\
    <div class="container py-1">\
      <div class="row">\
        <div class="col-12 mx-auto">\
\
          <form class="form">\
\
            <div class="row">\
              <div class="col col-12 form-group gd-plr1">\
                <label for="title">Title</label>\
                <input id="title" class="form-control" type="text" placeholder="Title" required>\
              </div>\
            </div>\
\
            <div class="row">\
              <div class="col col-1 gd-plr1 gd-fas-cal">\
                <i class="fas fa-calendar-alt"></i>\
              </div>\
              <div id="gd-date-pair" class="col col-11 gd-plr1">\
                <div class="row">\
                  <div class="col col-3 col-sm-3 form-group gd-plr1">\
                    <input id="gd-start-date" class="form-control date start gd-ac" type="text" placeholder="Start Date">\
                  </div>\
                  <div class="col col-2 col-sm-2 form-group gd-plr1">\
                    <input id="gd-start-time" class="form-control time start gd-ac" type="text" placeholder="Start Time">\
                  </div>\
                  <div class="col col-1 col-sm-1 form-group gd-plr1 gd-ac gd-pt5">\
                    <span class="gd-to">to</span>\
                  </div>\
                  <div class="col col-2 col-sm-2 form-group gd-plr1">\
                    <input id="gd-end-time" class="form-control time end gd-ac" type="text" placeholder="End Time">\
                  </div>\
                  <div class="col col-3 col-sm-3 form-group gd-plr1">\
                    <input id="gd-end-date" class="form-control date end gd-ac" type="text" placeholder="End Date">\
                  </div>\
                </div>\
              </div>\
            </div>\
\
            <div class="row">\
              <div class="col col-12 form-group gd-plr1">\
                <label for="desc">Description (optional)</label>\
                <textarea id="desc" class="form-control" name="desc" placeholder="Description" rows="3"></textarea>\
              </div>\
            </div>\
\
            <div class="row">\
              <div class="col col-12 form-group gd-plr1">\
                <label>Colour</label>\
                <ul class="gd-ul-color">\
                  <li class="gd-li-color gd-li-red"></li>\
                  <li class="gd-li-color gd-li-green"></li>\
                  <li class="gd-li-color gd-li-yellow selected"></li>\
                  <li class="gd-li-color gd-li-blue"></li>\
                  <li class="gd-li-color gd-li-grey"></li>\
                  <li class="gd-li-color gd-li-black"></li>\
                </ul>\
              </div>\
            </div>\
\
          </form>\
\
        </div>\
      </div>\
    </div>\
  </div>\
  </div>';

  $("#msgtype").on("change", function () {
    if ($("#msgtype option:selected").val() == "notify") {
      $("#notifytype").css("display", "inline-block")
      $("#ntLabel").css("display", "inline-block")
    } else {
      $("#notifytype").css("display", "none")
      $("#ntLabel").css("display", "none")
    }
  });

  $("#msgSelDisplay").on("click", function () {
    var msgtype = "";
    var notifytype = "";
    var position = "";
    var width = "auto";
    var animation = true;

    msgtype = $("#msgtype option:selected").val();
    if (msgtype == "notify") {
      notifytype = $("#notifytype option:selected").val();
    }
    position = $("#msgposition option:selected").val();
    width = $("#msgwidth option:selected").val();
    animation = ($("#msganimation option:selected").val() == "true");

    var d = new Date();

    switch (msgtype) {
      case "notify":
        gdMessages.notify({
          msg: 'Record has been updated',
          className: notifytype,
          width: width,
          position: position,
          animation: animation
        });
        break;

      case "confirm":
        gdMessages.confirm({
          msg: 'Record has been updated',
          className: 'stdconfirm',
          width: width,
          position: position,
          animation: animation,
          closeAfter: false,
          afterClose: function (result) {
            switch (result) {
              case "ok":
                gdMessages.notify({
                  msg: "You clicked OK",
                  closeAfter: {
                    time: 3,
                    resetOnHover: true
                  },
                  className: "success",
                  position: "bottom left"
                });
                break;
              case "cancel":
                gdMessages.notify({
                  msg: "You clicked Cancel",
                  closeAfter: {
                    time: 3,
                    resetOnHover: true
                  },
                  className: "error",
                  position: "bottom right"
                });
                break;
              case "other":
                gdMessages.notify({
                  msg: "You clicked Other",
                  closeAfter: {
                    time: 3,
                    resetOnHover: true
                  },
                  className: "info",
                  position: "top right"
                });
                break;
              default:
                gdMessages.notify({
                  msg: "Request for Confirmation timed out!",
                  closeAfter: {
                    time: 5,
                    resetOnHover: true
                  },
                  className: "warning",
                  position: "centre"
                });
            }
          }
        });
        break;

      case "dialog":
        gdMessages.dialog({
          title: "Contractor Details",
          msg: frmCalEvent,
          returnSelector: "#gd-simple-event-bf",
          width: width,
          position: position,
          animation: animation,
          otherBtn: {                      // otherBtn: false
            className: 'btn btn-warning',
            label: 'Save Copy'
          },
          beforeClose: gdFormValidation,
          afterClose: function (result, $data) {
            switch (result) {
              case "ok":                   // do the OK/Save processing
                gdMessages.notify({
                  msg: "You clicked OK - record saved",
                  closeAfter: {
                    time: 3,
                    resetOnHover: true
                  },
                  className: "success",
                  position: "bottom left"
                });
                break;
              case "cancel":               // do the cancel processing
                gdMessages.notify({
                  msg: "You clicked Cancel",
                  closeAfter: {
                    time: 3,
                    resetOnHover: true
                  },
                  className: "error",
                  position: "bottom right"
                });
                break;
              case "other":                // do the custom alternative processing
                gdMessages.notify({
                  msg: "You clicked Save Copy",
                  closeAfter: {
                    time: 3,
                    resetOnHover: true
                  },
                  className: "info",
                  position: "top right"
                });
                break;
              default:
                gdMessages.notify({
                  msg: "You took too long, so I closed!",
                  closeAfter: {
                    time: 5,
                    resetOnHover: true
                  },
                  className: "warning",
                  position: "centre"
                });
            }
          }
        });
        break;
    }
  });

  function gdFormValidation() {
    console.log('Validating');
    $data = $("#gd-simple-event-bf");
    var $form = $data.find(".form");
    var title = $form.find("#title").val();
    var startDate = $form.find("#gd-start-date").val();
    var startTime = $form.find("#gd-start-time").val();
    var endDate = $form.find("#gd-end-date").val();
    var endTime = $form.find("#gd-end-time").val();
    var desc = $form.find("#desc").val();
    console.log(title);
    console.log(startDate);
    console.log(startTime);
    console.log(endDate);
    console.log(endTime);
    console.log(desc);
    return true;
  }
});