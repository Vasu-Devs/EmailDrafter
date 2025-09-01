import { useState } from "react";
import api from "./api";

export default function EmailDrafter() {
  const [note, setNote] = useState("");
  const [tone, setTone] = useState("formal");
  const [recipient, setRecipient] = useState("");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    <div className="h-screen bg-zinc-700 flex text-zinc-100">
      {/* Left side - Form */}
      <div className="w-1/2 flex justify-center items-center p-8">
      <div className="w-full max-w-xl p-6 border rounded-lg shadow-lg bg-zinc-600 flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold mb-6 text-center">
          ✉️ AI Email Drafter
        </h1>

        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
          <textarea
            className="w-full p-2 border rounded text-black"
            rows={6}
            placeholder="Write rough notes here..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <select
            className="w-full p-2 border rounded text-black"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          >
            <option value="formal">Formal</option>
            <option value="casual">Casual</option>
            <option value="friendly">Friendly</option>
          </select>

          <input
            className="w-full p-2 border rounded text-black"
            type="text"
            placeholder="Recipient (e.g. boss@company.com)"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-zinc-400 hover:bg-blue-600 text-zinc-100 hover:text-zinc-50 font-medium rounded-lg transition w-full"
            >
              {loading ? "Drafting..." : "Generate Email"}
            </button>
          </div>
        </form>
      </div>
      </div>

      {/* Right side - Generated draft */}
      <div className="w-1/2 flex flex-col justify-center items-center p-8 bg-gray-200 text-black">
        {draft ? (
          <div className="w-full max-w-xl p-6 border rounded-lg shadow-lg bg-gray-50">
            <h2 className="text-lg font-semibold mb-3">📩 Generated Draft</h2>
            <textarea
              className="w-full h-96 p-3 border rounded resize-none"
              value={draft}
              readOnly
            />
            <button
              onClick={() => navigator.clipboard.writeText(draft)}
              className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition"
            >
              Copy to Clipboard
            </button>
          </div>
        ) : (
          <p className="text-gray-500">Generated email will appear here ✨</p>
        )}
      </div>
    </div>
  );
}
