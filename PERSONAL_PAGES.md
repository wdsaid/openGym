# openGym 个人版 · GitHub Pages

地址：https://wdsaid.github.io/openGym/

在 iPhone 的 Safari 中打开，点击分享，再选择“添加到主屏幕”。首次打开是空白记录，
可以创建自己的计划，也可以从设置导入已有备份。网页和计划内的动作素材会由应用缓存，
离线前先打开计划并等待素材加载完成。

## 数据与备份

训练、计划和体重保存在当前设备的网站存储里，不会提交到 GitHub，也不会自动同步到其他设备。
在“设置 → 数据与备份”导出 JSON，保存到“文件 → iCloud 云盘”。有自定义照片和视频时，
选择包含媒体的 ZIP 导出。清除网站数据、移除应用或换手机前先备份。
恢复备份会替换当前记录，请先导出当前数据。

## 部署

发布分支为 `codex/personal-pages`，工作流为 `.github/workflows/pages.yml`。
GitHub 仓库 Settings → Pages 的 Source 选择 GitHub Actions。
构建使用 `VITE_PERSONAL=1`；沿用浏览器本地存储，不初始化演示记录，不展示模拟 AI 教练。
Actions 会运行个人模式回归、构建前端、复制原项目的动作素材，再发布到 Pages。

本地构建：在 `frontend/` 运行 `npm ci` 和 `VITE_PERSONAL=1 npm run build`。
原项目：DuarteSantos8/openGym。沿用 AGPL 许可证和 NOTICE 中的第三方素材声明。
