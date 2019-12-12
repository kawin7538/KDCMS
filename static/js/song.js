$(document).ready(function(){
    var $videoSrc;
    $('button[id^=yt_button]').on('click', function (e) {
        // do something...
        var value=$(this).val();
        $videoSrc="https://www.youtube.com/embed/'"+value+"'?autoplay=1"
        console.log($videoSrc);
        $("#yt_frame").html('<iframe id="yt_video" class="embed-responsive-item" src="https://www.youtube.com/embed/'+value+'?autoplay=1" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>');
    });
    $('#videoModal').on('hide.bs.modal', function (e) {
        // a poor man's stop video
        $("#yt_video").attr('src',$videoSrc); 
    });
    $.ajax({
        url: 'song/list',
        type: 'get',
        dataType: 'json',
        success: function (data) {
            // console.log(data);
            let row='';
            var i=1;
            data.songs.forEach(s => {
                row += `<tr>
                <td style="display:none">${s.song_id}</td>
                <td>i</td>`
                if(s.song_ytlink!=null){
                    row += `<td><button value="{{s.song_ytlink}}" class="btn" id="yt_button{{forloop.counter}}" data-toggle="modal" data-target="#videoModal"><i class="fas fa-play-circle"></i></button></td>`;
                }
                {%if s.song_ytlink != None %}
                    <!-- <td><iframe src="https://www.youtube.com/embed/{{s.song_ytlink}}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></td> -->
                    <td><button value="{{s.song_ytlink}}" class="btn" id="yt_button{{forloop.counter}}" data-toggle="modal" data-target="#videoModal"><i class="fas fa-play-circle"></i></button></td>
                {%else%}
                    <!-- <td><button class="btn" disabled="disabled"><i class="fas fa-ban"></i></button></td> -->
                    <td></td>
                {%endif%}
                <td>{{s.song_name}}</td>
                {%if s.song_artist != None %}
                    <td>{{s.song_artist}}</td>
                {%else%}
                    <td></td>
                {%endif%}
            </tr>`;
            });
        }
    });
});