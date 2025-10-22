'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';

export default function EditMemePage() {
  const params = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    videoUrl: '',
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    examples: [''],
    tags: '',
    source: '',
    editor: '',
    changes: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchMeme();
    }
  }, [params.id]);

  const fetchMeme = async () => {
    try {
      const response = await fetch(`/api/memes/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          title: data.title,
          description: data.description,
          imageUrl: data.imageUrl,
          videoUrl: data.videoUrl || '',
          year: data.year,
          month: data.month,
          examples: data.examples.length > 0 ? data.examples : [''],
          tags: data.tags.join(', '),
          source: data.source || '',
          editor: '',
          changes: '',
        });
      } else {
        alert('밈을 찾을 수 없습니다.');
        router.push('/');
      }
    } catch (error) {
      console.error('밈 로드 오류:', error);
      alert('밈을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleExampleChange = (index: number, value: string) => {
    const newExamples = [...formData.examples];
    newExamples[index] = value;
    setFormData((prev) => ({
      ...prev,
      examples: newExamples,
    }));
  };

  const addExample = () => {
    setFormData((prev) => ({
      ...prev,
      examples: [...prev.examples, ''],
    }));
  };

  const removeExample = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      examples: prev.examples.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.changes.trim()) {
      alert('수정 사항을 입력해주세요.');
      return;
    }

    setSaving(true);

    try {
      const tagsArray = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      const examplesArray = formData.examples.filter((ex) => ex.trim());

      const payload = {
        title: formData.title,
        description: formData.description,
        imageUrl: formData.imageUrl,
        videoUrl: formData.videoUrl,
        year: Number(formData.year),
        month: Number(formData.month),
        examples: examplesArray,
        tags: tagsArray,
        source: formData.source,
        editor: formData.editor || '익명',
        changes: formData.changes,
      };

      const response = await fetch(`/api/memes/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('밈이 성공적으로 수정되었습니다!');
        // 상세 페이지로 리다이렉트하면서 강제 새로고침
        window.location.href = `/meme/${params.id}`;
      } else {
        const error = await response.json();
        alert(`오류: ${error.error}`);
      }
    } catch (error) {
      console.error('밈 수정 오류:', error);
      alert('밈 수정에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const years = Array.from({ length: 26 }, (_, i) => 2025 - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          밈 편집하기
        </h1>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 space-y-6">
          {/* 제목 */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              밈 제목 *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* 연도와 월 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                연도 *
              </label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}년
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                월 *
              </label>
              <select
                name="month"
                value={formData.month}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}월
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 이미지 URL */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              대표 이미지 URL *
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* 설명 */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              상세 설명 * (마크다운 지원)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* 원본 영상 URL */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              원본 영상 링크 (선택)
            </label>
            <input
              type="url"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* 사용 예시 */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              사용 예시 (선택)
            </label>
            {formData.examples.map((example, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={example}
                  onChange={(e) => handleExampleChange(index, e.target.value)}
                  placeholder="예시를 입력하세요"
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                {formData.examples.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeExample(index)}
                    className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    삭제
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addExample}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              + 예시 추가
            </button>
          </div>

          {/* 태그 */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              태그 (쉼표로 구분)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* 출처 */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              출처 URL (선택)
            </label>
            <input
              type="url"
              name="source"
              value={formData.source}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* 수정 사항 (위키 스타일) */}
          <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
            <label className="block text-gray-900 dark:text-yellow-100 font-semibold mb-2">
              수정 사항 * (필수)
            </label>
            <textarea
              name="changes"
              value={formData.changes}
              onChange={handleChange}
              required
              rows={3}
              placeholder="예: 오타 수정, 설명 보완, 이미지 교체 등"
              className="w-full px-4 py-3 border border-yellow-300 dark:border-yellow-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent dark:bg-yellow-800 dark:text-white"
            />
            <p className="text-sm text-gray-600 dark:text-yellow-200 mt-2">
              ℹ️ 편집 이력에 기록됩니다. 어떤 내용을 수정했는지 간단히 설명해주세요.
            </p>
          </div>

          {/* 편집자 이름 */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              편집자 이름 (선택)
            </label>
            <input
              type="text"
              name="editor"
              value={formData.editor}
              onChange={handleChange}
              placeholder="익명"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* 버튼 */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition font-semibold"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? '저장 중...' : '수정 사항 저장'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

