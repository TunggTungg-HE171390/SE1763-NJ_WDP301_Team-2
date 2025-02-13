import React from 'react';

const pricingPlans = [
  {
    id: 1,
    title: 'Tiết kiệm nhất',
    duration: 'Theo năm',
    price: '35,99 US$',
    pricePerMonth: '2,99 US$',
    bestValue: true,
  },
  {
    id: 2,
    title: 'Theo tháng',
    duration: 'Theo tháng',
    price: '7,99 US$',
    pricePerMonth: '7,99 US$',
    bestValue: false,
  },
];

const Pricing = () => {
  return (
    <div className="pricing-container ">
      {pricingPlans.map((plan) => (
        <div key={plan.id} className={`pricing-card ${plan.bestValue ? 'best-value' : ''} `}>
          <div className="pricing-title">{plan.title}</div>
          <div className="pricing-duration">{plan.duration}</div>
          <div className="pricing-price">
            {plan.bestValue && <span className="best-value-label">Tiết kiệm nhất</span>}
            {plan.price}
          </div>
          <div className="pricing-price-per-month">
            {plan.bestValue ? `Tương đương ${plan.pricePerMonth}/tháng` : `${plan.pricePerMonth}/tháng`}
          </div>
          {plan.bestValue ? (
            <button className="start-trial-button">Bắt đầu dùng thử miễn phí</button>
          ) : (
            <button className="buy-now-button">Mua Quizlet Plus</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Pricing;