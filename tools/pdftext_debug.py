#!/usr/bin/env python3
import re, sys, zlib, binascii

data = open(sys.argv[1], "rb").read()
obj_re = rb"(\d+ \d+ obj)(.*?)stream\r?\n"
st = []
for m in re.finditer(obj_re, data, re.S):
    header = m.group(1)
    body = m.group(2)
    start = m.end()
    end = data.find(b"endstream", start)
    if end == -1:
        continue
    stream = data[start:end]
    if stream.endswith(b"\n"):
        stream = stream[:-1]
    if stream.endswith(b"\r"):
        stream = stream[:-1]
    st.append((header, body, stream))

print("streams:", len(st))
shown = 0
for header, body, stream in st:
    raw = stream
    try:
        raw = zlib.decompress(stream)
    except Exception:
        pass
    # 只看有 Tj / TJ 的
    if (b"Tj" in raw or b"TJ" in raw):
        # 打印该流里 BT...ET 之间文本区域（前后 120 字节原始）
        # 找到所有字符串字面量附近原文
        idxs = [mm.start() for mm in re.finditer(rb"\((?:[^()]|\\[()]){1,120}\)\s*(?:Tj|TJ)|<[0-9A-Fa-f]+>\s*(?:Tj|TJ)", raw)]
        if not idxs:
            idxs = [mm.start() for mm in re.finditer(rb"\bTj\b|\bTJ\b", raw)]
        print("\n===== object", header.decode(), "=====", file=sys.stderr)
        for ii in idxs[:6]:
            seg = raw[max(0, ii - 8): ii + 80]
            print("RAW:", binascii.hexlify(seg[:88]).decode(), file=sys.stderr)
            try:
                print("TXT:", seg[:120].decode("latin-1"), file=sys.stderr)
            except Exception:
                pass
        shown += 1
        if shown >= 4:
            break