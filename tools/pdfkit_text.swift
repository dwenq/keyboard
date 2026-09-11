import Foundation
import PDFKit

// 用法: swift pdfkit_text.swift <pdf路径> [startPage] [endPage]
let args = CommandLine.arguments
guard args.count >= 2 else {
    FileHandle.standardError.write("usage: pdfkit_text.swift <pdf> [start] [end]\n".data(using: .utf8)!)
    exit(1)
}
let path = args[1]
let start = args.count >= 3 ? (Int(args[2]) ?? 1) : 1
let endArg = args.count >= 4 ? (Int(args[3]) ?? 0) : 0

guard let doc = PDFDocument(url: URL(fileURLWithPath: path)) else {
    FileHandle.standardError.write("cannot open pdf\n".data(using: .utf8)!)
    exit(1)
}
let pageCount = doc.pageCount
FileHandle.standardError.write("PAGES=\(pageCount)\n".data(using: .utf8)!)
let end = endArg == 0 ? pageCount : min(endArg, pageCount)

var out = ""
for p in start...end {
    guard let page = doc.page(at: p - 1) else { continue }
    if let s = page.string, !s.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
        out += "=====PAGE \(p)=====\n"
        out += s + "\n"
    }
}
print(out)