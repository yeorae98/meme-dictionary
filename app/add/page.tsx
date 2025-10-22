'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

export default function AddMemePage() {
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
  });
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === 'imageUrl') {
      setImagePreview(value);
    }
  };

  const handleImagePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        const blob = items[i].getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const base64 = event.target?.result as string;
            setFormData((prev) => ({ ...prev, imageUrl: base64 }));
            setImagePreview(base64);
          };
          reader.readAsDataURL(blob);
        }
        break;
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setFormData((prev) => ({ ...prev, imageUrl: base64 }));
        setImagePreview(base64);
      };
      reader.readAsDataURL(file);
    }
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
    setLoading(true);

    try {
      const tagsArray = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      const examplesArray = formData.examples.filter((ex) => ex.trim());

      const payload = {
        ...formData,
        tags: tagsArray,
        examples: examplesArray,
        year: Number(formData.year),
        month: Number(formData.month),
      };

      const response = await fetch('/api/memes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        alert('밈이 성공적으로 추가되었습니다!');
        // 홈페이지로 리다이렉트하면서 강제 새로고침
        window.location.href = '/';
      } else {
        const error = await response.json();
        alert(`오류: ${error.error}`);
      }
    } catch (error) {
      console.error('밈 추가 오류:', error);
      alert('밈 추가에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const years = Array.from({ length: 26 }, (_, i) => 2025 - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          새로운 밈 추가하기
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
              placeholder="예: 강남스타일"
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

          {/* 이미지 */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              대표 이미지 (선택사항)
            </label>
            
            {/* 이미지 미리보기 */}
            {imagePreview && (
              <div className="mb-3 relative w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                <img 
                  src={imagePreview} 
                  alt="미리보기" 
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, imageUrl: '' }));
                    setImagePreview('');
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                >
                  삭제
                </button>
              </div>
            )}

            {/* 이미지 업로드 방법 */}
            <div className="space-y-3">
              {/* 파일 업로드 */}
              <div>
                <label className="block w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center cursor-pointer hover:border-blue-500 transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <span className="text-gray-600 dark:text-gray-300">
                    📁 파일 선택 또는 이미지 드래그
                  </span>
                </label>
              </div>

              {/* URL 입력 */}
              <div className="relative">
                <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl.startsWith('data:') ? '' : formData.imageUrl}
                  onChange={handleChange}
                  onPaste={handleImagePaste}
                  placeholder="🔗 이미지 URL 입력 또는 이미지 붙여넣기 (Ctrl+V)"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <p className="text-sm text-gray-500 dark:text-gray-400">
                💡 팁: 이미지를 복사한 후 URL 입력창에 Ctrl+V로 붙여넣으세요!
              </p>
            </div>
          </div>

          {/* 설명 */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              상세 설명 (선택사항, 마크다운 지원)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={8}
              placeholder="밈에 대한 자세한 설명을 작성해주세요. 마크다운 형식을 사용할 수 있습니다. (선택사항)"
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
              placeholder="https://youtube.com/watch?v=..."
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
              placeholder="케이팝, 댄스, 바이럴"
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
              placeholder="https://..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
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
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '추가 중...' : '밈 추가하기'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

