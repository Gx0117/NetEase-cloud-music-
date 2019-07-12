window.onload = function(){
    let recHead = $(".rec-header")[0];
    let recList = $(".rec-list")[0];
    let control = $(".control")[0];
    let html = $("html")[0];
    let header_back = $(".back")[0];
    
    // 返回上一级
    header_back.onclick = function(){
        window.history.back();
    }
    
    // 获取每日推荐图片
    $.get(
        'http://localhost:3000/banner',
        function({banners}){
            let random = parseInt(Math.random()*banners.length);
            recHead.style.background = `url(${banners[random].imageUrl}) no-repeat 0 0/100% 100%`;
        }
    )


    // 获取每日推荐歌曲
    let idList = [];
    let nameList = [];
    let imgList = [];
    $.get(
        'http://localhost:3000/personalized/newsong',
        function({ result }){
            recList.innerHTML = "";
            result.forEach((item,index) => {
                idList.push(item.id);
                nameList.push(item.name);
                imgList.push(item.song.album.picUrl);
                let temp = item.song.alias;
                if(temp == ""){
                    temp = item.song.artists[0].name
                }
                recList.innerHTML += `
                    <li class="rec-item">
                        <a class="playing" href="#">
                            <div class="item-info">
                                <div class="info-img">
                                    <img src="${item.song.album.picUrl}" alt="">
                                </div>
                                <div class="info">
                                    <div class="info-title">
                                        ${item.name}
                                    </div>
                                    <div class="info-desc">
                                         ${temp}
                                    </div>
                                </div>
                            </div>
                            <div class="item-play">
                                <span class="iconfont icon-bofang1"></span>
                                <span class="iconfont icon-more1170511easyiconnet"></span>
                            </div>
                        </a>
                    </li>
                `
            });
            window._audio = document.createElement("audio");
            _audio.autoplay = "autoplay";
            let playing = [...$(`.playing`)];
            playing.forEach((item,index) => {
                item.index = index;
                item.onclick = function(){
                    $.get(
                        `http://localhost:3000/song/url?id=${idList[this.index]}`,
                        function({data}){
                            _audio.src = data[0].url;
                            _audio.play();
                        }
                    );
                    control.style.display = "block";
                    html.style.height = `110%`;
                    document.body.style.height = `110%`;
                    
                    control.innerHTML = `
                    <a href="./play.html?id=${idList[this.index]}">
                        <div class="con-mask"></div>
                        <div class="control-content">
                            <div class="con-img" >
                                <img src="${imgList[this.index]}" alt="" style="animation: rotate 18s linear 0s infinite normal none running">
                            </div>
                            <div class="con-info">
                                <div class="con-title">
                                    ${nameList[this.index]}
                                </div>
                                <div class="con-desc">
                                    滑动切换音乐
                                 </div>
                            </div>
                        </div>
                
                        <div class="con-play">
                            <div class="con-playing">
                            <span class="iconfont icon-pause"></span>
                            </div>

                            <div class="con-nextPlay">
                            <span class="iconfont icon-bofangliebiao"></span>
                            </div>
                        </div>
                    </a>
                    `
                    // 点击 播放/暂停
                    let con_playing = $(".con-playing")[0];
                    let con_nextPlay = $(".con-mask")[0];
                    let content = $(".control .control-content")[0];
                    let control_a = $(".control a")[0];
                    let temp = true;
                    con_playing.addEventListener("click",function(){
                        if(temp){
                            _audio.pause()
                            this.innerHTML = "<span class='iconfont icon-bofang'></span>"
                        }else{
                            _audio.play()
                            this.innerHTML = "<span class='iconfont icon-pause'></span>"
                        }
                        temp = !temp;
                        event.preventDefault()  //方法取消默认的行为
                    })

                    // // 滑动下一首
                    let temp1 = 0;
                    con_nextPlay.addEventListener("touchstart",function(e){
                        let timeStart = (new Date()).valueOf();
                        con_nextPlay.addEventListener("touchend",function(e){
                            let timeEnd = (new Date()).valueOf();
                            if(timeEnd - timeStart < 400 && timeEnd - timeStart > 150){
                                temp1++;
                                let nextPlay = 0;
                                if(idList.length - idList.indexOf(idList[item.index]) > temp1){
                                    nextPlay = idList.indexOf(idList[item.index]) + temp1;
                                }else{
                                    nextPlay = 0;
                                    temp1 = 0;
                                }
                                $.get(
                                    `http://localhost:3000/song/url?id=${idList[nextPlay]}`,
                                    function({data}){
                                        _audio.src = data[0].url;
                                        _audio.play();
                                    }
                                );
                                content.innerHTML = `
                                    <div class="control-content">
                                        <div class="con-img" >
                                            <img src="${imgList[nextPlay]}" alt="" style="animation: rotate 18s linear 0s infinite normal none running">
                                        </div>
                                        
                                        <div class="con-info">
                                            <div class="con-title">
                                                ${nameList[nextPlay]}
                                            </div>
                                            <div class="con-desc">
                                                滑动切换音乐
                                            </div>
                                        </div>
                                    </div>
                                    `
                                    control_a.href=`./play.html?id=${idList[nextPlay]}`
                                    // e.preventDefault();
                                }
                            // e.preventDefault();
                        })
                    })

                        let con_img = $(".con-img")[0].children[0];
                        _audio.addEventListener('ended',function(){
                            con_img.style.animation = '';  // 音乐播放完毕 图片停止旋转
                        })
                    }
                });
            // 监听播放 获取当前播放时间 给播放页面添加继续播放
            _audio.addEventListener('timeupdate',function(){
                window.playDate = _audio.currentTime;
                sessionStorage["playTime"] = playDate;
            });
        }
    )
}