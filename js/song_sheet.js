window.onload = function(){
    // 获取元素
    let title_back = $(".title-back")[0];
    let contentBg = $(".content-background")[0];
    let content_img = $(".content-img img")[0];
    let more_name = $(".more-name .name")[0];
    let more_words = $(".more-words .words")[0];
    let more_author_img = $(".more-author .img")[0];
    let more_author_name = $(".more-author .name")[0];
    let bottom_str1 = $(".commentCount")[0];
    let bottom_str2 = $(".shareCount")[0];
    let content_img_num = $(".content-top .times .num")[0]
    console.log(bottom_str1)

    // 退回到上一页
    title_back.onclick = function(){
        window.history.back();  //返回上一页
    }

    // 设置背景托盘
    contentBg.style.background = `url(${sessionStorage['songSheetImg']}) no-repeat center top`;
    contentBg.style.backgroundSize = `100% auto`;
    // 设置img下的照片
    content_img.src = sessionStorage["songSheetImg"];
    // 歌单名称
    more_name.innerHTML = sessionStorage["songSheetName"];

    // 获取歌单详情
    $.get(
        `http://localhost:3000/playlist/detail?id=${sessionStorage["songSheetId"]}`,
        function({playlist}){
            console.log(playlist.playCount)
            more_words.innerHTML = playlist.description;
            more_author_img.innerHTML = `<img src="${playlist.creator.backgroundUrl}" alt="">`;
            more_author_name.innerHTML = playlist.creator.nickname + " >";
            bottom_str1.innerHTML = playlist.commentCount;
            bottom_str2.innerHTML = playlist.shareCount;
            content_img_num.innerHTML = parseInt(playlist.playCount / 10000) + "万"
        }
    )
}