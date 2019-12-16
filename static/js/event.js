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
                row += `<td><span id="location">${s.location}</span></td>`;
                row += `<td><button id="event_delete${i}" class="btn btn-danger" data-toggle="modal" data-target="#deleteSongModal"><i class="fas fa-trash-alt"></i></button</td>`;
                row += `</tr>`;
                i++;
            });
            $("#event_table > tbody").html(row);
        },
    });
}