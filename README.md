# 591-locator
使用 Slack 通知您最新的物件!

# 準備工作

先弄好 [Slack Team](http://www.playpcesor.com/2015/06/slack.html) 並且申請 [incoming-webhooks](https://slack.com/apps/A0F7XDUAZ-incoming-webhooks)

## Node.js
開發用 5.4 的版本，不過應該 4.0 以上都OK

# 安裝

指令

`npm install`

複製設定檔，並且修改內容

`cp config.json-sample config.json`

# 啟動
建議用 [forever](https://github.com/foreverjs/forever) 之類的套件

## 設定搜尋條件

目前只支援舊版，請到這邊XD https://www.591.com.tw/

送出搜尋條件後，複製 `index.php` 開頭這個網址

![](http://i.imgur.com/RRtrDvH.png)

把網址加在啟動指令後面
`forever start app.js "https://rent.591.com.tw/index.php?module=search&action=rslist&is_new_list=1&type=1&searchtype=1&region=1&orderType=desc&listview=img&rentprice=,20000&section=3,5"`
