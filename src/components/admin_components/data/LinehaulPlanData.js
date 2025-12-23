
const TODAY = new Date().toISOString().slice(0, 10);

export const LinehaulPlanData = {
  areas: [
    {
      name: "Ex TAUPO",
      entries: [
        {
          trucks: "R1",
          regos: "FHL8/24",
          drivers: "Motu",
          trailers: "",
          start: "04:40",
          instructions: "straight to boat",
          boats: "0815 bb",
          load: "South",
          planDate: TODAY
        },
        {
          trucks: "R2",
          regos: "FHL4/7",
          drivers: "Frank",
          trailers: "",
          start: "",
          instructions: "straight to boat",
          boats: "0815 bb",
          load: "CHC",
          planDate: TODAY
        }
      ]
    },
    {
      name: "Ex PALMERSTON NORTH",
      entries: [
        {
          trucks: "pcl",
          regos: "MHG800",
          drivers: "CAS",
          trailers: "2h206/7",
          start: "",
          instructions: "ctz trailer return",
          boats: "n/a",
          load: "nsn/bln",
          planDate: TODAY
        }
      ]
    },
    {
      name: "FHL Ex WELLINGTON",
      entries: [
        {
          trucks: "",
          regos: "",
          drivers: "Arshpreet",
          trailers: "6j677/8",
          start: "",
          instructions: "drop ILL p/up ILL",
          boats: "Interislander",
          load: "empty",
          planDate: TODAY
        },
        {
          trucks: "FHL25",
          regos: "",
          drivers: "Kartic",
          trailers: "281u1/2",
          start: "",
          instructions: "DROP ILL",
          boats: "INTERISLANDER",
          load: "akl/uni",
          planDate: TODAY
        }
      ]
    },
    {
      name: "CTZ Ex WELLINGTON",
      entries: [
        {
          trucks: "KAT533",
          regos: "",
          drivers: "Keith",
          trailers: "632n7",
          start: "",
          instructions: "",
          boats: "",
          load: "ctz19-B",
          planDate: TODAY
        },
        {
          trucks: "ANR02",
          regos: "",
          drivers: "Travis",
          trailers: "539s2",
          start: "",
          instructions: "DEPOT",
          boats: "BLUEBRIDGE",
          load: "ctz19",
          planDate: TODAY
        }
      ]
    }
  ]
};

export default LinehaulPlanData;
