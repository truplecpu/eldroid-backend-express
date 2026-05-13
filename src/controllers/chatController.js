const chatService = require('../services/chatService');

class ChatController {
  async getHistory(req, res) {
    const { receiver_id } = req.params;
    const sender_id = req.user.userId || req.user.facultyId;

    try {
      const history = await chatService.getChatHistory(sender_id, receiver_id);
      return res.status(200).json({ status: 'success', data: history });
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }
}

module.exports = new ChatController();
