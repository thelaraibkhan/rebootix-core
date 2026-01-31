package ai.rebootix.android.protocol

import org.junit.Assert.assertEquals
import org.junit.Test

class RebootixProtocolConstantsTest {
  @Test
  fun canvasCommandsUseStableStrings() {
    assertEquals("canvas.present", RebootixCanvasCommand.Present.rawValue)
    assertEquals("canvas.hide", RebootixCanvasCommand.Hide.rawValue)
    assertEquals("canvas.navigate", RebootixCanvasCommand.Navigate.rawValue)
    assertEquals("canvas.eval", RebootixCanvasCommand.Eval.rawValue)
    assertEquals("canvas.snapshot", RebootixCanvasCommand.Snapshot.rawValue)
  }

  @Test
  fun a2uiCommandsUseStableStrings() {
    assertEquals("canvas.a2ui.push", RebootixCanvasA2UICommand.Push.rawValue)
    assertEquals("canvas.a2ui.pushJSONL", RebootixCanvasA2UICommand.PushJSONL.rawValue)
    assertEquals("canvas.a2ui.reset", RebootixCanvasA2UICommand.Reset.rawValue)
  }

  @Test
  fun capabilitiesUseStableStrings() {
    assertEquals("canvas", RebootixCapability.Canvas.rawValue)
    assertEquals("camera", RebootixCapability.Camera.rawValue)
    assertEquals("screen", RebootixCapability.Screen.rawValue)
    assertEquals("voiceWake", RebootixCapability.VoiceWake.rawValue)
  }

  @Test
  fun screenCommandsUseStableStrings() {
    assertEquals("screen.record", RebootixScreenCommand.Record.rawValue)
  }
}
