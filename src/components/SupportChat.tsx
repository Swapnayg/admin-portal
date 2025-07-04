
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Search, Phone, Video, MoreVertical, Paperclip } from 'lucide-react';

const SupportChat = () => {
  const [message, setMessage] = useState('');
  
  const conversations = [
    {
      id: 1,
      name: 'John Smith',
      lastMessage: 'Having trouble with payment processing...',
      time: '2 min ago',
      unread: 3,
      status: 'online'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      lastMessage: 'Thank you for the quick response!',
      time: '15 min ago',
      unread: 0,
      status: 'away'
    },
    {
      id: 3,
      name: 'Mike Chen',
      lastMessage: 'Can you help me with account verification?',
      time: '1 hour ago',
      unread: 1,
      status: 'offline'
    }
  ];

  const currentChat = {
    name: 'John Smith',
    status: 'online',
    messages: [
      { id: 1, sender: 'user', text: 'Hi, I\'m having trouble with payment processing on my account.', time: '2:30 PM' },
      { id: 2, sender: 'support', text: 'Hello John! I\'d be happy to help you with that. Can you tell me more about the specific issue you\'re experiencing?', time: '2:32 PM' },
      { id: 3, sender: 'user', text: 'When I try to process payments, I get an error message saying "Payment gateway unavailable"', time: '2:35 PM' },
      { id: 4, sender: 'support', text: 'I see the issue. Let me check your payment gateway configuration. One moment please.', time: '2:36 PM' }
    ]
  };

  return (
      <div className="max-w-full w-full flex h-[calc(100vh-8rem)] bg-white rounded-lg border border-slate-200 overflow-hidden">
        {/* Chat List Sidebar */}
        <div className="w-80 border-r border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">Support Chat</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
              <div key={conv.id} className="p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                        <span className="text-sm font-medium text-slate-600">
                          {conv.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                        conv.status === 'online' ? 'bg-green-500' : 
                        conv.status === 'away' ? 'bg-yellow-500' : 'bg-slate-400'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{conv.name}</p>
                      <p className="text-sm text-slate-500 truncate">{conv.lastMessage}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">{conv.time}</p>
                    {conv.unread > 0 && (
                      <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-600 text-white rounded-full">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                  <span className="text-sm font-medium text-slate-600">JS</span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              </div>
              <div>
                <h3 className="font-medium text-slate-900">{currentChat.name}</h3>
                <p className="text-sm text-green-600">Online</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Phone size={18} />
              </Button>
              <Button variant="ghost" size="sm">
                <Video size={18} />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical size={18} />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {currentChat.messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'support' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.sender === 'support' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-100 text-slate-900'
                }`}>
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-xs mt-1 ${
                    msg.sender === 'support' ? 'text-blue-100' : 'text-slate-500'
                  }`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Paperclip size={18} />
              </Button>
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button size="sm" className="gap-2 bg-slate-700 hover:bg-slate-800 text-white">
                  <Send size={18} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default SupportChat;
