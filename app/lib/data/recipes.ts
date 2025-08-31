import type { Recipe } from '../types';

export const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: '클래식 푸어오버',
    description: '깔끔하고 밝은 드립 커피, 플로럴 향이 특징',
    brewType: 'drip',
    rating: 4.5,
    author: '김사라',
    ingredients: ['중간 굵기 원두 25g', '93°C 물 400ml', '페이퍼 필터'],
    instructions: [
      '물을 93°C로 데운다',
      '필터를 헹구고 추출 도구를 예열한다',
      '원두를 넣고 가운데 움푹 파인다',
      '50ml 물을 원형으로 부어 30초간 블루밍한다',
      '천천히 원형으로 계속 부어 3분 30초에 마친다',
      '총 추출 시간: 4-5분'
    ],
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: '완벽한 에스프레소',
    description: '진하고 크리미한 에스프레소, 황금빛 크레마',
    brewType: 'espresso',
    rating: 4.8,
    author: '마르코 로시',
    ingredients: ['곱게 간 원두 18g', '신선한 정수물', '깨끗한 포타필터'],
    instructions: [
      '원두 18g을 곱게 간다',
      '포타필터에 원두를 고르게 분배한다',
      '30lb 압력으로 탬핑한다',
      '포타필터를 장착하고 추출을 시작한다',
      '25-30초 동안 36g을 추출한다',
      '즉시 서빙한다'
    ],
    createdAt: new Date('2024-01-20')
  },
  {
    id: '3',
    title: '프렌치 프레스 클래식',
    description: '진한 바디감의 드립 커피, 풍부하고 볼드한 맛',
    brewType: 'drip',
    rating: 4.2,
    author: '엠마 존슨',
    ingredients: ['굵게 간 원두 30g', '뜨거운 물 500ml', '프렌치 프레스'],
    instructions: [
      '물을 93°C로 데운다',
      '프렌치 프레스에 굵게 간 원두를 넣는다',
      '원두 위에 뜨거운 물을 붓는다',
      '가볍게 저어주고 뚜껑을 덮는다 (아직 누르지 말것)',
      '4분간 우린다',
      '플런저를 천천히 눌러 내리고 서빙한다'
    ],
    createdAt: new Date('2024-01-12')
  },
  {
    id: '4',
    title: '완벽한 카푸치노',
    description: '균형잡힌 에스프레소 음료, 실크 같은 마이크로폼',
    brewType: 'espresso',
    rating: 4.7,
    author: '안토니오 비안키',
    ingredients: ['에스프레소 블렌드 18g', '우유 150ml', '설탕 (선택)'],
    instructions: [
      '6oz 컵에 완벽한 에스프레소 샷을 추출한다',
      '차가운 우유를 스티밍 피처에 붓는다',
      '우유를 65°C로 스티밍하며 고운 마이크로폼을 만든다',
      '피처를 톡톡 쳐서 거품을 가라앉힌다',
      '높은 곳에서 시작해 표면 가까이서 우유를 붓는다',
      '원한다면 라떼 아트를 그린다'
    ],
    createdAt: new Date('2024-01-18')
  },
  {
    id: '5',
    title: '콜드브루 농축액',
    description: '부드럽고 상쾌한 드립 커피 농축액',
    brewType: 'drip',
    rating: 4.4,
    author: '제이크 마르티네즈',
    ingredients: ['굵게 간 원두 100g', '상온 물 1L', '큰 용기 또는 병'],
    instructions: [
      '큰 용기에 원두와 물을 넣는다',
      '잘 저어서 모든 원두가 젖도록 한다',
      '뚜껑을 덮고 상온에서 12시간 우린다',
      '고운 체나 치즈클로스로 거른다',
      '취향에 따라 물이나 우유로 희석한다',
      '얼음과 함께 서빙한다'
    ],
    createdAt: new Date('2024-01-10')
  },
  {
    id: '6',
    title: '아메리카노 클래식',
    description: '에스프레소 베이스 음료, 뜨거운 물을 넣어 드립 커피 농도로',
    brewType: 'espresso',
    rating: 4.1,
    author: '리사 박',
    ingredients: ['에스프레소 블렌드 18g', '뜨거운 물 120ml', '예열된 컵'],
    instructions: [
      '더블 에스프레소 샷을 추출한다',
      '물을 93°C로 데운다',
      '에스프레소에 뜨거운 물을 2:1 비율로 넣는다',
      '가볍게 저어 섞는다',
      '즉시 서빙한다',
      '원한다면 설탕이나 우유를 추가한다'
    ],
    createdAt: new Date('2024-01-22')
  },
  {
    id: '7',
    title: '바닐라 라떼',
    description: '달콤한 바닐라 시럽이 들어간 부드러운 라떼',
    brewType: 'espresso',
    rating: 4.6,
    author: '이민수',
    ingredients: ['에스프레소 샷 2개', '우유 200ml', '바닐라 시럽 15ml'],
    instructions: [
      '에스프레소 샷 2개를 추출한다',
      '우유를 65°C까지 스티밍한다',
      '컵에 바닐라 시럽을 넣는다',
      '에스프레소를 바닐라 시럽과 섞는다',
      '스티밍한 우유를 천천히 부어넣는다',
      '거품으로 마무리하고 바로 서빙한다'
    ],
    createdAt: new Date('2024-01-25')
  },
  {
    id: '8',
    title: '하리오 V60 드립',
    description: '정교한 추출로 만드는 깔끔하고 밝은 커피',
    brewType: 'drip',
    rating: 4.3,
    author: '박지훈',
    ingredients: ['V60 필터', '중간-가는 원두 22g', '93°C 물 350ml'],
    instructions: [
      'V60과 필터를 뜨거운 물로 예열한다',
      '원두를 V60에 넣고 가운데 움푹 파인다',
      '45초간 50ml 물로 블루밍한다',
      '원형으로 천천히 물을 부어 총 350ml가 되도록 한다',
      '전체 추출 시간은 2분 30초-3분이다',
      '필터를 제거하고 즉시 서빙한다'
    ],
    createdAt: new Date('2024-01-28')
  },
  {
    id: '9',
    title: '모카 라떼',
    description: '초콜릿과 커피의 완벽한 조화, 달콤하고 진한 맛',
    brewType: 'espresso',
    rating: 4.5,
    author: '최수진',
    ingredients: ['에스프레소 샷 2개', '우유 180ml', '초콜릿 시럽 20ml', '휘핑크림'],
    instructions: [
      '에스프레소 샷 2개를 추출한다',
      '컵에 초콜릿 시럽을 넣는다',
      '뜨거운 에스프레소를 부어 시럽과 섞는다',
      '우유를 스티밍하여 부드러운 거품을 만든다',
      '스티밍한 우유를 천천히 부어넣는다',
      '휘핑크림을 올리고 초콜릿 파우더로 장식한다'
    ],
    createdAt: new Date('2024-02-01')
  },
  {
    id: '10',
    title: '아이스 아메리카노',
    description: '시원하고 깔끔한 아이스 아메리카노, 여름철 최고의 선택',
    brewType: 'espresso',
    rating: 4.2,
    author: '김정호',
    ingredients: ['에스프레소 샷 2개', '차가운 물 150ml', '얼음', '시럽 (선택)'],
    instructions: [
      '에스프레소 샷 2개를 추출한다',
      '큰 글라스에 얼음을 가득 채운다',
      '추출한 에스프레소를 얼음 위에 천천히 붓는다',
      '차가운 물 150ml를 추가한다',
      '가볍게 저어서 섞는다',
      '원한다면 시럽을 추가하고 즉시 서빙한다'
    ],
    createdAt: new Date('2024-02-05')
  }
];