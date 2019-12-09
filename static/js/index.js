$(document).ready(function(){
    $('button[id^=yt_button]').on('click', function (e) {
        // do something...
        var value=$(this).val();
        console.log(value);
        $("#yt_video").html('<iframe src="https://www.youtube.com/embed/'+value+'?autoplay=1" width="100%" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>');
    });
});