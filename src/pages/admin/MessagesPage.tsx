import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getContactMessages, markMessageAsRead } from '../../services/contactService';
import { Mail, CheckCircle, User, Calendar, Tag } from 'lucide-react';

interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  visitorId?: string;
  role?: string;
  date: string;
  read: boolean;
}

const MessagesPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    fetchMessages();
  }, [token]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await getContactMessages(token);
      setMessages(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMessageClick = async (message: Message) => {
    setSelectedMessage(message);
    
    // Mark as read if not already read
    if (!message.read) {
      try {
        await markMessageAsRead(message._id, token);
        
        // Update local state
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg._id === message._id ? { ...msg, read: true } : msg
          )
        );
      } catch (err) {
        console.error('Error marking message as read:', err);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Contact Messages</h1>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-card dark:spider-card shadow rounded-lg overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-semibold">Messages ({messages.length})</h2>
          </div>
          
          <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No messages found
              </div>
            ) : (
              messages.map(message => (
                <div
                  key={message._id}
                  onClick={() => handleMessageClick(message)}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedMessage?._id === message._id
                      ? 'bg-primary/10'
                      : 'hover:bg-muted'
                  } ${!message.read ? 'font-medium' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-medium truncate flex-1">{message.name}</span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                      {formatDate(message.date).split(',')[0]}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground truncate flex-1">{message.email}</span>
                    {!message.read && (
                      <span className="w-2 h-2 rounded-full bg-primary ml-2"></span>
                    )}
                  </div>
                  <div className="mt-1 text-sm truncate">{message.message}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="bg-card dark:spider-card shadow rounded-lg p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-semibold">{selectedMessage.name}</h2>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  selectedMessage.read
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                    : 'bg-primary/10 text-primary'
                }`}>
                  {selectedMessage.read ? 'Read' : 'Unread'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <a href={`mailto:${selectedMessage.email}`} className="text-primary hover:underline">
                    {selectedMessage.email}
                  </a>
                </div>
                
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{formatDate(selectedMessage.date)}</span>
                </div>

                {selectedMessage.role && (
                  <div className="flex items-center text-sm">
                    <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{selectedMessage.role}</span>
                  </div>
                )}

                {selectedMessage.visitorId && (
                  <div className="flex items-center text-sm">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="truncate" title={selectedMessage.visitorId}>
                      Visitor ID: {selectedMessage.visitorId.substring(0, 8)}...
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-4">
                <h3 className="text-sm font-medium mb-2">Message:</h3>
                <div className="text-sm whitespace-pre-wrap">{selectedMessage.message}</div>
              </div>

              <div className="mt-6 flex justify-end">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: Contact Form Submission`}
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Reply via Email
                  <Mail size={16} className="ml-2" />
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-card dark:spider-card shadow rounded-lg p-6 flex flex-col items-center justify-center h-full min-h-[300px]">
              <Mail size={48} className="text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
