$(document).ready(function(){
    
    listMember();
});

function listMember(){
    $.ajax({
        url: 'member/list',
        type: 'get',
        dataType: 'json',
        success: function(data){
            let row=``;
            var i=1;
            data.member.forEach(s => {
                row += `<tr>`;
                row += `<td id="id" style="display: none">${s.member_id}</td>`;
                // row += `<td>${i}</td>`;
                row += `<td><a href="member/${s.member_id}">${s.nickname}</a></td>`
                row += `<td>${s.name}</td>`;
                row += `<td>${(s.sum_rehearsal/s.count_rehearsal*100).toFixed(2)}</td>`;
                row += `</tr>`;
                i++;
            });
            $("#member_table > tbody").html(row);
        }
    });
}