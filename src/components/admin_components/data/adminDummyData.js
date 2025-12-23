export const todaySummary = [
  {
    city: "Wellington",
    total: 18,
    completed: 12,
    noLoadplan: 3,
    notChecked: 2,
    atRisk: 1,
  },
  {
    city: "Taupo",
    total: 10,
    completed: 8,
    noLoadplan: 1,
    notChecked: 1,
    atRisk: 0,
  },
  {
    city: "Christchurch",
    total: 14,
    completed: 9,
    noLoadplan: 2,
    notChecked: 2,
    atRisk: 1,
  },
  {
    city: "Auckland",
    total: 20,
    completed: 15,
    noLoadplan: 3,
    notChecked: 1,
    atRisk: 1,
  },
];

export const cityLoadplans = {
  "Ex WLG": [
    {
      trailer: "TR-201",
      truck: "R1",
      driver: "John",
      route: "WLG → AKL",
      sailing: "Interislander 10:30",
      status: "Checked",
    },
    {
      trailer: "TR-204",
      truck: "R3",
      driver: "Mike",
      route: "WLG → CHC",
      sailing: "Bluebridge 14:00",
      status: "No Loadplan",
    },
  ],
};
