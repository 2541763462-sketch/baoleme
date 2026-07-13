# 饱了么 BaoLeMe 网站版

「饱了么」是一个模拟真实外卖体验的网站。用户可以浏览外卖首页、进入商家、加购商品、领取优惠券、提交虚拟订单，并在配送页看到骑手一路移动，最终发现外卖“永远留在路上”。

## 运行

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

构建产物位于 `dist/`。

## GitHub Pages

推送到 `main` 分支后，`.github/workflows/deploy-pages.yml` 会自动构建并发布网站。
仓库的 Pages 来源需要设置为 **GitHub Actions**。

## 说明

- 网站版不接入真实支付、真实地图、真实配送。
- 数据均为前端 Mock。
- 页面采用移动端优先设计，在桌面浏览器中以手机宽度展示，尽力还原外卖 App 信息密度与视觉体验。
