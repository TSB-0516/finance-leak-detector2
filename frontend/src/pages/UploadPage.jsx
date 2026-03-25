import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeStatement } from '../api/config';
import { useAnalysis } from '../context/AnalysisContext';
import DropZone from '../components/upload/DropZone';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorAlert from '../components/ui/ErrorAlert';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setAnalysisData } = useAnalysis();
  const navigate = useNavigate();

  async function handleAnalyze() {
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const data = await analyzeStatement(file);
      setAnalysisData(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to analyze statement. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface-base flex flex-col items-center justify-center px-4 py-12">
      {loading && <LoadingSpinner message="Analyzing your statement..." />}

      <div className="w-full max-w-lg text-center animate-fade-in">
        {/* Logo & Title */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-accent-primary flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-text-primary tracking-tight mb-2">
          Finance Leak Detector
        </h1>
        <p className="text-sm text-text-muted mb-10">
          Upload your bank statement to uncover spending leaks
        </p>

        {/* Error */}
        {error && (
          <div className="mb-6">
            <ErrorAlert message={error} onDismiss={() => setError('')} />
          </div>
        )}

        {/* Drop Zone */}
        <DropZone onFileSelect={setFile} />

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          disabled={!file || loading}
          className={`
            mt-8 w-full max-w-xs mx-auto block px-8 py-3 rounded-xl text-sm font-semibold
            transition-all duration-300 ease-out
            ${file && !loading
              ? 'bg-accent-primary text-white hover:bg-accent-soft hover:shadow-lg hover:shadow-accent-primary/20 active:scale-[0.98]'
              : 'bg-surface-raised text-text-faint cursor-not-allowed'
            }
          `}
        >
          {loading ? 'Analyzing...' : 'Analyze Statement'}
        </button>

        {/* Footer */}
        <p className="text-xs text-text-faint mt-12">
          Your data stays on this device · Rule-based analysis · No AI tracking
        </p>
      </div>
    </div>
  );
}
