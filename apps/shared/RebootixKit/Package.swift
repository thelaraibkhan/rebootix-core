// swift-tools-version: 6.2

import PackageDescription

let package = Package(
    name: "RebootixKit",
    platforms: [
        .iOS(.v18),
        .macOS(.v15),
    ],
    products: [
        .library(name: "RebootixProtocol", targets: ["RebootixProtocol"]),
        .library(name: "RebootixKit", targets: ["RebootixKit"]),
        .library(name: "RebootixChatUI", targets: ["RebootixChatUI"]),
    ],
    dependencies: [
        .package(url: "https://github.com/steipete/ElevenLabsKit", exact: "0.1.0"),
        .package(url: "https://github.com/gonzalezreal/textual", exact: "0.3.1"),
    ],
    targets: [
        .target(
            name: "RebootixProtocol",
            path: "Sources/RebootixProtocol",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .target(
            name: "RebootixKit",
            dependencies: [
                "RebootixProtocol",
                .product(name: "ElevenLabsKit", package: "ElevenLabsKit"),
            ],
            path: "Sources/RebootixKit",
            resources: [
                .process("Resources"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .target(
            name: "RebootixChatUI",
            dependencies: [
                "RebootixKit",
                .product(
                    name: "Textual",
                    package: "textual",
                    condition: .when(platforms: [.macOS, .iOS])),
            ],
            path: "Sources/RebootixChatUI",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .testTarget(
            name: "RebootixKitTests",
            dependencies: ["RebootixKit", "RebootixChatUI"],
            path: "Tests/RebootixKitTests",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
                .enableExperimentalFeature("SwiftTesting"),
            ]),
    ])
