$(function(){
//播放暂停控制
   var audio = $('#audioTag').get(0);

    $('#controls').click(function(){

        //监听音频播放时间并更新进度条
        audio.addEventListener('timeupdate',updateProgress,false);
        //监听播放完成事件
        audio.addEventListener('ended',audioEnded,false);


        //改变暂停/播放icon
        if(audio.paused){
            audio.play();
            $('.pauseButton').addClass('active')
            $('.playButton').addClass('active')
        } else{
            audio.pause();
            $('.pauseButton').removeClass('active')
            $('.playButton').removeClass('active')
        }
    })

    //读取视频长度,设置页面时长显示-loadedmetadata:指定视频/音频（audio/video）的元数据加载后触发
    //audio.duration 获取音频的时长，单位为秒
    $('#audioTag').on("loadedmetadata",function () {
        //alert(audio.duration)
        $('#audioTime').text(transTime(this.duration));
    });



})
//转换音频时长显示
function transTime(time) {
    var duration = parseInt(time);
    var minute = parseInt(duration/60);
    var sec = duration%60+'';
    var isM0 = ':';
    if(minute == 0){
        minute = '00';
    }else if(minute < 10 ){
        minute = '0'+minute;
    }
    if(sec.length == 1){
        sec = '0'+sec;
    }
    return minute+isM0+sec
}

//更新进度条
function updateProgress() {
    var audio =document.getElementsByTagName('audio')[0];
    var value = Math.round((Math.floor(audio.currentTime) / Math.floor(audio.duration)) * 100, 0);
    $('.pgs-play').css('width', value * 5  + '%');
    $('.played-time').html(transTime(audio.currentTime));


}
//播放完成
function audioEnded() {
    var audio =document.getElementsByTagName('audio')[0];
    audio.currentTime=0;
    audio.pause();
    $('.playButton').removeClass('active')
    $('.pauseButton').removeClass('active')
}

