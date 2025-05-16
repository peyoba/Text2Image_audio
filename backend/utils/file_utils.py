"""
文件处理相关的工具函数。
例如：保存音频文件、检查文件路径等。
"""

import os
import base64

# 定义一个可能的音频保存目录 (可以考虑从配置中读取)
# 注意：需要确保此目录存在，并且应用有写入权限。
# 在.gitignore中已添加 backend/generated_audio/
GENERATED_AUDIO_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'generated_audio')

def save_base64_audio_to_file(audio_base64: str, filename: str) -> str | None:
    """
    将base64编码的音频数据解码并保存到文件。

    Args:
        audio_base64 (str): base64编码的音频数据。
        filename (str): 要保存的文件名 (不含路径，例如 'output.mp3')。

    Returns:
        str | None: 如果成功，返回完整的文件路径；否则返回None。
    """
    try:
        # 详细的中文注释：确保音频保存目录存在
        if not os.path.exists(GENERATED_AUDIO_DIR):
            os.makedirs(GENERATED_AUDIO_DIR)
            print(f"已创建目录: {GENERATED_AUDIO_DIR}")

        # 详细的中文注释：构造完整的文件路径
        file_path = os.path.join(GENERATED_AUDIO_DIR, filename)

        # 详细的中文注释：解码base64数据
        # 有些base64字符串可能带有头部，如 "data:audio/mpeg;base64,"
        # 需要先移除这部分
        if ';base64,' in audio_base64:
            header, encoded_data = audio_base64.split(';base64,', 1)
        else:
            encoded_data = audio_base64
        
        audio_data = base64.b64decode(encoded_data)

        # 详细的中文注释：以二进制写模式保存文件
        with open(file_path, 'wb') as f:
            f.write(audio_data)
        
        print(f"音频文件已保存到: {file_path}")
        return file_path
    except base64.binascii.Error as b64_err:
        print(f"Base64解码错误: {b64_err}. 输入的前100个字符: '{audio_base64[:100]}'")
        return None
    except Exception as e:
        print(f"保存音频文件 '{filename}' 时发生错误: {e}")
        return None

# --- 示例用法 (用于测试此模块) ---
if __name__ == '__main__':
    print(f"音频将尝试保存到目录: {GENERATED_AUDIO_DIR}")
    
    # 详细的中文注释：一个非常短的有效WAV文件的base64示例 (RIFF...WAVEfmt ...data....)
    # 这个base64代表一个非常短的静音WAV文件
    sample_wav_base64 = "UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA="
    
    # 详细的中文注释：测试带有数据头部的base64字符串
    sample_wav_base64_with_header = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA="

    print("\n测试1: 保存不带头部的base64 WAV数据...")
    saved_path1 = save_base64_audio_to_file(sample_wav_base64, "test_output_no_header.wav")
    if saved_path1 and os.path.exists(saved_path1):
        print(f"测试1成功: 文件已保存到 {saved_path1}")
        # os.remove(saved_path1) # 测试后清理
    else:
        print("测试1失败。")

    print("\n测试2: 保存带头部的base64 WAV数据...")
    saved_path2 = save_base64_audio_to_file(sample_wav_base64_with_header, "test_output_with_header.wav")
    if saved_path2 and os.path.exists(saved_path2):
        print(f"测试2成功: 文件已保存到 {saved_path2}")
        # os.remove(saved_path2) # 测试后清理
    else:
        print("测试2失败。")

    print("\n测试3: 尝试保存无效的base64数据...")
    invalid_base64 = "this_is_not_valid_base64_data"
    saved_path3 = save_base64_audio_to_file(invalid_base64, "test_output_invalid.wav")
    if not saved_path3:
        print("测试3成功：无效数据未能保存 (符合预期)。")
    else:
        print("测试3失败：无效数据似乎被保存了。")
        if os.path.exists(saved_path3):
            os.remove(saved_path3) # 清理

    print("\nfile_utils.py 测试完成。") 