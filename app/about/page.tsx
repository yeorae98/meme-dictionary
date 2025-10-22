import Header from '@/components/Header';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            밈 백과사전 소개
          </h1>

          <div className="prose dark:prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                🎭 밈 백과사전이란?
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                밈 백과사전은 2000년부터 현재까지의 인터넷 밈을 연도별, 월별로 체계적으로 정리한
                협업 기반 온라인 아카이브입니다. 나무위키처럼 누구나 자유롭게 밈을 추가하고
                편집할 수 있으며, 모든 편집 내역은 투명하게 기록됩니다.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                ✨ 주요 기능
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>연도별, 월별로 정리된 체계적인 밈 아카이브</li>
                <li>토글 방식으로 쉽게 탐색 가능한 인터페이스</li>
                <li>각 밈의 상세 정보 (이미지, 원본 영상, 설명, 사용 예시 등)</li>
                <li>누구나 밈을 추가하고 편집할 수 있는 위키 스타일 시스템</li>
                <li>모든 편집 이력 투명 공개</li>
                <li>강력한 검색 기능</li>
                <li>태그 시스템으로 관련 밈 찾기</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                📝 편집 가이드
              </h2>
              <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  밈 추가하기
                </h3>
                <ol className="list-decimal list-inside space-y-1 text-gray-700 dark:text-gray-300">
                  <li>상단 메뉴에서 "밈 추가" 버튼 클릭</li>
                  <li>밈의 제목, 연도, 월 등 기본 정보 입력</li>
                  <li>대표 이미지 URL 입력 (필수)</li>
                  <li>밈에 대한 자세한 설명 작성 (마크다운 지원)</li>
                  <li>원본 영상 링크, 사용 예시, 태그 등 추가 정보 입력</li>
                  <li>편집자 이름 입력 (선택사항)</li>
                </ol>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg mt-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  밈 편집하기
                </h3>
                <ol className="list-decimal list-inside space-y-1 text-gray-700 dark:text-gray-300">
                  <li>편집하고 싶은 밈 페이지로 이동</li>
                  <li>"편집" 버튼 클릭</li>
                  <li>내용 수정</li>
                  <li>"수정 사항" 필드에 어떤 부분을 수정했는지 간단히 설명</li>
                  <li>저장하면 편집 이력에 자동으로 기록됩니다</li>
                </ol>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                💡 작성 팁
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>설명은 마크다운 형식으로 작성할 수 있습니다</li>
                <li>이미지는 외부 URL을 사용합니다 (Imgur, 위키미디어 등)</li>
                <li>태그는 쉼표로 구분하여 입력합니다</li>
                <li>사용 예시는 밈이 실제로 어떻게 사용되는지 보여줍니다</li>
                <li>출처는 가능한 한 공신력 있는 자료를 링크합니다</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                🤝 기여하기
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                밈 백과사전은 커뮤니티의 참여로 만들어집니다. 여러분이 아는 밈을 추가하고,
                잘못된 정보를 수정하고, 더 나은 설명을 작성해주세요. 모든 기여는 편집 이력에
                기록되며, 더 풍부한 밈 아카이브를 만드는 데 도움이 됩니다.
              </p>
            </section>

            <section className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 p-6 rounded-lg mt-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                지금 바로 시작하세요!
              </h2>
              <div className="flex justify-center gap-4">
                <Link
                  href="/"
                  className="px-6 py-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-lg hover:shadow-lg transition font-semibold"
                >
                  밈 둘러보기
                </Link>
                <Link
                  href="/add"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition font-semibold"
                >
                  밈 추가하기
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

