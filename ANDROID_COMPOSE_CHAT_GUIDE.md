# Android Jetpack Compose: Chat Implementation Guide

This guide provides a complete implementation of the Eldroid Parent-Teacher chat system for Android using **Jetpack Compose**, **Socket.io**, and **Retrofit**.

**Backend URL**: `https://eldroid-backend-express.onrender.com/`

---

## 1. Add Dependencies

Add these to your `app/build.gradle` file:

```kotlin
dependencies {
    // Socket.io
    implementation("io.socket:socket.io-client:2.1.0")

    // Retrofit (for Auth and History)
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")

    // ViewModel & LiveData
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.6.1")
}
```

Don't forget to add Internet permission in `AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.INTERNET" />
```

---

## 2. Authentication Data Models

```kotlin
data class ParentLoginRequest(val parentName: String)

data class LoginResponse(
    val status: String,
    val token: String,
    val parent_data: ParentData
)

data class ParentData(
    val userId: String,
    val parentName: String
)

data class ChatMessage(
    val sender_id: String,
    val receiver_id: String,
    val message: String,
    val created_at: String? = null
)
```

---

## 3. Socket Manager

Create a singleton to manage the WebSocket connection.

```kotlin
object SocketHandler {
    private var mSocket: io.socket.client.Socket? = null
    private const val URL = "https://eldroid-backend-express.onrender.com/"

    @Synchronized
    fun setSocket(token: String) {
        try {
            val options = io.socket.client.IO.Options.builder()
                .setAuth(mapOf("token" to token))
                .build()
            
            mSocket = io.socket.client.IO.socket(URL, options)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    @Synchronized
    fun getSocket(): io.socket.client.Socket? = mSocket

    @Synchronized
    fun establishConnection() {
        mSocket?.connect()
    }

    @Synchronized
    fun closeConnection() {
        mSocket?.disconnect()
    }
}
```

---

## 4. ViewModel (Business Logic)

The ViewModel manages the connection state and the list of messages.

```kotlin
class ChatViewModel : ViewModel() {
    private val _messages = mutableStateListOf<ChatMessage>()
    val messages: List<ChatMessage> = _messages

    fun connect(token: String) {
        SocketHandler.setSocket(token)
        val mSocket = SocketHandler.getSocket()

        mSocket?.on("receive_message") { args ->
            val data = args[0] as JSONObject
            val msg = ChatMessage(
                sender_id = data.getString("sender_id"),
                receiver_id = data.getString("receiver_id"),
                message = data.getString("message"),
                created_at = data.optString("created_at")
            )
            _messages.add(msg)
        }
        
        SocketHandler.establishConnection()
    }

    fun sendMessage(receiverId: String, text: String, myId: String) {
        val mSocket = SocketHandler.getSocket()
        val data = JSONObject().apply {
            put("receiver_id", receiverId)
            put("message", text)
        }
        
        mSocket?.emit("send_message", data)
        
        // Add locally for immediate UI update
        _messages.add(ChatMessage(myId, receiverId, text, "Just now"))
    }
}
```

---

## 5. Jetpack Compose UI

A simple chat screen with a message list and input field.

```kotlin
@Composable
fun ChatScreen(viewModel: ChatViewModel, myId: String, teacherId: String) {
    var textState by remember { mutableStateOf("") }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        // Message List
        LazyColumn(modifier = Modifier.weight(1f)) {
            items(viewModel.messages) { msg ->
                val isMe = msg.sender_id == myId
                ChatBubble(msg.message, isMe)
            }
        }

        // Input Field
        Row(verticalAlignment = Alignment.CenterVertically) {
            TextField(
                value = textState,
                onValueChange = { textState = it },
                modifier = Modifier.weight(1f),
                placeholder = { Text("Type a message...") }
            )
            IconButton(onClick = {
                if (textState.isNotBlank()) {
                    viewModel.sendMessage(teacherId, textState, myId)
                    textState = ""
                }
            }) {
                Icon(Icons.Default.Send, contentDescription = "Send")
            }
        }
    }
}

@Composable
fun ChatBubble(text: String, isMe: Boolean) {
    Surface(
        color = if (isMe) Color(0xFF0084FF) else Color(0xFFE4E6EB),
        shape = RoundedCornerShape(12.dp),
        modifier = Modifier
            .padding(vertical = 4.dp)
            .fillMaxWidth(0.8f)
            .align(if (isMe) Alignment.End else Alignment.Start)
    ) {
        Text(
            text = text,
            color = if (isMe) Color.White else Color.Black,
            modifier = Modifier.padding(12.dp)
        )
    }
}
```

---

## 💡 Implementation Notes for Render
*   **Cold Starts**: Render free tier "sleeps" after inactivity. The first connection might take 30+ seconds.
*   **HTTPS/WSS**: Always use `https://` for the URL; the library will automatically handle the `wss://` upgrade.
*   **Main Thread**: Remember that Socket.io events arrive on a background thread. Jetpack Compose `mutableStateListOf` is thread-safe for reading, but ensure updates don't crash your UI.
