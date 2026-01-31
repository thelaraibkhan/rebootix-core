// swift-tools-version: 6.2
// Package manifest for the Rebootix macOS companion (menu bar app + IPC library).

import PackageDescription

let package = Package(
    name: "Rebootix",
    platforms: [
        .macOS(.v15),
    ],
    products: [
        .library(name: "RebootixIPC", targets: ["RebootixIPC"]),
        .library(name: "RebootixDiscovery", targets: ["RebootixDiscovery"]),
        .executable(name: "Rebootix", targets: ["Rebootix"]),
        .executable(name: "rebootix-mac", targets: ["RebootixMacCLI"]),
    ],
    dependencies: [
        .package(url: "https://github.com/orchetect/MenuBarExtraAccess", exact: "1.2.2"),
        .package(url: "https://github.com/swiftlang/swift-subprocess.git", from: "0.1.0"),
        .package(url: "https://github.com/apple/swift-log.git", from: "1.8.0"),
        .package(url: "https://github.com/sparkle-project/Sparkle", from: "2.8.1"),
        .package(url: "https://github.com/steipete/Peekaboo.git", branch: "main"),
        .package(path: "../shared/RebootixKit"),
        .package(path: "../../Swabble"),
    ],
    targets: [
        .target(
            name: "RebootixIPC",
            dependencies: [],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .target(
            name: "RebootixDiscovery",
            dependencies: [
                .product(name: "RebootixKit", package: "RebootixKit"),
            ],
            path: "Sources/RebootixDiscovery",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .executableTarget(
            name: "Rebootix",
            dependencies: [
                "RebootixIPC",
                "RebootixDiscovery",
                .product(name: "RebootixKit", package: "RebootixKit"),
                .product(name: "RebootixChatUI", package: "RebootixKit"),
                .product(name: "RebootixProtocol", package: "RebootixKit"),
                .product(name: "SwabbleKit", package: "swabble"),
                .product(name: "MenuBarExtraAccess", package: "MenuBarExtraAccess"),
                .product(name: "Subprocess", package: "swift-subprocess"),
                .product(name: "Logging", package: "swift-log"),
                .product(name: "Sparkle", package: "Sparkle"),
                .product(name: "PeekabooBridge", package: "Peekaboo"),
                .product(name: "PeekabooAutomationKit", package: "Peekaboo"),
            ],
            exclude: [
                "Resources/Info.plist",
            ],
            resources: [
                .copy("Resources/Rebootix.icns"),
                .copy("Resources/DeviceModels"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .executableTarget(
            name: "RebootixMacCLI",
            dependencies: [
                "RebootixDiscovery",
                .product(name: "RebootixKit", package: "RebootixKit"),
                .product(name: "RebootixProtocol", package: "RebootixKit"),
            ],
            path: "Sources/RebootixMacCLI",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .testTarget(
            name: "RebootixIPCTests",
            dependencies: [
                "RebootixIPC",
                "Rebootix",
                "RebootixDiscovery",
                .product(name: "RebootixProtocol", package: "RebootixKit"),
                .product(name: "SwabbleKit", package: "swabble"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
                .enableExperimentalFeature("SwiftTesting"),
            ]),
    ])
