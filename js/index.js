window.onload = function(){
    let swiper = $(".swiper")[0];
    let dislist = $(".dis-list")[0];
    // banner
    $.get(
        "http://localhost:3000/banner",
        function({ banners }){
            let swiperWrapper = "";
            banners.forEach((item,index) =>{
                swiperWrapper += `
                <div class="swiper-slide">
                    <img class="banner-img" src='${item.imageUrl}' />
                    <span class="banner-img-type" style="background-color: ${item.titleColor};">${item.typeTitle}</span>
                </div>
                `;
            });
            swiper.innerHTML = `<div class="swiper-container">
                <div class="swiper-wrapper">
                    ${swiperWrapper}
                </div>
                <!-- Add Pagination -->
                <div class="swiper-pagination"></div>
                </div>` ;
            var swiperFun = new Swiper('.swiper-container', {
                autoplay: 3000,
                loop:true,
                autoplayDisableOnInteraction:false,
                pagination: '.swiper-pagination',
                paginationClickable: true
            });
            // console.log(banners)
        }
    )

    // nav-每日推荐time
    let nav_time = $(".nav .time")[0];
    let new_nav_time = new Date();
    nav_time.innerHTML = new_nav_time.getDate();


    // discover
    $.get(
        'http://localhost:3000/personalized',
        function({ result }){
            console.log(result)
            dislist.innerHTML = "";
            window.song_sheet = result;
            result.forEach((item,index) =>{
                if(index < 6){
                    dislist.innerHTML += 
                    `<li class="dis-item">
                            <a href="./src/song_sheet.html">
                                <div class="dis-img">
                                    <img src="${item.picUrl}" alt="">
                                </div>
                            </a>
                            <div class="desc">${item.name}</div>
                    </li>`
                }
            })
            for(let i = 0; i < dislist.children.length; i++){
                dislist.children[i].onclick = function(){
                    window.song_sheet_img = result[i].picUrl;
                    window.song_sheet_name = result[i].name;
                    window.song_sheet_id = result[i].id;
                    sessionStorage["songSheetImg"] = song_sheet_img;
                    sessionStorage["songSheetName"] = song_sheet_name;
                    sessionStorage["songSheetId"] = song_sheet_id;
                    console.log(result[i])
                }
            }
        }
    )
}