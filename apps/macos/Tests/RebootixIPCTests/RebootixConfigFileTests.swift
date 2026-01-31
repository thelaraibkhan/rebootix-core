import Foundation
import Testing
@testable import Rebootix

@Suite(.serialized)
struct RebootixConfigFileTests {
    @Test
    func configPathRespectsEnvOverride() async {
        let override = FileManager().temporaryDirectory
            .appendingPathComponent("rebootix-config-\(UUID().uuidString)")
            .appendingPathComponent("rebootix.json")
            .path

        await TestIsolation.withEnvValues(["REBOOTIX_CONFIG_PATH": override]) {
            #expect(RebootixConfigFile.url().path == override)
        }
    }

    @MainActor
    @Test
    func remoteGatewayPortParsesAndMatchesHost() async {
        let override = FileManager().temporaryDirectory
            .appendingPathComponent("rebootix-config-\(UUID().uuidString)")
            .appendingPathComponent("rebootix.json")
            .path

        await TestIsolation.withEnvValues(["REBOOTIX_CONFIG_PATH": override]) {
            RebootixConfigFile.saveDict([
                "gateway": [
                    "remote": [
                        "url": "ws://gateway.ts.net:19999",
                    ],
                ],
            ])
            #expect(RebootixConfigFile.remoteGatewayPort() == 19999)
            #expect(RebootixConfigFile.remoteGatewayPort(matchingHost: "gateway.ts.net") == 19999)
            #expect(RebootixConfigFile.remoteGatewayPort(matchingHost: "gateway") == 19999)
            #expect(RebootixConfigFile.remoteGatewayPort(matchingHost: "other.ts.net") == nil)
        }
    }

    @MainActor
    @Test
    func setRemoteGatewayUrlPreservesScheme() async {
        let override = FileManager().temporaryDirectory
            .appendingPathComponent("rebootix-config-\(UUID().uuidString)")
            .appendingPathComponent("rebootix.json")
            .path

        await TestIsolation.withEnvValues(["REBOOTIX_CONFIG_PATH": override]) {
            RebootixConfigFile.saveDict([
                "gateway": [
                    "remote": [
                        "url": "wss://old-host:111",
                    ],
                ],
            ])
            RebootixConfigFile.setRemoteGatewayUrl(host: "new-host", port: 2222)
            let root = RebootixConfigFile.loadDict()
            let url = ((root["gateway"] as? [String: Any])?["remote"] as? [String: Any])?["url"] as? String
            #expect(url == "wss://new-host:2222")
        }
    }

    @Test
    func stateDirOverrideSetsConfigPath() async {
        let dir = FileManager().temporaryDirectory
            .appendingPathComponent("rebootix-state-\(UUID().uuidString)", isDirectory: true)
            .path

        await TestIsolation.withEnvValues([
            "REBOOTIX_CONFIG_PATH": nil,
            "REBOOTIX_STATE_DIR": dir,
        ]) {
            #expect(RebootixConfigFile.stateDirURL().path == dir)
            #expect(RebootixConfigFile.url().path == "\(dir)/rebootix.json")
        }
    }
}
