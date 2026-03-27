/**
 * Landing Pages — Centralized Data (Refined Design)
 * Tập trung toàn bộ text/data cho landing pages.
 * Không hardcode text trong component (SANKIT Rule §7, §15).
 */

// ============================================
// SHARED — Navigation & Footer
// ============================================

export const LANDING_NAV_LINKS = [
    { id: 'home', label: 'Home', href: '/home' },
    { id: 'about', label: 'About', href: '/about' },
    { id: 'features', label: 'Features', href: '/home#features' },
    { id: 'pricing', label: 'Pricing', href: '/pricing' },
];

export const LANDING_FOOTER = {
    brand: {
        tagline: 'Kiến tạo tương lai nông nghiệp số bền vững. Gốc rễ vững chắc, vươn tầm thế giới.',
    },
    columns: [
        {
            title: 'Sản phẩm',
            links: [
                { label: 'Vùng trồng GIS', href: '#' },
                { label: 'Nhật ký App', href: '#' },
                { label: 'Truy xuất QR', href: '#' },
                { label: 'Bảng giá', href: '/pricing' },
            ],
        },
        {
            title: 'Công ty',
            links: [
                { label: 'Về chúng tôi', href: '/about' },
                { label: 'Đối tác', href: '#' },
                { label: 'Tuyển dụng', href: '#' },
                { label: 'Bảo mật', href: '#' },
            ],
        },
    ],
    newsletter: {
        title: 'Đăng ký nhận tin',
        description: 'Cập nhật những xu hướng nông nghiệp công nghệ cao mới nhất hàng tuần.',
    },
    address: 'Tầng 12, Tòa nhà Công nghệ, Quận 1, TP. Hồ Chí Minh.',
    copyright: '© 2024 SANKIT Smart Farming Solutions. Rooted in growth.',
};

// ============================================
// HOME PAGE
// ============================================

export const HOME_HERO = {
    label: 'SMARTER FARMING',
    titleLine1: 'SANKIT',
    titleLine2: 'Bám Sát',
    titleLine3: 'Thực Địa',
    subtitle:
        'Giải pháp số hóa toàn diện từ quy hoạch Vùng trồng đến Nhật ký sản xuất tự động. Chuyển đổi nông trại thành hệ sinh thái dữ liệu minh bạch.',
    ctaPrimary: 'Trải nghiệm Demo',
    ctaSecondary: 'Lộ trình tư vấn',
};

export const HOME_CHALLENGES = {
    title: 'Vận hành Nông trại có đang mắc kẹt?',
    subtitle: 'Những rào cản vô hình đang kìm hãm tiềm năng tăng trưởng của nông sản Việt.',
    items: [
        {
            id: 'data-fragment',
            icon: 'file-x',
            title: 'Dữ liệu phân mảnh',
            description:
                'Ghi chép sổ tay thất lạc, file Excel chồng chéo khiến việc tổng hợp báo cáo mất hàng tuần lễ.',
        },
        {
            id: 'cost-control',
            icon: 'trending-down',
            title: 'Mất kiểm soát chi phí',
            description: 'Không định lượng được chi phí phân bón, nhân công trên từng gốc cây, từng mùa vụ thực tế.',
        },
        {
            id: 'traceability',
            icon: 'search-x',
            title: 'Bế tắc truy xuất',
            description:
                'Khó khăn trong việc chứng minh quy trình canh tác sạch với đối tác thu mua và người tiêu dùng.',
        },
    ],
};

export const HOME_PHILOSOPHY = {
    title: 'Triết lý quản trị thuận tự nhiên',
    subtitle: 'Hệ thống hóa dòng chảy thông tin từ Đất Trồng đến Bàn Ăn',
};

export const HOME_ECOSYSTEM = {
    title: 'Hệ sinh thái Thực Chiến',
    subtitle: 'Thiết kế từ trải nghiệm thực tế tại các vùng nguyên liệu quy mô lớn hàng nghìn Hecta.',
    features: [
        {
            id: 'gis',
            title: 'Quản lý Vùng trồng & Thổ nhưỡng',
            description:
                'Số hóa toàn bộ bản đồ vùng trồng trên nền tảng GIS, giúp theo dõi sức khỏe đất và phân bổ nguồn lực chính xác đến từng lô thửa.',
            highlights: ['Bản đồ trực quan độ phân giải cao', 'Hồ sơ thổ nhưỡng chi tiết từng năm'],
        },
        {
            id: 'journal',
            title: 'Nhật ký Thực chiến & Truy xuất',
            description:
                'Loại bỏ sổ tay giấy. Mọi thao tác gieo hạt, bón phân được công nhân ghi nhận ngay tại hiện trường qua App Mobile, tự động tạo QR Code truy xuất khi thu hoạch.',
            stats: [
                { value: '0s', label: 'Ghi nhận' },
                { value: '100%', label: 'Minh bạch' },
            ],
        },
    ],
};

export const HOME_CTA = {
    title: 'Số hóa nông trại ngay hôm nay',
    subtitle: 'Chuyên gia của SANKIT sẽ đồng hành cùng bạn xây dựng lộ trình chuyển đổi số phù hợp nhất.',
    note: 'Chúng tôi cam kết bảo mật dữ liệu sản xuất của bạn 100%.',
};

// ============================================
// ABOUT PAGE
// ============================================

export const ABOUT_HERO = {
    title: 'Dấu Chân Công Nghệ Trên Từng Cánh Đồng',
    description:
        'SANKIT ra đời từ sự thấu hiểu sâu sắc những vất vả của người làm nông. Chúng tôi không chỉ xây dựng phần mềm; chúng tôi tạo ra giải pháp thực địa để mỗi giọt mồ hôi rơi xuống đều mang lại giá trị xứng đáng nhất.',
    quote: 'Chúng tôi đưa công nghệ về đúng nơi nó cần: Ngay tại mặt đất.',
};

export const ABOUT_VISION = {
    title: 'Tầm Nhìn',
    description:
        'Trở thành nền tảng quản trị nông nghiệp thông minh chuẩn mực tại Việt Nam, kiến tạo hệ sinh thái dữ liệu giúp nông nghiệp phát triển bền vững và minh bạch.',
};

export const ABOUT_MISSION = {
    title: 'Sứ Mệnh',
    description:
        'Xóa bỏ hoàn toàn ranh giới giữa thực địa và phòng quản trị. Mang đến công cụ giúp người nông dân điều hành trang trại bằng dữ liệu thời gian thực, tối ưu hóa mùa vụ từ khâu làm đất đến khi thu hoạch.',
};

export const ABOUT_WHY_SANKIT = {
    title: 'Vì sao các Farm quy mô lớn chọn SANKIT?',
    subtitle: 'Triết lý thiết kế của chúng tôi tập trung vào tính thực tiễn và khả năng mở rộng không giới hạn.',
    items: [
        {
            id: 'root-to-top',
            title: 'Đi từ Gốc lên Ngọn',
            description:
                'Quản lý chặt chẽ từ Vùng trồng và Mùa vụ. Chúng tôi thấu hiểu rằng nông nghiệp bắt đầu từ đất và cây, do đó mọi luồng dữ liệu đều được thiết kế để theo sát vòng đời sinh trưởng tự nhiên.',
        },
        {
            id: 'multi-model',
            title: 'Thích ứng đa Mô hình',
            description:
                'Tính linh hoạt cao cho phép SANKIT tùy chỉnh theo mọi loại hình trang trại từ thủy canh đến trồng trọt truyền thống.',
        },
        {
            id: 'data-integrity',
            title: 'Toàn vẹn & Kế thừa Dữ liệu',
            description:
                'Dữ liệu không bao giờ bị lãng phí. Mỗi mùa vụ trôi qua là một lớp tri thức được bồi đắp, giúp các quyết định của mùa vụ sau luôn chính xác hơn mùa vụ trước.',
        },
    ],
};

export const ABOUT_CTA = {
    title: 'Sẵn sàng để số hóa trang trại của bạn?',
    description: 'Gia nhập cộng đồng những nhà nông hiện đại cùng SANKIT để nâng tầm nông sản Việt.',
};

// ============================================
// PRICING PAGE
// ============================================

export const PRICING_HERO = {
    title: 'Đầu tư thông minh - Quản trị minh bạch - Nâng tầm Nông sản',
    subtitle:
        'SANKIT cung cấp các gói giải pháp linh hoạt phù hợp với mọi quy mô từ nông trại khởi nghiệp đến doanh nghiệp chế biến xuất khẩu.',
};

export const PRICING_PLANS = [
    {
        id: 'nen-tang',
        name: 'SANKIT NỀN TẢNG',
        subtitle: 'Cơ bản cho Farm nhỏ & Hợp tác xã mới bắt đầu số hóa.',
        featured: false,
        features: [
            { text: 'Quản lý 05 phân khu canh tác', included: true },
            { text: 'Nhật ký điện tử cơ bản', included: true },
            { text: 'Lưu kho vật tư & Phân bón', included: true },
        ],
    },
    {
        id: 'van-hanh',
        name: 'SANKIT VẬN HÀNH',
        subtitle: 'Toàn diện QR & Truy xuất nguồn gốc chuẩn quốc tế.',
        featured: true,
        features: [
            { text: 'Không giới hạn phân khu', included: true },
            { text: 'Cấp mã QR chuẩn BR-01', included: true },
            { text: 'Kiểm soát hiện trường Real-time', included: true },
            { text: 'Báo cáo hiệu suất thu hoạch', included: true },
        ],
    },
    {
        id: 'doanh-nghiep',
        name: 'SANKIT DOANH NGHIỆP',
        subtitle: 'Tùy biến sâu cho chuỗi giá trị và doanh nghiệp xuất khẩu.',
        featured: false,
        features: [
            { text: 'Tích hợp ERP & IoT Sensors', included: true },
            { text: 'White-label (Thương hiệu riêng)', included: true },
            { text: 'Hỗ trợ kỹ thuật 24/7 Priority', included: true },
            { text: 'Đào tạo nhân sự hiện trường', included: true },
        ],
    },
];

export const PRICING_SETUP = {
    title: 'Gói dịch vụ khởi tạo (Setup Fee)',
    description:
        'Để đảm bảo SANKIT hoạt động hiệu quả nhất, đội ngũ chuyên gia của chúng tôi sẽ đồng hành cùng bạn trong 7 ngày đầu tiên để thiết lập hạ tầng số.',
    note: 'Áp dụng cho mọi khách hàng mới để đảm bảo tính ổn định của hệ thống.',
};

export const PRICING_FAQ = [
    {
        id: 'non-tech',
        question: 'Nông dân không thạo công nghệ có sử dụng được SANKIT không?',
        answer: 'Có. SANKIT được thiết kế với giao diện trực quan, hỗ trợ tiếng Việt hoàn toàn. Đội ngũ của chúng tôi sẽ đào tạo trực tiếp tại hiện trường trong 7 ngày đầu tiên.',
    },
    {
        id: 'qr-br01',
        question: 'Mã QR bảo mật BR-01 là gì?',
        answer: 'BR-01 là chuẩn mã QR truy xuất nguồn gốc do SANKIT phát triển, tuân thủ tiêu chuẩn quốc tế về bảo mật và xác minh sản phẩm nông nghiệp.',
    },
    {
        id: 'qr-cost',
        question: 'Chi phí in mã QR được tính như thế nào?',
        answer: 'Chi phí in mã QR được tính theo số lượng tem in thực tế, đã bao gồm trong gói SANKIT VẬN HÀNH trở lên. Gói NỀN TẢNG có thể mua thêm với chi phí hợp lý.',
    },
];

export const PRICING_CTA = {
    title: '"Chuyển đổi số nông nghiệp không phải là xu hướng, mà là công cụ sinh tồn!"',
    description: 'Gia nhập mạng lưới nông trại thông minh SANKIT ngay hôm nay để bảo vệ giá trị nông sản Việt.',
};
