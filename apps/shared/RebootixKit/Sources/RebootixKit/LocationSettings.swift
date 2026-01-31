import Foundation

public enum RebootixLocationMode: String, Codable, Sendable, CaseIterable {
    case off
    case whileUsing
    case always
}
