window.onload = function(){
    // 获取元素
    let disc = $(".disc")[0];
    let title_name = $(".name")[0];
    let title_back = $(".title-back")[0];
    let play_wrap = $(".play-wrap")[0];
    let mask = $(".mask")[0];
    let playing = $(".playing")[0];
    let currentTime = $(".currentTime")[0];
    let duration = $(".duration")[0];
    let progress = $(".progress")[0];
    let proBg = $(".pro-bg")[0];
    let proBar = $(".pro-bar")[0];
    let playLyric = $(".play-lyric")[0];
    let lyricWrap = $(".lyric-wrap")[0];
    let datas = {};

    // 获取 id 并本地储存
    (function(str){
        if(!str.includes("?")) return;
        let arr = str.split("?")[1].split("&");
        arr.forEach((item,index) => {
            let dataArr = item.split("=");
            if(dataArr[0] == "id"){
                localStorage.setItem(dataArr[0],dataArr[1]);
            }
        })
    })(location.href);
    
    datas.id = localStorage.getItem("id");

    // 退回按钮
    title_back.onclick = function(){
        window.history.back();  //返回上一页
    }


    // 获取歌曲详情
    $.get(
        `http://localhost:3000/song/detail?ids=${datas.id}`,
        function({songs: [{al}]}){
            disc.innerHTML = `
            <img src="${al.picUrl}" alt="">
            `
            title_name.innerHTML = al.name;
            play_wrap.style.background = 0;
            mask.style.background = `url(${al.picUrl}) no-repeat center`;
        }
    )

    window._audio = document.createElement("audio");
    // 获取音乐
    $.get(
        `http://localhost:3000/song/url?id=${datas.id}`,
        function({data:[{url}]}){
            disc.style.animation = 'rotate 18s linear infinite';
            _audio.src = url;
            _audio.currentTime = sessionStorage["playTime"];
            _audio.play();

            // 监听音乐
            _audio.addEventListener('ended',function(){
                disc.style.animation = '';
            })

            // 监听播放
            _audio.addEventListener('timeupdate',function(){
                nowTime();
            });

            // 播放时间
            function nowTime(){
                // 总时间
                duration.innerHTML = time(_audio.duration);
                currentTime.innerHTML = time(_audio.currentTime);
                
                // 进度条
                let n = _audio.currentTime / _audio.duration;
                proBar.style.left = n * ((progress.offsetWidth - proBar.offsetWidth) / 1.28 / 100) + 'rem';
                proBg.style.width = n * ((progress.offsetWidth - proBar.offsetWidth) / 1.28 / 100) + 'rem';
            }

            // 处理时间函数
            function time(time){
                let m = zero(Math.floor(parseInt(time) % 3600 / 60));
                let s = zero(Math.floor(parseInt(time) % 60));
                return `${m}:${s}`
            }
            // 两位数时间格式
            function zero(num){
                return num < 10 ? "0" + num : num;
            }
            
        
            // 处理控件
            // playing
            let temp = true;
            playing.onclick = function(){
                let str = "";
                if(temp){
                    _audio.pause();
                    disc.style.animation = '';
                    str = "icon-bofang"
                    playing.innerHTML = `<span class="iconfont icon-bofang"></span>`;
                }else{
                    _audio.play();
                    disc.style.animation = 'rotate 18s linear infinite';
                    str = "icon-pause"
                }
                temp = !temp;
                this.innerHTML = `<span class="iconfont ${str}"></span>`
            }


            // 点击获取歌词
            let p = true,
                p1 = true;
            playLyric.onclick = function(){
                if(p){
                    disc.style.display = "none";
                    lyricWrap.style.display = "block";
                }else{
                    disc.style.display = "block";
                    lyricWrap.style.display = "none";
                }
                p = !p;
               if(p1){
                    $.get(
                        `http://localhost:3000/lyric?id=${datas.id}`,
                        function({lrc:{lyric}}){
                        let data = lyric.split("[");
                        data.forEach((item,index) => {
                                if(!item) return;
                                let dataArr = item.split("]");
                                let time = dataArr[0].split(".")[0];
                                let lyricStr = dataArr[1];
                                let timeArr = time.split(":")
                                let timer = timeArr[0] * 60 + timeArr[1] *1;
                                let p = document.createElement("p");
                                p.id = 'ly' + timer;
                                p.className = 'lyr';
                                p.innerHTML = lyricStr;
                                lyricWrap.appendChild(p);
                        });


                        //    获取所有p标签
                        let pArr = ([...$('.lyr')]);
                            _audio.addEventListener('timeupdate', function () {
                            // console.log('ly' + parseInt(_audio.currentTime))
            
                            let currentTime = parseInt(_audio.currentTime);

                            pArr.forEach((item, index) => {
                            if (item.id == 'ly' + currentTime) {
                                lyricWrap.style.marginTop =  -(item.offsetTop / 100) + 'rem';
                                if (index > 0) {
                                pArr[index - 1].style.color = '#7f7676';
                                }
            
                                item.style.color = '#fff'
                            }
                            })
                        })
                        p1 = false; 
                        } 
                    )
               }
            }
            // 歌曲进度条
            proBar.addEventListener("touchstart",function(event){
                let initX = event.changedTouches[0].clientX - this.offsetLeft;
                document.addEventListener("touchmove",function(event){
                    let x = event.changedTouches[0].clientX - initX;
                    let proW = progress.offsetWidth - proBar.offsetWidth;
                    if(x <= 0){
                        x = 0;
                    } else if(x >= proW){
                        x = proW;
                    }
                    proBar.style.left = x / 1.28 / 100 + "rem";
                    proBg.style.width = x / 1.28 / 100 + "rem";
                    _audio.currentTime = x / proW * _audio.duration; // 设置播放进度
                })
            });
        }
    )
} 