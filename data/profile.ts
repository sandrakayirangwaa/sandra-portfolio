/**
 * Everything the site says about Sandra lives in this file.
 * Update text here and every page picks it up.
 */

export type SkillId =
  | "all"
  | "backend"
  | "data"
  | "ml"
  | "iot"
  | "web"
  | "design"
  | "testing";

export const profile = {
  firstName: "Sandra",
  fullName: "Sandra Kayirangwa",
  title: "Software Engineer",
  intro: "I turn raw signals into decisions people can act on.",
  builds: [
    "backends and APIs",
    "mobile and web apps",
    "data pipelines",
    "machine learning models",
    "IoT systems",
  ],
  photo: { src: "images/sandra.png", alt: "Sandra Kayirangwa" } as {
    src: string;
    alt: string;
  } | null,
  location: "Kigali, Rwanda",
  email: "sandrakayirangwaa@gmail.com",
  cv: "https://drive.google.com/file/d/13V-NFtgRQ26CfQx0tgYTwZEo0SgK2fsr/view?usp=sharing",
  links: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/sandra-kayirangwa",
    },
    { label: "GitHub", href: "https://github.com/sandrakayirangwaa" },
    { label: "Behance", href: "https://www.behance.net/sandrakayiran" },
  ],
  statement: [
    "I\u2019m a software engineer working in backend and data, and exploring AI. I\u2019m most interested in building things that keep working when conditions aren\u2019t ideal.",
    "So far, that has meant pipelines that check incoming data before anything relies on it, APIs that the rest of a product depends on, and models that explain their output instead of just giving a number.",
    "I like finding the source of a problem and helping to fix it there. I also care about what technology makes possible for people, especially the people who need it most.",
    "The question I keep coming back to is simple: does this make something easier for the person on the receiving end? If not, I keep looking.",
  ],
  education: [
    {
      school: "AkiraChix, CodeHive",
      course: "Tech training program",
      dates: "Feb 2026 to Nov 2026",
    },
  ],
  skills: [
    {
      group: "Programming languages",
      items: ["Python", "SQL", "JavaScript", "Dart"],
    },
    {
      group: "Backend and APIs",
      items: [
        "FastAPI",
        "REST API design",
        "SQLAlchemy",
        "JWT authentication",
        "OAuth 2.0",
        "Role-based access control",
        "MQTT",
      ],
    },
    {
      group: "Databases",
      items: ["PostgreSQL", "Data modeling", "Query optimization"],
    },
    {
      group: "AI and machine learning",
      items: [
        "PyTorch",
        "Model training and evaluation",
        "Transfer learning",
        "Model deployment on constrained hardware",
      ],
    },
    {
      group: "Mobile and web development",
      items: ["Flutter", "Next.js", "React"],
    },
    { group: "Design", items: ["Figma", "UI design"] },
    {
      group: "IoT and hardware",
      items: ["ESP32", "LoRa", "Sensor integration"],
    },
    {
      group: "QA and testing",
      items: ["Cypress", "API testing", "End-to-end validation"],
    },
    {
      group: "Developer tools",
      items: [
        "Git and GitHub",
        "Docker",
        "Postman",
        "Google Colab",
        "Jupyter Notebook",
      ],
    },
  ],
};

/** The skill filters on the Work page. */
export const skillFilters: Record<SkillId, string> = {
  all: "Everything",
  backend: "Backend and APIs",
  data: "Data pipelines",
  ml: "Machine learning",
  iot: "IoT and hardware",
  web: "Mobile and web development",
  design: "Design",
  testing: "Testing and security",
};

export type Point = { text: string; skills: SkillId[] };

export type Step = {
  id: string;
  label: string;
  x: number;
  y: number;
  mx: number;
  my: number;
  below?: boolean;
  side?: boolean;
};

export type Scenario = {
  id: string;
  label: string;
  route: string[];
  end: string;
  outcome: "ok" | "stop" | "hold";
};

export type Project = {
  slug: string;
  name: string;
  /** Optional links. They appear on the project page when filled in. */
  repo?: string;
  live?: string;
  line: string;
  stack: string[];
  summary: string;
  /** A short label such as "Team project, in development". */
  status?: string;
  insight?: string;
  users?: { name: string; surface: string; text: string }[];
  pointsTitle?: string;
  /** Show the points as numbered steps. */
  ordered?: boolean;
  points: Point[];
  extraTitle?: string;
  extra?: string;
  /** Real results taken from the project. */
  results?: string[];
  flow: {
    title: string;
    note: string;
    wide: [number, number];
    tall: [number, number];
    steps: Step[];
    links: [string, string][];
    scenarios: Scenario[];
  };
};

export const projects: Project[] = [
  {
    slug: "afyra",
    name: "Afyra",
    line: "Connects smallholder farmers with feed manufacturers who need reliable quantities of crop residues.",
    stack: ["FastAPI", "PostgreSQL", "Flutter", "React"],
    status: "Built with my team",
    summary:
      "Afyra is a digital crop-residue sourcing and logistics platform. It connects smallholder farmers who have residues available with commercial animal-feed manufacturers, finds suitable supply across several farmers when needed, and coordinates aggregation, collection, transport and delivery.",
    insight:
      "Our research found that having crop residues in an area does not mean they are available for sale. Farmers may need them for their own livestock, while manufacturers need large, consistent quantities. Afyra matches real supply with actual demand.",
    users: [
      {
        name: "Farmer",
        surface: "Mobile app",
        text: "Lists residues, quantities and dates, sees a suggested price, then follows collection details and order progress.",
      },
      {
        name: "Truck driver",
        surface: "Mobile app",
        text: "Gets assigned pickups, opens navigation in Google Maps, records quantities and updates delivery status.",
      },
      {
        name: "Feed manufacturer",
        surface: "Web dashboard",
        text: "Posts requirements, reviews matched supply and pooling plans, and tracks quantities, prices and delivery.",
      },
    ],
    pointsTitle: "How it works",
    ordered: true,
    points: [
      {
        text: "Farmers list only what they are willing and able to sell, including quantity, location and availability date, and see a suggested price.",
        skills: ["web", "design"],
      },
      {
        text: "Manufacturers submit a sourcing request with residue type, quantity, delivery date, quality needs, maximum sourcing distance and desired buying price.",
        skills: ["web"],
      },
      {
        text: "The backend compares requests with listings on type, quantity, dates, quality, location and price, and includes only listings that meet the requirements.",
        skills: ["backend", "data"],
      },
      {
        text: "If one farmer can meet the request, the system proposes a direct match. If not, it groups nearby suitable farmers into practical pools within the sourcing distance.",
        skills: ["backend", "data"],
      },
      {
        text: "A participating farmer can volunteer as a collection point. The proposed host must accept, and one order can use several collection points.",
        skills: ["backend", "web"],
      },
      {
        text: "The manufacturer reviews suppliers, quantities, collection points, distances and prices. Estimated supply stays separate from confirmed quantities.",
        skills: ["web", "testing", "design"],
      },
      {
        text: "The host records what each farmer delivers, so any shortfall against the estimate is visible to the manufacturer.",
        skills: ["data", "testing"],
      },
      {
        text: "An assigned driver sees collection points and expected quantities, confirms arrival with a pickup code, records what is loaded at each stop, and updates delivery status.",
        skills: ["web"],
      },
      {
        text: "The manufacturer confirms receipt. The system compares requested, collected and delivered quantities, then completes the order.",
        skills: ["backend", "data"],
      },
    ],
    extraTitle: "Price transparency",
    extra:
      "Prices start from Tamia Feeds. The pricing engine adds or removes points based on quantity and quality, then shows the result as a suggestion. Both sides see it during matching and plan review, and the price they agree is recorded on the order.",
    flow: {
      title: "Follow an order through Afyra",
      note: "Simplified from the Afyra workflow. This animation does not use live data.",
      wide: [1000, 400],
      tall: [340, 740],
      steps: [
        {
          id: "listing",
          label: "Farmer listing",
          x: 70,
          y: 90,
          mx: 70,
          my: 40,
        },
        {
          id: "request",
          label: "Sourcing request",
          x: 70,
          y: 310,
          mx: 270,
          my: 100,
        },
        { id: "match", label: "Matching", x: 250, y: 200, mx: 170, my: 190 },
        { id: "direct", label: "Direct match", x: 430, y: 90, mx: 70, my: 270 },
        {
          id: "pool",
          label: "Pool of farmers",
          x: 430,
          y: 310,
          mx: 270,
          my: 320,
          below: true,
        },
        {
          id: "point",
          label: "Collection point",
          x: 590,
          y: 310,
          mx: 270,
          my: 400,
          below: true,
        },
        {
          id: "review",
          label: "Manufacturer review",
          x: 710,
          y: 200,
          mx: 170,
          my: 500,
        },
        {
          id: "driver",
          label: "Truck driver",
          x: 830,
          y: 200,
          mx: 170,
          my: 600,
          below: true,
        },
        { id: "done", label: "Delivered", x: 940, y: 200, mx: 170, my: 700 },
      ],
      links: [
        ["listing", "match"],
        ["request", "match"],
        ["match", "direct"],
        ["match", "pool"],
        ["pool", "point"],
        ["direct", "review"],
        ["point", "review"],
        ["review", "driver"],
        ["driver", "done"],
      ],
      scenarios: [
        {
          id: "direct",
          label: "One farmer has enough",
          route: ["listing", "match", "direct", "review", "driver", "done"],
          end: "A direct match, reviewed and delivered.",
          outcome: "ok",
        },
        {
          id: "pool",
          label: "One farmer is too small",
          route: [
            "request",
            "match",
            "pool",
            "point",
            "review",
            "driver",
            "done",
          ],
          end: "Nearby farmers bring their supply to a collection point.",
          outcome: "ok",
        },
        {
          id: "short",
          label: "Quantity falls short",
          route: ["listing", "match", "pool", "point", "review"],
          end: "The shortfall is recorded for the manufacturer to review.",
          outcome: "hold",
        },
      ],
    },
  },
  {
    slug: "paws",
    name: "PAWS",
    line: "An IoT and AI early-warning system for human-wildlife conflict around Maasai Mara water pans.",
    stack: [
      "ESP32",
      "LoRa",
      "MQTT",
      "PostgreSQL",
      "YOLOv8 nano",
      "Next.js",
      "JWT",
    ],
    summary:
      "PAWS combines remote water-level monitoring with wildlife and livestock detection to identify emerging conflict, helping rangers spot potential threats earlier and respond before situations escalate.",
    points: [
      {
        text: "Connected ESP32 water-level sensors to a LoRa gateway and MQTT broker, so rangers no longer collect readings from remote water pans by hand.",
        skills: ["iot", "backend", "data"],
      },
      {
        text: "Implemented MQTT message validation that checks telemetry payloads and verifies device registration before inserting readings into PostgreSQL, rejecting malformed messages and unregistered devices.",
        skills: ["backend", "data", "testing"],
      },
      {
        text: "Built the data pipeline that receives sensor readings from field stations, calculates water pan risk levels and delivers conflict alerts to the ranger dashboard.",
        skills: ["backend", "data"],
      },
      {
        text: "Combined water-level readings with wildlife and livestock detections to classify conflict risk, turning separate monitoring inputs into a single risk assessment for each location.",
        skills: ["data", "ml"],
      },
      {
        text: "Trained a YOLOv8 nano model on lion datasets to detect wildlife and livestock in images.",
        skills: ["ml"],
      },
      {
        text: "Added a confidence-based review step that sends low-confidence predictions for human verification before they can trigger an automated alert, keeping rangers in control of decisions that affect their safety.",
        skills: ["ml", "testing", "web", "design"],
      },
      {
        text: "Compressed the model to run on the station's own hardware, keeping stations monitoring for days on solar power and sending only compact summaries over LoRa instead of full images.",
        skills: ["ml", "iot"],
      },
      {
        text: "Built a Next.js dashboard that displays water pan readings, risk levels and incoming conflict alerts, so rangers can identify which locations need attention.",
        skills: ["backend", "web", "design"],
      },
      {
        text: "Secured the API with JWT authentication and role-based access control, so ranger locations and incident data are only visible to the roles that need them.",
        skills: ["backend", "testing"],
      },
    ],
    flow: {
      title: "Follow a signal through PAWS",
      note: "Simplified from the PAWS data flow. This animation does not use live data.",
      wide: [1000, 400],
      tall: [340, 780],
      steps: [
        { id: "sensor", label: "ESP32 sensor", x: 70, y: 90, mx: 70, my: 50 },
        { id: "lora", label: "LoRa gateway", x: 230, y: 90, mx: 70, my: 150 },
        { id: "mqtt", label: "MQTT broker", x: 390, y: 90, mx: 70, my: 250 },
        { id: "check", label: "Message check", x: 550, y: 90, mx: 70, my: 350 },
        { id: "db", label: "PostgreSQL", x: 710, y: 90, mx: 70, my: 450 },
        {
          id: "risk",
          label: "Risk level",
          x: 710,
          y: 310,
          mx: 170,
          my: 550,
          below: true,
        },
        {
          id: "dash",
          label: "Ranger dashboard",
          x: 900,
          y: 310,
          mx: 170,
          my: 720,
        },
        { id: "yolo", label: "YOLOv8 nano", x: 230, y: 310, mx: 270, my: 200 },
        {
          id: "conf",
          label: "Confidence check",
          x: 470,
          y: 310,
          mx: 270,
          my: 300,
          below: true,
        },
        {
          id: "human",
          label: "Human review",
          x: 470,
          y: 200,
          mx: 270,
          my: 400,
        },
      ],
      links: [
        ["sensor", "lora"],
        ["lora", "mqtt"],
        ["mqtt", "check"],
        ["check", "db"],
        ["db", "risk"],
        ["risk", "dash"],
        ["yolo", "conf"],
        ["conf", "risk"],
        ["conf", "human"],
      ],
      scenarios: [
        {
          id: "valid",
          label: "Valid reading",
          route: ["sensor", "lora", "mqtt", "check", "db", "risk", "dash"],
          end: "Stored, scored and shown to rangers.",
          outcome: "ok",
        },
        {
          id: "malformed",
          label: "Malformed message",
          route: ["sensor", "lora", "mqtt", "check"],
          end: "Rejected. Nothing reaches PostgreSQL.",
          outcome: "stop",
        },
        {
          id: "unknown",
          label: "Unregistered device",
          route: ["sensor", "lora", "mqtt", "check"],
          end: "Rejected. The device is not registered.",
          outcome: "stop",
        },
        {
          id: "confident",
          label: "Confident detection",
          route: ["yolo", "conf", "risk", "dash"],
          end: "Combined with water levels into one risk assessment.",
          outcome: "ok",
        },
        {
          id: "unsure",
          label: "Low-confidence detection",
          route: ["yolo", "conf", "human"],
          end: "Held for a person to verify before it can trigger an alert.",
          outcome: "hold",
        },
      ],
    },
  },
  {
    slug: "retinopathy",
    name: "Diabetic Retinopathy Severity Classifier",
    line: "A medical imaging app that classifies retinal photographs across five severity levels.",
    stack: ["TensorFlow", "MobileNetV2", "Streamlit"],
    repo: "https://github.com/sandrakayirangwaa/Medical-Imaging-Project",
    results: [
      "73.6% accuracy on 550 held-out test images.",
      "Reliable on the most common classes: 0.99 recall for No DR and 0.79 for Moderate.",
      "Weak on rarer classes, with 0.10 recall for Severe. Class imbalance is the main limitation, so this is not ready for clinical use.",
    ],
    summary:
      "The application uses a MobileNetV2 deep-learning model to give a predicted class and confidence score from retinal fundus photographs. It supports preliminary assessment and helps flag images that may need closer clinical review. I trained it on 3,662 labelled images from the APTOS 2019 dataset.",
    points: [
      {
        text: "Trained a MobileNetV2 model to classify retinal fundus images across five severity levels, giving health workers an early indication of which patients may need closer clinical review.",
        skills: ["ml"],
      },
      {
        text: "Built a Streamlit application that accepts uploaded retinal images and returns a predicted severity class, confidence score and brief explanation, so users can inspect a result without running code.",
        skills: ["backend", "ml", "web", "design"],
      },
      {
        text: "Integrated image preprocessing and model inference into the prediction workflow, so uploaded photographs pass through the trained model and are classified within the application.",
        skills: ["backend", "data", "ml"],
      },
    ],
    flow: {
      title: "Follow an image through the classifier",
      note: "Simplified prediction workflow. This tool supports preliminary assessment and does not give a diagnosis.",
      wide: [1000, 200],
      tall: [340, 480],
      steps: [
        {
          id: "upload",
          label: "Uploaded image",
          x: 90,
          y: 100,
          mx: 40,
          my: 50,
        },
        { id: "prep", label: "Preprocessing", x: 345, y: 100, mx: 40, my: 170 },
        { id: "model", label: "MobileNetV2", x: 600, y: 100, mx: 40, my: 290 },
        {
          id: "result",
          label: "Class, confidence, explanation",
          x: 860,
          y: 100,
          mx: 40,
          my: 420,
        },
      ],
      links: [
        ["upload", "prep"],
        ["prep", "model"],
        ["model", "result"],
      ],
      scenarios: [
        {
          id: "image",
          label: "Run an image",
          route: ["upload", "prep", "model", "result"],
          end: "One of five severity levels, with a confidence score.",
          outcome: "ok",
        },
      ],
    },
  },
];

export type MoreProject = {
  name: string;
  line: string;
  stack: string[];
  skills: SkillId[];
  repo: string;
  live?: string;
};

/** Smaller projects. Each row opens the repository. Add new ones here. */
export const moreProjects: MoreProject[] = [
  {
    name: "Supermarket POS API",
    line: "A point-of-sale backend with automated tests.",
    stack: ["FastAPI", "SQLAlchemy", "pytest", "GitHub Actions"],
    skills: ["backend", "testing"],
    repo: "https://github.com/sandrakayirangwaa/supermarket-pos-API",
  },
  {
    name: "Care Reminder API",
    line: "Emails caregivers when medication and appointment reminders are due.",
    stack: ["FastAPI", "PostgreSQL", "JWT", "APScheduler"],
    skills: ["backend", "testing"],
    repo: "https://github.com/sandrakayirangwaa/care-reminder-API",
  },
  {
    name: "Privacy Guard API",
    line: "Masks personal data before text reaches an LLM.",
    stack: ["FastAPI", "PostgreSQL", "Fernet encryption"],
    skills: ["backend", "testing"],
    repo: "https://github.com/sandrakayirangwaa/privacy-guard-API",
  },
  {
    name: "AI Notion Research Agent",
    line: "A chat agent that researches topics and saves the findings to Notion.",
    stack: ["n8n", "gpt-4o-mini", "Notion API"],
    skills: ["ml"],
    repo: "https://github.com/sandrakayirangwaa/ai-notion-research-agent",
  },
  {
    name: "IoT Dashboard",
    line: "Live ESP32 telemetry and relay controls over MQTT.",
    stack: ["Next.js", "MQTT", "ESP32"],
    skills: ["iot", "web"],
    repo: "https://github.com/sandrakayirangwaa/IoT-dashboard",
  },
  {
    name: "Health Spending in East Africa",
    line: "A regression on health spending and life expectancy in five countries.",
    stack: ["Python", "pandas", "seaborn", "OLS regression"],
    skills: ["data"],
    repo: "https://github.com/sandrakayirangwaa/elderly-healthcare-access-analysis",
  },
  {
    name: "Encoding Techniques",
    line: "Compares five encoding methods on house price data.",
    stack: ["Python", "scikit-learn", "pandas"],
    skills: ["data", "ml"],
    repo: "https://github.com/sandrakayirangwaa/encoding-techniques",
  },
  {
    name: "Titanic Cleaning Pipeline",
    line: "A repeatable data cleaning and charting script.",
    stack: ["Python", "pandas", "seaborn"],
    skills: ["data"],
    repo: "https://github.com/sandrakayirangwaa/titanic-cleaning",
  },
  {
    name: "Tally",
    line: "Inventory, sales and profit tracking for small shops in Rwanda.",
    stack: ["Next.js", "React"],
    skills: ["web"],
    repo: "https://github.com/sandrakayirangwaa/Tally",
  },
  {
    name: "PataLink",
    line: "A school lost and found app that suggests matches.",
    stack: ["Next.js", "React"],
    skills: ["web"],
    repo: "https://github.com/sandrakayirangwaa/PataLink",
  },
  {
    name: "Students and Courses",
    line: "Forms connected to a REST API for student enrolment.",
    stack: ["Next.js", "React Hook Form", "TanStack Query"],
    skills: ["web"],
    repo: "https://github.com/sandrakayirangwaa/React-Hook-Forms",
  },
];
