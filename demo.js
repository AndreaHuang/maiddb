const Joi = require("joi");
const schmea = Joi.object({
  date: Joi.string().isoDate(),
});
const list = [
  {
    date: "111",
  },
  {
    date: "aaa",
  },
  {
    date: 1,
  },
  { date: "2019" },
  { date: "2019-11" },
  { date: "2019-31-12" },
  { date: "2019-12-31" },
];
// list.forEach((item) => {
//   console.log("--------------");
//   console.log(item);
//   console.log(schmea.validate(item));
// });

const nationalities = ["ID", "PH", "TH"];
const schma = Joi.object({
  value: Joi.string().required().valid("ID", "PH", "TH"),
});

// .xor('password', 'access_token')
console.log(schma.validate({ value: "ID" }));
