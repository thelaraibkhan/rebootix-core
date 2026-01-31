package ai.rebootix.android.ui

import androidx.compose.runtime.Composable
import ai.rebootix.android.MainViewModel
import ai.rebootix.android.ui.chat.ChatSheetContent

@Composable
fun ChatSheet(viewModel: MainViewModel) {
  ChatSheetContent(viewModel = viewModel)
}
