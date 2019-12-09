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
    }) 
});