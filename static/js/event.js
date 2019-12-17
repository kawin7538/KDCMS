var $member=null;
var $type_dance=null;
var $song=null;

$(document).ready(function(){
    listEvent();
    $("#myInput3").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#myTableBody3 tr").filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
      });
    if($member==null){
        $.ajax({
            url: 'member/list',
            type: 'get',
            dataType: 'json',
            success: function(data){
                $member=data.member;
            },
        });
    }
    if($song==null){
        $.ajax({
            url: 'song/list',
            type: 'get',
            dataType: 'json',
            success: function(data){
                $song=data.songs;
            }
        });
    }
    if($type_dance==null){
        $.ajax({
            url: '/type_dance/list',
            type: 'get',
            dataType: 'json',
            success: function(data){
                $type_dance=data.type_dance;
            }
        });
    }
});

$(document).on('click',"#add_event",function(){
    $("#event_id").val("<new>");
    $("#eventForm input[id!=event_id]").val('');
    add_event_row(false);
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
    $("#location").val($row.find("#txt_location").text());
    $("#date_time").val($row.find("#datetime").text());
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

$(document).on('click',$("#member_choice_table > theader").find("button"),function(e){
    // e.preventDefault();
    add_member_row(true);
})

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
                row += `<td style="display:none"><span id="txt_location">${s.location}</span></td>`;
                row += `<td>`;
                $.each(s.line_item,function(k,v){
                    row += `<a href='/evaluation/${s.event_id}/${k}'>${k} </a>`;
                });
                row += `</td>`;
                row += `<td><button id="event_delete${i}" class="btn btn-danger" data-toggle="modal" data-target="#deleteEventModal"><i class="fas fa-trash-alt"></i></button</td>`;
                row += `</tr>`;
                i++;
            });
            $("#event_table > tbody").html(row);
        },
    });
}

function add_event_row(condition){
    // if($member==null){
    //     $.ajax({
    //         url: 'member/list',
    //         type: 'get',
    //         dataType: 'json',
    //         success: function(data){
    //             $member=data.member;
    //             add_event_row(false);
    //         },
    //     });
    // }
    // else if($song==null){
    //     $.ajax({
    //         url: 'song/list',
    //         type: 'get',
    //         dataType: 'json',
    //         success: function(data){
    //             $song=data.songs;
    //             add_event_row(false);
    //         }
    //     });
    // }
    // else if($type_dance==null){
    //     $.ajax({
    //         url: '/type_dance/list',
    //         type: 'get',
    //         dataType: 'json',
    //         success: function(data){
    //             $type_dance=data.type_dance;
    //             add_event_row(false);
    //         }
    //     });
    // }
    // else
    {
        var row = `<tr>`;
        row += `<td><select id="type_dance" required class="form-control">`;
        // $criteria.forEach(s => {
        //     row += `<option value=${s.criteria_id}>${s.criteria_name}</option>`;
        // });
        row += `<option value="" disabled="disabled" selected>select</option>`
        $.each($type_dance,function(i,s){
            row += `<option value=${s.type_id}>${s.type_name}</option>`;
            // console.log(i,s);
        });
        row += `</td>`;
        row += `<td><select id="song" required class="form-control">`;
        row += `<option value="" disabled="disabled" selected>select</option>`
        $.each($song,function(i,s){
            row += `<option value=${s.song_id}>${s.song_name}</option>`;
            // console.log(i,s);
        });
        row += add_member_row(false);
        row += `</tr>`;
        console.log(row);
        $("#member_check_table > tbody:last-child").append(row);
    }
}

function add_member_row(condition){
    if(condition==false){
        code=``;
        code +=`<td><table id="member_choice_table"><theader><tr><td><button class="btn btn-primary">Add Member</button></td></tr></theader><tbody><tr>`;
        code += `<td><select choice="member_choice" required class="form-control">`;
        code += `<option value="" disabled="disabled" selected>select</option>`
        $.each($member,function(i,s){
            code += `<option value=${s.member_id}>${s.nickname}</option>`;
        });
        code += `</td></tr></tbody></table></td>`;
        return code;
    }
    else{
        var code = `<tr><td><select id="member_choice" required class="form-control">`;
        code += `<option value="" disabled="disabled" selected>select</option>`;
        $.each($member,function(i,s){
            code += `<option value=${s.member_id}>${s.nickname}</option>`;
        });
        code+=`</td></tr>`;
        $("#member_choice_table > tbody:last-child").append(code);
    }
}      
