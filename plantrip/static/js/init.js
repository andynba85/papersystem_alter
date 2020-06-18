$(document).ready(function () {
  $('.datepicker').datepicker({
    format:'yyyy-mm-dd'
  });

  $('.timepicker').timepicker({
    twelveHour:false,
  });
  $('.modal').modal();
  $('select').formSelect();
});