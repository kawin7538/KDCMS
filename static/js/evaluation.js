$(document).ready(function(){
    list_rehearsal();
});



function list_rehearsal(){
    $.ajax({
        url: '../../evaluation/list/'+$("#pk1").html()+"/"+$("#pk2").html(),
        type: 'get',
        dataType: 'json',
        beforeSend: function(){
            $("#loading").modal('show');
        },
        success: function(data){
            $("#event_name").html(data.event_name);
            $("#song_name").html(data.song_name);
            let $row = ``;
            let $row2 = ``;
            $.each(data.list_member,function(k,v){
                $row += `<tr>`;
                $row += `<td>${v[1]}</td>`;
                $row += `<td>${v[0]}</td>`;
                $row += `</tr>`;
                $row2 += `<tr>`;
                $row2 += `<td><label for="check_in${k}">${v[1]}</label></td>`;
                $row2 += `<td><input type="checkbox" id="check_in${k}" name="check_in" value="${k}"></td>`;
                $row2 += `</tr>`;
            });
            $("#member_checkin > tbody").html($row);
            $("#member_check_table > tbody").html($row2);
            $row= ``;
            data.list_evaluation.forEach(s => {
                $row += `<tr>`;
                $row += `<td rowspan=${Object.keys(s.criteria_score).length} id="eva_id" style="display:none">${s.eva_id}</td>`
                $row += `<td rowspan=${Object.keys(s.criteria_score).length}>${s.eva_date}</td>`;
                // row += `<td rowspan=${s.criteria.length}>${s.eva_date}</td>`;
                var ii=0;
                $.each(s.criteria_score,function(k,v){
                    if(ii==0){
                        ii++;
                    }
                    else{
                        $row += `<tr>`;
                    }
                    $row += `<td>${v[1]}</td>`;
                    $row += `<td>${v[0]}</td>`;
                    $row += `</tr>`;
                })
            });
            // console.log($row);
            $("#eva_score > tbody").html($row);
        },
        complete: function(){
            $("#loading").modal("hide");
        }
    })
}

