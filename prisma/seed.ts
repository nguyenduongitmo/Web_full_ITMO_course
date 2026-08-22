import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // log chi tiết
});

// hàm thử lại khi kết nối hỏng
async function retryOperation(fn: () => Promise<any>, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      console.log(`Lần thử ${i + 1} thất bại, đang thử lại...`);
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1))); // Chờ 2-6s
    }
  }
}

async function main() {
  // Dữ liệu tour mẫu từ ứng dụng của mình

  // b1: kết nối DB
  try {
    await prisma.$connect();
    console.log('Kết nối database thành công!');
  } catch (error) {
    console.error('Không thể kết nối database:')
    process.exit(1);
  }


  const tours = [
    {
      name: 'Tour khám phá Saint Petersburg',
      image: 'SaintPetersburg_0.jpg',
      description: 'Tham gia tour khám phá thành phố với những điểm đến nổi bật như Nhà thờ St. Isaac, Cung điện Mùa đông...',
      code: '#ROYAL-01-VN-RU',
      price: 500,
      duration: '5 ngày 4 đêm',
      isFeatured: true,
    },
    {
      name: 'Tour khám phá Moscow',
      image: 'Moscow_0.jpg',
      description: 'Khám phá vẻ đẹp của Moscow với Quảng trường Đỏ, Điện Kremlin...',
      code: '#ROYAL-02-VN-RU',
      price: 550,
      duration: '5 ngày 4 đêm',
      isFeatured: true,
    },
    {
      name: 'Tour khám phá Kazan',
      image: 'Kazan_0.jpg',
      description: 'Khám phá vẻ đẹp của Kazan với Nhà thờ Chính tòa Kazan, Pháo đài Kazan...',
      code: '#ROYAL-03-VN-RU',
      price: 450,
      duration: '4 ngày 3 đêm',
      isFeatured: false,
    },
    {
      name: 'Tour khám phá Sochi',
      image: 'Sochi_0.jpg',
      description: 'Sochi nổi tiếng với bãi biển đẹp và dãy núi Caucasus hùng vĩ.',
      code: '#ROYAL-04-VN-RU',
      price: 480,
      duration: '6 ngày 5 đêm',
      isFeatured: false,
    },
    {
      name: 'Tour khám phá Vladivostok',
      image: 'Vladivostok_0.jpg',
      description: 'Thành phố cảng với kiến trúc độc đáo và thiên nhiên tuyệt đẹp.',
      code: '#ROYAL-05-VN-RU',
      price: 600,
      duration: '7 ngày 6 đêm',
      isFeatured: true,
    },
    {
      name: 'Tour khám phá Murmansk',
      image: 'Murmansk_0.jpg',
      description: 'Trải nghiệm thiên nhiên Bắc Cực và hiện tượng cực quang.',
      code: '#ROYAL-06-VN-RU',
      price: 700,
      duration: '5 ngày 4 đêm',
      isFeatured: false,
    },
  ];

  console.log('Starting seed data...');


  // b2: seed với retry cho mỗi tour
   for (let i = 0; i < tours.length; i++) {
    const tour = tours[i];
    try {
      await retryOperation(async () => {
        const result = await prisma.tour.upsert({
          where: { code: tour.code },
          update: {},
          create: tour,
        });
        console.log(`${i + 1}/${tours.length} Created: ${result.name}`);
      });
    } catch (error) {
      console.error(`Lỗi khi seed tour ${tour.code}:`);
     // vẫn tiếp tục với tour khác
    }
  }

  console.log('Seed data completed!');
}

main()
  .catch((e) => {
    console.error('Error occurred while seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });