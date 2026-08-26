import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
    console.log('Kết nối database thành công!');
  } catch (error) {
    console.error('Không thể kết nối database:', error);
    process.exit(1);
  }

  //  TOURS 
  console.log('\nBắt đầu seed tours...');

  const allTours = [
    {
      name: 'Tour khám phá Saint Petersburg',
      image: 'SaintPetersburg_0.jpg',
      description: 'Khám phá thành phố Saint Petersburg xinh đẹp với Nhà thờ St. Isaac, Cung điện Mùa đông, và những kênh đào thơ mộng. Trải nghiệm văn hóa Nga đậm chất châu Âu.',
      code: '#ROYAL-01-VN-RU',
      price: 500,
      duration: '5 ngày 4 đêm',
      isFeatured: true,
    },
    {
      name: 'Tour khám phá Moscow',
      image: 'Moscow_0.jpg',
      description: 'Khám phá thủ đô Moscow với Quảng trường Đỏ, Điện Kremlin hùng vĩ, và những nhà thờ Chính thống giáo tuyệt đẹp. Trải nghiệm nhịp sống sôi động của thành phố lớn nhất nước Nga.',
      code: '#ROYAL-02-VN-RU',
      price: 550,
      duration: '5 ngày 4 đêm',
      isFeatured: true,
    },
    {
      name: 'Tour khám phá Kazan',
      image: 'Kazan_0.jpg',
      description: 'Khám phá Kazan - thành phố giao thoa giữa văn hóa Hồi giáo và Chính thống giáo. Tham quan Điện Kremlin Kazan, Nhà thờ Chính tòa Kazan và trải nghiệm ẩm thực Tatar độc đáo.',
      code: '#ROYAL-03-VN-RU',
      price: 450,
      duration: '4 ngày 3 đêm',
      isFeatured: false,
    },
    {
      name: 'Tour nghỉ dưỡng Sochi',
      image: 'Sochi_0.jpg',
      description: 'Sochi - thiên đường nghỉ dưỡng bên bờ Biển Đen. Tận hưởng bãi biển đẹp, khám phá dãy núi Caucasus và tham quan Công viên Olympic nổi tiếng.',
      code: '#ROYAL-04-VN-RU',
      price: 480,
      duration: '6 ngày 5 đêm',
      isFeatured: false,
    },
    {
      name: 'Tour khám phá Vladivostok',
      image: 'Vladivostok_0.jpg',
      description: 'Vladivostok - thành phố cảng xinh đẹp bên bờ biển Thái Bình Dương. Khám phá kiến trúc độc đáo, cầu cảng dài nhất nước Nga và thưởng thức hải sản tươi ngon.',
      code: '#ROYAL-05-VN-RU',
      price: 600,
      duration: '7 ngày 6 đêm',
      isFeatured: true,
    },
    {
      name: 'Tour săn cực quang Murmansk',
      image: 'Murmansk_0.jpg',
      description: 'Murmansk - thành phố cực Bắc của nước Nga. Trải nghiệm hiện tượng cực quang kỳ ảo, khám phá thiên nhiên Bắc Cực hoang sơ và văn hóa của người Sami bản địa.',
      code: '#ROYAL-06-VN-RU',
      price: 700,
      duration: '5 ngày 4 đêm',
      isFeatured: false,
    },
    {
      name: 'Tour khám phá Kaliningrad',
      image: 'Kaliningrad_0.jpg',
      description: 'Kaliningrad - vùng đất cổ kính với kiến trúc Phổ cổ và bờ biển Baltic tuyệt đẹp. Tham quan Nhà thờ Königsberg và Bảo tàng Hổ phách nổi tiếng.',
      code: '#ROYAL-07-VN-RU',
      price: 480,
      duration: '4 ngày 3 đêm',
      isFeatured: false,
    },
    {
      name: 'Tour khám phá Nizhny Novgorod',
      image: 'NizhnyNovgorod_0.jpg',
      description: 'Nizhny Novgorod - thành phố cổ kính bên sông Volga. Khám phá Điện Kremlin nguy nga, tham quan bảo tàng và trải nghiệm cuộc sống thường nhật của người dân vùng Volga.',
      code: '#ROYAL-08-VN-RU',
      price: 420,
      duration: '4 ngày 3 đêm',
      isFeatured: false,
    },
    {
      name: 'Tour khám phá Vladimir',
      image: 'Vladimir_0.jpg',
      description: 'Vladimir - thành phố cổ của nước Nga với kiến trúc vàng và di sản UNESCO. Tham quan Nhà thờ Đức Mẹ và khám phá những công trình kiến trúc thời Trung cổ.',
      code: '#ROYAL-09-VN-RU',
      price: 380,
      duration: '3 ngày 2 đêm',
      isFeatured: false,
    },
  ];

  for (let i = 0; i < allTours.length; i++) {
    const tour = allTours[i];
    try {
      const result = await prisma.tour.upsert({
        where: { code: tour.code },
        update: tour,
        create: tour,
      });
      console.log(` ${i + 1}/${allTours.length} ${result.name}`);
    } catch (error) {
      console.error(`Lỗi seed tour ${tour.code}:`, error.message);
    }
  }

  //  USERS 
  console.log('\nBắt đầu seed users...');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@royaltravel.com' },
    update: {},
    create: {
      email: 'admin@royaltravel.com',
      fullName: 'Quản trị viên',
      password: 'admin123',
      role: 'ADMIN',
    },
  });
  console.log('  Admin: admin@royaltravel.com');

  const user1 = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      fullName: 'Nguyễn Văn A',
      password: 'user123',
      role: 'USER',
    },
  });
  console.log('  User: user@example.com');

  const user2 = await prisma.user.upsert({
    where: { email: 'tranthib@example.com' },
    update: {},
    create: {
      email: 'tranthib@example.com',
      fullName: 'Trần Thị B',
      password: 'user123',
      role: 'USER',
    },
  });
  console.log('  User: tranthib@example.com');

  // Lấy danh sách user và tour
  const users = await prisma.user.findMany();
  const tours = await prisma.tour.findMany();

  //  BOOKINGS 
  if (tours.length >= 3 && users.length >= 1) {
    console.log('\n Bắt đầu seed bookings...');

    const bookingsData = [
      {
        bookingCode: 'BOOK-00001',
        userId: users[0].id,
        tourId: tours[0].id,
        fullName: 'Trần Văn B',
        email: 'tranb@example.com',
        phone: '0912345678',
        travelDate: new Date('2025-01-15'),
        passengers: 2,
        status: 'ĐÃ XÁC NHẬN',
      },
      {
        bookingCode: 'BOOK-00002',
        userId: users[1]?.id || users[0].id,
        tourId: tours[1].id,
        fullName: 'Lê Thị C',
        email: 'lethic@example.com',
        phone: '0987654321',
        travelDate: new Date('2025-02-20'),
        passengers: 3,
        status: 'CHỜ XÁC NHẬN',
      },
      {
        bookingCode: 'BOOK-00003',
        userId: users[2]?.id || users[0].id,
        tourId: tours[2].id,
        fullName: 'Phạm Văn D',
        email: 'phamvd@example.com',
        phone: '0977123456',
        travelDate: new Date('2025-03-10'),
        passengers: 1,
        status: 'HOÀN THÀNH',
      },
      {
        bookingCode: 'BOOK-00004',
        userId: users[0].id,
        tourId: tours[3]?.id || tours[0].id,
        fullName: 'Hoàng Thị E',
        email: 'hoangthe@example.com',
        phone: '0909123456',
        travelDate: new Date('2025-04-05'),
        passengers: 4,
        status: 'ĐANG XỬ LÝ',
      },
    ];

    for (const booking of bookingsData) {
      try {
        await prisma.booking.create({ data: booking });
        console.log(` Booking: ${booking.fullName} - ${booking.travelDate.toLocaleDateString('vi-VN')}`);
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
        fullName: 'Nguyễn Văn E',
        email: 'nguyene@example.com',
        comment: 'Tour rất tuyệt vời! Hướng dẫn viên nhiệt tình, khách sạn sạch sẽ. Sẽ giới thiệu cho bạn bè!',
        rating: 5,
        tourId: tours[0]?.id || null,
        userId: users[0]?.id || null,
      },
      {
        fullName: 'Trần Thị F',
        email: 'tranf@example.com',
        comment: 'Khách sạn sạch sẽ, đồ ăn ngon. Chương trình tour hợp lý. Sẽ quay lại!',
        rating: 4,
        tourId: tours[1]?.id || null,
        userId: users[1]?.id || null,
      },
      {
        fullName: 'Lê Văn G',
        email: 'levang@example.com',
        comment: 'Giá cả hợp lý, dịch vụ chuyên nghiệp. Rất hài lòng với tour lần này.',
        rating: 5,
        tourId: tours[2]?.id || null,
        userId: null,
      },
      {
        fullName: 'Phạm Thị H',
        email: 'phamthih@example.com',
        comment: 'Tour ổn nhưng thời gian di chuyển hơi nhiều. Hy vọng lần sau sẽ được cải thiện.',
        rating: 3,
        tourId: tours[3]?.id || null,
        userId: null,
      },
    ];

    for (const feedback of feedbacksData) {
      try {
        await prisma.feedback.create({ data: feedback });
        console.log(` Feedback: ${feedback.fullName} - ${feedback.rating}⭐`);
      } catch (error) {
        console.error('Lỗi seed feedback:', error.message);
      }
    }
  }

  //  CONTACTS 
  console.log('\nBắt đầu seed contacts...');

  const contactsData = [
    {
      fullName: 'Nguyễn Thị H',
      email: 'nguyenthih@example.com',
      phone: '0933123456',
      message: 'Tôi muốn tìm hiểu về tour Moscow 5 ngày 4 đêm. Xin vui lòng gửi thêm thông tin chi tiết.',
      subscribe: true,
    },
    {
      fullName: 'Trần Văn I',
      email: 'tranvi@example.com',
      phone: '0944567890',
      message: 'Cho tôi xin thông tin tour Sochi nghỉ dưỡng. Gia đình tôi có 4 người, muốn đi vào tháng 7.',
      subscribe: false,
    },
    {
      fullName: 'Lê Thị K',
      email: 'lethik@example.com',
      phone: '0978234567',
      message: 'Tôi muốn đặt tour Saint Petersburg cho 2 người vào tháng 2 năm sau. Xin tư vấn giúp tôi.',
      subscribe: true,
    },
  ];

  for (const contact of contactsData) {
    try {
      await prisma.contact.create({ data: contact });
      console.log(`Contact: ${contact.fullName}`);
    } catch (error) {
      console.error('Lỗi seed contact:', error.message);
    }
  }
  console.log('TỔNG KẾT SEED:');
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

  console.log('Seed dữ liệu thành công!');
}

main()
  .catch((e) => {
    console.error('Lỗi seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });