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

  console.log('Bắt đầu seed dữ liệu tour...');

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

  console.log('\nBắt đầu seed users...');
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@royaltravel.com' },
    update: {},
    create: {
      email: 'admin@royaltravel.com',
      name: 'Administrator',
      password: 'admin123',
      role: 'ADMIN',
    },
  });
  console.log('Admin user được tạo: admin@royaltravel.com');

  const user1 = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Nguyen Van A',
      password: 'user123',
      role: 'USER',
    },
  });
  console.log('User được tạo: user@example.com');

  // Lấy danh sách user và tour để tạo booking, feedback
  const users = await prisma.user.findMany();
  const tours = await prisma.tour.findMany();

  //  BOOKINGS 
  if (tours.length >= 3 && users.length >= 1) {
    console.log('\nBắt đầu seed bookings...');
    
    const bookingsData = [
      { 
        bookingCode: 'BOOK-00001',
        userId: users[0].id,
        tourId: tours[0].id,
        fullName: 'Tran Van B',
        email: 'tranb@example.com',
        phone: '0912345678',
        travelDate: new Date('2025-01-15'),
        passengers: 2,
        status: 'CONFIRMED',
      },
      {
        bookingCode: 'BOOK-00002',
        userId: users[0].id,
        tourId: tours[1].id,
        fullName: 'Le Thi C',
        email: 'lethic@example.com',
        phone: '0987654321',
        travelDate: new Date('2025-02-20'),
        passengers: 3,
        status: 'PENDING',
      },
      {
        bookingCode: 'BOOK-00003',
        userId: users[users.length - 1]?.id || users[0].id,
        tourId: tours[2].id,
        fullName: 'Pham Van D',
        email: 'phamvd@example.com',
        phone: '0977123456',
        travelDate: new Date('2025-03-10'),
        passengers: 1,
        status: 'DELIVERED',
      },
    ];

    for (const booking of bookingsData) {
      try {
        await prisma.booking.create({ data: booking });
        console.log(`Booking created: ${booking.fullName} - ${booking.travelDate}`);
      } catch (error) {
        console.error('Lỗi seed booking:', error.message);
      }
    }
  }

//  FEEDBACKS 
  if (tours.length >= 3) {
    console.log('\nBắt đầu seed feedbacks...');
    
    const feedbacksData = [
      {
        name: 'Nguyen Van E',
        email: 'nguyene@example.com',
        comment: 'Tour rat tuyet voi! Huong dan vien nhiet tinh.',
        tourId: tours[0]?.id || null,
        userId: users[0]?.id || null,
      },
      {
        name: 'Tran Thi F',
        email: 'tranf@example.com',
        comment: 'Khach san sach se, do an ngon. Se quay lai!',
        tourId: tours[1]?.id || null,
        userId: users[users.length - 1]?.id || null,
      },
      {
        name: 'Le Van G',
        email: 'levang@example.com',
        comment: 'Gia ca hop ly, dich vu chuyen nghiep.',
        tourId: tours[2]?.id || null,
        userId: null,
      },
    ];

    for (const feedback of feedbacksData) {
      try {
        await prisma.feedback.create({ data: feedback });
        console.log(`Feedback created: ${feedback.name}`);
      } catch (error) {
        console.error('Lỗi seed feedback:', error.message);
      }
    }
  }

  //  CONTACTS 
  console.log('\nBắt đầu seed contacts...');
  
  const contactsData = [
    {
      name: 'Nguyen Thi H',
      email: 'nguyenthih@example.com',
      phone: '0933123456',
      message: 'Toi muon tim hieu ve tour Moscow 5 ngay 4 dem.',
      subscribe: true,
    },
    {
      name: 'Tran Van I',
      email: 'tranvi@example.com',
      phone: '0944567890',
      message: 'Cho toi xin thong tin tour Sochi nhe.',
      subscribe: false,
    },
  ];

  for (const contact of contactsData) {
    try {
      await prisma.contact.create({ data: contact });
      console.log(`Contact created: ${contact.name}`);
    } catch (error) {
      console.error('Lỗi seed contact:', error.message);
    }
  }

  console.log('\nTỔNG KẾT SEED: ');
  const totalUsers = await prisma.user.count();
  const totalTours = await prisma.tour.count();
  const totalBookings = await prisma.booking.count();
  const totalFeedbacks = await prisma.feedback.count();
  const totalContacts = await prisma.contact.count();

  console.log(`Users: ${totalUsers}`);
  console.log(`Tours: ${totalTours}`);
  console.log(`Bookings: ${totalBookings}`);
  console.log(`Feedbacks: ${totalFeedbacks}`);
  console.log(`Contacts: ${totalContacts}`);
}

main()
  .catch((e) => {
    console.error('Lỗi seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });