import React, { useMemo, useState } from 'react';
import axios from 'axios';
import { Sparkles, Globe, FileText, CheckCircle, AlertCircle, ExternalLink, Send, RefreshCw } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function App() {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [formType, setFormType] = useState('scholarship');
  const [userMessage, setUserMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [formInfo, setFormInfo] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const requiredFields = useMemo(
    () => (formInfo?.fields || []).filter((field) => field.required),
    [formInfo]
  );

  const analyzeWebsite = async () => {
    setLoading(true);
    setError('');
    setFormInfo(null);
    setAnalysis(null);
    setConversation([]);
    try {
      const response = await axios.post(`${API_BASE}/api/analyze-form`, { url: websiteUrl });
      setFormInfo(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not analyse this website. Check the URL and backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const sendInformation = async (event) => {
    event?.preventDefault();
    if (!userMessage.trim() || !formInfo) return;
    const nextConversation = [...conversation, { role: 'user', content: userMessage.trim() }];
    setConversation(nextConversation);
    setUserMessage('');
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API_BASE}/api/collect-info`, {
        formType,
        fields: formInfo.fields,
        conversation: nextConversation,
      });
      setAnalysis(response.data);
      if (response.data.next_question) {
        setConversation((items) => [...items, { role: 'assistant', content: response.data.next_question }]);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'The AI could not process that information. Check that Ollama is running.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFormInfo(null);
    setAnalysis(null);
    setConversation([]);
    setError('');
  };

  const copyValues = async () => {
    await navigator.clipboard.writeText(JSON.stringify(analysis?.field_values || {}, null, 2));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-5 md:p-8 font-sans">
      <header className="max-w-5xl mx-auto mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900">Digital Divide Navigator</h1>
        <p className="text-slate-600 mt-2">Understand forms, collect missing information, and prepare accurate applications.</p>
      </header>

      <main className="max-w-5xl mx-auto space-y-6">
        <section className="bg-white p-5 md:p-6 rounded-xl shadow border border-slate-200">
          <div className="flex items-center gap-2 mb-4 text-blue-700">
            <Globe size={21} />
            <h2 className="text-xl font-semibold">1. Connect to an application form</h2>
          </div>
          <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="website-url">Public website URL</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input id="website-url" type="url" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://example.com/scholarship-form" className="flex-1 min-w-0 p-3 border rounded-lg" />
            <button onClick={analyzeWebsite} disabled={loading || !websiteUrl.trim()}
              className="px-5 py-3 rounded-lg bg-blue-600 text-white font-semibold disabled:bg-slate-400">
              {loading && !formInfo ? 'Analysing...' : 'Analyse website'}
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2">The backend must be able to reach the URL. Some sites block automated requests or require sign-in.</p>
          {formInfo && <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            <span className="text-green-700 flex items-center gap-1"><CheckCircle size={16} /> Form detected</span>
            <span className="text-slate-600">{formInfo.page_title || 'Untitled page'}</span>
            <span className="text-slate-500">{formInfo.fields.length} fields ({requiredFields.length} required)</span>
            <a href={formInfo.url} target="_blank" rel="noreferrer" className="text-blue-700 inline-flex items-center gap-1"><ExternalLink size={14} /> Open website</a>
            <button onClick={reset} className="text-slate-600 inline-flex items-center gap-1"><RefreshCw size={14} /> Reset</button>
          </div>}
        </section>

        {formInfo && <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-white p-5 md:p-6 rounded-xl shadow border border-slate-200">
            <div className="flex items-center gap-2 mb-4 text-blue-700">
              <FileText size={20} /><h2 className="text-xl font-semibold">2. Tell us about yourself</h2>
            </div>
            <label htmlFor="form-type" className="block text-sm font-medium text-slate-700 mb-1">Application type</label>
            <select id="form-type" value={formType} onChange={(e) => setFormType(e.target.value)} className="w-full p-2 border rounded-lg mb-4">
              <option value="scholarship">Scholarship application</option>
              <option value="job_application">Job application</option>
              <option value="government_grant">Government grant</option>
              <option value="general">Other form</option>
            </select>

            <div className="mb-4">
              <p className="text-sm font-semibold text-slate-700 mb-2">Fields found on the website</p>
              <div className="max-h-52 overflow-auto border rounded-lg divide-y">
                {formInfo.fields.map((field, index) => <div key={`${field.name}-${index}`} className="p-2 text-sm flex justify-between gap-3">
                  <span className="text-slate-800">{field.label || field.name || field.id || `Field ${index + 1}`}</span>
                  <span className="text-slate-500 shrink-0">{field.type}{field.required ? ' · required' : ''}</span>
                </div>)}
              </div>
            </div>

            <form onSubmit={sendInformation}>
              <label htmlFor="user-story" className="block text-sm font-medium text-slate-700 mb-1">Describe your situation or answer the AI's question</label>
              <textarea id="user-story" value={userMessage} onChange={(e) => setUserMessage(e.target.value)}
                placeholder="For example: My name is Adam. I study at SNS College. My annual family income is 2 lakh rupees..."
                className="w-full p-3 border rounded-lg min-h-36" />
              <button type="submit" disabled={loading || !userMessage.trim()} className="w-full mt-3 bg-blue-600 text-white py-3 rounded-lg font-semibold disabled:bg-slate-400 flex justify-center items-center gap-2">
                <Send size={17} /> {loading ? 'AI is processing...' : 'Send information'}
              </button>
            </form>
          </section>

          <section className="bg-white p-5 md:p-6 rounded-xl shadow border border-slate-200">
            <div className="flex items-center gap-2 mb-4 text-green-700">
              <Sparkles size={20} /><h2 className="text-xl font-semibold">3. AI information check</h2>
            </div>
            <div className="space-y-3 max-h-52 overflow-auto mb-4">
              {conversation.length === 0 ? <p className="text-slate-400 italic">Your conversation with the assistant will appear here.</p> : conversation.map((item, index) =>
                <div key={index} className={`p-3 rounded-lg text-sm ${item.role === 'user' ? 'bg-blue-50 ml-5' : 'bg-slate-100 mr-5'}`}>
                  <p className="font-semibold mb-1">{item.role === 'user' ? 'You' : 'Digital Divide Navigator'}</p>
                  <p className="whitespace-pre-wrap">{item.content}</p>
                </div>)}
            </div>

            {analysis && <div className="border-t pt-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold text-slate-800">Extracted field values</h3>
                {analysis.complete ? <span className="text-green-700 text-sm flex items-center gap-1"><CheckCircle size={15}/> Required details collected</span> : <span className="text-amber-700 text-sm flex items-center gap-1"><AlertCircle size={15}/> More details needed</span>}
              </div>
              <div className="space-y-2 max-h-64 overflow-auto">
                {Object.entries(analysis.field_values || {}).map(([key, value]) => <div key={key} className="p-2 bg-slate-50 rounded border text-sm">
                  <p className="text-xs uppercase text-slate-500 font-semibold">{key.replace(/_/g, ' ')}</p>
                  <p className="text-slate-800 break-words">{value === null || value === '' ? 'Not provided' : String(value)}</p>
                </div>)}
              </div>
              {!!analysis.missing_fields?.length && <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm">
                <p className="font-semibold text-amber-900">Still missing</p>
                <ul className="list-disc pl-5 text-amber-800">{analysis.missing_fields.map((field) => <li key={field}>{field}</li>)}</ul>
              </div>}
              {analysis.complete && <button onClick={copyValues} className="w-full p-3 rounded-lg bg-green-700 text-white font-semibold">Copy field values</button>}
              <p className="text-xs text-slate-500">Review all extracted details. This prototype prepares field values; it does not submit the external application.</p>
            </div>}
          </section>
        </div>}

        {error && <div role="alert" className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">{error}</div>}
      </main>
    </div>
  );
}
