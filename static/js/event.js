var $member=null;
var $type_dance=null;
var $song=null;

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
                row += `<td style="display:none"><span id="location">${s.location}</span></td>`;
                row += `<td>`;
                $.each(s.line_item,function(k,v){
                    row += `<a href='/evaluation/${s.event_id}/${k}'>${k} </a>`;
                });
                row += `</td>`;
                row += `<td><button id="event_delete${i}" class="btn btn-danger" data-toggle="modal" data-target="#deleteSongModal"><i class="fas fa-trash-alt"></i></button</td>`;
                row += `</tr>`;
                i++;
            });
            $("#event_table > tbody").html(row);
        },
    });
}

function add_event_row(condition){
    if($member==null){
        $.ajax({
            url: 'member/list',
            type: 'get',
            dataType: 'json',
            success: function(data){
                $member=data.member;
                add_event_row(false);
            },
        });
    }
    else if($song==null){
        $.ajax({
            url: 'song/list',
            type: 'get',
            dataType: 'json',
            success: function(data){
                $song=data.songs;
                add_event_row(false);
            }
        });
    }
    else if($type_dance==null){
        $.ajax({
            url: '/type_dance/list',
            type: 'get',
            dataType: 'json',
            success: function(data){
                $type_dance=data.type_dance;
                add_event_row(false);
            }
        });
    }
    else{
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
        $("#member_check_table > tbody:last-child").append(row);
    }
}

function add_member_row(condition){
    if(condition==false){
        code=``;
        code +=`<table>`
    }
}