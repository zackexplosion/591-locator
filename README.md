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
複製按下條件之後的第一個網址
![](http://i.imgur.com/9aCDl0F.png)

把網址加在啟動指令後面
`forever start app.js "https://rent.591.com.tw/home/search/rsList?is_new_list=1&type=1&kind=0&searchtype=1&region=1&rentprice=4,"`
