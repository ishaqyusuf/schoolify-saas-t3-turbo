export function getResultComment(score) {
  const comments = [
    {
      min: 90,
      max: 100,
      arabic: "ممتاز! أداء رائع واستثنائي.",
      english: "Excellent! Outstanding and exceptional performance.",
    },
    {
      min: 80,
      max: 89,
      arabic: "جيد جدًا! أداء قوي وجهد ملحوظ.",
      english: "Very good! Strong performance and great effort.",
    },
    {
      min: 70,
      max: 79,
      arabic: "جيد! عمل جيد ولكن هناك مجال للتحسين.",
      english: "Good! Well done, but there is room for improvement.",
    },
    {
      min: 60,
      max: 69,
      arabic: "مقبول! تحتاج إلى بذل المزيد من الجهد.",
      english: "Satisfactory! Needs more effort.",
    },
    {
      min: 50,
      max: 59,
      arabic: "ضعيف! حاول تحسين أدائك في المستقبل.",
      english: "Weak! Try to improve your performance in the future.",
    },
    {
      min: 0,
      max: 49,
      arabic: "راسب! بحاجة إلى العمل الجاد والمثابرة.",
      english: "Fail! Needs hard work and persistence.",
    },
  ];

  const comment = comments.find((c) => score >= c.min && score <= c.max);
  return comment
    ? comment
    : { arabic: "درجة غير صالحة", english: "Invalid score" };
}

// Example usage:
console.log(getResultComment(85)); // { arabic: "جيد جدًا! أداء قوي وجهد ملحوظ.", english: "Very good! Strong performance and great effort." }
