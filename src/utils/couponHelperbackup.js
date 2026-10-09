// 示範優惠券規則（積分兌換）
export const COUPON_RULES = [
  { id: 'cp-01', nameZh: '50元港幣優惠券', nameEn: 'HK$50 Coupon', costPoints: 300, value:50 },
  { id: 'cp-02', nameZh: '100元港幣優惠券', nameEn: 'HK$100 Coupon', costPoints: 500, value:100 },
  { id: 'cp-03', nameZh: '200元港幣優惠券', nameEn: 'HK$200 Coupon', costPoints:900, value:200 }
];

export const canRedeemCoupon = (userPoints, rule) => userPoints >= rule.costPoints;
