import { useState } from "react";
import api from "./api";

export default function EmailDrafter() {
  const [note, setNote] = useState("");
  const [tone, setTone] = useState("formal");
  const [recipient, setRecipient] = useState("");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setDraft("");
    const payload = { note, tone, recipient };
    try {
      const res = await api.post("/email-draft", payload, {
        headers: { "Content-Type": "application/json" },
      });
      if (res.data.reponse) {
        setDraft(res.data.reponse);
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

  return (
    <div className="min-h-screen bg-zinc-700 flex flex-col lg:flex-row text-zinc-100">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex justify-center items-center p-4 lg:p-8">
        <div className="w-full max-w-xl p-6 border border-zinc-500 rounded-lg shadow-xl bg-zinc-600">
          <h1 className="text-2xl lg:text-3xl font-bold mb-6 text-center text-zinc-100">
            ✉️ AI Email Drafter
          </h1>
          <div className="w-full space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-200 mb-2">
                Your Notes
              </label>
              <textarea
                className="w-full p-3 border border-zinc-400 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                rows={6}
                placeholder="Write rough notes here..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-200 mb-2">
                Tone
              </label>
              <select
                className="w-full p-3 border border-zinc-400 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              >
                <option value="formal">Formal</option>
                <option value="casual">Casual</option>
                <option value="friendly">Friendly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-200 mb-2">
                Recipient
              </label>
              <input
                className="w-full p-3 border border-zinc-400 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                type="text"
                placeholder="Recipient (e.g. boss@company.com)"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-500 text-zinc-100 font-medium rounded-lg transition duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
            >
              {loading ? "Drafting..." : "Generate Email"}
            </button>
          </div>
        </div>
      </div>

      {/* Right side - Generated draft */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-4 lg:p-8 bg-gray-100 text-black">
        {draft ? (
          <div className="w-full max-w-xl p-6 border border-gray-300 rounded-lg shadow-xl bg-white">
            <h2 className="text-lg lg:text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
              📩 Generated Draft
            </h2>
            <textarea
              className="w-full h-64 lg:h-96 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm lg:text-base"
              value={draft}
              readOnly
            />
            <button
              onClick={() => navigator.clipboard.writeText(draft)}
              className="mt-4 w-full lg:w-auto px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition duration-200 transform hover:scale-105"
            >
              📋 Copy to Clipboard
            </button>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-4">✨</div>
            <p className="text-lg">Generated email will appear here</p>
            <p className="text-sm mt-2">Fill out the form and hit generate!</p>
          </div>
        )}
      </div>
    </div>
  );
}
