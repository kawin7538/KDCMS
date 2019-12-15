$(document).ready(function(){
    
    listMember();
});

$(document).on('click','a[id^=member_detail]',function(){
    var member_id=$(this).closest('tr').find('#id').html()
    $.ajax({
        url: 'member/detail/'+member_id,
        type: 'get',
        dataType: 'json',
        success: function(data){
            console.log(data)
            data1=data['member_detail']
            var modal=$('#memberDetailModal');
            modal.find("#name_surname_id").val(data1['firstname'].trim()+" "+data1['lastname'].trim());
            modal.find("#sid_id").val(data1['student_id'].trim());
            modal.find("#faculty_id").val(data1.faculty_name);
            modal.find("#department_id").val(data1.department_name);
            modal.find("#tel_id").val(data1.tel);
            modal.find("#fb_id").val(data1.facebook);
            modal.find("#line_id").val(data1.line);
            modal.find("#email_id").val(data1.email);

            data2=data['list_event']
            var $row=``;
            var i=1;
            data2.forEach(s => {
                $row+=`<tr>`;
                $row+=`<td>${i}</td>`;
                $row+=`<td>${s.event_name}</td>`;
                $row+=`<td>${s.date_time}</td>`;
                $row+=`</tr>`;
                i++;
            });
            modal.find("#dance_history > tbody").html($row);
            modal.find('#edit_profile_btn').attr('href',`member/${member_id}`)
        }
    });
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
                row += `<td><a href="#" id="member_detail${i}" data-toggle="modal" data-target="#memberDetailModal">${s.nickname}</a></td>`
                row += `<td>${s.name}</td>`;
                row += `<td>${(s.sum_rehearsal/s.count_rehearsal*100).toFixed(2)}</td>`;
                row += `</tr>`;
                i++;
            });
            $("#member_table > tbody").html(row);
        }
    });
}

function saveData() {
    var nickname= document.getElementById('nickname');
    var firstname= document.getElementById('firstname');
    var lastname= document.getElementById('lastname');
    var studentid= document.getElementById('studentid');
    var faculty;
    var image;
    var tel= document.getElementById('phonenumber');
    var facebook= document.getElementById('facebook');
    var line= document.getElementById('line');
    var email= document.getElementById('email');
    insertData(nickname.value,firstname.value,lastname.value,studentid.value,
        phonenumber.value,facebook.value,line.value,email.value)

}

function insertData(nickname,firstname,lastname,studentid,
    phonenumber,facebook,line,email)
    var firebaseref=firebase.database().ref("users");
    firebaseRef.push({
        nickname:nickname,
        firstname:firstname,
        lastname:lastname,
        studentid=studentid,
        phonenumber=phonenumber,
        facebook=facebook,
        line=line,
        email=email,
    });
    console.log("Insert Success");

session_start();
mysql_connect("localhost","root","root");
mysql_select_db("mydatabase");


$(document).on('click','memberFormReset',function(){
    $("#memberForm input[id!=member_id]").val('');
});

$(document).on('click',"#memberFormSubmit",function(e){
    var nickname = $('#nickname').val().trim();
    if (nickname == '') {
        alert('กรุณาระบุ nickname');
        $('#nickname').focus();
        return false;
        }

    var firstname = $('#firstname').val().trim();
        if (firstname == '') {
            alert('กรุณาระบุ firstname');
            $('#firstname').focus();
            return false;
            }
    var lastname = $('#lastname').val().trim();
        if (lastname == '') {
            alert('กรุณาระบุ lastname');
            $('#lastname').focus();
            return false;
            }
    var studentid = $('#studentid').val().trim();
        if (studentid == '') {
            alert('กรุณาระบุ studentID');
            $('#studentid').focus();
            return false;
            }

$(document).on('click',"#upload",function(){
$("#member_id").val("<new>");
$("#memberForm input[id!=member_id]").val('');
});
            

    })
    
