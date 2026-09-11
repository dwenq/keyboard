import Foundation
import PDFKit
import Vision
import CoreGraphics
import ImageIO

// 用法: swift pdf_ocr.swift <pdf路径> [startPage] [endPage] [scale]
// scale 默认 3（渲染放大倍数，越大越清晰，越慢）

let args = CommandLine.arguments
guard args.count >= 2 else {
    FileHandle.standardError.write("usage: pdf_ocr.swift <pdf> [start] [end] [scale]\n".data(using: .utf8)!)
    exit(1)
}
let path = args[1]
let start = args.count >= 3 ? (Int(args[2]) ?? 1) : 1
let endArg = args.count >= 4 ? (Int(args[3]) ?? 0) : 0
let scale = args.count >= 5 ? (Int(args[4]) ?? 3) : 3

guard let doc = PDFDocument(url: URL(fileURLWithPath: path)) else {
    FileHandle.standardError.write("cannot open pdf\n".data(using: .utf8)!)
    exit(1)
}
let pageCount = doc.pageCount
let end = endArg == 0 ? pageCount : min(endArg, pageCount)

FileHandle.standardError.write("PAGES=\(pageCount) processing \(start)-\(end) scale=\(scale)\n".data(using: .utf8)!)

@available(macOS 10.15, *)
func ocrImage(_ cg: CGImage) -> String {
    let req = VNRecognizeTextRequest()
    req.recognitionLevel = .accurate
    req.usesLanguageCorrection = true
    req.recognitionLanguages = ["en-US"]
    req.minimumTextHeight = 0.005
    let handler = VNImageRequestHandler(cgImage: cg, options: [:])
    try? handler.perform([req])
    let obs = req.results ?? []
    // 按 y（从上到下）排序组织行
    var items: [(y: CGFloat, x: CGFloat, text: String)] = []
    for o in obs {
        if let c = o as? VNRecognizedTextObservation, let top = c.topCandidates(1).first {
            items.append((c.boundingBox.midY, c.boundingBox.minX, top.string))
        }
    }
    // Vision 坐标原点在左下，y 越大越靠上
    items.sort { a, b in
        if abs(a.y - b.y) > 0.02 { return a.y > b.y }
        return a.x < b.x
    }
    return items.map { $0.text }.joined(separator: "\n")
}

var out = ""
for p in start...end {
    guard let page = doc.page(at: p - 1) else { continue }
    let bounds = page.bounds(for: .mediaBox)
    let pixelW = Int(bounds.width * CGFloat(scale))
    let pixelH = Int(bounds.height * CGFloat(scale))
    let colorSpace = CGColorSpaceCreateDeviceRGB()
    guard let ctx = CGContext(data: nil, width: pixelW, height: pixelH,
                              bitsPerComponent: 8, bytesPerRow: 0, space: colorSpace,
                              bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue) else { continue }
    ctx.setFillColor(CGColor(red: 1, green: 1, blue: 1, alpha: 1))
    ctx.fill(CGRect(x: 0, y: 0, width: pixelW, height: pixelH))
    // PDFKit: 以指定大小渲染
    let pageRect = CGRect(x: 0, y: 0, width: pixelW, height: pixelH)
    // 注意 PDFKit 的 render 默认翻转，用 scale 处理
    page.draw(with: .mediaBox, to: ctx)
    guard let img = ctx.makeImage() else { continue }
    let text = ocrImage(img)
    if !text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
        out += "=====PAGE \(p)=====\n" + text + "\n"
    } else {
        out += "=====PAGE \(p)=====\n[NO TEXT]\n"
    }
}
print(out)