$(document).ready(function(){
    listEvent();
});

function listEvent(){
    $.ajax({
        url: 'event/list',
        type: 'get',
        dataType: 'json',
        success: function(data){
            let row=``;
            var i=1;
            data.event_list.forEach( s => {
                row += `<tr>
                <td id="id" style="display:none">${s.event_id}</td>`;
                // <td>${i}</td>`;
                row += `<td><span id="datetime">${s.date_time}</span></td>`;
                row += `<td><a href="#" id="event_detail${i}" data-toggle="modal" data-target="#eventFormModal">${s.event_name}</a></td>`;
                // row += `<td><span id="location">${s.location}</span></td>`;
                row += `<td><button id="event_delete${i}" class="btn btn-danger" data-toggle="modal" data-target="#deleteEventModal"><i class="fas fa-trash-alt"></i></button</td>`;
                row += `</tr>`;
                i++;
            });
            $("#event_table > tbody").html(row);
        },
    });
}

$(document).on('click',"#add_event",function(){
    $("#event_id").val("<new>");
    $("#eventForm input[id!=event_id]").val('');
});

$(document).on('click',"button[id^=event_delete]",function(){
    // $("#deleteEventModal").find("#deleteDetail").text("FAS");
    var modal=$("#deleteEventModal");
    var row=$(this).closest("tr");
    var html="";
    html+="<div class=\"row\"><div class=\"col-4\">event id</div><div class=\"col\">"+row.find("#id").text()+"</div></div>";
    html+="<div class=\"row\"><div class=\"col-4\">event name</div><div class=\"col\">"+row.find("a[id^=event_detail]").text()+"</div></div>";
    html+="<div class=\"row\"><div class=\"col-4\">event location</div><div class=\"col\">"+row.find("#event_location").text()+"</div></div>";
    html+="<div class=\"row\"><div class=\"col-4\">date/time</div><div class=\"col\">"+row.find("#date_time").text()+"</div></div>";
    modal.find("#deleteDetail").html(html);
    modal.find("#deleteSongButton").val(row.find("#id").text());
});

$(document).on('click',"#deleteEventButton",function(){
    var token = $('[name=csrfmiddlewaretoken]').val();
    $.ajax({
        url: 'event/delete/'+$("#deleteEventButton").val(),
        type: 'post',
        headers: {'X-CSRFToken':token},
        dataType: 'json',
        success: function(data){
            alert('ลบสำเร็จ');
            $("#deleteEventModal").modal('hide');
            listSong();
        }
    });
})

$(document).on('click','a[id^=event_detail]',function(){
    var $row=$(this).closest("tr");
    // var $event_id=$row.find("#id").text();
    // console.log($event_id);
    $("#event_id").val($row.find("#id").text());
    $("#event_name").val($(this).text());
    $("#event_location").val($row.find("#location").text());
    $("#date/time").val($row.find("#date/time").text());
});

$(document).on('click','#eventFormReset',function(){
    $("#eventForm input[id!=event_id]").val('');
});

$(document).on('click',"#eventFormSubmit",function(e){
    var event_name = $('#event_name').val().trim();
    if (event_name == '') {
        alert('กรุณาระบุ event name');
        $('#event_name').focus();
        return false;
    }
    if($('#event_id').val() == '<new>'){
        var token = $('[name=csrfmiddlewaretoken]').val();
        var $form=$('#eventForm');
        var $formData = $form.serialize();
        console.log($formData);
        $.ajax({
            url:  '/event/create',
            type:  'post',
            data: $form.serialize(),
            headers: { "X-CSRFToken": token },
            dataType:  'json',
            success: function  (data) {
                if (data.error) {
                    console.log(data);
                    alert(data.error);
                } else {
                    console.log(data);
                    // console.log(data.Receipt);
                    // $('#receiptNo').val(data.receipt.receipt_no)
                    alert('บันทึกสำเร็จ');
                    $("#eventForm input[id!=event_id]").val('');
                    $("#eventFormModal").modal('hide');
                    listSong();
                }                    
            },
        });  
    }
    else{
        var token = $('[name=csrfmiddlewaretoken]').val();
        var $form=$('#eventForm');
        var $formData = $form.serialize();
        console.log($formData);
        $.ajax({
            url:  '/event/update',
            type:  'post',
            data: $form.serialize(),
            headers: { "X-CSRFToken": token },
            dataType:  'json',
            success: function  (data) {
                if (data.error) {
                    console.log(data);
                    alert(data.error);
                } else {
                    console.log(data);
                    alert('บันทึกสำเร็จ');
                    $("#eventForm input[id!=event_id]").val('');
                    $("#eventFormModal").modal('hide');
                    listSong();
                }                    
            },
        });
    }
});

       