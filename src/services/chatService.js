const supabase = require('../config/supabase');

class ChatService {
  async saveMessage(messageData) {
    const { sender_id, receiver_id, message, sender_type } = messageData;
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        sender_id,
        receiver_id,
        message,
        sender_type, // 'faculty' or 'parent'
        created_at: new Date()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getChatHistory(user1Id, user2Id) {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .or(`and(sender_id.eq.${user1Id},receiver_id.eq.${user2Id}),and(sender_id.eq.${user2Id},receiver_id.eq.${user1Id})`)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  }
}

module.exports = new ChatService();
