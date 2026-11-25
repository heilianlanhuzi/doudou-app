# 豆豆的家（Doudou App）

这是一个静态网页 PWA 原型，面向 iPhone Safari 使用。GitHub 仓库保持 Private。

## 当前原型可用
- 首页、底部导航与弹窗交互
- 闹钟时间和启用开关的本地保存
- 豆豆点击反馈、摸摸/陪玩/喂食/陪睡等演示反馈
- 房间主题入口（目前只有温馨卧室选项）
- PWA manifest、Service Worker 离线缓存基础
- iOS 安全区与窄屏布局适配

## 尚未实现 / 仅演示
- 当前房间 CSS 场景和狗狗 Emoji 仍是占位；**正式豆豆角色母版、卧室和家具原始美术资源尚未接入**。接入必须使用用户此前确认的原始素材，不得重新生成、改造或替换豆豆。
- 闹钟只保存时间与开关，不会在 iOS 后台准时响铃；没有系统通知、后台音频或可靠唤醒能力。
- 家具拖拽、摆放保存、房间编辑和成长系统尚未实现。
- 互动按钮只改变页面文案，不包含真实动画、音效或游戏状态。

## Cloudflare Pages 免费托管设置
仓库无需公开。用 Cloudflare Dashboard 连接 GitHub 私有仓库：
1. Workers & Pages → Create → Pages → Connect to Git.
2. 授权 Cloudflare 访问此私有仓库，并选择 `heilianlanhuzi/doudou-app` 的 `main` 分支。
3. Framework preset 选 **None**。
4. Build command 留空；Build output directory 填 `.`；Root directory 留空。
5. 保存并部署。之后推送到 `main` 会自动触发部署。

当前代码不需要 npm 安装或构建步骤。Cloudflare 项目创建、GitHub 授权及首次部署仍需在用户的 Cloudflare 账号内完成。

## iPhone Safari 验收
部署成功后，在 iPhone Safari 打开 Cloudflare Pages 地址，检查首屏、底部导航、闹钟时间保存、开关状态、豆豆互动和刷新后的本地状态。通过分享菜单可添加到主屏幕。
