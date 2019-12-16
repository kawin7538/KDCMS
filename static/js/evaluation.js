var $criteria=null;
var $row=1;

$(document).ready(function(){
    list_rehearsal();
    add_cri_row(false);
});

$(document).on('click','#add_eva',function(){
    $("#evaFormReset").click();
    $("#eva_id_id").val('<new>');
    $("#evaForm input[id!=eva_id_id]").val('');
    $("#event_id").val($("#pk1").html());
    $("#team_id").val($("#pk2").html());
});

$(document).on('click','a[id^=eva_detail]',function(){
    $row=$(this).closest('tr')
    $("#evaFormModal").modal('show');
    $("#evaForm input[id!=eva_id_id]").val('');
    $("#event_id").val($("#pk1").html());
    $("#team_id").val($("#pk2").html());
    $("#criteria_score_table > tbody").html("");
    add_cri_row(false);
    $("input[type=checkbox]").prop('checked',false);
    $("#eva_id_id").val($row.find('#eva_id').text());
    $("#eva_date").val($(this).text());
    console.log('../../evaluation/detail/'+$('#eva_id_id').val());
    $.ajax({
        url: '../../evaluation/detail/'+$('#eva_id_id').val(),
        method: 'get',
        dataType: 'json',
        success: function(data){
            console.log(data);
        },
        error: function(jqXHR,exception){
            console.log(jqXHR,exception);
        }
    });
});

$(document).on('click','#evaFormReset',function(){
    $("#eva_id_id").val('<new>');
    $("#evaForm input[id!=eva_id_id]").val('');
    $("#event_id").val($("#pk1").html());
    $("#team_id").val($("#pk2").html());
    $("#criteria_score_table > tbody").html("");
    add_cri_row(false);
    $("input[type=checkbox]").prop('checked',false);
});

$(document).on('click','#evaFormSubmit',function(){
    var song_name = $('#eva_date').val().trim();
    if (song_name == '') {
        alert('กรุณาระบุวันที่ประเมิน');
        $('#datetimepicker').focus();
        return false;
    }
    // console.log($("#criteria_score_table > tbody >tr").length);
    $("#criteria_score_table > tbody >tr").each(function(index){
        if($(this).find("select option:selected").text()=='select'){
            alert('กรุณาระบุเกฑ์');
            $(this).find("select").focus();
            return false;
        }
        // console.log($(this).find("input[type=number]").val());
        if($(this).find("input[type=number]").val()==''){
            alert('กรุณาระบุคะแนน');
            $(this).find("input[type=number]").focus();
            return false;
        }
    });
    var str=$("#evaForm input:not([type='checkbox'])").serialize();
    var str1=cri_table_toJson();
    // console.log(str1);
    // var str2=$("input[type=checkbox]:checked").map(function(){
    //     return {'id':($(this).attr('id')).toString(),'value':(this.checked ? 1 : 0).toString()};
    // }).get();
    var str2=member_table_toJson();
    // console.log(str2);
    var token = $('[name=csrfmiddlewaretoken]').val();
    $.ajax({
        url: '../../evaluation/create',
        type: 'post',
        data: str+"&member_lineitem="+str2+"&score_lineitem="+str1,
        headers: { "X-CSRFToken": token },
        dataType:  'json',
        success: function(data){
            if (data.error) {
                console.log(data);
                alert(data.error);
            } else {
                console.log(data);
                // console.log(data.Receipt);
                $('#eva_id_id').val(data.eva_id)
                alert('บันทึกสำเร็จ');
                $("#evaFormModal").modal('hide');
                list_rehearsal();
            }
        }
    });
});

$(document).on('click','#criteria_add',function(){
    add_cri_row(true);
})

$(document).on('click','.delete_eva',function(e){
    e.preventDefault();
    $(this).closest('tr').remove();
})

function cri_table_toJson(){
    var rows=[];
    var i=0;
    $("#criteria_score_table > tbody >tr").each(function(index){
        rows[i]={};
        rows[i][$(this).find("select option:selected").attr('value')]=$(this).find("input[type=number]").val();
        i++;
    });
    var obj={};
    obj['score_lineitem']=rows;
    return JSON.stringify(obj);
}

function member_table_toJson(){
    var rows=[];
    var i=0;
    $("input[type=checkbox]").each(function(){
        rows[i]={};
        rows[i][$(this).attr('id')]=(this.checked ? 1 : 0);
        i++;
    });
    var obj={};
    obj['member_lineitem']=rows;
    return JSON.stringify(obj);
}

function add_cri_row(condition){
    if($criteria==null){
        $.ajax({
            url: '../../criteria/list',
            type: 'get',
            dataType: 'json',
            success: function(data){
                $criteria=data.criteria;
                add_cri_row(false);
            }
        });
    }
    else{
        // console.log($criteria);
        var row = `<tr>`;
        row += `<td><select required class="form-control">`;
        // $criteria.forEach(s => {
        //     row += `<option value=${s.criteria_id}>${s.criteria_name}</option>`;
        // });
        row += `<option value="" disabled="disabled" selected>select</option>`
        $.each($criteria,function(i,s){
            row += `<option value=${s.criteria_id}>${s.criteria_name}</option>`;
            // console.log(i,s);
        })
        row += `</td>`;
        row += `<td><input required class="form-control" type="number" pattern="[0-9]*" min="0" max="10" /></td>`;
        if(condition){
            row += `<td><button class="delete_eva">delete</button></td>`;
        }
        else{
            row += `<td></td>`;
        }
        row += `</tr>`;
        $("#criteria_score_table > tbody:last-child").append(row);
    }
}

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
                $row2 += `<td><input type="checkbox" id="${k}" name="check_in" value="${k}"></td>`;
                $row2 += `</tr>`;
            });
            $("#member_checkin > tbody").html($row);
            $("#member_check_table > tbody").html($row2);
            $row= ``;
            data.list_evaluation.forEach(s => {
                $row += `<tr>`;
                $row += `<td rowspan=${Object.keys(s.criteria_score).length} id="eva_id" style="display:none">${s.eva_id}</td>`
                $row += `<td rowspan=${Object.keys(s.criteria_score).length}><a href="#" id="eva_detail${s.eva_id}">${s.eva_date}</td>`;
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
