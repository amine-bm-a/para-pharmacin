import React, { useState } from 'react';
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  Book, 
  Send, 
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const HelpCenter = () => {
  const [message, setMessage] = useState('');

  const faqItems = [
    {
      question: 'How do I track my order?',
      answer: 'You can track your order by going to "My Orders" section and clicking on the "Track" button next to your order. You will receive a tracking number via email once your order is shipped.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept credit/debit cards (Visa, Mastercard), cash on delivery, and bank transfers. All payments are secure and encrypted.',
    },
    {
      question: 'How do I upload a prescription?',
      answer: 'Go to the "Prescription Center" in your account dashboard and click on "Upload Prescription". You can upload PDF, JPG, or PNG files up to 10MB.',
    },
    {
      question: 'What is your return policy?',
      answer: 'You can return unopened products within 7 days of delivery. Please contact our support team to initiate a return request.',
    },
    {
      question: 'How do loyalty points work?',
      answer: 'You earn 1 point for every DH 10 spent. Points can be redeemed for discounts on future purchases. Check your loyalty program section for more details.',
    },
  ];

  const supportOptions = [
    {
      id: 'live-chat',
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      icon: MessageCircle,
      color: '#2E7D5B',
      available: true,
      waitTime: 'Available now',
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp Support',
      description: 'Quick support via WhatsApp messaging',
      icon: Phone,
      color: '#25D366',
      available: true,
      waitTime: 'Usually responds in 5 min',
    },
    {
      id: 'email',
      title: 'Email Support',
      description: 'Send us an email for detailed inquiries',
      icon: Mail,
      color: '#C9A96A',
      available: true,
      waitTime: 'Response within 24h',
    },
    {
      id: 'phone',
      title: 'Phone Support',
      description: 'Call our support hotline',
      icon: Phone,
      color: '#8FAF9B',
      available: true,
      waitTime: 'Mon-Sat, 9am-9pm',
    },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: 20,
      padding: 32,
      border: '1px solid #E8E8E8',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
      marginBottom: 32,
    }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1A1A1A', margin: 0, marginBottom: 4 }}>
          Help Center
        </h2>
        <p style={{ fontSize: 14, color: '#666', margin: 0 }}>
          Get help with orders, prescriptions, and account issues
        </p>
      </div>

      {/* Support Options */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', marginBottom: 16 }}>
          Contact Support
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {supportOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                style={{
                  padding: 24,
                  borderRadius: 16,
                  border: '1px solid #E8E8E8',
                  background: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = option.color;
                  e.currentTarget.style.boxShadow = `0 8px 30px rgba(0, 0, 0, 0.08)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#E8E8E8';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: option.color + '20',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Icon size={24} style={{ color: option.color }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A', margin: 0 }}>
                      {option.title}
                    </h4>
                  </div>
                  <ChevronRight size={20} style={{ color: '#999' }} />
                </div>
                <p style={{ fontSize: 13, color: '#666', margin: '0 0 8px 0' }}>
                  {option.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle size={12} style={{ color: option.color }} />
                  <span style={{ fontSize: 12, color: option.color, fontWeight: 600 }}>
                    {option.waitTime}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* FAQ Section */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', marginBottom: 16 }}>
          Frequently Asked Questions
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {faqItems.map((faq, index) => (
            <div
              key={index}
              style={{
                padding: 20,
                borderRadius: 16,
                border: '1px solid #E8E8E8',
                background: '#F8F9FA',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderColor = '#2E7D5B';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#F8F9FA';
                e.currentTarget.style.borderColor = '#E8E8E8';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: '#2E7D5B20',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Book size={18} style={{ color: '#2E7D5B' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A', marginBottom: 8 }}>
                    {faq.question}
                  </h4>
                  <p style={{ fontSize: 13, color: '#666', lineHeight: 1.6, margin: 0 }}>
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button style={{
          marginTop: 16,
          padding: '12px 24px',
          borderRadius: 10,
          border: '1px solid #E8E8E8',
          background: 'white',
          color: '#666',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#F6F1EB';
          e.currentTarget.style.borderColor = '#2E7D5B';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'white';
          e.currentTarget.style.borderColor = '#E8E8E8';
        }}
        >
          View All FAQs
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Quick Message */}
      <div style={{
        padding: 24,
        borderRadius: 16,
        background: 'linear-gradient(135deg, #2E7D5B10, #8FAF9B10)',
        border: '1px solid #2E7D5B30',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <MessageCircle size={24} style={{ color: '#2E7D5B' }} />
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', margin: 0 }}>
            Send us a quick message
          </h3>
        </div>
        
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe your issue or question..."
          rows={4}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: 12,
            border: '1px solid #E8E8E8',
            background: 'white',
            fontSize: 14,
            outline: 'none',
            resize: 'vertical',
            marginBottom: 16,
            fontFamily: 'inherit',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#2E7D5B';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(46, 125, 91, 0.1)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#E8E8E8';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 12, color: '#666', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Clock size={12} />
            Average response time: 2 hours
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            style={{
              padding: '12px 24px',
              borderRadius: 10,
              border: 'none',
              background: message.trim()
                ? 'linear-gradient(135deg, #2E7D5B, #8FAF9B)'
                : '#E8E8E8',
              color: message.trim() ? 'white' : '#999',
              fontSize: 14,
              fontWeight: 600,
              cursor: message.trim() ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (message.trim()) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(46, 125, 91, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (message.trim()) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            <Send size={16} />
            Send Message
          </button>
        </div>
      </div>

      {/* Contact Info */}
      <div style={{
        marginTop: 24,
        padding: 16,
        borderRadius: 12,
        background: '#F8F9FA',
        border: '1px solid #E8E8E8',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <AlertCircle size={20} style={{ color: '#C9A96A' }} />
        <div style={{ fontSize: 13, color: '#666', flex: 1 }}>
          <strong>Emergency?</strong> For urgent prescription matters, call our hotline directly: <strong>+212 5 24 42 38 23</strong>
        </div>
        <a
          href="tel:+212524423823"
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            background: '#2E7D5B',
            color: 'white',
            fontSize: 13,
            fontWeight: 600,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#8FAF9B';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#2E7D5B';
          }}
        >
          <Phone size={14} />
          Call Now
        </a>
      </div>
    </div>
  );
};

export default HelpCenter;
