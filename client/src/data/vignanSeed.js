export const VIGNAN_DEFAULT_COMPLAINTS = [
  {
    _id: 'vig-cmp-01',
    title: 'Faulty Ceiling Projector in Visvesvaraya Block (V-Block) Room 304',
    category: 'IT & AV Equipment',
    location: 'Visvesvaraya Block (V-Block), Room 304',
    description: 'HDMI signal repeatedly disconnects every few minutes during afternoon lectures. Projector lamp indicator blinks yellow and colors appear distorted.',
    status: 'In Progress',
    studentName: 'Pavan Kumar Reddy',
    studentEmail: '221fa04108@vignan.ac.in',
    priority: 'High',
    adminNotes: 'Technician dispatched from Vignan CCF (Central Computing Facility). Replacement 10m high-speed HDMI cord installed.',
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString()
  },
  {
    _id: 'vig-cmp-02',
    title: 'Ceiling Fan Screeching & Loose Blades in Aryabhata Block',
    category: 'Electrical',
    location: 'Aryabhata Block (A-Block), Room 208 (CSE Wing)',
    description: 'Middle ceiling fan is making loud rattling noise and vibrating severely at speed 4. Disturbs faculty lectures.',
    status: 'Pending',
    studentName: 'Ananya Chowdary',
    studentEmail: '231fa05042@vignan.ac.in',
    priority: 'Medium',
    adminNotes: '',
    createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString()
  },
  {
    _id: 'vig-cmp-03',
    title: 'Drinking Water Purifier Sensor Fault near Dr. K. L. Rao Central Library',
    category: 'Hostel & Mess',
    location: 'Dr. K. L. Rao Central Library, Ground Floor Lobby',
    description: 'The UV drinking water cooler dispenser TDS indicator shows red and water flow is sluggish. High traffic area for students studying for midterms.',
    status: 'Resolved',
    studentName: 'Venkata Sai Teja',
    studentEmail: '211fa04019@vignan.ac.in',
    priority: 'Urgent',
    adminNotes: 'Estate Maintenance Team replaced RO membrane filter elements and sanitized dispenser nozzles. TDS verified normal.',
    createdAt: new Date(Date.now() - 52 * 3600 * 1000).toISOString()
  },
  {
    _id: 'vig-cmp-04',
    title: 'Broken Bench Screws & Loose Armrests in U-Block Classroom 102',
    category: 'Classroom & Furniture',
    location: 'U-Block (University Block), Classroom 102',
    description: 'Second row wooden bench has loose carriage bolts causing wobbling. Sharp edge exposed on right corner.',
    status: 'In Progress',
    studentName: 'Karthik Varma',
    studentEmail: '221fa06012@vignan.ac.in',
    priority: 'Medium',
    adminNotes: 'Campus carpentry workshop notified. Fix scheduled for 3:30 PM today.',
    createdAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString()
  },
  {
    _id: 'vig-cmp-05',
    title: 'Restroom Flush Valve Leakage in NTR Vignan Vihar Admin Wing',
    category: 'Cleaning & Washrooms',
    location: 'NTR Vignan Vihar (Main Block), 1st Floor East Restroom',
    description: 'Washbasin plumbing joint is leaking continuously causing a slippery puddle near the corridor entryway.',
    status: 'Resolved',
    studentName: 'M. Haritha',
    studentEmail: '221fa08034@vignan.ac.in',
    priority: 'Urgent',
    adminNotes: 'Plumbing squad replaced brass ball valve and gasket seal. Area cleaned and dried.',
    createdAt: new Date(Date.now() - 44 * 3600 * 1000).toISOString()
  },
  {
    _id: 'vig-cmp-06',
    title: 'Pathway Streetlight Out Near Open Air Theatre (OAT)',
    category: 'Campus Infrastructure',
    location: 'Sangam Dairy Walkway, Near Open Air Theatre (OAT) Pole #8',
    description: 'LED floodlight fixture shattered after strong thunderstorm winds. Pedestrian pathway pitch dark after 6:30 PM.',
    status: 'Resolved',
    studentName: 'S. Sai Charan',
    studentEmail: '231fa04215@vignan.ac.in',
    priority: 'High',
    adminNotes: 'Electrical division installed new weatherproof 60W LED luminaire and tested twilight sensor.',
    createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString()
  },
  {
    _id: 'vig-cmp-07',
    title: 'Wi-Fi Access Point Frequent Disconnects in H-Block Lab 3',
    category: 'IT & AV Equipment',
    location: 'H-Block (Biotech & Pharmacy), Bioinformatics Lab 3',
    description: 'Vignan-Student-WiFi keeps dropping connections when 40+ students run simulations simultaneously.',
    status: 'Pending',
    studentName: 'Divya Sri',
    studentEmail: '211fa12005@vignan.ac.in',
    priority: 'High',
    adminNotes: '',
    createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString()
  }
];

export const VIGNAN_DEFAULT_LOST_ITEMS = [
  {
    _id: 'vig-lost-01',
    itemName: 'Vignan University Student Smart ID Card (#221FA04108)',
    type: 'Found',
    category: 'ID Cards & Wallets',
    location: 'Campus Food Court & Cafeteria (Near OAT)',
    date: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    description: 'Blue Vignan University lanyard with smart RFID card belonging to Pavan Kumar Reddy (CSE). Deposited at Security Desk #1.',
    contact: 'Vignan Security Office Ext. 201 / security@vignan.ac.in',
    postedBy: 'Vignan Security Desk',
    status: 'Active',
    createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString()
  },
  {
    _id: 'vig-lost-02',
    itemName: 'Casio fx-991EX ClassWiz Scientific Calculator',
    type: 'Lost',
    category: 'Electronics',
    location: 'Aryabhata Block (A-Block), Room 204',
    date: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    description: 'Black casing with a small red Vignan sticker on the solar panel. Urgent for upcoming mathematics mid-term examination.',
    contact: '221fa04108@vignan.ac.in / +91 98480 22334',
    postedBy: 'Pavan Kumar Reddy',
    status: 'Active',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  },
  {
    _id: 'vig-lost-03',
    itemName: 'Vignan University College Bus Pass (Guntur Route #14)',
    type: 'Found',
    category: 'ID Cards & Wallets',
    location: 'Main Entrance Gate Security Cabin (Vadlamudi Gate)',
    date: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    description: 'Green lamination bus pass valid for Semester 1, Guntur Collectorate - Vadlamudi Route. Name: G. Rakesh.',
    contact: 'Transport Incharge Office / transport@vignan.ac.in',
    postedBy: 'Transport Office',
    status: 'Active',
    createdAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString()
  },
  {
    _id: 'vig-lost-04',
    itemName: 'HP Wireless Optical Mouse & USB Dongle',
    type: 'Found',
    category: 'Electronics',
    location: 'Dr. K. L. Rao Central Library, 2nd Floor Digital Study Section',
    date: new Date(Date.now() - 40 * 3600 * 1000).toISOString(),
    description: 'Silver-grey mouse left on Desk 24 next to desktop terminal. Handed over to Librarian counter.',
    contact: 'library@vignan.ac.in / Ext. 312',
    postedBy: 'Central Library Desk',
    status: 'Claimed',
    createdAt: new Date(Date.now() - 40 * 3600 * 1000).toISOString()
  },
  {
    _id: 'vig-lost-05',
    itemName: 'Hero Sprint Bicycle Key with Blue Keychain',
    type: 'Lost',
    category: 'Keys',
    location: 'Student Bicycle Parking near Vasishta Boys Hostel',
    date: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    description: 'Single brass key with blue silicone ring and mini flashlight. Lost during morning class rush.',
    contact: '231fa05110@vignan.ac.in / +91 94401 55667',
    postedBy: 'Tarun Kumar',
    status: 'Active',
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString()
  }
];

export const VIGNAN_DEFAULT_ANNOUNCEMENTS = [
  {
    _id: 'vig-ann-01',
    title: 'Vignan MAHOTSAV 2026: National Youth Festival Project Booth Allotments',
    message: 'All engineering and technology project teams exhibiting prototypes must complete their kiosk setup in the Indoor Sports Complex by 8:30 AM tomorrow. Distinguished jury judging starts at 10:00 AM sharp.',
    category: 'Events',
    priority: 'Important',
    postedBy: 'Dean of Student Affairs - VFSTR',
    createdAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString()
  },
  {
    _id: 'vig-ann-02',
    title: 'Dr. K. L. Rao Central Library: Extended Night Study Hours for Mid-Semester Exams',
    message: 'To facilitate exam preparation for all B.Tech, M.Tech, and Pharmacy students, Central Library reading halls will remain open until 11:30 PM with Wi-Fi and air conditioning operational.',
    category: 'Academic',
    priority: 'Normal',
    postedBy: 'Chief Librarian, VFSTR',
    createdAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString()
  },
  {
    _id: 'vig-ann-03',
    title: 'Important: University Bus Route Schedule for Guntur, Tenali & Vijayawada',
    message: 'Due to ongoing culvert expansion work on the Vadlamudi-Sangam Dairy road, college buses departing to Guntur and Tenali will depart 15 minutes early from the main bus bay.',
    category: 'Urgent Alert',
    priority: 'Critical',
    postedBy: 'Vignan University Transport Cell',
    createdAt: new Date(Date.now() - 42 * 3600 * 1000).toISOString()
  },
  {
    _id: 'vig-ann-04',
    title: 'Scheduled Maintenance: Campus Core Firewall & High-Speed Network Switch',
    message: 'Central Computing Facility (CCF) will perform core optical fiber switch maintenance this Sunday between 1:00 AM and 5:00 AM. Intermittent internet outage expected in A-Block and Hostels.',
    category: 'Maintenance',
    priority: 'Normal',
    postedBy: 'Director of IT Infrastructure',
    createdAt: new Date(Date.now() - 65 * 3600 * 1000).toISOString()
  }
];

export function computePulseStats(complaints = [], lostItems = [], isOnline = true) {
  const totalComplaints = complaints.length;
  const pendingComplaints = complaints.filter((c) => c.status === 'Pending').length;
  const inProgressComplaints = complaints.filter((c) => c.status === 'In Progress').length;
  const resolvedComplaints = complaints.filter((c) => c.status === 'Resolved').length;

  const resolutionRate =
    totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 0;

  const categoryCounts = {};
  const categoryResolved = {};

  complaints.forEach((c) => {
    const cat = c.category || 'Other';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    if (c.status === 'Resolved') {
      categoryResolved[cat] = (categoryResolved[cat] || 0) + 1;
    }
  });

  const categoryBreakdown = Object.keys(categoryCounts)
    .map((cat) => ({
      category: cat,
      total: categoryCounts[cat],
      resolved: categoryResolved[cat] || 0,
      percentage: Math.round((categoryCounts[cat] / (totalComplaints || 1)) * 100)
    }))
    .sort((a, b) => b.total - a.total);

  const topCategories = categoryBreakdown.slice(0, 4);

  const totalLost = lostItems.length;
  const activeLost = lostItems.filter((i) => i.status === 'Active').length;
  const claimedLost = lostItems.filter((i) => i.status === 'Claimed' || i.status === 'Resolved').length;

  return {
    databaseMode: isOnline
      ? 'MongoDB (Mongoose Live Engine)'
      : 'Vignan In-Browser Storage (Exhibition Offline Engine)',
    totalComplaints,
    pendingComplaints,
    inProgressComplaints,
    resolvedComplaints,
    resolutionRate,
    categoryBreakdown,
    topCategories,
    lostAndFoundStats: {
      total: totalLost,
      active: activeLost,
      claimed: claimedLost
    }
  };
}

