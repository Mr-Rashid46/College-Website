import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Sparkles } from 'lucide-react';
import API from '../../api/axios';

const DEFAULT_FAQS = [
  {
    keywords: ['admission', 'apply', 'form', 'enroll', 'process', 'cap', 'cet'],
    answer: 'Admissions for B.Tech, M.Tech, B.Pharm, and MCA courses at DBATU are conducted via Centralized Admission Process (CAP) on the MHT-CET portal (cetcell.mahacet.org). Select DBATU Lonere during choice code filling.',
  },
  {
    keywords: ['course', 'programme', 'degree', 'btech', 'mtech', 'bpharm', 'mca', 'engineering'],
    answer: 'DBATU offers B.Tech (Computer, EXTC, Mechanical, Civil), B.Pharm, M.Tech (Computer Engg), MCA, and Ph.D. research programmes. Visit our Academics page to view detailed syllabi.',
  },
  {
    keywords: ['notice', 'exam', 'timetable', 'result', 'circular', 'winter', 'summer'],
    answer: 'All official DBATU examination timetables, revaluation circulars, and merit lists are published on our Notice Board and official portal (dbatu.ac.in).',
  },
  {
    keywords: ['contact', 'address', 'phone', 'location', 'email', 'lonere'],
    answer: 'DBATU Campus is located at Lonere, Mangaon, Raigad District, Maharashtra - 402103. Phone: +91 2140 275142. Email: registrar@dbatu.ac.in.',
  },
  {
    keywords: ['fee', 'scholarship', 'freeship', 'mahadbt'],
    answer: 'Fee structures for DBATU technological programmes are displayed under Admissions. Category students can apply for Government Scholarships via MahaDBT portal.',
  },
];

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [faqs, setFaqs] = useState(DEFAULT_FAQS);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am DBATU Virtual Assistant. How can I help you today regarding engineering admissions, B.Tech/M.Tech courses, or university examination timetables?',
    },
  ]);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await API.get('/faqs');
        if (res.data.success && res.data.data.length > 0) {
          setFaqs(res.data.data);
        }
      } catch (err) {
        // Fallback to default FAQs
      }
    };
    fetchFaqs();
  }, []);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg.trim();
    const newMsgs = [...messages, { sender: 'user', text: userText }];
    setMessages(newMsgs);
    setInputMsg('');
    setIsTyping(true);

    // Generate response with artificial dynamic delay
    setTimeout(() => {
      const lower = userText.toLowerCase();
      const match = faqs.find((item) =>
        item.keywords && item.keywords.some((k) => lower.includes(k.toLowerCase()))
      );

      let botReply = match
        ? match.answer
        : "Thank you for reaching out! For detailed inquiries, please use our Contact Us form or email the Registrar at registrar@dbatu.ac.in.";

      setMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
      setIsTyping(false);
    }, 700);
  };

  const handleQuickQuestion = (qText) => {
    setInputMsg(qText);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {!isOpen ? (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-navy-900 to-navy-800 text-gold-400 border-2 border-gold-500 shadow-glow flex items-center justify-center relative group"
            aria-label="Open Assistant Chatbot"
          >
            <MessageSquare className="w-6 h-6 stroke-[2.2]" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold-400 rounded-full border-2 border-white animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold-400 rounded-full border-2 border-white"></span>
          </motion.button>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 40 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[500px]"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white p-4 flex justify-between items-center border-b border-navy-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 text-navy-950 flex items-center justify-center font-bold shadow-md">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold font-serif text-white flex items-center gap-1.5">
                    <span>DBATU Assistant</span>
                    <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                  </h4>
                  <p className="text-[10px] text-gold-300 font-medium">Online | Instant Helper</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-navy-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick FAQ Pills */}
            <div className="bg-slate-50 p-2.5 border-b border-slate-200 flex gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
              <button
                onClick={() => handleQuickQuestion('Admissions Process')}
                className="px-3 py-1 bg-white border border-slate-200 rounded-full whitespace-nowrap text-navy-900 hover:bg-navy-50 font-semibold shadow-xs transition-colors"
              >
                🎓 Admissions
              </button>
              <button
                onClick={() => handleQuickQuestion('Programmes Offered')}
                className="px-3 py-1 bg-white border border-slate-200 rounded-full whitespace-nowrap text-navy-900 hover:bg-navy-50 font-semibold shadow-xs transition-colors"
              >
                📚 Courses
              </button>
              <button
                onClick={() => handleQuickQuestion('Exam Notices')}
                className="px-3 py-1 bg-white border border-slate-200 rounded-full whitespace-nowrap text-navy-900 hover:bg-navy-50 font-semibold shadow-xs transition-colors"
              >
                📢 Notices
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
              {messages.map((m, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.sender === 'bot' && (
                    <div className="w-7 h-7 rounded-xl bg-navy-900 text-gold-400 flex items-center justify-center shrink-0 mt-1 text-xs shadow-xs">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-[82%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-gradient-to-r from-navy-900 to-navy-800 text-white rounded-br-none shadow-md'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none shadow-sm font-medium'
                    }`}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex gap-2 items-center text-slate-400 text-xs pl-2 pt-1">
                  <Bot className="w-4 h-4 text-gold-500 animate-bounce" />
                  <span className="italic">Assistant is typing...</span>
                </div>
              )}
            </div>

            {/* Footer Input */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 text-xs px-4 py-2.5 border border-slate-300 rounded-full focus:outline-none focus:border-navy-700 font-medium"
              />
              <button
                type="submit"
                className="w-9 h-9 rounded-full bg-navy-900 hover:bg-navy-950 text-gold-400 flex items-center justify-center transition-transform transform hover:scale-105 shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatbotWidget;
