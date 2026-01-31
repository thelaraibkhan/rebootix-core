import Foundation

public enum RebootixCameraCommand: String, Codable, Sendable {
    case list = "camera.list"
    case snap = "camera.snap"
    case clip = "camera.clip"
}

public enum RebootixCameraFacing: String, Codable, Sendable {
    case back
    case front
}

public enum RebootixCameraImageFormat: String, Codable, Sendable {
    case jpg
    case jpeg
}

public enum RebootixCameraVideoFormat: String, Codable, Sendable {
    case mp4
}

public struct RebootixCameraSnapParams: Codable, Sendable, Equatable {
    public var facing: RebootixCameraFacing?
    public var maxWidth: Int?
    public var quality: Double?
    public var format: RebootixCameraImageFormat?
    public var deviceId: String?
    public var delayMs: Int?

    public init(
        facing: RebootixCameraFacing? = nil,
        maxWidth: Int? = nil,
        quality: Double? = nil,
        format: RebootixCameraImageFormat? = nil,
        deviceId: String? = nil,
        delayMs: Int? = nil)
    {
        self.facing = facing
        self.maxWidth = maxWidth
        self.quality = quality
        self.format = format
        self.deviceId = deviceId
        self.delayMs = delayMs
    }
}

public struct RebootixCameraClipParams: Codable, Sendable, Equatable {
    public var facing: RebootixCameraFacing?
    public var durationMs: Int?
    public var includeAudio: Bool?
    public var format: RebootixCameraVideoFormat?
    public var deviceId: String?

    public init(
        facing: RebootixCameraFacing? = nil,
        durationMs: Int? = nil,
        includeAudio: Bool? = nil,
        format: RebootixCameraVideoFormat? = nil,
        deviceId: String? = nil)
    {
        self.facing = facing
        self.durationMs = durationMs
        self.includeAudio = includeAudio
        self.format = format
        self.deviceId = deviceId
    }
}
