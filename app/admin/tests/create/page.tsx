'use client';

import { useState, useEffect } from 'react';
import type { AdminLessonOption } from '@/types/admin';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, ChevronLeft, Plus, Trash2, CheckCircle2, Save, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface QuestionState {
  question: string;
  answers: { text: string; isCorrect: boolean }[];
}

export default function AdminCreateTestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [lessons, setLessons] = useState<AdminLessonOption[]>([]);

  const [lessonId, setLessonId] = useState('');
  const [testTitle, setTestTitle] = useState('');
  const [questions, setQuestions] = useState<QuestionState[]>([
    {
      question: '',
      answers: [
        { text: '', isCorrect: true },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
      ],
    },
  ]);

  useEffect(() => {
    async function loadLessons() {
      try {
        const res = await fetch('/api/admin/lessons', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        const list = data.lessons || [];
        setLessons(list);
        if (list.length > 0) {
          setLessonId(list[0].id);
          setTestTitle(`${list[0].title} Testi`);
        }
      } catch {
        toast.error('Darslar ro\u2018yxatini yuklab bo\u2018lmadi');
      }
    }
    loadLessons();
  }, []);

  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        question: '',
        answers: [
          { text: '', isCorrect: true },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
        ],
      },
    ]);
  };

  const handleRemoveQuestion = (idx: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleQuestionTextChange = (qIdx: number, text: string) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[qIdx].question = text;
      return updated;
    });
  };

  const handleAnswerTextChange = (qIdx: number, aIdx: number, text: string) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[qIdx].answers[aIdx].text = text;
      return updated;
    });
  };

  const handleCorrectAnswerSelect = (qIdx: number, aIdx: number) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[qIdx].answers = updated[qIdx].answers.map((a, i) => ({
        ...a,
        isCorrect: i === aIdx,
      }));
      return updated;
    });
  };

  const handleSaveTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonId || !testTitle.trim()) {
      toast.error('Dars va test nomini kiriting');
      return;
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].question.trim()) {
        toast.error(`${i + 1}-savol matnini kiriting`);
        return;
      }
      for (let j = 0; j < questions[i].answers.length; j++) {
        if (!questions[i].answers[j].text.trim()) {
          toast.error(`${i + 1}-savolning ${j + 1}-javob variantini to'ldiring`);
          return;
        }
      }
    }

    setLoading(true);
    try {
      // Test + questions + answers land in one call, so a partially written
      // test is never exposed to a student (TZ §22.7).
      const res = await fetch('/api/admin/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lesson_id: lessonId,
          title: testTitle,
          passing_score: 90,
          is_published: true,
          questions: questions.map((q) => ({
            question: q.question,
            points: 1,
            multiple: false,
            answers: q.answers.map((a) => ({ answer: a.text, is_correct: a.isCorrect })),
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Test yaratishda xatolik');

      toast.success('Test va savollar muvaffaqiyatli saqlandi!');
      router.push('/admin/tests');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Test yaratishda xatolik');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between pb-6 border-b border-white/5">
        <Link
          href="/admin/tests"
          className="text-white/50 hover:text-white text-xs font-bold flex items-center gap-1.5 transition"
        >
          <ChevronLeft size={16} /> Testlar ro&apos;yxatiga qaytish
        </Link>
        <span className="text-xs font-mono text-emerald-400 font-bold uppercase">Test konstruktori</span>
      </div>

      <div className="bg-[#111] border border-white/5 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
        <div>
          <h1 className="text-2xl font-black text-white">Yangi Test Yaratish</h1>
          <p className="text-xs text-white/50 mt-1">Dars oxiridagi 90% talabiga ega bo&apos;lgan amaliy imtihon.</p>
        </div>

        <form onSubmit={handleSaveTest} className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono uppercase text-white/60 mb-1.5">Tegishli dars *</label>
              <select
                required
                value={lessonId}
                onChange={(e) => {
                  setLessonId(e.target.value);
                  const sel = lessons.find((l) => l.id === e.target.value);
                  if (sel) setTestTitle(`${sel.title} Testi`);
                }}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition"
              >
                {lessons.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.courseTitle ? `${l.courseTitle} — ` : ''}{l.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-white/60 mb-1.5">Test sarlavhasi *</label>
              <input
                type="text"
                required
                value={testTitle}
                onChange={(e) => setTestTitle(e.target.value)}
                placeholder="Market Structure Testi"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          {/* Questions Section */}
          <div className="space-y-6 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Sparkles size={18} className="text-emerald-400" />
                Savollar ro&apos;yxati ({questions.length} ta savol)
              </h2>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-xl border border-emerald-500/20 flex items-center gap-1.5 transition"
              >
                <Plus size={14} /> Savol qo&apos;shish
              </button>
            </div>

            {questions.map((q, qIdx) => (
              <div key={qIdx} className="bg-black/50 border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
                    Savol #{qIdx + 1}
                  </span>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(qIdx)}
                      className="text-rose-400 hover:text-rose-300 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  required
                  value={q.question}
                  onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                  placeholder="Savol matnini kiriting..."
                  className="w-full bg-black/70 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                />

                {/* Answers Options */}
                <div className="space-y-2.5 pt-2">
                  <span className="text-[11px] font-mono uppercase text-white/40 block">
                    Javob variantlari (To&apos;g&apos;ri javobni tanlang):
                  </span>
                  {q.answers.map((ans, aIdx) => (
                    <div key={aIdx} className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleCorrectAnswerSelect(qIdx, aIdx)}
                        className={`w-6 h-6 rounded-full border flex items-center justify-center transition flex-shrink-0 ${
                          ans.isCorrect
                            ? 'bg-emerald-500 border-emerald-500 text-black'
                            : 'border-white/20 hover:border-white/50 text-transparent'
                        }`}
                      >
                        <CheckCircle2 size={14} />
                      </button>
                      <input
                        type="text"
                        required
                        value={ans.text}
                        onChange={(e) => handleAnswerTextChange(qIdx, aIdx, e.target.value)}
                        placeholder={`Variant ${aIdx + 1}`}
                        className={`flex-1 bg-black/60 border rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none transition ${
                          ans.isCorrect ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/5'
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center gap-2"
            >
              {loading ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
              Testni saqlash
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
