import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

// 检测用户语言的多种方案
async function detectUserLanguage(): Promise<string> {
  try {
    // 方案1: 检查 Accept-Language 头部
    const headersList = await headers();
    const acceptLanguage = headersList.get('accept-language');
    
    if (acceptLanguage) {
      // 解析 Accept-Language 头部，获取首选语言
      const languages = acceptLanguage
        .split(',')
        .map(lang => {
          const [code, quality] = lang.trim().split(';q=');
          return {
            code: code.toLowerCase(),
            quality: quality ? parseFloat(quality) : 1.0
          };
        })
        .sort((a, b) => b.quality - a.quality);
      
      // 找到最高优先级的中文和英文语言
      let topChinese = null;
      let topEnglish = null;
      
      for (const lang of languages) {
        if (!topChinese && lang.code.startsWith('zh')) {
          topChinese = lang;
        }
        if (!topEnglish && lang.code.startsWith('en')) {
          topEnglish = lang;
        }
        // 如果都找到了，提前退出循环
        if (topChinese && topEnglish) break;
      }
      
      // 比较中文和英文的优先级
      if (topChinese && topEnglish) {
        // 两种语言都存在，根据quality因子决定
        return topChinese.quality >= topEnglish.quality ? 'zh' : 'en';
      } else if (topChinese) {
        // 只有中文
        return 'zh';
      } else if (topEnglish) {
        // 只有英文
        return 'en';
      }
      
      // 如果没有中文和英文，检查第一个语言是否为其他中文相关的代码
      const firstLang = languages[0];
      if (firstLang && (firstLang.code.includes('chinese') || firstLang.code.includes('中文'))) {
        return 'zh';
      }
    }
    
    // 方案2: 检查其他可能的中文相关头部
    const userAgent = headersList.get('user-agent');
    if (userAgent) {
      // 检查User-Agent中是否包含中文相关标识
      const chinesePatterns = [
        /zh-cn/i,
        /zh-tw/i,
        /chinese/i,
        /中文/,
      ];
      
      if (chinesePatterns.some(pattern => pattern.test(userAgent))) {
        return 'zh';
      }
    }
    
    // 方案3: 检查 CF-IPCountry 头部（如果使用 Cloudflare）
    const cfCountry = headersList.get('cf-ipcountry');
    if (cfCountry) {
      const chineseCountries = ['CN', 'TW', 'HK', 'MO', 'SG'];
      if (chineseCountries.includes(cfCountry.toUpperCase())) {
        return 'zh';
      }
    }
    
  } catch (error) {
    console.error('Error detecting user language:', error);
  }
  
  // 默认返回英文
  return 'en';
}

// This page only renders when the app is built statically (output: 'export')
export default async function RootPage() {
  const detectedLanguage = await detectUserLanguage();
  redirect(`/${detectedLanguage}`);
}