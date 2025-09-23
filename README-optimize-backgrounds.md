# 背景图片优化脚本使用说明

## 功能特性

- 🖼️ **批量处理**: 自动处理 `content/_shared/backgrounds` 目录下的所有图片
- 📏 **智能缩放**: 自动调整图片尺寸到 1920x1080 以内，保持宽高比
- 🗜️ **格式转换**: 生成 WebP 格式以获得更好的压缩率
- 💾 **安全备份**: 自动备份原始文件到 `original` 目录
- 📊 **详细统计**: 显示压缩率和文件大小变化
- 🎨 **质量控制**: WebP 质量 85%，JPEG 质量 90%

## 安装依赖

### macOS
```bash
# 安装 ImageMagick
brew install imagemagick

# 可选：安装 WebP 工具获得更好的 WebP 质量
brew install webp
```

### Ubuntu/Debian
```bash
# 安装 ImageMagick
sudo apt-get install imagemagick

# 可选：安装 WebP 工具
sudo apt-get install webp
```

## 使用方法

### 方法 1: 使用 npm 脚本（推荐）

```bash
# 使用 Node.js 版本
npm run optimize-backgrounds

# 使用 Shell 脚本版本
npm run optimize-backgrounds-sh
```

### 方法 2: 直接运行脚本

```bash
# Node.js 版本
node scripts/optimize-backgrounds.js

# Shell 脚本版本
bash scripts/optimize-backgrounds.sh
```

## 输出结构

运行脚本后，会在 `content/_shared/backgrounds` 目录下创建以下结构：

```
content/_shared/backgrounds/
├── original/              # 原始文件备份
│   ├── 20250923-111705.jpeg
│   ├── investment-tech.webp
│   └── ...
├── optimized/             # 优化后的文件
│   ├── 20250923-111705.webp          # WebP 版本
│   ├── 20250923-111705_optimized.jpeg # 优化的原格式版本
│   ├── investment-tech.webp
│   ├── investment-tech_optimized.webp
│   └── ...
├── 20250923-111705.jpeg   # 原始文件（保持不变）
├── investment-tech.webp
└── ...
```

## 配置选项

可以在脚本中修改以下配置：

```javascript
const CONFIG = {
  maxWidth: 1920,        // 最大宽度
  maxHeight: 1080,       // 最大高度
  webpQuality: 85,       // WebP 质量 (0-100)
  jpegQuality: 90,       // JPEG 质量 (0-100)
};
```

## 示例输出

```
🚀 开始优化背景图片...

✅ ImageMagick 已安装
📁 创建目录: content/_shared/backgrounds/optimized
📁 创建目录: content/_shared/backgrounds/original
📸 找到 10 个图片文件

🔄 处理: 20250923-111705.jpeg
   原始尺寸: 2560x1440
   原始大小: 2.34 MB
   原始格式: jpeg
   ✅ 已备份到: 20250923-111705.jpeg
   📏 调整尺寸到: 1920x1080
   ✅ 优化完成: 0.85 MB
   📉 压缩率: 63.7%

📊 优化总结:
   ✅ 成功处理: 10/10 个文件
   📁 原始总大小: 25.67 MB
   📁 优化后总大小: 8.92 MB
   📉 总压缩率: 65.2%

📂 文件位置:
   原始文件备份: content/_shared/backgrounds/original
   优化后文件: content/_shared/backgrounds/optimized
```

## 注意事项

1. **备份安全**: 原始文件会自动备份到 `original` 目录，不会丢失
2. **格式支持**: 支持 JPG、JPEG、PNG、WebP 格式
3. **质量平衡**: 默认设置在文件大小和图片质量之间取得平衡
4. **批量处理**: 一次性处理所有图片，无需手动逐个处理

## 故障排除

### ImageMagick 未安装
```
❌ 需要安装 ImageMagick
macOS: brew install imagemagick
Ubuntu: sudo apt-get install imagemagick
```

### 权限问题
```bash
chmod +x scripts/optimize-backgrounds.sh
```

### 目录不存在
确保 `content/_shared/backgrounds` 目录存在且包含图片文件。