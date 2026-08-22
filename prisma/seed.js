const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
    console.log('Kết nối database thành công!');
  } catch (error) {
    console.error('Không thể kết nối database:', error);
    process.exit(1);
  }

  const allTours = [
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
    {
      name: 'Tour khám phá Kaliningrad',
      image: 'Kaliningrad_0.jpg',
      description: 'Khám phá thành phố Kaliningrad với kiến trúc Phổ cổ và bờ biển Baltic tuyệt đẹp.',
      code: '#ROYAL-07-VN-RU',
      price: 480,
      duration: '4 ngày 3 đêm',
      isFeatured: false,
    },
    {
      name: 'Tour khám phá Nizhny Novgorod',
      image: 'NizhnyNovgorod_0.jpg',
      description: 'Khám phá Nizhny Novgorod - thành phố cổ kính bên sông Volga với Điện Kremlin nguy nga.',
      code: '#ROYAL-08-VN-RU',
      price: 420,
      duration: '4 ngày 3 đêm',
      isFeatured: false,
    },
    {
      name: 'Tour khám phá Vladimir',
      image: 'Vladimir_0.jpg',
      description: 'Khám phá Vladimir - thành phố cổ của nước Nga với kiến trúc vàng và di sản UNESCO.',
      code: '#ROYAL-09-VN-RU',
      price: 380,
      duration: '3 ngày 2 đêm',
      isFeatured: false,
    },
  ];

  console.log('Bắt đầu seed dữ liệu...');

  for (let i = 0; i < allTours.length; i++) {
    const tour = allTours[i];
    try {
      const result = await prisma.tour.upsert({
        where: { code: tour.code },
        update: tour,
        create: tour,
      });
      console.log(`${i + 1}/${allTours.length} ${result.name}`);
    } catch (error) {
      console.error(`Lỗi seed tour ${tour.code}:`, error.message);
    }
  }

  const totalTours = await prisma.tour.count();
  console.log(`Tổng số tour: ${totalTours}`);
  console.log('Seed hoàn tất!');
}

main()
  .catch((e) => {
    console.error('Lỗi seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });