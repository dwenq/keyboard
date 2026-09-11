#!/usr/bin/env python3
"""
pdftext.py — Pdf文本流提取（仅用标准库，无第三方依赖）。
说明：解析 PDF 对象，decompress 所有 FlateDecode 流，找出内容流里的文本显示
算子 (Tj / TJ / ' / ") 并还原字符串；尽力借助 ToUnicode CMap 还原字符。
用法：python3 pdftext.py <input.pdf> [page_start] [page_end]
"""
import re
import sys
import zlib

CID_PAT = re.compile(rb"\(cid:\d+\)")


def find_streams(data):
    """找出所有流对象及其编号。返回 [(stream_bytes, obj_header)]"""
    out = []
    obj_re = rb"(\d+ \d+ obj)(.*?)stream\r?\n"
    for m in re.finditer(obj_re, data, re.S):
        header = m.group(1)
        body = m.group(2)
        start = m.end()
        end = data.find(b"endstream", start)
        if end == -1:
            continue
        stream = data[start:end]
        # 去掉结尾可能的换行
        if stream.endswith(b"\n"):
            stream = stream[:-1]
        if stream.endswith(b"\r"):
            stream = stream[:-1]
        out.append((header, stream, body))
    return out


def decode_stream(stream):
    """尝试解码流内容，返回原始字节。"""
    try:
        return zlib.decompress(stream)
    except Exception:
        return stream


def unescape_pdf_string(s):
    """解码 PDF 字符串字面量：处理 \\n \\t \\( \\) \\\\ 以及 \\ooo 转义。"""
    out = bytearray()
    i = 0
    while i < len(s):
        c = s[i]
        if c == 0x5C:  # backslash
            if i + 1 >= len(s):
                break
            nxt = s[i + 1]
            if nxt in b"nrtbf":
                out.append({ord("n"): 0x0A, ord("r"): 0x0D, ord("t"): 0x09,
                            ord("b"): 0x08, ord("f"): 0x0C}[nxt])
                i += 2
            elif nxt in b"()\\":
                out.append(nxt)
                i += 2
            elif nxt in b"01234567":
                j = i + 1
                while j < len(s) and j < i + 4 and s[j] in b"01234567":
                    j += 1
                out.append(int(s[i + 1:j], 8) & 0xFF)
                i = j
            else:
                out.append(nxt)
                i += 2
        else:
            out.append(c)
            i += 1
    return bytes(out)


def collect_content_streams(argv, data):
    """收集内容流。简单方案：所有解压后含文本算子的流。"""
    page_start, page_end = 1, 0
    if len(argv) >= 3:
        page_start = int(argv[2])
    if len(argv) >= 4:
        page_end = int(argv[3])
    return page_start, page_end


def main():
    if len(sys.argv) < 2:
        print("usage: pdftext.py <input.pdf> [page_start] [page_end]", file=sys.stderr)
        return
    path = sys.argv[1]
    pg_start = int(sys.argv[2]) if len(sys.argv) >= 3 else 1
    pg_end = int(sys.argv[3]) if len(sys.argv) >= 4 else 0

    with open(path, "rb") as f:
        data = f.read()
    print("file size: %.1f MB" % (len(data) / 1024 / 1024), file=sys.stderr)

    streams = find_streams(data)
    print("total objects with streams: %d" % len(streams), file=sys.stderr)

    # 文本算子：Tj  "<str>" Tj ；TJ [<s> x <s>] TJ
    tj = re.compile(rb"\bTj\b")
    tjarr = re.compile(rb"\bTJ\b")

    # 收集文本串算子的内容流（按对象顺序）
    text_streams = []
    for header, stream, body in streams:
        raw = decode_stream(stream)
        if tj.search(raw) or tjarr.search(raw):
            text_streams.append((header, raw))

    print("streams containing text operators: %d" % len(text_streams), file=sys.stderr)

    # 组装)"<str>" Tj 与 [ ... ] TJ
    pieces = []
    for header, raw in text_streams:
        seg = extract_text_run(raw)
        if seg:
            pieces.append(seg)

    def emit(s):
        print(s)

    for seg in pieces:
        emit(seg)


def extract_text_run(raw):
    """从单个内容流中提取连续文本，返回可打印文本字符串。"""
    out = []
    # 找一个简单的解析：扫描 ( ... ) 字符串字面量 + 显示算子
    # 先移除 CID 标记
    raw = CID_PAT.sub(b"", raw)
    i = 0
    n = len(raw)
    line_parts = []
    while i < n:
        c = raw[i]
        if c == 0x28:  # '(' 字符串开始
            # 读取字符串（处理嵌套括号与转义）
            j = i + 1
            depth = 1
            while j < n and depth > 0:
                if raw[j] == 0x5C:  # backslash
                    j += 2
                    continue
                if raw[j] == 0x28:
                    depth += 1
                elif raw[j] == 0x29:
                    depth -= 1
                j += 1
            s_bytes = raw[i + 1:j - 1]
            s = unescape_pdf_string(s_bytes)
            # 必须是可打印候选
            if any(32 <= b <= 126 for b in s):
                line_parts.append(bytes(s))
            i = j
        elif c == 0x5D or c == 0x5B:  # [ ] TJ 数组边界，保留
            i += 1
        elif c == 0x4A and raw[i:i+2] == b"TJ":
            i += 2
        elif c == 0x54 and raw[i:i+2] == b"Tj":
            i += 2
        elif c in (0x0A, 0x0D):
            # 新行：可能代表文本换行
            pass
        elif c == 0x54 and raw[i:i+3] == b"T*":
            i += 3
        else:
            i += 1
    # 组装每个字符串段，按一个片段近似一行
    # 这里简单把收集到的串拼接
    joined = b"".join(line_parts)
    try:
        return joined.decode("latin-1")
    except Exception:
        return ""


if __name__ == "__main__":
    main()