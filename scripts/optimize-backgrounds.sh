#!/bin/bash

# 背景图片优化脚本
# 使用 ImageMagick 和 cwebp 优化图片

set -e

# 配置
INPUT_DIR="content/_shared/backgrounds"
OUTPUT_DIR="content/_shared/backgrounds/optimized"
BACKUP_DIR="content/_shared/backgrounds/original"
MAX_WIDTH=1920
MAX_HEIGHT=1080
WEBP_QUALITY=85
JPEG_QUALITY=90

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# 检查依赖
check_dependencies() {
    print_message $BLUE "🔍 检查依赖..."
    
    if ! command -v convert &> /dev/null; then
        print_message $RED "❌ ImageMagick 未安装"
        print_message $YELLOW "安装方法:"
        print_message $YELLOW "  macOS: brew install imagemagick"
        print_message $YELLOW "  Ubuntu: sudo apt-get install imagemagick"
        exit 1
    fi
    
    if ! command -v cwebp &> /dev/null; then
        print_message $YELLOW "⚠️  cwebp 未安装，将使用 ImageMagick 转换 WebP"
        print_message $YELLOW "安装方法:"
        print_message $YELLOW "  macOS: brew install webp"
        print_message $YELLOW "  Ubuntu: sudo apt-get install webp"
        USE_CWEBP=false
    else
        USE_CWEBP=true
    fi
    
    print_message $GREEN "✅ 依赖检查完成"
}

# 创建目录
create_directories() {
    print_message $BLUE "📁 创建目录..."
    mkdir -p "$OUTPUT_DIR"
    mkdir -p "$BACKUP_DIR"
    print_message $GREEN "✅ 目录创建完成"
}

# 获取图片信息
get_image_info() {
    local file_path=$1
    identify -format "%w %h %m %b" "$file_path" 2>/dev/null || echo "0 0 UNKNOWN 0"
}

# 优化单个图片
optimize_image() {
    local input_file=$1
    local filename=$(basename "$input_file")
    local name_without_ext="${filename%.*}"
    local ext="${filename##*.}"
    
    print_message $BLUE "\n🔄 处理: $filename"
    
    # 获取图片信息
    local info=$(get_image_info "$input_file")
    local width=$(echo $info | cut -d' ' -f1)
    local height=$(echo $info | cut -d' ' -f2)
    local format=$(echo $info | cut -d' ' -f3)
    local size=$(echo $info | cut -d' ' -f4)
    
    if [ "$width" = "0" ]; then
        print_message $RED "   ❌ 无法读取图片信息"
        return 1
    fi
    
    print_message $YELLOW "   原始: ${width}x${height}, ${format}, ${size}"
    
    # 备份原始文件
    cp "$input_file" "$BACKUP_DIR/"
    print_message $GREEN "   ✅ 已备份"
    
    # 计算新尺寸
    local new_width=$width
    local new_height=$height
    local needs_resize=false
    
    if [ $width -gt $MAX_WIDTH ] || [ $height -gt $MAX_HEIGHT ]; then
        local width_ratio=$(echo "scale=4; $MAX_WIDTH / $width" | bc -l)
        local height_ratio=$(echo "scale=4; $MAX_HEIGHT / $height" | bc -l)
        
        # 选择较小的比例以保持宽高比
        local ratio
        if (( $(echo "$width_ratio < $height_ratio" | bc -l) )); then
            ratio=$width_ratio
        else
            ratio=$height_ratio
        fi
        
        new_width=$(echo "$width * $ratio / 1" | bc)
        new_height=$(echo "$height * $ratio / 1" | bc)
        needs_resize=true
        
        print_message $YELLOW "   📏 调整尺寸到: ${new_width}x${new_height}"
    fi
    
    # 生成优化的 JPEG/PNG 版本
    local optimized_original="$OUTPUT_DIR/${name_without_ext}_optimized.${ext,,}"
    local convert_cmd="convert \"$input_file\""
    
    if [ "$needs_resize" = true ]; then
        convert_cmd="$convert_cmd -resize ${new_width}x${new_height}"
    fi
    
    convert_cmd="$convert_cmd -strip -interlace Plane -quality $JPEG_QUALITY \"$optimized_original\""
    
    if eval $convert_cmd; then
        local optimized_size=$(get_image_info "$optimized_original" | cut -d' ' -f4)
        print_message $GREEN "   ✅ 优化版本: $optimized_size"
    else
        print_message $RED "   ❌ 优化失败"
    fi
    
    # 生成 WebP 版本
    local webp_output="$OUTPUT_DIR/${name_without_ext}.webp"
    
    if [ "$USE_CWEBP" = true ]; then
        # 使用 cwebp
        local temp_file="/tmp/temp_${name_without_ext}.png"
        
        local cwebp_cmd="convert \"$input_file\""
        if [ "$needs_resize" = true ]; then
            cwebp_cmd="$cwebp_cmd -resize ${new_width}x${new_height}"
        fi
        cwebp_cmd="$cwebp_cmd -strip \"$temp_file\""
        
        if eval $cwebp_cmd; then
            if cwebp -q $WEBP_QUALITY "$temp_file" -o "$webp_output"; then
                local webp_size=$(get_image_info "$webp_output" | cut -d' ' -f4)
                print_message $GREEN "   ✅ WebP版本: $webp_size"
            else
                print_message $RED "   ❌ WebP转换失败"
            fi
            rm -f "$temp_file"
        fi
    else
        # 使用 ImageMagick
        local webp_cmd="convert \"$input_file\""
        if [ "$needs_resize" = true ]; then
            webp_cmd="$webp_cmd -resize ${new_width}x${new_height}"
        fi
        webp_cmd="$webp_cmd -strip -quality $WEBP_QUALITY \"$webp_output\""
        
        if eval $webp_cmd; then
            local webp_size=$(get_image_info "$webp_output" | cut -d' ' -f4)
            print_message $GREEN "   ✅ WebP版本: $webp_size"
        else
            print_message $RED "   ❌ WebP转换失败"
        fi
    fi
}

# 主函数
main() {
    print_message $GREEN "🚀 开始优化背景图片..."
    
    # 检查依赖
    check_dependencies
    
    # 创建目录
    create_directories
    
    # 检查输入目录
    if [ ! -d "$INPUT_DIR" ]; then
        print_message $RED "❌ 输入目录不存在: $INPUT_DIR"
        exit 1
    fi
    
    # 查找图片文件
    local image_files=()
    while IFS= read -r -d '' file; do
        image_files+=("$file")
    done < <(find "$INPUT_DIR" -maxdepth 1 -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.webp" \) -print0)
    
    if [ ${#image_files[@]} -eq 0 ]; then
        print_message $RED "❌ 没有找到图片文件"
        exit 1
    fi
    
    print_message $BLUE "📸 找到 ${#image_files[@]} 个图片文件"
    
    # 处理每个文件
    local success_count=0
    for file in "${image_files[@]}"; do
        if optimize_image "$file"; then
            ((success_count++))
        fi
    done
    
    # 输出总结
    print_message $GREEN "\n📊 优化完成!"
    print_message $GREEN "   ✅ 成功处理: $success_count/${#image_files[@]} 个文件"
    print_message $BLUE "   📂 原始文件备份: $BACKUP_DIR"
    print_message $BLUE "   📂 优化后文件: $OUTPUT_DIR"
}

# 运行脚本
main "$@"