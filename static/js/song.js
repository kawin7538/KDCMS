$(document).ready(function(){
    var $videoSrc;
    $.ajax({
        url: 'song/list',
        type: 'get',
        dataType: 'json',
        success: function (data) {
            // console.log(data);
            let row=``;
            var i=1;
            data.songs.forEach(s => {
                row += `<tr>
                <td style="display:none">${s.song_id}</td>
                <td>${i}</td>`;
                if(s.song_ytlink!=null){
                    row += `<td><button value="${s.song_ytlink}" class="btn" id="yt_button${i}" data-toggle="modal" data-target="#videoModal"><i class="fas fa-play-circle"></i></button></td>`;
                }
                else{
                    row += `<td></td>`;
                }
                row += `<td>${s.song_name}</td>`
                if(s.song_artist!=null){
                    row += `<td>${s.song_artist}</td>`;
                }
                else{
                    row += `<td></td>`;
                }
                row += `</tr>`;
                i++;
            });
            $("#song_table > tbody").html(row);
        }
    });
    $('button[id^=yt_button]').click(function (e) {
        // do something...
        var value=$(this).val();
        console.log(value);
        $videoSrc="https://www.youtube.com/embed/'"+value+"'?autoplay=1"
        console.log($videoSrc);
        $("#yt_frame").html('<iframe id="yt_video" class="embed-responsive-item" src="https://www.youtube.com/embed/'+value+'?autoplay=1" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>');
    });
    $('#videoModal').on('hide.bs.modal', function (e) {
        // a poor man's stop video
        $("#yt_video").attr('src',$videoSrc); 
    });
});