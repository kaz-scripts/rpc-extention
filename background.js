
// content_script.js

function clearRPC() {
    fetch('http://localhost:5000/clear_rpc', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
}

function clear(activeInfo) {
	    // アクティブなタブの情報を取得
    chrome.tabs.get(activeInfo.tabId, function(tab) {
        const urls =['hianime.to','diep.io','www.youtube.com','www.nicovideo.jp'];
		if (!urls.includes(new URL(tab.url).hostname)) {
			clearRPC(tab.id, null, tab);
		}
		else {
			sendMessageToContentScript({action: "executeFunction"});
		}
    });
}

// タブのアクティブ状態が変更されたときに呼び出されるリスナーを追加
chrome.tabs.onActivated.addListener(function(activeInfo) {
clear(activeInfo);
});

chrome.windows.onRemoved.addListener(function(activeInfo) {
clear(activeInfo);
});

function sendMessageToContentScript(message) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message);
    });
}

/*
4:rpcのクリアのリクエスト用の関数
16:4の条件分岐。いらぬサイトではクリアする。
30,34:content scriptではタブのイベントを監視できないためbackgroundで監視。
38:発火したらcontent scriptにメッセージを送信。
*/