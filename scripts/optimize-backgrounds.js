#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置选项
const CONFIG = {
  // 输入目录
  inputDir: path.join(path.dirname(__dirname), 'content/_shared/backgrounds'),
  // 输出目录
  outputDir: path.join(path.dirname(__dirname), 'content/_shared/backgrounds/optimized'),
  // 备份目录
  backupDir: path.join(path.dirname(__dirname), 'content/_shared/backgrounds/original'),
  // 最大宽度
  maxWidth: 1920,
  // 最大高度
  maxHeight: 1080,
  // WebP质量 (0-100)
  webpQuality: 85,
  // JPEG质量 (0-100)
  jpegQuality: 90,
  // 支持的图片格式
  supportedFormats: ['.jpg', '.jpeg', '.png', '.webp'],
};

// 检查是否安装了必要的工具
function checkDependencies() {
  try {
    execSync('which convert', { stdio: 'ignore' });
    console.log('✅ ImageMagick 已安装');
  } catch (error) {
    console.error('❌ 需要安装 ImageMagick');
    console.error('macOS: brew install imagemagick');
    console.error('Ubuntu: sudo apt-get install imagemagick');
    process.exit(1);
  }
}

// 创建必要的目录
function createDirectories() {
  [CONFIG.outputDir, CONFIG.backupDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 创建目录: ${dir}`);
    }
  });
}

// 获取图片信息
function getImageInfo(filePath) {
  try {
    const output = execSync(`identify -format "%w %h %m" "${filePath}"`, { encoding: 'utf8' });
    const [width, height, format] = output.trim().split(' ');
    return {
      width: parseInt(width),
      height: parseInt(height),
      format: format.toLowerCase(),
      size: fs.statSync(filePath).size
    };
  } catch (error) {
    console.error(`❌ 无法获取图片信息: ${filePath}`);
    return null;
  }
}

// 计算新的尺寸（保持宽高比）
function calculateNewDimensions(width, height, maxWidth, maxHeight) {
  if (width <= maxWidth && height <= maxHeight) {
    return { width, height, needsResize: false };
  }

  const widthRatio = maxWidth / width;
  const heightRatio = maxHeight / height;
  const ratio = Math.min(widthRatio, heightRatio);

  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
    needsResize: true
  };
}

// 优化单个图片
function optimizeImage(inputPath, outputPath, backupPath) {
  const fileName = path.basename(inputPath);
  const fileExt = path.extname(inputPath).toLowerCase();
  
  console.log(`\n🔄 处理: ${fileName}`);

  // 获取图片信息
  const imageInfo = getImageInfo(inputPath);
  if (!imageInfo) {
    return false;
  }

  console.log(`   原始尺寸: ${imageInfo.width}x${imageInfo.height}`);
  console.log(`   原始大小: ${(imageInfo.size / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   原始格式: ${imageInfo.format}`);

  // 备份原始文件
  fs.copyFileSync(inputPath, backupPath);
  console.log(`   ✅ 已备份到: ${path.basename(backupPath)}`);

  // 计算新尺寸
  const newDimensions = calculateNewDimensions(
    imageInfo.width,
    imageInfo.height,
    CONFIG.maxWidth,
    CONFIG.maxHeight
  );

  // 构建 ImageMagick 命令
  let command = `convert "${inputPath}"`;
  
  // 如果需要调整大小
  if (newDimensions.needsResize) {
    command += ` -resize ${newDimensions.width}x${newDimensions.height}`;
    console.log(`   📏 调整尺寸到: ${newDimensions.width}x${newDimensions.height}`);
  }

  // 设置质量和格式
  const outputExt = path.extname(outputPath).toLowerCase();
  if (outputExt === '.webp') {
    command += ` -quality ${CONFIG.webpQuality}`;
  } else if (outputExt === '.jpg' || outputExt === '.jpeg') {
    command += ` -quality ${CONFIG.jpegQuality}`;
  }

  // 添加优化选项
  command += ` -strip`; // 移除元数据
  command += ` -interlace Plane`; // 渐进式加载
  
  command += ` "${outputPath}"`;

  try {
    execSync(command, { stdio: 'ignore' });
    
    // 获取优化后的文件大小
    const optimizedSize = fs.statSync(outputPath).size;
    const compressionRatio = ((imageInfo.size - optimizedSize) / imageInfo.size * 100).toFixed(1);
    
    console.log(`   ✅ 优化完成: ${(optimizedSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   📉 压缩率: ${compressionRatio}%`);
    
    return true;
  } catch (error) {
    console.error(`   ❌ 优化失败: ${error.message}`);
    return false;
  }
}

// 主函数
function main() {
  console.log('🚀 开始优化背景图片...\n');

  // 检查依赖
  checkDependencies();

  // 创建目录
  createDirectories();

  // 获取所有图片文件
  const files = fs.readdirSync(CONFIG.inputDir)
    .filter(file => {
      const ext = path.extname(file).toLowerCase();
      return CONFIG.supportedFormats.includes(ext);
    })
    .filter(file => {
      // 跳过已经在子目录中的文件
      const filePath = path.join(CONFIG.inputDir, file);
      return fs.statSync(filePath).isFile();
    });

  if (files.length === 0) {
    console.log('❌ 没有找到支持的图片文件');
    return;
  }

  console.log(`📸 找到 ${files.length} 个图片文件`);

  let successCount = 0;
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;

  // 处理每个文件
  files.forEach(file => {
    const inputPath = path.join(CONFIG.inputDir, file);
    const fileName = path.parse(file).name;
    const originalSize = fs.statSync(inputPath).size;
    totalOriginalSize += originalSize;

    // 生成输出文件路径（WebP格式）
    const webpOutputPath = path.join(CONFIG.outputDir, `${fileName}.webp`);
    const backupPath = path.join(CONFIG.backupDir, file);

    if (optimizeImage(inputPath, webpOutputPath, backupPath)) {
      successCount++;
      totalOptimizedSize += fs.statSync(webpOutputPath).size;
    }

    // 如果原文件不是WebP，也生成一个优化的原格式版本
    const originalExt = path.extname(file).toLowerCase();
    if (originalExt !== '.webp') {
      const optimizedOriginalPath = path.join(CONFIG.outputDir, `${fileName}_optimized${originalExt}`);
      optimizeImage(inputPath, optimizedOriginalPath, backupPath);
    }
  });

  // 输出总结
  console.log('\n📊 优化总结:');
  console.log(`   ✅ 成功处理: ${successCount}/${files.length} 个文件`);
  console.log(`   📁 原始总大小: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   📁 优化后总大小: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   📉 总压缩率: ${((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100).toFixed(1)}%`);
  console.log(`\n📂 文件位置:`);
  console.log(`   原始文件备份: ${CONFIG.backupDir}`);
  console.log(`   优化后文件: ${CONFIG.outputDir}`);
}

// 运行脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { optimizeImage, getImageInfo, calculateNewDimensions };