'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Send, User, Shield } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [ticket, setTicket] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    adminApi.get<any>(`/admin/support/${params.id}`)
      .then(data => {
        setTicket(data);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.id]);

  async function handleSendMessage() {
    if (!newMessage.trim()) return;
    setSending(true);
    try {
      const msg = await adminApi.post<any>(`/admin/support/${params.id}/reply`, { message: newMessage.trim() });
      setTicket((prev: any) => ({
        ...prev,
        messages: [...(prev?.messages || []), msg],
      }));
      setNewMessage('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  async function updateStatus(status: string) {
    try {
      await adminApi.patch(`/admin/support/${params.id}/status`, { status });
      setTicket((prev: any) => ({ ...prev, status }));
    } catch (err: any) {
      setError(err.message);
    }
  }

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!ticket) return <div className="p-6 text-gray-500">Ticket not found</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600 mt-1">
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{ticket.subject}</h1>
              <span className={`badge ${
                ticket.status === 'open' ? 'badge-error' :
                ticket.status === 'pending' ? 'badge-warning' : 'badge-success'
              }`}>{ticket.status}</span>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              {ticket.id.slice(0, 8)} | {ticket.user?.email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {ticket.status === 'open' && (
            <Button size="sm" onClick={() => updateStatus('pending')}>Accept Ticket</Button>
          )}
          {(ticket.status === 'open' || ticket.status === 'pending') && (
            <Button variant="ghost" size="sm" onClick={() => updateStatus('resolved')}>Mark Resolved</Button>
          )}
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">Conversation</h2>
        <div className="space-y-4 max-h-[600px] overflow-y-auto mb-4">
          {ticket.messages?.map((msg: any) => (
            <div key={msg.id} className={`flex gap-3 ${msg.senderType === 'admin' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                msg.senderType === 'admin' ? 'bg-admin-accent text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {msg.senderType === 'admin' ? <Shield size={14} /> : <User size={14} />}
              </div>
              <div className={`flex-1 max-w-[80%] ${msg.senderType === 'admin' ? 'text-right' : ''}`}>
                <div className={`rounded-lg p-4 inline-block text-left ${
                  msg.senderType === 'admin' ? 'bg-admin-accent text-white' : 'bg-gray-100 text-gray-800'
                }`}>
                  <p className="text-sm">{msg.message}</p>
                </div>
                <div className="text-xs text-gray-500 mt-1">{new Date(msg.createdAt).toLocaleString()}</div>
              </div>
            </div>
          ))}
          {(!ticket.messages || ticket.messages.length === 0) && (
            <p className="text-gray-400 text-sm">No messages yet</p>
          )}
        </div>

        <div className="border-t pt-4">
          <div className="flex gap-3">
            <textarea
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Type your reply..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-admin-accent focus:ring-2 focus:ring-admin-accent/10 outline-none transition-all min-h-[80px] resize-none"
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <div className="flex items-end">
              <Button onClick={handleSendMessage} disabled={!newMessage.trim() || sending}>
                <Send size={16} className="mr-1" />
                Send
              </Button>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Press Enter to send, Shift+Enter for new line</p>
        </div>
      </div>
    </div>
  );
}
