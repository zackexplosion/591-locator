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

`forever start app.js`
