#手机做游戏手柄：node+websocket+html5

#概述

node版的游戏控制器,手机通过浏览器访问由node在电脑上创建的服务器网页，使手机和电脑建立websocket连接。手机会把重力加速度的一些处理信息发给电脑，然后这些信息通过电脑端的node程序来模拟电脑按键，从而实现操控电脑游戏。

本程序不是做一个出色的游戏手柄而是通过做它来了解node+websocket+html5三者怎么整合使用。

##Build Setup

```bash
# Open a terminal and cd to project folder.

# Run npm install to install the required libraries
npm install
# Run node app.js to start the presentation
node app.js
# Open http://localhost:8080 on your computer and enter your pass key (by default it is “c“).
# Open http://<your computer’s local ip address> on your phone and enter the same pass key.
# Have fun!

```

#几个概念

+ html5:html标准，主要运行在浏览器上。在手机浏览器上发挥重要作用，它能读取手机的重力传感器、螺旋仪传感器数值。
+ websocket：一种全双工通信协议，在TCP协议上形成。它和语言、平台无关，只要遵循它的协议就能通信。它和html5有着千丝万缕的联系，在html家族中它和ajax有着同等的地位。

#引用库

程序很简单，主要功能现成的第三方库都实现了，程序仅粘合了几个库。用到的有

+ express
+ robotjs
+ socket.io


