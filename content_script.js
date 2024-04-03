// content_script.js


function removeDuplicateParams(url) {
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    const uniqueParams = new URLSearchParams();

    for (const [key, value] of params.entries()) {
        if (!uniqueParams.has(key)) {
            uniqueParams.append(key, value);
        }
    }

    urlObj.search = uniqueParams.toString();
    return urlObj.toString();
}

function sendRPCUpdate(details, state, limage, startTime, buttons, ltext, simage, stext) {
    fetch('http://localhost:5000/update_rpc', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            details: details,
            state: state,
            limage: limage,
            startTime: startTime,
            buttons: buttons,
            ltext: ltext,
            simage: simage,
            stext: stext
        })
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log('Error:', error));
}

function sendRPCclear {
    fetch('http://localhost:5000/clear_rpc', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log('Error:', error));
}


function updateRPC() {
    var details,
    state,
    limage,
    ltext,
    simage,
    stext;
    var host = window.location.hostname;
    var url = window.location.href;
    //startTime = (Math.floor(Date.now() / 1000)).toString();
    var buttons = '[]';

    if (host === "hianime.to") {
        details = document.querySelector("#ani_detail > div > div > div.anis-watch-wrap > div.anis-watch-detail > div > div.anisc-detail > h2 > a").textContent + "を視聴中";
        state = removeDuplicateParams(url);
        limage = document.querySelector("#ani_detail > div > div > div.anis-watch-wrap > div.anis-watch-detail > div > div.anisc-poster > div > img").src;
        ltext = document.querySelector("#ani_detail > div > div > div.anis-watch-wrap > div.anis-watch-detail > div > div.anisc-detail > h2 > a").textContent;
        buttons = `[{"label": "視聴する", "url": "${removeDuplicateParams(window.location.href)}"}]`;
    } else if (host === "diep.io") {
        details = "diep.ioをプレイ中";
        state = localStorage.getItem("cscore") + " | " + localStorage.getItem("ctank");
        //alert(url);
        limage = "https://diep.io/be87e5a9f24931a70069.png"
            ltext = details;
        buttons = `[{"label": "プレイする", "url": removeDuplicateParams(window.location.href)}]`;
    } else if (host === "www.youtube.com" && url.includes("/watch")) {
        var intervalId = setInterval(function () {
            var element = document.querySelector("#title > h1 > yt-formatted-string");
            if (element) {
                clearInterval(intervalId);
            }
        }, 5000);
        details = "YouTubeを視聴中 | " + document.querySelector("#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > div.ytp-time-display.notranslate > span:nth-child(2) > span.ytp-time-current").textContent + " / " + document.querySelector("#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > div.ytp-time-display.notranslate > span:nth-child(2) > span.ytp-time-duration").textContent;
        state = document.querySelector("#title > h1 > yt-formatted-string").textContent + " | " + document.querySelector("#text > a").textContent;
        limage = "https://www.youtube.com/s/desktop/accca349/img/favicon_144x144.png";
        simage = document.evaluate('/html/body/ytd-app/div[1]/ytd-page-manager/ytd-watch-flexy/div[5]/div[1]/div/div[2]/ytd-watch-metadata/div/div[2]/div[1]/ytd-video-owner-renderer/a/yt-img-shadow/img',document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0).src;
        stext = document.querySelector("#text > a").textContent;
        ltext = "YouTube"
            buttons = `[{"label": "視聴する", "url": "${removeDuplicateParams(window.location.href)}"}]`;
    } else if (host === "www.nicovideo.jp" && url.includes("/watch")) {
        var intervalId = setInterval(function () {
            var element = document.querySelector("#js-app > div > div > div.BaseLayout-contents > div.WatchAppContainer-main > div.HeaderContainer > div.HeaderContainer-topArea > div.HeaderContainer-topAreaLeft > h1");
            if (element) {
                clearInterval(intervalId);
            }
        }, 5000);
        details = "ニコニコ動画を視聴中 | " + document.querySelector("#js-app > div > div > div.BaseLayout-contents > div.WatchAppContainer-main > div.MainContainer > div.MainContainer-player > div.PlayerContainer > div.ControllerBoxContainer > div.ControllerContainer > div > div.ControllerContainer-area.ControllerContainer-centerArea > div").textContent;
        state = document.querySelector("#js-app > div > div > div.BaseLayout-contents > div.WatchAppContainer-main > div.HeaderContainer > div.HeaderContainer-topArea > div.HeaderContainer-topAreaLeft > h1").textContent + " | " + document.querySelector("#js-app > div > div > div.BaseLayout-contents > div.WatchAppContainer-main > div.HeaderContainer > div.Grid.HeaderContainer-row > div.GridCell.VideoOwnerInfo-gridCell > div > div.VideoOwnerInfo-links > div.VideoOwnerInfo-pageLinks > a").textContent;
        limage = "https://resource.video.nimg.jp/web/images/favicon/144.png";
        simage = document.querySelector("#js-app > div > div > div.BaseLayout-contents > div.WatchAppContainer-main > div.HeaderContainer > div.Grid.HeaderContainer-row > div.GridCell.VideoOwnerInfo-gridCell > div > div.VideoOwnerInfo-iconWrapper > div > a > img").src;
        stext = document.querySelector("#js-app > div > div > div.BaseLayout-contents > div.WatchAppContainer-main > div.HeaderContainer > div.Grid.HeaderContainer-row > div.GridCell.VideoOwnerInfo-gridCell > div > div.VideoOwnerInfo-links > div.VideoOwnerInfo-pageLinks > a").textContent;
        ltext = "ニコニコ動画"
            buttons = `[{"label": "視聴する", "url": "${removeDuplicateParams(window.location.href)}"}]`;
    }
    sendRPCUpdate(details, state, limage, startTime, buttons, ltext, simage, stext);
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === "executeFunction") {
        sendRPCclear();
    }
});

var startTime;
window.addEventListener('load', function () {
    startTime = (Math.floor(Date.now() / 1000)).toString();
    updateRPC();
});
window.addEventListener('hashchange', function () {
    startTime = (Math.floor(Date.now() / 1000)).toString();
    updateRPC();
});

setInterval(updateRPC, 5000);

/*メモ
2024/03/30
4:URLのパラメーターの重複を削除。
19:サーバーにrpcの更新内容をリクエスト。
41:更新内容をサイトごとに設定する関数。
53:頻繁にリンクが変わるので注意、時間取得はプレーヤーが埋め込まれてるので難しい（？）重要でもないので後回し。
59:proxyがアンチチートなどで利用できなくなった場合使用不可になる、別のアプローチと言うよりはアンチチートを回避したほうが早いだろう。パーティー招待リンクをボタンのurlに使用したかったが方法がわからず断念。
66:全体的に適当に作られている、今後のYouTubeのアップデートで使用不可になる可能性大。また再生時間はプレーヤーにフォーカスしないと更新されないので別のアプローチ(ytplayer)を使用したいがコードを壊したくないので断念。(投稿者アイコンも雑に取得しているため失敗するかも？←xpathを使うことで回避)
80:上のYouTube用のコードを流用したが、再生時間などは正常に動作する。こちらも今後のアップデートで使用不可になる可能性大。
98:background.jsからタブイベントの発火を受け取り、rpcの更新を行う。
105,109:タブの更新、ロード時にrpcを更新。
114:setIntervalでrpcの更新をしている、レート制限がわからないが、一秒でも可能？もう少し長くしたほうがいいと思うがrpcの更新程度なら大丈夫だろう。
 */
