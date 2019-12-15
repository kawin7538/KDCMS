$(document).ready(function(){
    list_rehearsal();
});

function list_rehearsal(){
    $.ajax({
        url: '../../evaluation/list/'+$("#pk1").html()+"/"+$("#pk2").html(),
        type: 'get',
        dataType: 'json',
        success: function(data){
            console.log(data)
        }
    })
}