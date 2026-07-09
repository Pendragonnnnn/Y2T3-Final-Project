const Notification = require('../models/Notification');

class NotificationService {
  static async sendNotification({ recipientId, title, messageBody }) {
    return Notification.create({ recipientId, title, messageBody });
  }
}

module.exports = NotificationService;