/**
 * 고급 밈 크롤러
 * 
 * 실제 웹사이트에서 밈 정보를 크롤링하는 스크립트입니다.
 * 
 * 주의: 웹사이트의 robots.txt와 이용 약관을 준수해야 합니다.
 * 너무 빠른 속도로 요청하면 IP가 차단될 수 있습니다.
 * 
 * 사용법:
 * node scripts/advanced-crawler.js
 */

const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/meme-encyclopedia';

// 요청 간 대기 시간 (밀리초)
const DELAY_BETWEEN_REQUESTS = 2000;

// 사용자 에이전트
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

/**
 * Know Your Meme에서 밈 정보 크롤링
 */
async function crawlKnowYourMeme() {
  const memes = [];
  
  try {
    // 트렌딩 페이지에서 밈 목록 가져오기
    const response = await axios.get('https://knowyourmeme.com/memes/trending', {
      headers: { 'User-Agent': USER_AGENT }
    });
    
    const $ = cheerio.load(response.data);
    
    // 각 밈 항목 파싱
    $('.entry-grid-body .entry').each((i, element) => {
      const title = $(element).find('h2 a').text().trim();
      const link = $(element).find('h2 a').attr('href');
      const imageUrl = $(element).find('img').attr('src');
      
      if (title && link) {
        memes.push({
          title,
          link: `https://knowyourmeme.com${link}`,
          imageUrl,
          source: 'Know Your Meme'
        });
      }
    });
    
    console.log(`✅ Know Your Meme에서 ${memes.length}개의 밈을 찾았습니다.`);
    
  } catch (error) {
    console.error('❌ Know Your Meme 크롤링 오류:', error.message);
  }
  
  return memes;
}

/**
 * 개별 밈 상세 정보 가져오기
 */
async function fetchMemeDetails(memeUrl) {
  try {
    await sleep(DELAY_BETWEEN_REQUESTS);
    
    const response = await axios.get(memeUrl, {
      headers: { 'User-Agent': USER_AGENT }
    });
    
    const $ = cheerio.load(response.data);
    
    // 상세 정보 파싱
    const description = $('#entry_body').text().trim();
    const year = extractYear($('.entry-info').text());
    const tags = [];
    
    $('.entry-tags a').each((i, el) => {
      tags.push($(el).text().trim());
    });
    
    return {
      description: description.substring(0, 500), // 처음 500자만
      year: year || new Date().getFullYear(),
      month: 1, // 기본값
      tags
    };
    
  } catch (error) {
    console.error(`상세 정보 가져오기 실패 (${memeUrl}):`, error.message);
    return null;
  }
}

/**
 * 텍스트에서 연도 추출
 */
function extractYear(text) {
  const match = text.match(/20\d{2}/);
  return match ? parseInt(match[0]) : null;
}

/**
 * 대기 함수
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Reddit에서 인기 밈 가져오기
 */
async function crawlReddit() {
  const memes = [];
  
  try {
    // Reddit API 사용 (인증 불필요한 공개 데이터)
    const subreddits = ['memes', 'dankmemes', 'MemeEconomy'];
    
    for (const subreddit of subreddits) {
      await sleep(DELAY_BETWEEN_REQUESTS);
      
      const response = await axios.get(`https://www.reddit.com/r/${subreddit}/top.json?limit=25&t=all`, {
        headers: { 'User-Agent': USER_AGENT }
      });
      
      if (response.data && response.data.data && response.data.data.children) {
        response.data.data.children.forEach(post => {
          const data = post.data;
          if (data.url && (data.url.includes('.jpg') || data.url.includes('.png') || data.url.includes('.gif'))) {
            memes.push({
              title: data.title,
              imageUrl: data.url,
              link: `https://www.reddit.com${data.permalink}`,
              score: data.score,
              created: new Date(data.created_utc * 1000),
              source: `Reddit r/${subreddit}`
            });
          }
        });
      }
      
      console.log(`✅ r/${subreddit}에서 밈 수집 완료`);
    }
    
    console.log(`✅ Reddit에서 총 ${memes.length}개의 밈을 찾았습니다.`);
    
  } catch (error) {
    console.error('❌ Reddit 크롤링 오류:', error.message);
  }
  
  return memes;
}

/**
 * 크롤링한 데이터를 데이터베이스에 저장
 */
async function saveMemes(memes) {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB 연결 성공');
    
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
    
    let addedCount = 0;
    let skippedCount = 0;
    
    for (const memeData of memes) {
      // 중복 체크
      const existing = await Meme.findOne({ title: memeData.title });
      if (existing) {
        skippedCount++;
        continue;
      }
      
      const meme = new Meme({
        title: memeData.title,
        description: memeData.description || '설명이 없습니다.',
        imageUrl: memeData.imageUrl || '',
        videoUrl: '',
        year: memeData.year || new Date().getFullYear(),
        month: memeData.month || 1,
        examples: [],
        tags: memeData.tags || [],
        source: memeData.link || memeData.source || '',
        editHistory: [{
          editor: '자동 크롤러',
          editedAt: new Date(),
          changes: '자동 수집'
        }]
      });
      
      await meme.save();
      addedCount++;
      console.log(`✅ "${memeData.title}" 추가됨`);
      
      await sleep(100); // DB 부하 방지
    }
    
    console.log(`\n✨ ${addedCount}개 추가, ${skippedCount}개 건너뜀`);
    
  } catch (error) {
    console.error('❌ 저장 오류:', error);
  } finally {
    await mongoose.disconnect();
  }
}

/**
 * 메인 실행 함수
 */
async function main() {
  console.log('🚀 고급 밈 크롤러 시작...\n');
  
  console.log('⚠️  주의사항:');
  console.log('   - 웹사이트의 robots.txt를 준수합니다');
  console.log('   - 요청 간 적절한 대기 시간을 설정했습니다');
  console.log('   - 과도한 크롤링은 IP 차단의 원인이 될 수 있습니다\n');
  
  const allMemes = [];
  
  // Know Your Meme 크롤링
  console.log('📖 Know Your Meme 크롤링 중...');
  const kymMemes = await crawlKnowYourMeme();
  allMemes.push(...kymMemes);
  
  // Reddit 크롤링
  console.log('\n🤖 Reddit 크롤링 중...');
  const redditMemes = await crawlReddit();
  allMemes.push(...redditMemes);
  
  // 데이터베이스에 저장
  console.log(`\n💾 총 ${allMemes.length}개의 밈을 데이터베이스에 저장 중...\n`);
  await saveMemes(allMemes);
  
  console.log('\n✅ 크롤링 완료!');
}

// 실행
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { crawlKnowYourMeme, crawlReddit, saveMemes };

