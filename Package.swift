// swift-tools-version:5.3

import Foundation
import PackageDescription

var sources = ["src/parser.c"]
if FileManager.default.fileExists(atPath: "src/scanner.c") {
    sources.append("src/scanner.c")
}

let package = Package(
    name: "TreeSitterOpenscad",
    products: [
        .library(name: "TreeSitterOpenscad", targets: ["TreeSitterOpenscad"]),
    ],
    dependencies: [
        .package(url: "https://github.com/tree-sitter/swift-tree-sitter", from: "0.8.0"),
    ],
    targets: [
        .target(
            name: "TreeSitterOpenscad",
            dependencies: [],
            path: ".",
            sources: sources,
            resources: [
                .copy("queries")
            ],
            publicHeadersPath: "bindings/swift",
            cSettings: [.headerSearchPath("src")]
        ),
        .testTarget(
            name: "TreeSitterOpenscadTests",
            dependencies: [
                "SwiftTreeSitter",
                "TreeSitterOpenscad",
            ],
            path: "bindings/swift/TreeSitterOpenscadTests"
        )
    ],
    cLanguageStandard: .c11
)
