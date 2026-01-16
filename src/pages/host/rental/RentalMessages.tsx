/**
 * RENTAL MESSAGES PAGE - Communication with tenants
 */

import React, { useState } from 'react';
import RentalManagerLayout from '@/components/host/rental/RentalManagerLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Search, Send, Paperclip, Phone, Video, MoreVertical, Check, CheckCheck } from 'lucide-react';

const mockConversations = [
  {
    id: '1',
    tenant: 'John Mwangi',
    avatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=100&h=100&fit=crop&crop=face',
    property: 'Modern 2BR Apartment',
    lastMessage: 'Thank you for fixing the water heater!',
    time: '10:30 AM',
    unread: 0,
    online: true
  },
  {
    id: '2',
    tenant: 'Amina Hassan',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop&crop=face',
    property: 'Mikocheni Guest House - Room 1',
    lastMessage: 'When will the electrician come?',
    time: '9:15 AM',
    unread: 2,
    online: false
  },
  {
    id: '3',
    tenant: 'Peter Mushi',
    avatar: 'https://images.unsplash.com/photo-1507152927003-f7312a0a313c?w=100&h=100&fit=crop&crop=face',
    property: 'Mikocheni Guest House - Room 2',
    lastMessage: 'I will pay rent by Friday',
    time: 'Yesterday',
    unread: 1,
    online: true
  },
  {
    id: '4',
    tenant: 'Grace Kimaro',
    avatar: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=100&h=100&fit=crop&crop=face',
    property: 'Mikocheni Guest House - Room 3',
    lastMessage: 'The AC is working now, thanks!',
    time: 'Yesterday',
    unread: 0,
    online: false
  },
  {
    id: '5',
    tenant: 'David Mwanga',
    avatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=100&h=100&fit=crop&crop=face',
    property: 'Mbezi Beach Apartments - Unit 1A',
    lastMessage: 'Can I renew my lease for another year?',
    time: 'Mon',
    unread: 0,
    online: false
  }
];

const mockMessages = [
  { id: '1', sender: 'tenant', text: 'Hello, I wanted to report an issue with the water heater.', time: '9:00 AM', read: true },
  { id: '2', sender: 'host', text: 'Hi John, sorry to hear that. What seems to be the problem?', time: '9:05 AM', read: true },
  { id: '3', sender: 'tenant', text: 'It\'s not heating the water properly. The water is only lukewarm.', time: '9:10 AM', read: true },
  { id: '4', sender: 'host', text: 'I\'ll send a technician tomorrow morning. Will you be home around 10 AM?', time: '9:15 AM', read: true },
  { id: '5', sender: 'tenant', text: 'Yes, I\'ll be here. Thank you!', time: '9:20 AM', read: true },
  { id: '6', sender: 'host', text: 'Great! The technician will call you before arriving.', time: '9:25 AM', read: true },
  { id: '7', sender: 'tenant', text: 'Thank you for fixing the water heater!', time: '10:30 AM', read: true },
];

const RentalMessages = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
  const [newMessage, setNewMessage] = useState('');

  const filteredConversations = mockConversations.filter(conv =>
    conv.tenant.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.property.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = mockConversations.reduce((sum, c) => sum + c.unread, 0);

  return (
    <RentalManagerLayout 
      title="Messages" 
      subtitle={`${totalUnread} unread messages`}
    >
      <div className="flex gap-4 h-[calc(100vh-220px)] min-h-[500px]">
        {/* Conversations List */}
        <Card className="w-full lg:w-80 flex-shrink-0 border-gray-200 flex flex-col">
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`w-full p-3 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-50 ${
                  selectedConversation.id === conv.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={conv.avatar}
                    alt={conv.tenant}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {conv.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 truncate text-sm">{conv.tenant}</h4>
                    <span className="text-xs text-gray-400">{conv.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{conv.property}</p>
                  <p className="text-sm text-gray-600 truncate mt-0.5">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <Badge className="bg-blue-600 text-white text-xs px-1.5 min-w-[20px] h-5">
                    {conv.unread}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </Card>

        {/* Chat Area */}
        <Card className="flex-1 border-gray-200 flex flex-col hidden lg:flex">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={selectedConversation.avatar}
                  alt={selectedConversation.tenant}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {selectedConversation.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{selectedConversation.tenant}</h3>
                <p className="text-xs text-gray-500">{selectedConversation.property}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm"><Phone className="h-4 w-4" /></Button>
              <Button variant="ghost" size="sm"><Video className="h-4 w-4" /></Button>
              <Button variant="ghost" size="sm"><MoreVertical className="h-4 w-4" /></Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {mockMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'host' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                    msg.sender === 'host'
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-gray-100 text-gray-900 rounded-bl-md'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <div className={`flex items-center justify-end gap-1 mt-1 ${
                    msg.sender === 'host' ? 'text-blue-200' : 'text-gray-400'
                  }`}>
                    <span className="text-xs">{msg.time}</span>
                    {msg.sender === 'host' && (
                      msg.read ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-end gap-2">
              <Button variant="ghost" size="sm" className="flex-shrink-0">
                <Paperclip className="h-5 w-5 text-gray-400" />
              </Button>
              <Textarea
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="min-h-[40px] max-h-[120px] resize-none"
                rows={1}
              />
              <Button size="sm" className="flex-shrink-0 bg-blue-600 hover:bg-blue-700">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Mobile: Show message to select conversation */}
        <div className="flex-1 hidden items-center justify-center text-gray-500 lg:hidden">
          <p>Select a conversation to view messages</p>
        </div>
      </div>
    </RentalManagerLayout>
  );
};

export default RentalMessages;
