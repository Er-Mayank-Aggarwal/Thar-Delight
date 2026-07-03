export const dummyOrders = [
  {
    id: "ORD-1001",
    customer: {
      name: "Priya Sharma",
      email: "priya.sharma@gmail.com",
      phone: "+91 98765 43210",
      address: "12, Malviya Nagar, Jaipur, Rajasthan 302017",
    },
    items: [
      { name: "Ajwain Millet Cookies", qty: 2, price: 249 },
      { name: "Millet Bhel", qty: 1, price: 149 },
    ],
    total: 647,
    status: "delivered",
    date: "2026-07-01",
    time: "09:15",
    paymentMethod: "UPI",
  },
  {
    id: "ORD-1002",
    customer: {
      name: "Rahul Verma",
      email: "rahul.verma@outlook.com",
      phone: "+91 87654 32109",
      address: "45, Civil Lines, Jodhpur, Rajasthan 342001",
    },
    items: [
      { name: "Dark Chocolate Cookies", qty: 3, price: 279 },
      { name: "Farali Almond Cookies", qty: 1, price: 299 },
    ],
    total: 1136,
    status: "shipped",
    date: "2026-07-02",
    time: "14:30",
    paymentMethod: "Credit Card",
  },
  {
    id: "ORD-1003",
    customer: {
      name: "Anita Meena",
      email: "anita.meena@yahoo.com",
      phone: "+91 76543 21098",
      address: "78, Vaishali Nagar, Ajmer, Rajasthan 305001",
    },
    items: [
      { name: "Bajra Til Cookies", qty: 2, price: 229 },
      { name: "Millet Puff", qty: 3, price: 129 },
    ],
    total: 845,
    status: "processing",
    date: "2026-07-03",
    time: "11:45",
    paymentMethod: "COD",
  },
  {
    id: "ORD-1004",
    customer: {
      name: "Deepak Rathore",
      email: "deepak.r@gmail.com",
      phone: "+91 65432 10987",
      address: "23, Shastri Circle, Udaipur, Rajasthan 313001",
    },
    items: [
      { name: "Acacia Wood Plate", qty: 1, price: 899 },
    ],
    total: 899,
    status: "pending",
    date: "2026-06-28",
    time: "16:20",
    paymentMethod: "UPI",
  },
  {
    id: "ORD-1005",
    customer: {
      name: "Kavita Joshi",
      email: "kavita.j@gmail.com",
      phone: "+91 54321 09876",
      address: "56, Station Road, Bikaner, Rajasthan 334001",
    },
    items: [
      { name: "Farali Jeera Cookies", qty: 2, price: 269 },
      { name: "Ajwain Millet Cookies", qty: 1, price: 249 },
      { name: "Millet Bhel", qty: 2, price: 149 },
    ],
    total: 1085,
    status: "delivered",
    date: "2026-06-29",
    time: "10:05",
    paymentMethod: "Debit Card",
  },
  {
    id: "ORD-1006",
    customer: {
      name: "Sunil Meghwal",
      email: "sunil.m@hotmail.com",
      phone: "+91 43210 98765",
      address: "89, Paota, Jodhpur, Rajasthan 342006",
    },
    items: [
      { name: "Millet Puff", qty: 5, price: 129 },
    ],
    total: 645,
    status: "pending",
    date: "2026-06-25",
    time: "08:30",
    paymentMethod: "UPI",
  },
  {
    id: "ORD-1007",
    customer: {
      name: "Meera Kumawat",
      email: "meera.k@gmail.com",
      phone: "+91 32109 87654",
      address: "34, Mansarovar, Jaipur, Rajasthan 302020",
    },
    items: [
      { name: "Dark Chocolate Cookies", qty: 2, price: 279 },
      { name: "Bajra Til Cookies", qty: 2, price: 229 },
    ],
    total: 1016,
    status: "processing",
    date: "2026-06-26",
    time: "19:10",
    paymentMethod: "Credit Card",
  },
  {
    id: "ORD-1008",
    customer: {
      name: "Arjun Singh",
      email: "arjun.singh@gmail.com",
      phone: "+91 21098 76543",
      address: "67, Rani Bazar, Bikaner, Rajasthan 334001",
    },
    items: [
      { name: "Acacia Wood Plate", qty: 2, price: 899 },
      { name: "Farali Almond Cookies", qty: 1, price: 299 },
    ],
    total: 2097,
    status: "pending",
    date: "2026-06-22",
    time: "13:55",
    paymentMethod: "COD",
  },
];

export const getOrdersByStatus = (status) => {
  return dummyOrders.filter((o) => o.status === status);
};

export const getRecentOrders = (count = 5) => {
  return [...dummyOrders]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, count);
};
