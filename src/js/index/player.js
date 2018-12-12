{
    let view = {
        el: '.playArea',
        template: `
            <div class="player-wrapper" id="uploadContainer">
                <div class="controls" id="controls">
                    <div class="playButton">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-bofang"></use>
                        </svg>                    </div>

                    <div class="pauseButton" >
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-zanting-copy"></use>
                        </svg>
                    </div>

                </div>

                <div class="Audio">
                    <audio id="audioTag" src="http://piwfultho.bkt.clouddn.com/Come%20Be%20With%20Me.mp3"></audio>
                    <div class="playbar">
                        <span class="played-time">00:00</span>
                        <div class="pgs">
                            <div class="pgs-play" id="progress" style="width: 20%;"></div>
                        </div>
                        <span class="audio-time" id="audioTime">0</span>
                    </div>


                </div>
            </div>
            <div class="clickable" id="uploadButton">
                <span> 了解更多 >></span>

        </div>


       
        `,
        render() {
            $(this.el).html(this.template)
        },
        find(selector) {
            return $(this.el).find(selector)[0]
        }


    }
    let model = {}
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.bindEvents()
            this.view.render()



        },
        bindEvents() {
            //播放暂停控制
            var audio = $(this.view.el).find('#audioTag');
            console.log('sdsd')
            console.log(audio)

            $(this.view.el).find('#controls').click(function () {
                console.log('ddd')
                //监听音频播放时间并更新进度条
                // audio.addEventListener('timeupdate', updateProgress, false);
                //监听播放完成事件
                // audio.addEventListener('ended', audioEnded, false);
                audio.on('timeupdate',()=>{
                    this.updateProgress()
                })

                audio.on('ended',()=>{
                    this.audioEnded()
                })

                //改变暂停/播放icon
                if (audio.paused) {
                    audio.play();
                    $('.pauseButton').addClass('active')
                    $('.playButton').addClass('active')
                } else {
                    audio.pause();
                    $('.pauseButton').removeClass('active')
                    $('.playButton').removeClass('active')
                }
            })

            //读取视频长度,设置页面时长显示-loadedmetadata:指定视频/音频（audio/video）的元数据加载后触发
            //audio.duration 获取音频的时长，单位为秒
            $(this.view.el).find('#audioTag').on("loadedmetadata", function () {
                //alert(audio.duration)
                $(this.view.el).find('#audioTime').text(this.transTime(this.duration));
            });
        },
        transTime(time) {
            var duration = parseInt(time);
            var minute = parseInt(duration / 60);
            var sec = duration % 60 + '';
            var isM0 = ':';
            if (minute == 0) {
                minute = '00';
            } else if (minute < 10) {
                minute = '0' + minute;
            }
            if (sec.length == 1) {
                sec = '0' + sec;
            }
            return minute + isM0 + sec
        },

        //更新进度条
        updateProgress() {
            var audio = document.getElementsByTagName('audio')[0];
            var value = Math.round((Math.floor(audio.currentTime) / Math.floor(audio.duration)) * 100, 0);
            $('.pgs-play').css('width', value * 5 + '%');
            $('.played-time').html(transTime(audio.currentTime));


        },

        //播放完成
        audioEnded() {
            var audio = document.getElementsByTagName('audio')[0];
            audio.currentTime = 0;
            audio.pause();
            $('.playButton').removeClass('active')
            $('.pauseButton').removeClass('active')
        }


    }
    controller.init(view, model)
}