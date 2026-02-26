export type Language = 'ko' | 'en' | 'mn' | 'ja' | 'zh';

export const TRANSLATIONS: Record<Language, any> = {
  ko: {
    nav: { about: '소개', curriculum: '커리큘럼', sponsorship: '후원', donate: '후원하기', translate: '번역하기', schools: '학교 및 프로젝트', profiles: '프로필 소개', admin: '관리자' },
    hero: {
      tag: 'MONGLE MONGLE PROJECT',
      title: 'Teaching Google AI in the Mongolia of the Blue Sky.',
      desc: '이유빈과 이다예린이 몽골의 학생들에게 인공지능의 미래를 전하러 떠납니다.\n구글 AI 기술을 통해 몽골의 새로운 가능성을 여는 이 여정에 여러분의 따뜻한 손길을 더해주세요.',
      donate: '후원하기'
    },
    stats: { students: '교육 대상 학생', focus: '교육 커리큘럼', periodLabel: 'Period', periodValue: '3월~7월(총 5개월)' },
    funding: {
      title: '후원 진행 현황',
      desc: '우리의 목표를 향해 함께 달려가고 있습니다.',
      sponsors: '후원자',
      amount: '총 후원 금액',
      days: '남은 기간',
      recentTitle: '최근 후원자 목록',
      viewAll: '전체 보기',
      unitPerson: '명',
      unitDay: '일',
      unitWon: '원',
      goalLabel: '목표 인원',
      goalUnit: '명'
    },
    mission: {
      title: '프로필 소개',
      team: { title: '팀 소개', desc: '이유빈과 이다예린은 기술이 세상을 더 나은 곳으로 만들 수 있다고 믿습니다. 몽골의 교육 소외 지역을 찾아가 직접 구글 AI 도구와 기초 프로그래밍을 교육합니다.' },
      profiles: [
        { name: '이유빈', age: '20살', certs: 'Google Level 1, Level 2', edu: '학력: 심리학 학사 과정중', role: '팀 리더 / AI 강사' },
        { name: '이다예린', age: '16살', certs: 'Google Level 1, Level 2', role: 'AI 강사 / 콘텐츠 제작' }
      ],
      curriculum: {
        title: '구글 AI 커리큘럼',
        desc: 'Gemini, Teachable Machine 등 구글의 최신 AI 도구들을 활용하여 학생들이 실생활의 문제를 해결하는 프로젝트 중심의 수업을 진행합니다.',
        items: [
          { title: 'Google Slides', desc: '효과적인 발표 자료를 만들고 공유하는 방법을 배웁니다.' },
          { title: 'Google Sheets', desc: '데이터를 정리하고 분석하며 수식을 활용하는 기초를 다집니다.' },
          { title: 'Google Classroom', desc: '디지털 학습 환경에서 과제를 관리하고 소통하는 법을 익힙니다.' },
          { title: 'Google Forms', desc: '설문조사를 만들고 데이터를 수집하여 분석하는 과정을 경험합니다.' },
          { title: 'Google Drive', desc: '파일을 안전하게 저장하고 협업을 위해 공유하는 클라우드 시스템을 이해합니다.' },
          { title: 'Notebook LM', desc: 'AI 기반의 노트를 활용하여 정보를 요약하고 인사이트를 얻는 최신 기술을 배웁니다.' },
          { title: 'Vibe coding', desc: 'AI와 대화하며 코드를 작성하고 창의적인 프로젝트를 수행하는 새로운 코딩 방식을 경험합니다.' },
          { title: 'Google Educator Level 1', desc: '구글 도구를 교육 현장에서 활용하는 기초 역량을 인증받는 과정을 준비합니다.' },
          { title: 'Google Educator Level 2', desc: '보다 심화된 구글 도구 활용 능력을 갖추어 혁신적인 교육 전문가로 거듭납니다.' }
        ]
      },
      timeline: { title: '타임라인', desc: '2026년 3월부터 몽골 NEST학교와 UBMK학교에 교사, 학생들에게 Google AI 교육을 진행할 예정입니다.' }
    },
    sponsorship: {
      title: '후원하기',
      desc: '몽골의 미래를 여는 기술 교육에 동참해주세요.\n지속적인 변화를 만드는 \'정기 약정\'과 자유로운 \'일시 후원\' 중 선택하실 수 있습니다.',
      commitment: '후원 약정하기',
      oneTime: '일시 후원하기',
      howTo: '후원하는 방법...',
      howToDesc: '후원약정이나, 일시후원을 완료하면, 계좌화면이 나옵니다.\n그 계좌번호로 입금해주시면 됩니다.\n감사합니다.',
      quickTiers: '빠른 선택',
      select: '선택하기'
    },
    modal: {
      commitmentTitle: '정기 후원 약정서',
      oneTimeTitle: '일시 후원 신청서',
      commitmentDesc: '매달 50,000원 정기 후원 (5회)',
      oneTimeDesc: '자유로운 금액 후원',
      nameLabel: '성함',
      namePlaceholder: '이름을 입력해주세요',
      phoneLabel: '연락처',
      amountLabel: '후원 금액 (50,000원부터)',
      targetLabel: '후원 대상 선택',
      messageLabel: '응원 메시지 보내기',
      messagePlaceholder: '따뜻한 응원의 한마디를 남겨주세요',
      submitCommitment: '약정 완료하기',
      submitOneTime: '후원 신청하기',
      infoCommitment: '후원 약정에 대해서...',
      infoDonation: '일시 후원에 대해서...',
      infoCommitmentDesc: '정기 후원 약정은 매달 1회 50,000원을 후원하는 방식입니다. 입력하신 연락처로 매달 1번 후원 안내 메시지를 보내드립니다.',
      infoDonationDesc: '일시 후원은 영구적인 약정이 아닌, 원하실 때마다 금액을 바꾸어 가며 자유롭게 참여하실 수 있는 후원 방식입니다. 최소 50,000원부터 가능합니다.',
      successTitleCommitment: '약정이 완료되었습니다!',
      successTitleOneTime: '후원 신청이 완료되었습니다!',
      aiGenerating: 'AI가 감사 메시지를 작성 중입니다...',
      bankGuide: '입금 계좌 안내',
      targetAccount: '님 후원 계좌',
      thanksMsg: '님의 따뜻한 마음이 큰 힘이 됩니다.',
      monthlyMsg: '매달 1회 안내 메시지를 보내드리겠습니다.',
      close: '닫기'
    },
    schools: {
      title: '학교 및 프로젝트 소개',
      nest: {
        name: 'NEST 학교',
        desc: '그곳은 한국의 과학고같은 영재학생들이 모여있지만 구글 교육시스템은 아직 도입되지 않았습니다. 선생님들이 디지털 도구를 활용해 더 효과적으로 가르칠 수 있도록 돕습니다.'
      },
      ubmk: {
        name: 'UBMK 학교',
        desc: 'UBMK학교는 한국사람의 자녀들, 다문화가정 자녀들이 다니는 학교입니다. 디지털 전환이 필요한 이곳에 구글 워크스페이스를 구축하고 교사들에게 AI기초를 가르칩니다.'
      },
      chromebook: {
        name: 'Chromebook Project',
        desc: '디지털교육에는 PC가 필요합니다. PC가 없는 학생들을위해 이번 후원을 통해 교육용 PC를 선물하고 활용법을 가르칩니다.'
      }
    },
    footer: {
      privacy: '개인정보 처리방침',
      terms: '이용약관',
      contact: '문의하기',
      rights: '© 2026 Lee Yu-bin & Lee Da-yerin. All rights reserved.'
    }
  },
  en: {
    nav: { about: 'About', curriculum: 'Curriculum', sponsorship: 'Sponsorship', donate: 'Donate Now', translate: 'Translate', schools: 'Schools & Projects', profiles: 'Team Profiles', admin: 'Admin' },
    hero: {
      tag: 'MONGLE MONGLE PROJECT',
      title: 'Teaching Google AI in the Mongolia of the Blue Sky.',
      desc: 'Lee Yu-bin and Lee Da-yerin are heading to Mongolia to share the future of AI with local youth. Join us in opening new possibilities through Google AI technology.',
      donate: 'Donate Now'
    },
    stats: { students: 'Students Reached', focus: 'Curriculum Focus', periodLabel: 'Period', periodValue: 'March ~ July (5 Months)' },
    funding: {
      title: 'Funding Progress',
      desc: 'Moving towards our goal together.',
      sponsors: 'Sponsors',
      amount: 'Total Amount',
      days: 'Days Left',
      recentTitle: 'Recent Sponsors',
      viewAll: 'View All',
      unitPerson: 'people',
      unitDay: 'days',
      unitWon: 'KRW',
      goalLabel: 'Goal',
      goalUnit: 'people'
    },
    mission: {
      title: 'The Mission',
      team: { title: 'Meet the Team', desc: 'Yu-bin and Da-yerin believe technology can make the world better. They visit underserved areas in Mongolia to teach Google AI tools and programming.' },
      profiles: [
        { name: 'Lee Yu-bin', age: '20 years old', certs: 'Google Level 1, Level 2', edu: 'Education: Bachelor of Psychology in progress', role: 'Team Leader / AI Instructor' },
        { name: 'Lee Da-yerin', age: '16 years old', certs: 'Google Level 1, Level 2', role: 'AI Instructor / Content Creator' }
      ],
      curriculum: {
        title: 'Google AI Curriculum',
        desc: 'Using tools like Gemini and Teachable Machine, we provide project-based learning to solve real-world problems.',
        items: [
          { title: 'Google Slides', desc: 'Learn how to create and share effective presentation materials.' },
          { title: 'Google Sheets', desc: 'Build foundations for organizing and analyzing data using formulas.' },
          { title: 'Google Classroom', desc: 'Learn how to manage assignments and communicate in a digital learning environment.' },
          { title: 'Google Forms', desc: 'Experience the process of creating surveys and collecting/analyzing data.' },
          { title: 'Google Drive', desc: 'Understand cloud systems for securely storing and sharing files for collaboration.' },
          { title: 'Notebook LM', desc: 'Learn latest technologies for summarizing information and gaining insights using AI-based notes.' },
          { title: 'Vibe coding', desc: 'Experience new coding methods of writing code and performing creative projects by talking with AI.' },
          { title: 'Google Educator Level 1', desc: 'Prepare for the process of getting certified for basic competencies in using Google tools in educational settings.' },
          { title: 'Google Educator Level 2', desc: 'Become an innovative educational expert with more advanced Google tool utilization skills.' }
        ]
      },
      timeline: { title: 'Timeline', desc: 'Starting March 2026, we will provide Google AI education to teachers and students at NEST and UBMK schools in Mongolia.' }
    },
    sponsorship: {
      title: 'Support the Mission',
      desc: 'Join us in opening the future of Mongolia. Choose between a "Commitment" for sustainable change or a "One-time" donation.',
      commitment: 'Make a Commitment',
      oneTime: 'One-time Donation',
      howTo: 'How to donate...',
      howToDesc: 'After completing the commitment or one-time donation, the account screen will appear. Please deposit to that account number. Thank you.',
      quickTiers: 'Quick Tiers',
      select: 'Select'
    },
    modal: {
      commitmentTitle: 'Sponsorship Commitment',
      oneTimeTitle: 'One-time Donation Form',
      commitmentDesc: '50,000 KRW monthly commitment (5 times)',
      oneTimeDesc: 'Flexible donation amount',
      nameLabel: 'Name',
      namePlaceholder: 'Enter your name',
      phoneLabel: 'Phone Number',
      amountLabel: 'Donation Amount (from 50,000 KRW)',
      targetLabel: 'Select Target',
      messageLabel: 'Send Support Message',
      messagePlaceholder: 'Leave a warm message of support',
      submitCommitment: 'Complete Commitment',
      submitOneTime: 'Submit Donation',
      infoCommitment: 'About Commitment...',
      infoDonation: 'About One-time Donation...',
      infoCommitmentDesc: 'A commitment is a monthly donation of 50,000 KRW. We will send a reminder message once a month to your contact number.',
      infoDonationDesc: 'One-time donation is a flexible way to support us whenever you want. Minimum amount is 50,000 KRW.',
      successTitleCommitment: 'Commitment Completed!',
      successTitleOneTime: 'Donation Submitted!',
      aiGenerating: 'AI is writing a thank you message...',
      bankGuide: 'Bank Account Info',
      targetAccount: "\'s Account",
      thanksMsg: 'Your support means a lot to us.',
      monthlyMsg: 'We will send you a monthly update message.',
      close: 'Close'
    },
    schools: {
      title: 'Schools & Projects',
      nest: {
        name: 'NEST School',
        desc: 'A place for gifted students like a science high school in Korea, but Google education systems have not yet been introduced. We help teachers teach more effectively using digital tools.'
      },
      ubmk: {
        name: 'UBMK School',
        desc: 'A school for children of Koreans and multicultural families. We build Google Workspace and teach AI basics to teachers in this place that needs digital transformation.'
      },
      chromebook: {
        name: 'Chromebook Project',
        desc: 'Digital education requires PCs. For students without PCs, we gift educational PCs through this sponsorship and teach them how to use them.'
      }
    },
    footer: {
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      contact: 'Contact Us',
      rights: '© 2026 Lee Yu-bin & Lee Da-yerin. All rights reserved.'
    }
  },
  mn: {
    nav: { about: 'Тухай', curriculum: 'Хөтөлбөр', sponsorship: 'Хандив', donate: 'Хандив өгөх', translate: 'Орчуулах', schools: 'Сургууль ба Төсөл', profiles: 'Багийн танилцуулга', admin: 'Админ' },
    hero: {
      tag: 'MONGLE MONGLE PROJECT',
      title: 'Teaching Google AI in the Mongolia of the Blue Sky.',
      desc: 'Ли Ю-бин, Ли Да-ерин нар Монголын залуучуудтай AI-ийн ирээдүйг хуваалцахаар ирж байна. Google AI технологиор дамжуулан шинэ боломжуудыг нээхэд бидэнтэй нэгдээрэй.',
      donate: 'Хандив өгөх'
    },
    stats: { students: 'Сурагчид', focus: 'Сургалтын чиглэл', periodLabel: 'Period', periodValue: '3-р сараас 7-р сар (5 сар)' },
    funding: {
      title: 'Хандивын явц',
      desc: 'Бид хамтдаа зорилгодоо тэмүүлж байна.',
      sponsors: 'Хандивлагчид',
      amount: 'Нийт дүн',
      days: 'Үлдсэн хоног',
      recentTitle: 'Сүүлийн хандивлагчид',
      viewAll: 'Бүгдийг харах',
      unitPerson: 'хүн',
      unitDay: 'хоног',
      unitWon: 'вон',
      goalLabel: 'Зорилтот тоо',
      goalUnit: 'хүн'
    },
    mission: {
      title: 'Эрхэм зорилго',
      team: { title: 'Багтай танилц', desc: 'Ю-бин, Да-ерин нар технологийг дэлхийг илүү сайн болгож чадна гэдэгт итгэдэг. Тэд Монголын алслагдсан бүс нутгуудаар явж Google AI хэрэгсэл заадаг.' },
      profiles: [
        { name: 'Ли Ю-бин', age: '20 настай', certs: 'Google Level 1, Level 2', edu: 'Боловсрол: Сэтгэл судлалын бакалаврын оюутан', role: 'Багийн ахлагч / AI багш' },
        { name: 'Ли Да-ерин', age: '16 настай', certs: 'Google Level 1, Level 2', role: 'AI багш / Контент бүтээгч' }
      ],
      curriculum: {
        title: 'Google AI хөтөлбөр',
        desc: 'Gemini, Teachable Machine зэрэг хэрэгслүүдийг ашиглан бодит асуудлыг шийдвэрлэх төсөлд суурилсан сургалт явуулдаг.',
        items: [
          { title: 'Google Slides', desc: 'Үр дүнтэй танилцуулга бэлтгэх, хуваалцах аргад суралцана.' },
          { title: 'Google Sheets', desc: 'Өгөгдөл цэгцлэх, дүн шинжилгээ хийх, томьёо ашиглах суурийг тавина.' },
          { title: 'Google Classroom', desc: 'Дижитал орчинд даалгавар удирдах, харилцах аргад суралцана.' },
          { title: 'Google Forms', desc: 'Судалгаа авах, өгөгдөл цуглуулах, дүн шинжилгээ хийх үйл явцыг туршина.' },
          { title: 'Google Drive', desc: 'Файл хадгалах, хамтран ажиллах үүлэн системийг ойлгоно.' },
          { title: 'Notebook LM', desc: 'AI ашиглан мэдээллийг нэгтгэх, шинэ санаа олох технологийг сурна.' },
          { title: 'Vibe coding', desc: 'AI-тай харилцаж код бичих, бүтээлч төсөл хэрэгжүүлэх шинэ арга барилыг туршина.' },
          { title: 'Google Educator Level 1', desc: 'Google-ийн хэрэгслүүдийг боловсролын салбарт ашиглах суурь чадварын гэрчилгээ авахад бэлтгэнэ.' },
          { title: 'Google Educator Level 2', desc: 'Google-ийн хэрэгслүүдийг гүнзгийрүүлэн ашиглаж, боловсролын шинэлэг мэргэжилтэн болно.' }
        ]
      },
      timeline: { title: 'Хугацаа', desc: '2026 оны 3-р сараас эхлэн Монголын NEST болон UBMK сургуулиудын багш, сурагчдад Google AI боловсрол олгоно.' }
    },
    sponsorship: {
      title: 'Биднийг дэмжээрэй',
      desc: 'Монголын ирээдүйг нээхэд бидэнтэй нэгдээрэй. Тогтвортой өөрчлөлтийн төлөөх "Амлалт" эсвэл "Нэг удаагийн" хандивын аль нэгийг сонгоно уу.',
      commitment: 'Амлалт өгөх',
      oneTime: 'Нэг удаагийн хандив',
      howTo: 'Хэрхэн хандивлах вэ...',
      howToDesc: 'Амлалт эсвэл нэг удаагийн хандивыг дуусгасны дараа дансны дэлгэц гарч ирнэ. Тэр дансны дугаар руу шилжүүлнэ үү. Баярлалаа.',
      quickTiers: 'Хурдан сонголт',
      select: 'Сонгох'
    },
    modal: {
      commitmentTitle: 'Хандивын амлалт',
      oneTimeTitle: 'Нэг удаагийн хандив',
      commitmentDesc: 'Сар бүр 50,000 вон (5 удаа)',
      oneTimeDesc: 'Уян хатан дүн',
      nameLabel: 'Нэр',
      namePlaceholder: 'Нэрээ оруулна уу',
      phoneLabel: 'Утасны дугаар',
      amountLabel: 'Хандивын дүн (50,000 воноос дээш)',
      targetLabel: 'Хэнд хандивлах',
      submitCommitment: 'Амлалт дуусгах',
      submitOneTime: 'Хандив илгээх',
      infoCommitment: 'Амлалтын тухай...',
      infoDonation: 'Хандивын тухай...',
      infoCommitmentDesc: 'Сар бүр 50,000 вон хандивлах амлалт. Бид сард нэг удаа таны дугаарт сануулга илгээнэ.',
      infoDonationDesc: 'Нэг удаагийн хандив нь таны хүссэн үедээ өгөх боломжтой хандив юм. Доод дүн 50,000 вон.',
      successTitleCommitment: 'Амлалт амжилттай!',
      successTitleOneTime: 'Хандив амжилттай!',
      aiGenerating: 'AI талархлын зурвас бичиж байна...',
      bankGuide: 'Дансны мэдээлэл',
      targetAccount: '-ийн данс',
      thanksMsg: 'Таны дэмжлэгт баярлалаа.',
      monthlyMsg: 'Бид сар бүр мэдээлэл илгээх болно.',
      close: 'Хаах'
    },
    footer: {
      privacy: 'Нууцлалын бодлого',
      terms: 'Үйлчилгээний нөхцөл',
      contact: 'Холбоо барих',
      rights: '© 2026 Lee Yu-bin & Lee Da-yerin. All rights reserved.'
    }
  },
  ja: {
    nav: { about: '紹介', curriculum: 'カリキュラム', sponsorship: '支援', donate: '今すぐ支援', translate: '翻訳', schools: '学校とプロジェクト', profiles: 'プロフィール紹介', admin: '管理者' },
    hero: {
      tag: 'MONGLE MONGLE PROJECT',
      title: 'Teaching Google AI in the Mongolia of the Blue Sky.',
      desc: 'イ・ユビンとイ・ダエリンがモンゴルの若者にAIの未来を届けるために出発します。Google AI技術を通じてモンゴルの新しい可能性を切り拓くこの旅に、温かいご支援をお願いします。',
      donate: '支援する'
    },
    stats: { students: '対象学生数', focus: 'カリキュラムの焦点', periodLabel: 'Period', periodValue: '3月~7月(計5ヶ月)' },
    funding: {
      title: '支援の進捗状況',
      desc: '目標に向かって共に歩んでいます。',
      sponsors: '支援者',
      amount: '総支援金額',
      days: '残り日数',
      recentTitle: '最近の支援者リスト',
      viewAll: 'すべて見る',
      unitPerson: '名',
      unitDay: '日',
      unitWon: 'ウォン',
      goalLabel: '目標人数',
      goalUnit: '名'
    },
    mission: {
      title: 'ミッション',
      team: { title: 'チーム紹介', desc: 'ユビンとダエリンは技術が世界をより良くできると信じています。モンゴルの教育格差地域を訪れ、Google AIツールとプログラミングを教育します。' },
      profiles: [
        { name: 'イ・ユビン', age: '20歳', certs: 'Google Level 1, Level 2', edu: '学歴：心理学学士課程在学中', role: 'チームリーダー / AI講師' },
        { name: 'イ・ダエリン', age: '16歳', certs: 'Google Level 1, Level 2', role: 'AI講師 / コンテンツ制作' }
      ],
      curriculum: {
        title: 'Google AI カ리キュラム',
        desc: 'GeminiやTeachable Machineなどの最新AIツールを活用し、実生活の課題を解決するプロジェクト中心の授業を行います。',
        items: [
          { title: 'Google Slides', desc: '効果的なプレゼンテーション資料の作成と共有方法를 배웁니다.' },
          { title: 'Google Sheets', desc: 'データの整理、分析、数式の活用の基礎를 다집니다.' },
          { title: 'Google Classroom', desc: 'デジタル学習環境での課題管理と커뮤니케이션 방법을 익힙니다.' },
          { title: 'Google Forms', desc: 'アンケート作成と 데이터 수집 및 분석의 프로세스를 체험합니다.' },
          { title: 'Google Drive', desc: '파일을 안전하게 저장하고 협업을 위해 공유하는 클라우드 시스템을 이해합니다.' },
          { title: 'Notebook LM', desc: 'AIベースのノートを活用して情報を要約し、인사이트를 얻는 최신 기술을 배웁니다.' },
          { title: 'Vibe coding', desc: 'AIと対話しながらコードを記述し、크리에이티브한 프로젝트를 수행하는 새로운 코딩 방식을 경험합니다.' },
          { title: 'Google Educator Level 1', desc: 'Googleツールを教育現場で活用する基礎能力の認定を受ける준비를 합니다.' },
          { title: 'Google Educator Level 2', desc: 'より高度なGoogleツール活用能力を身につけ、혁신적인 교육 전문가로 거듭납니다.' }
        ]
      },
      timeline: { title: 'タイムライン', desc: '2026年3月からモンゴルのNEST校とUBMK校の教師および生徒にGoogle AI教育を実施する予定です。' }
    },
    sponsorship: {
      title: 'ミッションを支援する',
      desc: 'モンゴルの未来を切り拓く技術教育にご参加ください。持続的な変化を生む「定期契約」と自由な「一時支援」からお選びいただけます。',
      commitment: '定期支援を約束する',
      oneTime: '一時支援する',
      howTo: '支援方法...',
      howToDesc: '支援の約束または一時支援を完了すると、口座画面が表示されます。その口座番号に入金してください。ありがとうございます。',
      quickTiers: 'クイック選択',
      select: '選択する'
    },
    modal: {
      commitmentTitle: '定期支援約定書',
      oneTimeTitle: '一時支援申込書',
      commitmentDesc: '毎月50,000ウォンの定期支援（5回）',
      oneTimeDesc: '自由な金額の支援',
      nameLabel: 'お名前',
      namePlaceholder: 'お名前を入力してください',
      phoneLabel: '連絡先',
      amountLabel: '支援金額（50,000ウォンから）',
      targetLabel: '支援対象の選択',
      submitCommitment: '約定を完了する',
      submitOneTime: '支援を申し込む',
      infoCommitment: '定期支援について...',
      infoDonation: '支援について...',
      infoCommitmentDesc: '定期支援は約定により毎月1回50,000ウォンを支援する方式です。ご入力いただいた連絡先に毎月1回案内メッセージをお送りします。',
      infoDonationDesc: '一時支援は、必要な時にいつでも金額を変えて自由に参加できる支援方式です。最低50,000ウォンから可能です。',
      successTitleCommitment: '約定が完了しました！',
      successTitleOneTime: '支援の申し込みが完了しました！',
      aiGenerating: 'AIが感謝のメッセージを作成中です...',
      bankGuide: '振込口座の案内',
      targetAccount: 'さんの支援口座',
      thanksMsg: 'さんの温かいお気持ちが大きな力になります。',
      monthlyMsg: '毎月1回案内メッセージをお送りします。',
      close: '閉じる'
    },
    footer: {
      privacy: 'プライバシーポリシー',
      terms: '利用規約',
      contact: 'お問い合わせ',
      rights: '© 2026 Lee Yu-bin & Lee Da-yerin. All rights reserved.'
    }
  },
  zh: {
    nav: { about: '关于', curriculum: '课程', sponsorship: '赞助', donate: '立即捐赠', translate: '翻译', schools: '学校与项目', profiles: '个人简介', admin: '管理员' },
    hero: {
      tag: 'MONGLE MONGLE PROJECT',
      title: 'Teaching Google AI in the Mongolia of the Blue Sky.',
      desc: '李裕彬和李多艺邻正前往蒙古，与当地青年分享 AI 的未来。加入我们，通过 Google AI 技术开启新的可能性。',
      donate: '立即捐赠'
    },
    stats: { students: '覆盖学生', focus: '课程重点', periodLabel: 'Period', periodValue: '3月~7月(共5个月)' },
    funding: {
      title: '筹款进度',
      desc: '共同迈向我们的目标。',
      sponsors: '赞助者',
      amount: '总赞助金额',
      days: '剩余天数',
      recentTitle: '最近赞助者名单',
      viewAll: '查看全部',
      unitPerson: '人',
      unitDay: '天',
      unitWon: '韩元',
      goalLabel: '目标人数',
      goalUnit: '人'
    },
    mission: {
      title: '使命',
      team: { title: '团队介绍', desc: '裕彬和多艺邻相信技术可以让世界变得更好。他们访问蒙古偏远地区，教授 Google AI 工具和编程。' },
      profiles: [
        { name: '李裕彬', age: '20岁', certs: 'Google Level 1, Level 2', edu: '学历：心理学学士在读', role: '团队负责人 / AI 讲师' },
        { name: '李多艺邻', age: '16岁', certs: 'Google Level 1, Level 2', role: 'AI 讲师 / 内容制作' }
      ],
      curriculum: {
        title: 'Google AI 课程',
        desc: '使用 Gemini 和 Teachable Machine 等工具，我们提供以项目为基础的学习，解决现实世界的问题。',
        items: [
          { title: 'Google Slides', desc: '学习如何制作和分享有效的演示文稿。' },
          { title: 'Google Sheets', desc: '打好整理、分析数据及使用公式的基础。' },
          { title: 'Google Classroom', desc: '掌握在数字学习环境中管理作业和沟通的方法。' },
          { title: 'Google Forms', desc: '体验创建问卷调查、收集并分析数据的过程。' },
          { title: 'Google Drive', desc: '理解用于安全存储文件和共享协作的云系统。' },
          { title: 'Notebook LM', desc: '学习利用 AI 笔记总结信息并获取见解的最新技术。' },
          { title: 'Vibe coding', desc: '体验与 AI 对话编写代码并执行创意项目的新型编码方式。' },
          { title: 'Google Educator Level 1', desc: '准备获得在教学现场应用 Google 工具的基础能力认证。' },
          { title: 'Google Educator Level 2', desc: '具备更深层次的 Google 工具应用能力，成为创新的教育专家。' }
        ]
      },
      timeline: { title: '时间线', desc: '从 2026 年 3 月开始，我们将为蒙古 NEST 和 UBMK 学校的师生提供 Google AI 教育。' }
    },
    sponsorship: {
      title: '支持使命',
      desc: '加入我们，开启蒙古的未来。选择旨在实现可持续变革的“承诺” or “一次性”捐赠。',
      commitment: '做出承诺',
      oneTime: '一次性捐赠',
      howTo: '如何捐赠...',
      howToDesc: '完成承诺或一次性捐赠后，将出现账户屏幕。请汇款至该账号。谢谢。',
      quickTiers: '快速选择',
      select: '选择'
    },
    modal: {
      commitmentTitle: '定期赞助承诺书',
      oneTimeTitle: '一次性赞助申请书',
      commitmentDesc: '每月 50,000 韩元定期赞助 (5次)',
      oneTimeDesc: '灵活金额赞助',
      nameLabel: '姓名',
      namePlaceholder: '请输入您的姓名',
      phoneLabel: '联系方式',
      amountLabel: '赞助金额（50,000 韩元起）',
      targetLabel: '选择赞助对象',
      submitCommitment: '完成承诺',
      submitOneTime: '提交申请',
      infoCommitment: '关于定期赞助...',
      infoDonation: '关于赞助...',
      infoCommitmentDesc: '定期赞助是每月一次赞助 50,000 韩元的方式。我们将每月向您的联系方式发送一次赞助指南。',
      infoDonationDesc: '一次性赞助是一种灵活的方式，您可以随时根据需要更改金额。最低金额为 50,000 韩元。',
      successTitleCommitment: '承诺已完成！',
      successTitleOneTime: '申请已提交！',
      aiGenerating: 'AI 正在撰写感谢信...',
      bankGuide: '汇款账户指南',
      targetAccount: ' 的赞助账户',
      thanksMsg: ' 您的慷慨支持对我们意义重大。',
      monthlyMsg: '我们将每月向您发送一次指南信息。',
      close: '关闭'
    },
    footer: {
      privacy: '隐私政策',
      terms: '服务条款',
      contact: '联系我们',
      rights: '© 2026 Lee Yu-bin & Lee Da-yerin. All rights reserved.'
    }
  }
};
