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
    
