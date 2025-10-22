// 메모리 기반 밈 저장소 (DB 없이 작동)

interface Meme {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  year: number;
  month: number;
  examples: string[];
  tags: string[];
  source?: string;
  createdAt: Date;
  updatedAt: Date;
  editHistory: {
    editor: string;
    editedAt: Date;
    changes: string;
  }[];
}

// 메모리에 밈 저장
let memes: Meme[] = [];
let nextId = 1;

// 샘플 데이터
const sampleMemes: Omit<Meme, '_id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: "강남스타일",
    description: "싸이의 '강남스타일'은 2012년 YouTube에서 폭발적인 인기를 얻으며 전 세계적인 현상이 되었습니다. 말춤과 함께 K-POP의 세계적 확산을 상징합니다.",
    imageUrl: "https://i.ytimg.com/vi/9bZkp7q19f0/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    year: 2012,
    month: 7,
    examples: ["말춤 따라하기", "패러디 영상"],
    tags: ["케이팝", "싸이", "댄스", "한국"],
    source: "https://knowyourmeme.com/memes/gangnam-style",
    editHistory: [{
      editor: "시스템",
      editedAt: new Date(),
      changes: "샘플 데이터"
    }]
  },
  {
    title: "Doge",
    description: "시바견 카보수의 사진에 Comic Sans 폰트로 'such wow', 'very amaze' 같은 깨진 영어를 덧붙인 밈입니다. 2013년에 인기를 얻어 암호화폐 Dogecoin까지 탄생시켰습니다.",
    imageUrl: "https://i.kym-cdn.com/entries/icons/original/000/013/564/doge.jpg",
    videoUrl: "",
    year: 2013,
    month: 8,
    examples: ["such wow", "very meme", "much doge"],
    tags: ["시바견", "암호화폐", "귀여움"],
    source: "https://knowyourmeme.com/memes/doge",
    editHistory: [{
      editor: "시스템",
      editedAt: new Date(),
      changes: "샘플 데이터"
    }]
  },
  {
    title: "Distracted Boyfriend",
    description: "남자친구가 다른 여성을 쳐다보는 스톡 사진 밈입니다. 2017년에 인기를 얻어 다양한 상황을 비유하는 데 사용되었습니다.",
    imageUrl: "https://i.kym-cdn.com/entries/icons/original/000/021/311/free.jpg",
    videoUrl: "",
    year: 2017,
    month: 8,
    examples: ["선택의 갈등 표현", "우선순위 비교"],
    tags: ["스톡사진", "관계", "선택"],
    source: "https://knowyourmeme.com/memes/distracted-boyfriend",
    editHistory: [{
      editor: "시스템",
      editedAt: new Date(),
      changes: "샘플 데이터"
    }]
  }
];

// 초기화
export function initMemoryStore() {
  if (memes.length === 0) {
    sampleMemes.forEach(meme => {
      memes.push({
        ...meme,
        _id: String(nextId++),
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });
    console.log(`✅ 메모리 저장소 초기화 완료 (${memes.length}개 샘플 밈)`);
  }
}

// 모든 밈 조회
export function getAllMemes(): Meme[] {
  initMemoryStore();
  return [...memes].sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    if (b.month !== a.month) return b.month - a.month;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
}

// ID로 밈 조회
export function getMemeById(id: string): Meme | null {
  initMemoryStore();
  return memes.find(m => m._id === id) || null;
}

// 밈 추가
export function addMeme(memeData: Omit<Meme, '_id' | 'createdAt' | 'updatedAt'>): Meme {
  initMemoryStore();
  const newMeme: Meme = {
    ...memeData,
    _id: String(nextId++),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  memes.push(newMeme);
  console.log(`✅ 밈 추가됨: "${newMeme.title}" (ID: ${newMeme._id})`);
  return newMeme;
}

// 밈 수정
export function updateMeme(id: string, updates: Partial<Meme>): Meme | null {
  initMemoryStore();
  const index = memes.findIndex(m => m._id === id);
  if (index === -1) return null;
  
  memes[index] = {
    ...memes[index],
    ...updates,
    _id: id,
    updatedAt: new Date()
  };
  console.log(`✅ 밈 수정됨: "${memes[index].title}" (ID: ${id})`);
  return memes[index];
}

// 밈 삭제
export function deleteMeme(id: string): boolean {
  initMemoryStore();
  const index = memes.findIndex(m => m._id === id);
  if (index === -1) return false;
  
  const deleted = memes.splice(index, 1)[0];
  console.log(`✅ 밈 삭제됨: "${deleted.title}" (ID: ${id})`);
  return true;
}

// 검색
export function searchMemes(query: string): Meme[] {
  initMemoryStore();
  const lowerQuery = query.toLowerCase();
  return memes.filter(meme => 
    meme.title.toLowerCase().includes(lowerQuery) ||
    meme.description.toLowerCase().includes(lowerQuery) ||
    meme.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  ).sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    if (b.month !== a.month) return b.month - a.month;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
}

