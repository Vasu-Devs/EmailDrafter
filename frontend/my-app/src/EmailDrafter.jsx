import { useState, useEffect } from "react";
import api from "./api";

export default function EmailDrafter() {
  const [note, setNote] = useState("");
  const [tone, setTone] = useState("formal");
  const [recipient, setRecipient] = useState("");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);
  const [wordCount, setWordCount] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setWordCount(note.trim() ? note.trim().split(/\s+/).length : 0);
  }, [note]);

  const handleSubmit = async () => {
    if (!note.trim()) return;
    
    setLoading(true);
    setDraft("");
    const payload = { note: note.trim(), tone, recipient };
    
    try {
      const res = await api.post("/email-draft", payload, {
        headers: { "Content-Type": "application/json" },
      });
      
      if (res.data.reponse) {
        const newDraft = res.data.reponse;
        setDraft(newDraft);
        
        const historyItem = {
          id: Date.now(),
          note: note.trim(),
          tone,
          recipient,
          draft: newDraft,
          timestamp: new Date().toLocaleString()
        };
        setHistory(prev => [historyItem, ...prev.slice(0, 4)]);
      } else {
        setDraft("❌ Error: " + JSON.stringify(res.data));
      }
    } catch (err) {
      console.error(err);
      setDraft("❌ Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(draft);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const clearForm = () => {
    setNote("");
    setRecipient("");
    setDraft("");
  };

  const loadFromHistory = (item) => {
    setNote(item.note);
    setTone(item.tone);
    setRecipient(item.recipient);
    setDraft(item.draft);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Theme classes
  const themeClasses = {
    bg: darkMode ? 'bg-black' : 'bg-white',
    text: darkMode ? 'text-white' : 'text-black',
    cardBg: darkMode ? 'bg-gray-900' : 'bg-gray-50',
    cardBorder: darkMode ? 'border-gray-700' : 'border-gray-200',
    inputBg: darkMode ? 'bg-gray-800' : 'bg-white',
    inputBorder: darkMode ? 'border-gray-600' : 'border-gray-300',
    inputText: darkMode ? 'text-white' : 'text-black',
    buttonPrimary: darkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800',
    buttonSecondary: darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-black',
    historyItem: darkMode ? 'bg-gray-800 hover:bg-gray-700 border-gray-600' : 'bg-white hover:bg-gray-50 border-gray-200',
    textSecondary: darkMode ? 'text-gray-300' : 'text-gray-600',
    textMuted: darkMode ? 'text-gray-400' : 'text-gray-500'
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${themeClasses.bg} ${themeClasses.text}`}>
      {/* Header */}
      <div className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-100 border-gray-200'} border-b transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <span className="text-4xl">✉️</span>
                AI Email Drafter
              </h1>
              <p className={`mt-2 ${themeClasses.textSecondary}`}>
                Transform your messy thoughts into polished emails
              </p>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`p-3 rounded-full transition-all duration-300 ${themeClasses.buttonSecondary} shadow-md hover:shadow-lg`}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <span className="text-xl">
                {darkMode ? '☀️' : '🌙'}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="xl:col-span-1">
          <div className={`${themeClasses.cardBg} rounded-xl p-8 border ${themeClasses.cardBorder} shadow-lg transition-all duration-300 hover:shadow-xl`}>
            <div className="flex items-center gap-3 mb-8">
              <span className="text-2xl">📝</span>
              <h2 className="text-xl font-bold">What's on your mind?</h2>
            </div>

            <div className="space-y-6">
              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold mb-3">
                  Your messy thoughts 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${themeClasses.buttonSecondary}`}>
                    {wordCount} words
                  </span>
                </label>
                <textarea
                  className={`w-full p-4 border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.inputText} rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all duration-200`}
                  rows={6}
                  placeholder="Write rough notes here... like 'need to ask boss about vacation' or 'tell client the project is delayed'"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              {/* Recipient */}
              <div>
                <label className="block text-sm font-semibold mb-3">
                  Who's this for?
                </label>
                <input
                  className={`w-full p-4 border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.inputText} rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all duration-200`}
                  type="text"
                  placeholder="Recipient (e.g. boss@company.com)"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </div>

              {/* Tone */}
              <div>
                <label className="block text-sm font-semibold mb-4">
                  What vibe are we going for?
                </label>
                <div className="space-y-3">
                  {[
                    { value: "formal", label: "Formal", icon: "👔" },
                    { value: "casual", label: "Casual", icon: "😎" },
                    { value: "friendly", label: "Friendly", icon: "😊" }
                  ].map((option) => (
                    <label key={option.value} className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 hover:${themeClasses.buttonSecondary} ${tone === option.value ? themeClasses.buttonSecondary : ''}`}>
                      <input
                        type="radio"
                        name="tone"
                        value={option.value}
                        checked={tone === option.value}
                        onChange={(e) => setTone(e.target.value)}
                        className="mr-4 w-4 h-4"
                      />
                      <span className="text-lg mr-3">{option.icon}</span>
                      <span className="font-medium">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  onClick={handleSubmit}
                  disabled={loading || !note.trim()}
                  className={`flex-1 px-8 py-4 font-bold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md ${themeClasses.buttonPrimary}`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      Drafting...
                    </span>
                  ) : (
                    "✨ Generate Email"
                  )}
                </button>
                <button
                  onClick={clearForm}
                  className={`px-6 py-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg ${themeClasses.buttonSecondary}`}
                  title="Clear all fields"
                >
                  <span className="text-lg">🗑️</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div className="xl:col-span-1">
          <div className={`${themeClasses.cardBg} rounded-xl p-8 border ${themeClasses.cardBorder} shadow-lg transition-all duration-300 hover:shadow-xl min-h-[600px]`}>
            {draft ? (
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📩</span>
                    <h2 className="text-xl font-bold">Generated Draft</h2>
                  </div>
                  <button
                    onClick={handleCopy}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg ${copied ? 'bg-green-500 text-white' : themeClasses.buttonPrimary}`}
                  >
                    {copied ? "✅ Copied!" : "📋 Copy"}
                  </button>
                </div>
                <textarea
                  className={`flex-1 p-6 border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.inputText} rounded-xl resize-none min-h-96 focus:outline-none font-mono leading-relaxed`}
                  value={draft}
                  readOnly
                />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                <div className="text-8xl opacity-50">✨</div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">Generated email will appear here</h3>
                  <p className={`${themeClasses.textSecondary} max-w-md text-lg leading-relaxed`}>
                    Fill out the form and hit generate to see your polished email!
                  </p>
                </div>
                {!note.trim() && (
                  <div className={`${themeClasses.textMuted} text-sm px-4 py-2 rounded-lg ${themeClasses.buttonSecondary}`}>
                    💡 Write some notes to get started
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="xl:col-span-1">
            <div className={`${themeClasses.cardBg} rounded-xl p-8 border ${themeClasses.cardBorder} shadow-lg transition-all duration-300 hover:shadow-xl`}>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">🕒</span>
                <h3 className="text-xl font-bold">Recent emails</h3>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => loadFromHistory(item)}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border shadow-sm hover:shadow-md ${themeClasses.historyItem}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className={`text-xs ${themeClasses.textMuted}`}>
                        {item.timestamp}
                      </span>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${themeClasses.buttonSecondary}`}>
                        {item.tone}
                      </span>
                    </div>
                    <p className="text-sm font-medium mb-2 line-clamp-2">
                      {item.note.length > 80 ? `${item.note.substring(0, 80)}...` : item.note}
                    </p>
                    {item.recipient && (
                      <p className={`text-xs ${themeClasses.textMuted}`}>
                        📧 To: {item.recipient}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
