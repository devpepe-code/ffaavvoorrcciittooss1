'use client';

import { useState } from 'react';
import { Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Message = {
  id: string;
  sender: 'client' | 'tasker';
  text: string;
  timestamp: Date;
  seen?: boolean;
};

export function ChatWindow({
  taskerId,
  taskerName,
  initialMessage,
  onClose,
}: {
  taskerId: string;
  taskerName: string;
  initialMessage?: string;
  onClose?: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'client',
      text: initialMessage || 'Hola, necesito ayuda. ¿Estás disponible?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');

  function handleSend() {
    if (!input.trim()) return;
    setMessages([
      ...messages,
      {
        id: String(messages.length + 1),
        sender: 'client',
        text: input,
        timestamp: new Date(),
      },
    ]);
    setInput('');
    // TODO: Replace with real WebSocket/Supabase realtime
  }

  return (
    <div
      className="flex flex-col rounded-2xl shadow-lg"
      style={{ backgroundColor: '#FFFFFF', height: '500px', maxHeight: '90vh' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between border-b px-4 py-4"
        style={{ borderColor: 'rgba(0,0,0,0.06)' }}
      >
        <div>
          <h3 className="font-semibold" style={{ color: '#1A1A2E' }}>
            {taskerName}
          </h3>
          <p className="text-xs" style={{ color: '#9CA3AF' }}>
            Conectado
          </p>
        </div>
        {onClose && (
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-gray-100">
            <X className="h-5 w-5" style={{ color: '#6B7280' }} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'client' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className="max-w-xs rounded-2xl px-4 py-2 text-sm"
              style={{
                backgroundColor: msg.sender === 'client' ? '#F97316' : '#F3F4F6',
                color: msg.sender === 'client' ? '#FFFFFF' : '#1A1A2E',
              }}
            >
              {msg.text}
              <div
                className="mt-1 text-xs"
                style={{ color: msg.sender === 'client' ? 'rgba(255,255,255,0.7)' : '#9CA3AF' }}
              >
                {msg.timestamp.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div
        className="border-t p-4"
        style={{ borderColor: 'rgba(0,0,0,0.06)' }}
      >
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Escribe tu mensaje..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <Button
            onClick={handleSend}
            className="rounded-xl"
            style={{ backgroundColor: '#F97316', color: '#FFFFFF' }}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="mt-2 text-xs" style={{ color: '#9CA3AF' }}>
          💡 TODO: Conectar a Supabase Realtime o WebSocket
        </p>
      </div>
    </div>
  );
}
