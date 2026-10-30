/**
 * Public Cleanliness Reporter - Hierarchical Geographic Data & Initial Seeds
 * PBL Mini Project
 */

// Hierarchical State -> District -> Mandal -> Village/Ward Data
const LOCATION_DATA = {
  "Telangana": {
    code: "TS",
    districts: {
      "Hyderabad": {
        mandals: {
          "Charminar": ["Ghansi Bazar", "Moghalpura", "Shalibanda", "Pathergatti", "Sultan Bazar"],
          "Khairatabad": ["Banjara Hills", "Jubilee Hills", "Somajiguda", "Panjagutta", "Venkateshwara Colony"],
          "Secunderabad": ["Maredpally", "Begumpet", "Chilkalguda", "Sitaphalmandi", "Tarnaka"],
          "Serilingampally": ["Gachibowli", "Madhapur", "Kondapur", "Hitec City", "Hafeezpet"],
          "Musheerabad": ["Bholakpur", "Ramnagar", "Kavadiguda", "Bakaram", "Gandhinagar"],
          "Amberpet": ["Tilak Nagar", "Shivam Road", "Golnaka", "Baghamberpet", "Patel Nagar"],
          "Asif Nagar": ["Mehdipatnam", "Gudimalkapur", "Humayun Nagar", "Mallepally", "Vijaynagar Colony"]
        }
      },
      "Medchal-Malkajgiri": {
        mandals: {
          "Uppal": ["Boduppal", "Peerzadiguda", "Ramanthapur", "Habsiguda", "Nacharam"],
          "Malkajgiri": ["Safilguda", "Neredmet", "Vinayak Nagar", "Moula Ali", "Anandbagh"],
          "Quthbullapur": ["Chintal", "Jeedimetla", "Subhash Nagar", "Suraram", "Gajularamaram"],
          "Medchal": ["Kandlakoya", "Pudur", "Athvelly", "Dabilpur", "Gundlapochampally"],
          "Ghatkesar": ["Annojiguda", "Pocharam", "Yamnampet", "Pratapsingaram", "Kondapur Village"],
          "Alwal": ["Old Alwal", "Macha Bolarum", "Venkatapuram", "Temple Rock", "Lothkunta"],
          "Kapra": ["Sainikpuri", "Dr. A.S. Rao Nagar", "Cherlapally", "Kushaiguda", "Dammaiguda"]
        }
      },
      "Ranga Reddy": {
        mandals: {
          "Rajendranagar": ["Attapur", "Bandlaguda Jagir", "Mailardevpally", "Hyderguda", "Budvel"],
          "Shamshabad": ["Airport Colony", "Tondupally", "Ootapally", "Kavaguda", "Madanpally"],
          "Hayathnagar": ["Hayathnagar Ward 1", "Injapur", "Sahebnagar", "Torrur", "Pedda Amberpet"],
          "Ibrahimpatnam": ["Kongara Kalan", "Eliminedu", "Khanapur", "Polkampally", "Turkayamjal"],
          "Saroornagar": ["Kothapet", "Chaitanyapuri", "Dilsukhnagar", "Karmanghat", "L.B. Nagar"]
        }
      },
      "Warangal": {
        mandals: {
          "Warangal Fort": ["Fort Warangal", "Kareemabad", "Shambunipet", "Ursu", "Rangampet"],
          "Hanamkonda": ["Subedari", "Kazipet", "Nayeemnagar", "Lashkar Bazar", "Kakatiya University Area"],
          "Khila Warangal": ["Mamnoor", "Timmampet", "Alankar", "Bollikunta", "Vasanthapur"],
          "Wardhannapet": ["Inavolu", "Dharmaram", "Bandautlapally", "Nallabelli", "Katrapally"]
        }
      },
      "Karimnagar": {
        mandals: {
          "Karimnagar Urban": ["Kothirampur", "Mankammathota", "Kashmirgadda", "Vidyanagar", "Mukarampura"],
          "Choppadandi": ["Arnakonda", "Rukmapur", "Chinnakalvala", "Gopalaraopet", "Gumlapur"],
          "Manakondur": ["Munjampally", "Vellulla", "Chenjarla", "Pothireddypally", "Katakshapur"],
          "Thimmapur": ["Nustulapur", "Renikunta", "Poreddypally", "Mogilipalem", "Alugunoor"]
        }
      },
      "Nizamabad": {
        mandals: {
          "Nizamabad North": ["Kanteshwar", "Khaleelwadi", "Vinayak Nagar", "Subhashnagar", "Namdevwada"],
          "Nizamabad South": ["Barkatpura", "Armoor Road Ward", "Dubba", "Malapally", "Bodhan Road Area"],
          "Armoor": ["Perkit", "Mamillapally", "Kothapet", "Maganpet", "Alur"],
          "Bodhan": ["Rakhasipet", "Shakar Nagar", "Pandu", "Bhanpura", "Salura"]
        }
      },
      "Khammam": {
        mandals: {
          "Khammam Urban": ["Ballepally", "Rotary Nagar", "Wyra Road Ward", "Mayuri Centre", "Kaviraj Nagar"],
          "Khammam Rural": ["Thirthala", "Mallemadugu", "Edulapuram", "Khammam Palem", "Polepally"],
          "Madhira": ["Dendukuru", "Maddulapalli", "Allinagaram", "Torraguntapalem", "Siddinenigudem"],
          "Kothagudem": ["Rudrampur", "Chunchupally", "Babucamp", "Writer Basti", "Garimellapadu"]
        }
      },
      "Nalgonda": {
        mandals: {
          "Nalgonda Urban": ["Clock Tower Area", "Prakasham Bazar", "Devarakonda Road", "Brahmana Veedhi", "Arjalabavi"],
          "Miryalaguda": ["Santhi Nagar", "Reddy Colony", "Hanumanpet", "Rayapatnam", "Gudur"],
          "Suryapet": ["Kudakuda", "Balaiah Nagar", "Sriram Nagar", "Jangaon Cross", "Pillalamarri"]
        }
      }
    }
  },
  "Andhra Pradesh": {
    code: "AP",
    districts: {
      "Visakhapatnam": {
        mandals: {
          "Gajuwaka": ["Auto Nagar", "Kurmannapalem", "Kanithi", "Srinagar", "Tungalam"],
          "Visakhapatnam Urban": ["MVP Colony", "Siripuram", "Dwaraka Nagar", "Beach Road Ward", "Jagadamba Junction"],
          "Bheemunipatnam": ["Tagarapuvalasa", "Chepalauppada", "Narasimhapuram", "Kappada", "Bheemili Beach Ward"],
          "Pendurthi": ["Chinnamushidiwada", "Suvarnanagar", "Pulagalipalem", "Gorapalli", "Pinagadi"],
          "Anakapalle": ["Woodpeta", "Sharoff Bazar", "Gavarapalem", "Thotada", "Rebaka"]
        }
      },
      "NTR / Vijayawada": {
        mandals: {
          "Vijayawada Urban": ["Governorpet", "Suryaraopet", "Moghalrajpuram", "Labbipet", "Benz Circle Ward"],
          "Vijayawada Central": ["Satyanarayanapuram", "Gandhinagar", "Bhimannapeta", "Poornanandampet", "Ayodhya Nagar"],
          "Ibrahimpatnam": ["Kondapalli", "Ferry Village", "Zuzuvuru", "Trilochanapuram", "Guntupalli"],
          "Penamaluru": ["Poranki", "Kanuru", "Tadigadapa", "Yanamalakuduru", "Gosala"],
          "Gannavaram": ["Airport Area", "Pedda Avutapalli", "Chinna Avutapalli", "Mustabad", "Purushothapatnam"]
        }
      },
      "Guntur": {
        mandals: {
          "Guntur Urban": ["Arundelpet", "Brodipet", "Kothapet", "Pattabhipuram", "Nallapadu"],
          "Mangalagiri": ["Atmakuru", "Nowluru", "Yerrabalem", "Chinakakani", "Bethapudi"],
          "Tenali": ["Morrispet", "Chenchupet", "Nazerrpet", "Ithanagar", "Ganga Sagar"],
          "Tadikonda": ["Mothadaka", "Ponnekallu", "Kantheru", "Ravela", "Bejawada Vari Palem"]
        }
      },
      "Tirupati": {
        mandals: {
          "Tirupati Urban": ["Bhavani Nagar", "Alipiri Ward", "Korlagunta", "Balaji Colony", "Bairagipatteda"],
          "Chandragiri": ["A.Rangampet", "Sanambatla", "Thondavada", "Panakam", "Narasingapuram"],
          "Srikalahasti": ["Subhash Nagar", "Panagal", "Bahadurpeta", "Kothapeta", "Rajiv Nagar"],
          "Renigunta": ["Karakambadi", "Thandlam", "Gajulamandyam", "Mamandur", "Surappakasam"]
        }
      },
      "Chittoor": {
        mandals: {
          "Chittoor Urban": ["Kongareddy Palli", "Murukambattu", "Greamspet", "Santapet", "Bazar Street"],
          "Palamaner": ["Kurubalabyle", "Pengara", "Melumai", "Gudiyattam Road Ward", "Baireddipalle Gate"],
          "Madanapalle": ["Neerugattuvaripalle", "Ponnetipalem", "B.K. Palli", "Valasapalle", "Basinikonda"]
        }
      },
      "Kurnool": {
        mandals: {
          "Kurnool Urban": ["Budhwarpet", "Santosh Nagar", "B Camp", "C Camp", "Joharapuram"],
          "Nandyal": ["Sanjeeva Nagar", "Tekke", "NGOs Colony", "Srinivasa Nagar", "Padmavathi Nagar"],
          "Adoni": ["Havanur", "Venkateshwara Colony", "Mandagiri", "SKD Nagar", "Vontimitta Area"]
        }
      }
    }
  },
  "Karnataka": {
    code: "KA",
    districts: {
      "Bengaluru Urban": {
        mandals: {
          "Bengaluru South": ["Jayanagar", "JP Nagar", "BTM Layout", "Banashankari", "Padmanabhanagar"],
          "Bengaluru East": ["Indiranagar", "Whitefield", "Marathahalli", "Kalyan Nagar", "CV Raman Nagar"],
          "Bengaluru North": ["Malleshwaram", "Hebbal", "Yelahanka", "RT Nagar", "Peenya"]
        }
      },
      "Mysuru": {
        mandals: {
          "Mysuru Urban": ["Gokulam", "Kuvempunagar", "Vijayanagar", "Jayalakshmipuram", "Saraswathipuram"],
          "Nanjangud": ["Debur", "Hullahalli", "Heggadahalli", "Kavalande", "Thandavapura"]
        }
      }
    }
  },
  "Maharashtra": {
    code: "MH",
    districts: {
      "Pune": {
        mandals: {
          "Haveli": ["Kothrud", "Shivajinagar", "Hadapsar", "Viman Nagar", "Kalyani Nagar"],
          "Mulshi": ["Hinjawadi", "Wakad", "Maan", "Pirangut", "Lavale"]
        }
      },
      "Nagpur": {
        mandals: {
          "Nagpur Urban": ["Dharampeth", "Sitabuldi", "Ramdaspeth", "Pratap Nagar", "Manish Nagar"],
          "Kamthi": ["Kanhan", "Ranala", "Yerkheda", "Goreghat", "Bhilgaon"]
        }
      }
    }
  }
};

// Problem categories metadata with icons, urgency defaults, and descriptions
const PROBLEM_CATEGORIES = [
  {
    id: "garbage_not_collected",
    label: "Garbage not collected",
    icon: "🗑️",
    badgeColor: "#ea580c",
    defaultSeverity: "Medium",
    desc: "Household or street garbage uncollected for multiple days"
  },
  {
    id: "overflowing_dustbin",
    label: "Overflowing dustbin",
    icon: "🚮",
    badgeColor: "#d97706",
    defaultSeverity: "High",
    desc: "Public municipality trash bin full and spilling onto the road"
  },
  {
    id: "open_drain",
    label: "Open drain / sewage blockage",
    icon: "🚰",
    badgeColor: "#dc2626",
    defaultSeverity: "High",
    desc: "Clogged or broken drainage canal causing foul stench & overflow"
  },
  {
    id: "stagnant_water",
    label: "Stagnant water / mosquitoes",
    icon: "🦟",
    badgeColor: "#0284c7",
    defaultSeverity: "High",
    desc: "Water accumulation on road or empty plot breeding disease vectors"
  },
  {
    id: "public_toilet_dirty",
    label: "Public toilet dirty",
    icon: "🚻",
    badgeColor: "#7c3aed",
    defaultSeverity: "Medium",
    desc: "Unsanitary, unusable, or broken community/public washroom"
  },
  {
    id: "burning_of_waste",
    label: "Burning of waste",
    icon: "🔥",
    badgeColor: "#b91c1c",
    defaultSeverity: "Critical",
    desc: "Open burning of leaves, plastic, or municipal garbage releasing toxic fumes"
  },
  {
    id: "other",
    label: "Other cleanliness issue",
    icon: "⚠️",
    badgeColor: "#475569",
    defaultSeverity: "Low",
    desc: "Dead animal carcasses, construction debris, bio-waste, or general neglect"
  }
];

// Realistic Pre-seeded Demo Reports to showcase the app instantly
const INITIAL_DEMO_REPORTS = [
  {
    id: "PCR-2026-88102",
    createdAt: "2026-10-28T09:30:00.000Z",
    state: "Telangana",
    district: "Hyderabad",
    mandal: "Serilingampally",
    village: "Hitec City",
    problem: "Overflowing dustbin",
    problemId: "overflowing_dustbin",
    customProblemText: "",
    severity: "High",
    description: "Main commercial street dustbin near Cyber Towers bus shelter is overflowing heavily. Plastic wrappers and food waste scattered across the footpath.",
    reporterName: "Rajesh Varma",
    reporterPhone: "9876543210",
    reporterEmail: "rajesh.varma@example.com",
    status: "Resolved",
    photoData: null,
    photoPlaceholderIcon: "🚮",
    officialRemark: "GHMC sanitation van dispatched on 29-Oct. Dustbin emptied, cleared, and disinfectant bleaching powder sprinkled.",
    resolvedAt: "2026-10-29T14:15:00.000Z"
  },
  {
    id: "PCR-2026-89415",
    createdAt: "2026-10-29T11:45:00.000Z",
    state: "Telangana",
    district: "Medchal-Malkajgiri",
    mandal: "Uppal",
    village: "Boduppal",
    problem: "Open drain / sewage blockage",
    problemId: "open_drain",
    customProblemText: "",
    severity: "Critical",
    description: "Sewage water leaking from the underground drain near Green Avenue Road No. 4. Foul odor and pedestrian path completely blocked.",
    reporterName: "Ananya Sharma",
    reporterPhone: "9123456789",
    reporterEmail: "ananya.s@example.com",
    status: "In Progress",
    photoData: null,
    photoPlaceholderIcon: "🚰",
    officialRemark: "Sanitation engineering team inspected the pipeline. Desilting super sucker machine deployed.",
    resolvedAt: null
  },
  {
    id: "PCR-2026-90231",
    createdAt: "2026-10-30T08:15:00.000Z",
    state: "Andhra Pradesh",
    district: "Visakhapatnam",
    mandal: "Visakhapatnam Urban",
    village: "MVP Colony",
    problem: "Garbage not collected",
    problemId: "garbage_not_collected",
    customProblemText: "",
    severity: "Medium",
    description: "Door-to-door waste collection vehicle has not visited Sector 7 for the last 3 days. Piles of bags accumulated near the community park entrance.",
    reporterName: "K. Murali Krishna",
    reporterPhone: "9440123456",
    reporterEmail: "kmurali@example.com",
    status: "Pending",
    photoData: null,
    photoPlaceholderIcon: "🗑️",
    officialRemark: "",
    resolvedAt: null
  },
  {
    id: "PCR-2026-91044",
    createdAt: "2026-10-30T14:20:00.000Z",
    state: "Telangana",
    district: "Hyderabad",
    mandal: "Charminar",
    village: "Pathergatti",
    problem: "Stagnant water / mosquitoes",
    problemId: "stagnant_water",
    customProblemText: "",
    severity: "High",
    description: "Water logging behind government school building after recent rains. Heavy mosquito infestation endangering schoolchildren.",
    reporterName: "Syed Imran",
    reporterPhone: "9848011223",
    reporterEmail: "",
    status: "Pending",
    photoData: null,
    photoPlaceholderIcon: "🦟",
    officialRemark: "",
    resolvedAt: null
  },
  {
    id: "PCR-2026-91580",
    createdAt: "2026-10-30T16:05:00.000Z",
    state: "Andhra Pradesh",
    district: "Tirupati",
    mandal: "Tirupati Urban",
    village: "Alipiri Ward",
    problem: "Burning of waste",
    problemId: "burning_of_waste",
    customProblemText: "",
    severity: "Critical",
    description: "Dry leaves and plastic packages being burnt near bypass junction causing heavy smog and respiratory trouble for morning walkers.",
    reporterName: "S. Venkatesh",
    reporterPhone: "9701239876",
    reporterEmail: "svenkat@example.com",
    status: "In Progress",
    photoData: null,
    photoPlaceholderIcon: "🔥",
    officialRemark: "Notified environmental inspection squad. Extinguished fire; issuing notice to nearby plot owner.",
    resolvedAt: null
  }
];

// Helper to initialize or retrieve reports from localStorage
function getStoredReports() {
  const stored = localStorage.getItem("PCR_REPORTS_DATABASE");
  if (!stored) {
    localStorage.setItem("PCR_REPORTS_DATABASE", JSON.stringify(INITIAL_DEMO_REPORTS));
    return [...INITIAL_DEMO_REPORTS];
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error("Failed to parse stored reports", e);
    return [...INITIAL_DEMO_REPORTS];
  }
}

function saveStoredReports(reports) {
  localStorage.setItem("PCR_REPORTS_DATABASE", JSON.stringify(reports));
}
