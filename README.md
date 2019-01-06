# 疯狂拼音波场首发

这次参与大赛的项目有两个相互结合产品：

-《疯狂拼音》小游戏:  http://www.crazypinyin.com
  
-《疯狂拼音广告主管理后台》:  https://qingyeyin.github.io/CrazyPinyinTRON/

《疯狂拼音》使用Cocos Creator开发。《疯狂拼音广告主管理后台》使用React进行开。两者全部基于TRON公链实现，使用TRX作为游戏内的激励。得益于TRON的高性能，游戏体验得到大幅加强。

# 游戏理念
2018可谓是区块链游戏开启先河的一年。游戏被公认为是区块链最先应用的场景。

经过一年的发展，几大类区块链游戏也孕育而生，已经落地的区块链游戏产品有博彩类、资金盘类，宠物养成类、卡牌类、沙盒类、放置类和策略类等等。

除去博彩类和资金盘类的游戏，其它品类游戏都会强调游戏资产上链，以游戏资产所有权、可流通性、可复用性和可升值性作为主要卖点。

关于资产上链是否有必要，是否真的具有价值等争议，本文不做讨论。本文只想说明的是并不是所有类型的游戏都是强资产的、或者具有可以资产化的道具。而且有些游戏与道具的自由交易可流通本身就是有冲突的（比如MMO游戏）。

具有资产的游戏类型，通常的都是中重度游戏，其玩家对应的也都是中重度游戏玩家。这类玩家相比轻度玩家更加熟悉游戏产品，熟悉各类游戏词汇和游戏术语；他们倾向于有深度和复杂的游戏，单次游戏时间较长，游戏次数较多。但结合整个游戏玩家基数来看，中重度玩家还是处于少数。目前币圈和链圈用户很多并不玩游戏，也不了解游戏，他们与中重度游戏玩家并不重合，想靠币圈和链圈用户来推动区块链游戏发展恐怕是个很长期的过程。

反观小游戏，与中重度游戏相比具有显著的碎片化的特点。小游戏用户非常广泛（包括老人、小孩在内的各类人群都可以参与）、上手简单、不需要投入大量的游戏时间，社交传播属性强，更方便普及到币圈和链圈用户。这点从国内的微信小游戏，和在App Store/Google Play上霸榜的Voodoo小游戏可以得到印证。

基于以上思考，本项目设计了这套《小游戏推广系统》系统。该系统尝试设计一个简单的通证经济模型并利用区块链技术在游戏玩家、游戏开发商和广告主之间建立紧密联系。



# 《疯狂拼音》
对玩家而言，他们通过玩游戏获得良好的体验和实际的TRX奖励，TRX奖励来自奖池。
游戏内设置有体力机制已控制玩家游戏进度的控制，体力机制保证了《疯狂拼音》这类小游戏的自传播能力。玩家每开始一局比赛需要消耗1点体力，待体力不足时，玩家需要花时间等待体力恢复方能继续游戏。
如果玩家相想继续体验游戏，也可以选择使用分享按钮将游戏分享给朋友，瞬间完成体力恢复。
游戏内设有金币，金币可用用来购买提示，玩家如果金币不足，可用使用TRX进行充值。玩家充值金额的90%也会进入TRX奖池。

对于广告主（想投放广告获得流量的开发者也是广告主）而言, 目前链游戏圈并没有成熟的流量获取方式和流量获取平台。圈内各种个样的社群（如微信、qq、Telegram、Discord等等）的群体也很多重合且数量有限。
小游戏是快速接近广大玩家的游戏类型，有助与链游向普通用户的普及。
广告主可以在智能合约内投入TRX购买游戏内广告，投入TRX的90%将进入奖池，供玩家进行游戏时得到TRX奖励。玩家没结束一局挑战后，可以通“原地复活”和“看广告得双倍奖励”等游戏规则，让玩家去主动点击并观看广告主投放的广告。

对与游戏开发商而言，可用基于这套《小游戏推广系统》研发更好玩的小游戏，获得固定奖池收益。
![](https://github.com/qingyeyin/CrazyPinyinTRON/blob/master/screenshots/1.png)
![](https://github.com/qingyeyin/CrazyPinyinTRON/blob/master/screenshots/2.png)
![](https://github.com/qingyeyin/CrazyPinyinTRON/blob/master/screenshots/3.png)
![](https://github.com/qingyeyin/CrazyPinyinTRON/blob/master/screenshots/4.png)

总结如下：
- 整个系统维护一个TRX奖池
- 玩家通过玩游戏获得良好的体验和实际的TRX奖励
- 广告主可以在智能合约内投入TRX购买游戏内广告，在游戏内获得优质流量
- 游戏研发商通过提供游戏产品和游戏服务获得固定比例的奖池分成

上述规则全部上链，体现在智能合约中。保证了系统规则的公开、公正和透明。游戏玩家获得的TRX奖励、游戏研发商分配的奖池收益、广告主的广告投放效果等数据完全记录在链上.

# 《广告主管理后台》
后台专门广告主准备，可用在后台购买广告，查看并分析广告数据等。
![](https://github.com/qingyeyin/CrazyPinyinTRON/blob/master/screenshots/5.png)
![](https://github.com/qingyeyin/CrazyPinyinTRON/blob/master/screenshots/6.png)
![](https://github.com/qingyeyin/CrazyPinyinTRON/blob/master/screenshots/7.png)
