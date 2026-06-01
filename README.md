# 刘禹小朋友的泡泡乐园

一个手机优先的静态 H5 小游戏，适合直接发给微信好友打开。

## 运行

直接打开 [index.html](/Users/xujia/Projects/liuyu-bubble-garden/index.html)，或者在目录里起一个静态服务：

```bash
python3 -m http.server 8000
```

然后访问 `http://localhost:8000`。

## 玩法

- 点击泡泡，随机掉落恋爱小纸条
- 点满 `12` 个泡泡，解锁六一祝福卡片
- 点击“重新放一池泡泡”可以重新开始

## 后续可改

- 泡泡文案在 [script.js](/Users/xujia/Projects/liuyu-bubble-garden/script.js) 里的 `notes`
- 标题和结尾祝福在 [index.html](/Users/xujia/Projects/liuyu-bubble-garden/index.html)
- 结尾照片默认读取 `./assets/finale-photo.png`
- 你把想用的照片保存成 [assets/finale-photo.png](/Users/xujia/Projects/liuyu-bubble-garden/assets/finale-photo.png) 就会自动显示
- 长按蒲公英和电子烟花逻辑在 [script.js](/Users/xujia/Projects/liuyu-bubble-garden/script.js)
