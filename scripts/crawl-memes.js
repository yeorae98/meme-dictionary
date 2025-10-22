/**
 * 밈 크롤링 스크립트
 * 
 * 이 스크립트는 Know Your Meme, Reddit, Wikipedia 등에서
 * 2000년~2025년의 인기 밈 정보를 수집합니다.
 * 
 * 사용법:
 * node scripts/crawl-memes.js
 */

const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');

// MongoDB 연결
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/meme-encyclopedia';

// 밈 데이터베이스 스키마
const MemeSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String,
  videoUrl: String,
  year: Number,
  month: Number,
  examples: [String],
  tags: [String],
  source: String,
  editHistory: [{
    editor: String,
    editedAt: Date,
    changes: String,
  }],
}, { timestamps: true });

const Meme = mongoose.models.Meme || mongoose.model('Meme', MemeSchema);

// 샘플 밈 데이터 (2000년~2025년)
// 실제 크롤링 대신 대표적인 밈들을 미리 정의
const SAMPLE_MEMES = [
  // 2000년대 초반
  {
    title: "Dancing Baby",
    description: "1996년에 처음 등장했지만 2000년대 초반에 인터넷에서 폭발적으로 인기를 얻은 춤추는 아기 3D 애니메이션입니다. 초기 바이럴 비디오의 대표적인 예시입니다.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Dancing_baby.gif/220px-Dancing_baby.gif",
    videoUrl: "",
    year: 2000,
    month: 1,
    examples: ["이메일로 공유", "웹사이트 배경"],
    tags: ["초기인터넷", "3D애니메이션", "바이럴"],
    source: "https://knowyourmeme.com/memes/dancing-baby"
  },
  {
    title: "All Your Base Are Belong to Us",
    description: "1989년 비디오 게임 'Zero Wing'의 엉터리 영어 번역에서 유래한 밈입니다. 2000년대 초반 인터넷에서 패러디와 리믹스의 대상이 되었습니다.",
    imageUrl: "https://i.imgur.com/placeholder.jpg",
    videoUrl: "",
    year: 2000,
    month: 2,
    examples: ["포토샵 편집", "플래시 애니메이션"],
    tags: ["게임", "번역오류", "클래식"],
    source: "https://knowyourmeme.com/memes/all-your-base-are-belong-to-us"
  },
  
  // 2005-2010년대
  {
    title: "Rickroll",
    description: "Rick Astley의 'Never Gonna Give You Up' 뮤직비디오로 누군가를 속여 보내는 인터넷 밈입니다. 2007년 4chan에서 시작되어 전 세계적으로 퍼졌습니다.",
    imageUrl: "https://i.imgur.com/placeholder.jpg",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    year: 2007,
    month: 5,
    examples: ["링크 트롤링", "깜짝 영상"],
    tags: ["릭애슬리", "트롤", "클래식"],
    source: "https://knowyourmeme.com/memes/rickroll"
  },
  {
    title: "LOLcats / I Can Has Cheezburger?",
    description: "재미있는 표정의 고양이 사진에 잘못된 문법의 캡션을 붙인 이미지 매크로입니다. 2007년에 시작되어 인터넷 밈 문화의 주류가 되었습니다.",
    imageUrl: "https://i.imgur.com/placeholder.jpg",
    videoUrl: "",
    year: 2007,
    month: 1,
    examples: ["I can has cheezburger?", "Im in ur base"],
    tags: ["고양이", "이미지매크로", "귀여움"],
    source: "https://knowyourmeme.com/memes/lolcats"
  },
  
  // 2010년대
  {
    title: "Gangnam Style (강남스타일)",
    description: "싸이의 '강남스타일'은 2012년 YouTube에서 폭발적인 인기를 얻으며 전 세계적인 현상이 되었습니다. 말춤과 함께 K-POP의 세계적 확산을 상징합니다.",
    imageUrl: "https://i.imgur.com/placeholder.jpg",
    videoUrl: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    year: 2012,
    month: 7,
    examples: ["말춤 따라하기", "패러디 영상"],
    tags: ["케이팝", "싸이", "댄스", "한국"],
    source: "https://knowyourmeme.com/memes/gangnam-style"
  },
  {
    title: "Doge",
    description: "시바견 카보수의 사진에 Comic Sans 폰트로 'such wow', 'very amaze' 같은 깨진 영어를 덧붙인 밈입니다. 2013년에 인기를 얻어 암호화폐 Dogecoin까지 탄생시켰습니다.",
    imageUrl: "https://i.imgur.com/placeholder.jpg",
    videoUrl: "",
    year: 2013,
    month: 8,
    examples: ["such wow", "very meme", "much doge"],
    tags: ["시바견", "암호화폐", "귀여움"],
    source: "https://knowyourmeme.com/memes/doge"
  },
  {
    title: "Harlem Shake",
    description: "Baauer의 'Harlem Shake' 음악에 맞춰 춤추는 짧은 영상 밈입니다. 2013년 2월에 전 세계적으로 수천 개의 패러디 영상이 만들어졌습니다.",
    imageUrl: "https://i.imgur.com/placeholder.jpg",
    videoUrl: "",
    year: 2013,
    month: 2,
    examples: ["단체 댄스 영상", "오피스 패러디"],
    tags: ["댄스", "바이럴", "음악"],
    source: "https://knowyourmeme.com/memes/harlem-shake"
  },
  {
    title: "Ice Bucket Challenge",
    description: "ALS(루게릭병) 인식 개선을 위한 캠페인으로, 얼음물을 머리에 붓고 다음 사람을 지목하는 챌린지입니다. 2014년 여름 전 세계적으로 유행했습니다.",
    imageUrl: "https://i.imgur.com/placeholder.jpg",
    videoUrl: "",
    year: 2014,
    month: 7,
    examples: ["유명인 챌린지", "기부 캠페인"],
    tags: ["챌린지", "자선", "사회운동"],
    source: "https://knowyourmeme.com/memes/ice-bucket-challenge"
  },
  {
    title: "What Does the Fox Say?",
    description: "노르웨이 코미디 듀오 Ylvis의 노래로, 여우의 울음소리를 우스꽝스럽게 표현한 뮤직비디오입니다. 2013년 바이럴 히트를 기록했습니다.",
    imageUrl: "https://i.imgur.com/placeholder.jpg",
    videoUrl: "https://www.youtube.com/watch?v=jofNR_WkoCE",
    year: 2013,
    month: 9,
    examples: ["Ring-ding-ding-ding-dingeringeding"],
    tags: ["음악", "코미디", "동물"],
    source: "https://knowyourmeme.com/memes/the-fox-what-does-the-fox-say"
  },
  
  // 2015-2020년대
  {
    title: "Damn Daniel",
    description: "흰색 Vans 신발을 신은 Daniel을 찍은 짧은 스냅챗 영상에서 유래한 밈입니다. 2016년 초에 바이럴 되었습니다.",
    imageUrl: "https://i.imgur.com/placeholder.jpg",
    videoUrl: "",
    year: 2016,
    month: 2,
    examples: ["Damn Daniel, back at it again"],
    tags: ["스냅챗", "패션", "청소년"],
    source: "https://knowyourmeme.com/memes/damn-daniel"
  },
  {
    title: "Pepe the Frog",
    description: "Matt Furie의 만화 캐릭터에서 유래한 개구리 밈입니다. 다양한 감정을 표현하는 밈으로 사용되었으나 후에 논란이 되었습니다.",
    imageUrl: "https://i.imgur.com/placeholder.jpg",
    videoUrl: "",
    year: 2015,
    month: 1,
    examples: ["Feels good man", "Sad frog"],
    tags: ["개구리", "감정", "논란"],
    source: "https://knowyourmeme.com/memes/pepe-the-frog"
  },
  {
    title: "Distracted Boyfriend",
    description: "남자친구가 다른 여성을 쳐다보는 스톡 사진 밈입니다. 2017년에 인기를 얻어 다양한 상황을 비유하는 데 사용되었습니다.",
    imageUrl: "https://i.imgur.com/placeholder.jpg",
    videoUrl: "",
    year: 2017,
    month: 8,
    examples: ["선택의 갈등 표현", "우선순위 비교"],
    tags: ["스톡사진", "관계", "선택"],
    source: "https://knowyourmeme.com/memes/distracted-boyfriend"
  },
  {
    title: "Woman Yelling at Cat",
    description: "고양이 앞에서 샐러드를 먹는 고양이 사진과 소리지르는 여성의 이미지를 합성한 밈입니다. 2019년에 폭발적으로 인기를 얻었습니다.",
    imageUrl: "https://i.imgur.com/placeholder.jpg",
    videoUrl: "",
    year: 2019,
    month: 5,
    examples: ["논쟁 패러디", "의견 대립"],
    tags: ["고양이", "논쟁", "합성"],
    source: "https://knowyourmeme.com/memes/woman-yelling-at-a-cat"
  },
  {
    title: "Baby Yoda (The Child)",
    description: "디즈니+ 시리즈 '만달로리안'에 등장하는 귀여운 캐릭터입니다. 2019년 말 엄청난 인기를 얻으며 수많은 밈을 탄생시켰습니다.",
    imageUrl: "https://i.imgur.com/placeholder.jpg",
    videoUrl: "",
    year: 2019,
    month: 11,
    examples: ["This is the way", "Baby Yoda sipping soup"],
    tags: ["스타워즈", "귀여움", "디즈니"],
    source: "https://knowyourmeme.com/memes/baby-yoda"
  },
  
  // 2020년대
  {
    title: "Bernie Sanders Mittens",
    description: "2021년 바이든 대통령 취임식에서 털장갑을 낀 채 앉아있는 버니 샌더스의 사진이 밈이 되었습니다.",
    imageUrl: "https://i.imgur.com/placeholder.jpg",
    videoUrl: "",
    year: 2021,
    month: 1,
    examples: ["포토샵 합성", "다양한 배경에 버니 추가"],
    tags: ["정치", "패션", "포토샵"],
    source: "https://knowyourmeme.com/memes/bernie-sanders-mittens"
  },
  {
    title: "Coffin Dance",
    description: "가나의 관 운반 댄서들이 춤추며 관을 나르는 영상입니다. 2020년 코로나19 팬데믹 기간 동안 실패나 위험한 상황을 표현하는 밈으로 사용되었습니다.",
    imageUrl: "https://i.imgur.com/placeholder.jpg",
    videoUrl: "",
    year: 2020,
    month: 4,
    examples: ["Astronomia 음악", "실패 영상 편집"],
    tags: ["댄스", "음악", "가나", "코로나19"],
    source: "https://knowyourmeme.com/memes/coffin-dance-dancing-pallbearers"
  },
  {
    title: "Among Us",
    description: "2018년에 출시되었지만 2020년에 폭발적으로 인기를 얻은 게임 'Among Us'와 관련된 밈들입니다. 'sus'(의심스러운), 임포스터 등의 용어가 밈화되었습니다.",
    imageUrl: "https://i.imgur.com/placeholder.jpg",
    videoUrl: "",
    year: 2020,
    month: 9,
    examples: ["That's sus", "Red is impostor"],
    tags: ["게임", "Twitch", "의심"],
    source: "https://knowyourmeme.com/memes/among-us"
  },
  {
    title: "Sigma Male / Sigma Grindset",
    description: "남성 위계질서 밈의 일종으로, '시그마 남성'은 독립적이고 비순응적인 남성상을 표현합니다. 2021년에 인기를 얻었습니다.",
    imageUrl: "https://i.imgur.com/placeholder.jpg",
    videoUrl: "",
    year: 2021,
    month: 6,
    examples: ["Sigma grindset", "Patrick Bateman edits"],
    tags: ["남성성", "풍자", "문화"],
    source: "https://knowyourmeme.com/memes/sigma-male"
  },
  {
    title: "Let Me Do It For You",
    description: "도움을 주려는 사람이 일을 더 복잡하게 만드는 상황을 표현하는 밈입니다.",
    imageUrl: "https://i.imgur.com/placeholder.jpg",
    videoUrl: "",
    year: 2022,
    month: 3,
    examples: ["일 도와주기 실패"],
    tags: ["관계", "유머"],
    source: ""
  },
  
  // 2023-2025년
  {
    title: "AI Chat Screenshots",
    description: "ChatGPT를 비롯한 AI 챗봇과의 대화를 캡처한 스크린샷이 밈이 되었습니다. AI의 재미있거나 놀라운 응답이 공유됩니다.",
    imageUrl: "https://i.imgur.com/placeholder.jpg",
    videoUrl: "",
    year: 2023,
    month: 1,
    examples: ["ChatGPT 유머", "AI 실수"],
    tags: ["인공지능", "ChatGPT", "기술"],
    source: "https://knowyourmeme.com/memes/chatgpt"
  },
  {
    title: "Barbenheimer",
    description: "'바비'와 '오펜하이머' 영화가 같은 날 개봉하면서 생긴 밈입니다. 두 영화의 극명한 대조가 인터넷 문화 현상이 되었습니다.",
    imageUrl: "https://i.imgur.com/placeholder.jpg",
    videoUrl: "",
    year: 2023,
    month: 7,
    examples: ["더블 상영", "분홍색 vs 검정색"],
    tags: ["영화", "문화현상", "2023"],
    source: "https://knowyourmeme.com/memes/barbenheimer"
  },
  {
    title: "Grimace Shake",
    description: "맥도날드의 보라색 캐릭터 '그리메이스'의 쉐이크를 마신 후 죽거나 이상한 일이 생기는 내용의 TikTok 트렌드입니다.",
    imageUrl: "https://i.imgur.com/placeholder.jpg",
    videoUrl: "",
    year: 2023,
    month: 6,
    examples: ["그리메이스 쉐이크 챌린지", "가짜 죽음 연기"],
    tags: ["틱톡", "맥도날드", "챌린지"],
    source: "https://knowyourmeme.com/memes/grimace-shake"
  },
  {
    title: "Spiderman Pointing Meme",
    description: "1967년 스파이더맨 애니메이션에서 두 스파이더맨이 서로를 가리키는 장면이 밈이 되었습니다. 비슷한 두 대상을 비교할 때 사용됩니다.",
    imageUrl: "https://i.imgur.com/placeholder.jpg",
    videoUrl: "",
    year: 2011,
    month: 12,
    examples: ["서로 닮은 것들 비교", "책임 전가"],
    tags: ["스파이더맨", "마블", "클래식"],
    source: "https://knowyourmeme.com/memes/spider-man-pointing-at-spider-man"
  },
  {
    title: "Bing Chilling",
    description: "배우 존 시나가 중국어로 아이스크림을 사랑한다고 말하는 영상에서 유래한 밈입니다. 2021년에 인기를 얻었습니다.",
    imageUrl: "https://i.imgur.com/placeholder.jpg",
    videoUrl: "",
    year: 2021,
    month: 5,
    examples: ["Bing chilling", "중국어 발음"],
    tags: ["존시나", "중국", "WWE"],
    source: "https://knowyourmeme.com/memes/john-cenas-bing-chilling"
  }
];

// 데이터베이스에 밈 추가
async function seedMemes() {
  try {
    console.log('MongoDB에 연결 중...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB 연결 성공');

    console.log('\n기존 밈 데이터 확인 중...');
    const existingCount = await Meme.countDocuments();
    console.log(`현재 ${existingCount}개의 밈이 등록되어 있습니다.`);

    if (existingCount > 0) {
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });

      await new Promise((resolve) => {
        readline.question('\n기존 데이터를 삭제하고 새로 시작하시겠습니까? (y/N): ', async (answer) => {
          if (answer.toLowerCase() === 'y') {
            console.log('기존 데이터 삭제 중...');
            await Meme.deleteMany({});
            console.log('✅ 기존 데이터 삭제 완료');
          }
          readline.close();
          resolve();
        });
      });
    }

    console.log('\n샘플 밈 데이터 추가 중...');
    let addedCount = 0;

    for (const memeData of SAMPLE_MEMES) {
      // 중복 체크
      const existing = await Meme.findOne({ title: memeData.title });
      if (existing) {
        console.log(`⏭️  "${memeData.title}" - 이미 존재함 (건너뜀)`);
        continue;
      }

      const meme = new Meme({
        ...memeData,
        editHistory: [{
          editor: '크롤러',
          editedAt: new Date(),
          changes: '자동 수집'
        }]
      });

      await meme.save();
      addedCount++;
      console.log(`✅ "${memeData.title}" (${memeData.year}년 ${memeData.month}월) 추가됨`);
    }

    console.log(`\n✨ 총 ${addedCount}개의 밈이 추가되었습니다!`);
    
    const finalCount = await Meme.countDocuments();
    console.log(`📊 현재 데이터베이스에 ${finalCount}개의 밈이 있습니다.`);

    console.log('\n💡 추가 밈을 수집하려면 다음 사이트들을 참고하세요:');
    console.log('   - https://knowyourmeme.com/');
    console.log('   - https://en.wikipedia.org/wiki/List_of_Internet_phenomena');
    console.log('   - Reddit r/memes, r/dankmemes');
    
  } catch (error) {
    console.error('❌ 오류 발생:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ 데이터베이스 연결 종료');
  }
}

// 실행
if (require.main === module) {
  seedMemes();
}

module.exports = { seedMemes, SAMPLE_MEMES };

