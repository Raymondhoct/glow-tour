// 示範優惠券規則（積分兌換）
export const COUPON_RULES = [
  {
    id: 'cp-01',
    nameZh: '30美元優惠券',
    nameEn: '$30 off min $200',
    costPoints: 200,
    value: 30,
    imgUrl: '/images/coupons/coupon30.jpeg'
  },
  {
    id: 'cp-02',
    nameZh: '80美元優惠券',
    nameEn: '$80 off min $500',
    costPoints: 450,
    value: 80,
    imgUrl: '/images/coupons/coupon80.jpeg'
  },
  {
    id: 'cp-03',
    nameZh: '200美元優惠券',
    nameEn: '$200 off min $1000',
    costPoints: 900,
    value: 200,
    imgUrl: '/images/coupons/coupon200.jpeg'
  }
];
export const canRedeemCoupon = (userPoints, rule) => userPoints >= rule.costPoints;

