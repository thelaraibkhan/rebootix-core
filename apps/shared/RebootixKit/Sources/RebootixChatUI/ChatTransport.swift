import Foundation

public enum RebootixChatTransportEvent: Sendable {
    case health(ok: Bool)
    case tick
    case chat(RebootixChatEventPayload)
    case agent(RebootixAgentEventPayload)
    case seqGap
}

public protocol RebootixChatTransport: Sendable {
    func requestHistory(sessionKey: String) async throws -> RebootixChatHistoryPayload
    func sendMessage(
        sessionKey: String,
        message: String,
        thinking: String,
        idempotencyKey: String,
        attachments: [RebootixChatAttachmentPayload]) async throws -> RebootixChatSendResponse

    func abortRun(sessionKey: String, runId: String) async throws
    func listSessions(limit: Int?) async throws -> RebootixChatSessionsListResponse

    func requestHealth(timeoutMs: Int) async throws -> Bool
    func events() -> AsyncStream<RebootixChatTransportEvent>

    func setActiveSessionKey(_ sessionKey: String) async throws
}

extension RebootixChatTransport {
    public func setActiveSessionKey(_: String) async throws {}

    public func abortRun(sessionKey _: String, runId _: String) async throws {
        throw NSError(
            domain: "RebootixChatTransport",
            code: 0,
            userInfo: [NSLocalizedDescriptionKey: "chat.abort not supported by this transport"])
    }

    public func listSessions(limit _: Int?) async throws -> RebootixChatSessionsListResponse {
        throw NSError(
            domain: "RebootixChatTransport",
            code: 0,
            userInfo: [NSLocalizedDescriptionKey: "sessions.list not supported by this transport"])
    }
}
