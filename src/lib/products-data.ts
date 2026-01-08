export interface ProductVariation {
  strength: string;
  moq: number;
  price?: number;
}

export interface Product {
  name: string;
  displayName: string;
  slug: string;
  variations: ProductVariation[];
  description?: string;
  scientificPurpose?: string;
  studiesFindings?: string;
  nihLink?: string;
}

export interface ProductCategory {
  name: string;
  slug: string;
  products: Product[];
}

export const productCategories: ProductCategory[] = [
  {
    name: "GLP / Metabolic",
    slug: "glp-metabolic",
    products: [
      {
        name: "SEMAGLUTIDE",
        displayName: "GLP1-SEMA",
        slug: "glp1-sema",
        variations: [
          { strength: "5mg", moq: 10 },
          { strength: "10mg", moq: 10 },
          { strength: "15mg", moq: 10 },
          { strength: "20mg", moq: 10 },
          { strength: "30mg", moq: 10 },
        ],
        description: "GLP1-SEMA is a long-acting peptide agonist engineered to mimic endogenous glucagon-like peptide-1 (GLP-1), a nutrient-responsive incretin hormone that coordinates glucose handling and appetite regulation. It is structurally modified to resist rapid enzymatic degradation and to sustain systemic exposure, enabling prolonged GLP-1 receptor activation. In research settings, it is used to map how sustained GLP-1R signaling alters pancreatic endocrine output, gastrointestinal motility, and CNS satiety circuitry.",
        scientificPurpose: "Designed to study GLP-1 receptor biology across metabolic tissues, with emphasis on glucose-dependent insulin secretion dynamics, suppression of nutrient-inappropriate glucagon output, gastric emptying control, and hypothalamic/brainstem satiety network activation.",
        studiesFindings: "Increases glucose-dependent insulin secretion signaling. Suppresses glucagon output under nutrient availability (context dependent). Delays gastric emptying kinetics, reducing post-meal glucose excursion magnitude. Enhances satiety signaling and reduces energy intake in controlled settings. Produces sustained reductions in body weight and fat mass in clinical research programs. Improves glycemic endpoints in metabolic disease contexts (study dependent). Improves select cardiometabolic biomarkers in obesity/metabolic studies (context dependent). Enables mechanistic mapping of GLP-1R pathways across peripheral + CNS compartments.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/28637769/"
      },
      {
        name: "TIRZEPATIDE",
        displayName: "GLP1-TRIZ",
        slug: "glp1-triz",
        variations: [
          { strength: "5mg", moq: 10 },
          { strength: "10mg", moq: 10 },
          { strength: "15mg", moq: 10 },
          { strength: "20mg", moq: 10 },
          { strength: "30mg", moq: 10 },
          { strength: "40mg", moq: 10 },
          { strength: "50mg", moq: 10 },
          { strength: "60mg", moq: 10 },
        ],
        description: "GLP1-TRIZ is a dual incretin receptor agonist engineered to activate both GLP-1 and GIP receptors, combining two nutrient-sensing endocrine pathways into a single signaling framework. This dual design is used to study \"incretin synergy,\" where parallel receptor engagement can amplify insulinotropic signaling while also modulating appetite and metabolic substrate handling. Research interest centers on how dual-pathway activation alters endocrine output, energy intake, and adiposity outcomes compared with single incretin activation.",
        scientificPurpose: "Designed to study combined GLP-1R/GIPR activation on glucose-dependent insulin secretion, systemic insulin sensitivity, appetite regulation, and fat-mass reduction biology, including downstream transcriptional remodeling in metabolic tissues.",
        studiesFindings: "Amplifies glucose-dependent insulin secretion via dual incretin engagement. Improves insulin sensitivity measures in metabolic studies (context dependent). Reduces appetite drive and caloric intake through CNS satiety signaling. Produces substantial reductions in body weight and fat mass in clinical programs. Improves glycemic endpoints (fasting measures/HbA1c in clinical contexts). Improves lipid-related biomarkers in obesity/metabolic research (study dependent). Supports mechanistic study of dual receptor signaling bias and pathway crosstalk. Demonstrates larger weight-related outcomes than some single-pathway strategies (study dependent).",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/34170647/"
      },
      {
        name: "RETATRUTIDE",
        displayName: "GLP3-RETA",
        slug: "glp3-reta",
        variations: [
          { strength: "5mg", moq: 10 },
          { strength: "10mg", moq: 10 },
          { strength: "15mg", moq: 10 },
          { strength: "20mg", moq: 10 },
          { strength: "30mg", moq: 10 },
        ],
        description: "GLP3-RETA is a tri-agonist metabolic peptide designed to activate GLP-1, GIP, and glucagon receptors. The architecture is intended to combine incretin-driven satiety and glycemic control with glucagon-receptor–linked energy expenditure and lipid mobilization signaling. In research, it is used to explore \"balanced polyagonism\" as a strategy to shift weight-loss magnitude and metabolic flexibility beyond incretin-only models.",
        scientificPurpose: "Designed to study multi-receptor coordination of appetite suppression, glycemic regulation, lipid oxidation, and energy expenditure signaling—particularly the contribution of glucagon receptor signaling to weight-loss outcomes.",
        studiesFindings: "Produces large body-weight reductions in investigational clinical research (study dependent). Reduces fat mass and improves adiposity-associated endpoints. Enhances energy expenditure/thermogenic signaling markers (context dependent). Improves glycemic control metrics via incretin pathway activity. Improves lipid metabolism biomarkers in metabolic disease contexts (study dependent). Supports mechanistic evaluation of receptor-balanced polyagonist design. Enables mapping of glucagon receptor effects on substrate utilization in obesity models. Improves composite cardiometabolic endpoints in select programs (context dependent).",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/37385275/"
      },
      {
        name: "CAGRILINTIDE",
        displayName: "CAGRILINTIDE",
        slug: "cagrilintide",
        variations: [
          { strength: "5mg", moq: 10 },
          { strength: "10mg", moq: 10 },
        ],
        description: "Cagrilintide is a long-acting amylin-analogue peptide designed to replicate satiety signaling associated with the endogenous pancreatic hormone amylin. It is engineered for prolonged receptor engagement to intensify appetite-regulating neuroendocrine signaling.",
        scientificPurpose: "Designed to study amylin-receptor pathway activation, appetite suppression mechanisms, and additive weight-loss biology (including combination approaches with incretin agonists).",
        studiesFindings: "Enhances satiety signaling and reduces energy intake. Supports weight reduction endpoints in obesity-focused research programs. Influences gastric motility and nutrient handling signals (context dependent). Improves metabolic biomarkers when paired with incretin signaling (study dependent). Enables mechanistic investigation of amylin pathway modulation.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=cagrilintide+amylin+analog+satiety"
      },
      {
        name: "MAZDUTIDE",
        displayName: "MAZDUTIDE",
        slug: "mazdutide",
        variations: [
          { strength: "10mg", moq: 10 },
        ],
        description: "Mazdutide is an investigational dual agonist targeting GLP-1 and glucagon receptors, designed to integrate satiety-driven energy intake reduction with glucagon-linked energy expenditure and lipid utilization signaling. Mechanistically, it is studied to determine how adding glucagon receptor activity can shift substrate partitioning and thermogenic outputs while maintaining incretin-mediated glycemic benefits. It is primarily used as a polyagonist tool for obesity and metabolic disease research.",
        scientificPurpose: "Designed to study GLP-1R/GCGR dual activation for appetite suppression, energy expenditure modulation, lipid oxidation signaling, and metabolic biomarker improvement in obesity research.",
        studiesFindings: "Reduces body weight and adiposity endpoints in investigational programs (study dependent). Suppresses appetite and lowers energy intake via incretin pathway activity. Enhances energy expenditure and lipid oxidation signaling (context dependent). Improves glycemic endpoints through GLP-1 receptor signaling. Improves lipid metabolism biomarkers in obesity/metabolic disease contexts. Supports mechanistic mapping of glucagon receptor contributions to weight-loss magnitude. Improves composite cardiometabolic risk markers in select studies (study dependent). Enables evaluation of receptor balance (satiety vs expenditure) in polyagonist design.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/35872749/"
      },
      {
        name: "SURVODUTIDE",
        displayName: "SURVODUTIDE",
        slug: "survodutide",
        variations: [
          { strength: "10mg", moq: 10 },
        ],
        description: "Survodutide is an investigational dual agonist designed to activate both the GLP-1 receptor and the glucagon receptor, integrating incretin-driven satiety/glycemic signaling with glucagon-linked energy expenditure and lipid utilization programs. In research framing, it is a representative \"poly-agonist metabolic peptide\" used to study how coordinated receptor engagement can shift body weight outcomes and metabolic biomarkers beyond incretin-only approaches.",
        scientificPurpose: "Designed to study GLP-1R/GCGR dual agonism for appetite reduction, energy expenditure signaling, lipid oxidation, and metabolic disease endpoints in obesity-focused research.",
        studiesFindings: "Produces weight reduction endpoints in investigational metabolic programs (study dependent). Suppresses appetite and reduces energy intake via GLP-1 pathway activity (context dependent). Enhances energy expenditure and lipid utilization signaling through glucagon-receptor components (context dependent). Improves glycemic biomarkers via incretin-associated signaling. Improves cardiometabolic biomarkers in obesity/metabolic disease research contexts (study dependent). Provides a tool framework for studying receptor-balanced polyagonism and weight-loss magnitude.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=survodutide+GLP-1+glucagon+dual+agonist+obesity"
      },
      {
        name: "GLP-1",
        displayName: "GLP-1",
        slug: "glp-1",
        variations: [
          { strength: "5mg", moq: 10 },
        ],
        description: "GLP-1 (glucagon-like peptide-1) is an endogenous incretin hormone secreted primarily from intestinal L-cells following nutrient exposure. It signals through the GLP-1 receptor to coordinate glucose-dependent insulin secretion, glucagon suppression, gastric emptying modulation, and central satiety signaling. In research and drug development, native GLP-1 biology serves as the physiologic blueprint for incretin therapeutics and appetite regulation studies.",
        scientificPurpose: "Designed to study native incretin physiology, GLP-1 receptor signaling kinetics, glucose homeostasis regulation, gastric motility control, and appetite/satiety circuitry.",
        studiesFindings: "Enhances glucose-dependent insulin secretion during nutrient availability. Suppresses glucagon secretion in postprandial contexts (context dependent). Slows gastric emptying, moderating nutrient delivery and postprandial glucose excursions. Activates central satiety pathways and reduces energy intake in controlled contexts. Improves glycemic regulation endpoints in metabolic studies. Provides a core physiologic reference model for incretin receptor signaling research.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=glucagon-like+peptide-1+GLP-1+receptor+incretin+mechanism"
      },
    ]
  },
  {
    name: "Recovery & Regenerative",
    slug: "recovery-regenerative",
    products: [
      {
        name: "BPC-157",
        displayName: "BPC-157",
        slug: "bpc-157",
        variations: [
          { strength: "5mg", moq: 10 },
          { strength: "10mg", moq: 10 },
        ],
        description: "BPC-157 is a synthetic pentadecapeptide derived from a gastric protein fragment, frequently studied in tissue-repair models for its unusual stability and signaling effects on repair cascades. It is commonly framed as a cytoprotective/regenerative research peptide.",
        scientificPurpose: "Designed to explore angiogenesis, tissue repair kinetics, inflammatory signaling modulation, and mucosal protection mechanisms.",
        studiesFindings: "Accelerates repair processes in tendon/ligament injury models. Enhances angiogenic signaling and microvascular recovery markers. Supports muscle repair signaling in preclinical contexts. Improves mucosal protective signaling in GI models. Modulates nitric oxide–linked pathways in repair contexts (model dependent).",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=BPC-157+pentadecapeptide+tissue+repair"
      },
      {
        name: "TB500",
        displayName: "TB500 (Thymosin Beta-4)",
        slug: "tb500",
        variations: [
          { strength: "5mg", moq: 10 },
          { strength: "10mg", moq: 10 },
        ],
        description: "TB500 is commonly marketed as thymosin beta-4–related material; thymosin beta-4 is an endogenous actin-binding peptide involved in cytoskeletal remodeling, cell migration, and repair-associated signaling. Research literature often focuses on wound repair biology and angiogenesis.",
        scientificPurpose: "Designed to study actin dynamics, cellular migration, angiogenesis, and tissue repair signaling networks.",
        studiesFindings: "Promotes cell migration and tissue repair signaling. Enhances angiogenic responses in wound models. Supports regenerative processes in soft tissue models. Modulates inflammatory signaling in repair contexts. Influences cytoskeletal organization relevant to healing.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=thymosin+beta-4+cell+migration+angiogenesis"
      },
      {
        name: "THYMOSIN ALPHA-1",
        displayName: "THYMOSIN ALPHA-1",
        slug: "thymosin-alpha-1",
        variations: [
          { strength: "5mg", moq: 10 },
          { strength: "10mg", moq: 10 },
        ],
        description: "Thymosin alpha-1 (thymalfasin) is a thymic peptide used as an immunomodulatory agent in multiple research and clinical contexts. It is studied for effects on T-cell function, antigen presentation signaling, and immune coordination under infection or immune dysfunction settings.",
        scientificPurpose: "Designed to study immune restoration and modulation—particularly T-cell–linked immunity, innate-adaptive coordination, and anti-infective immune signaling support.",
        studiesFindings: "Enhances T-cell functional signaling in immunology studies (context dependent). Improves immune coordination markers in infectious disease research programs. Supports antigen presentation and immune activation pathways (study dependent). Modulates cytokine signaling associated with improved immune response profiles. Used as a probe for thymic-peptide immune regulation mechanisms.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=thymosin+alpha-1+thymalfasin+immunomodulatory"
      },
      {
        name: "SS-31",
        displayName: "SS-31",
        slug: "ss-31",
        variations: [
          { strength: "10mg", moq: 10 },
          { strength: "50mg", moq: 10 },
        ],
        description: "SS-31 (elamipretide) is a mitochondria-targeted peptide designed to interact with inner mitochondrial membrane components (including cardiolipin-associated domains) to stabilize electron transport efficiency. It is studied for improving mitochondrial bioenergetics and reducing mitochondrial stress signaling.",
        scientificPurpose: "Designed to study mitochondrial dysfunction biology, oxidative phosphorylation efficiency, and mitochondrial stress/ROS signaling modulation.",
        studiesFindings: "Improves mitochondrial respiration and ATP production efficiency (context dependent). Stabilizes mitochondrial membrane-associated bioenergetic processes. Reduces mitochondrial oxidative stress markers in experimental models. Improves cellular energetic performance under stress conditions (study dependent). Used as a tool for investigating cardiolipin/ETC coupling biology.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=elamipretide+SS-31+cardiolipin+mitochondrial+function"
      },
      {
        name: "ARA-290",
        displayName: "ARA-290",
        slug: "ara-290",
        variations: [
          { strength: "10mg", moq: 10 },
        ],
        description: "ARA-290 (cibinetide) is an erythropoietin-derived peptide designed to activate tissue-protective signaling through the innate repair receptor complex without stimulating erythropoiesis. Research uses it to probe anti-inflammatory and neuroprotective tissue resilience pathways.",
        scientificPurpose: "Designed to study tissue-protective EPO-pathway signaling, anti-inflammatory mechanisms, and neuropathy/repair endpoints without hematopoietic stimulation.",
        studiesFindings: "Reduces inflammatory signaling markers in experimental contexts (study dependent). Supports tissue-protective signaling in models of injury/stress. Demonstrates neuroprotective/neuropathy-relevant effects in some studies (context dependent). Improves functional endpoints tied to repair signaling in select models. Enables mechanistic mapping of EPO-derived innate repair receptor biology.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=ARA-290+cibinetide+innate+repair+receptor"
      },
      {
        name: "THYMALIN",
        displayName: "THYMALIN",
        slug: "thymalin",
        variations: [
          { strength: "10mg", moq: 10 },
        ],
        description: "Thymalin is a thymus-derived polypeptide complex studied in immune regulation research traditions, often described as influencing T-cell functional activity and broader immune coordination. NIH-indexed literature discusses thymalin as an immunomodulatory thymic extract with multiple peptide components.",
        scientificPurpose: "Designed to study thymic-peptide immune modulation, immune restoration signaling, and T-cell functional biology in immune dysfunction contexts.",
        studiesFindings: "Enhances immune functional markers in certain studies (context dependent). Increases T-lymphocyte functional activity in research settings (study dependent). Supports immune regulation pathways relevant to infection/immune dysfunction research. Provides a multi-peptide model for thymus-derived immunomodulation mechanisms. Enables investigation of peptide components that influence immune signaling.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=Thymalin+polypeptide+thymus+extract+immunomodulatory"
      },
      {
        name: "EPITHALON",
        displayName: "EPITHALON",
        slug: "epithalon",
        variations: [
          { strength: "10mg", moq: 10 },
          { strength: "50mg", moq: 10 },
        ],
        description: "Epithalon (Epitalon) is a synthetic peptide associated with pineal-derived peptide research traditions and aging biology. It is discussed in literature exploring long-term cellular function, circadian-linked neuroendocrine regulation, and telomere-associated hypotheses in aging frameworks. Research interest often centers on how peptide signals might influence aging-related molecular programs, with results varying by model and study lineage.",
        scientificPurpose: "Designed to study aging-associated molecular programs, neuroendocrine/circadian regulation biology, and telomere/telomerase-related hypotheses in experimental aging research.",
        studiesFindings: "Modulates aging-associated biomarkers in certain experimental traditions (context dependent). Influences neuroendocrine and circadian-linked signaling markers (study dependent). Associated with telomere/telomerase pathway hypotheses in some publications. Supports investigation of peptide regulation of long-term cellular stress adaptation programs. Used as a tool for studying peptide–aging pathway interactions in controlled settings. Enables evaluation of peptide-driven molecular aging frameworks in preclinical contexts.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/12937340/"
      },
      {
        name: "AOD",
        displayName: "AOD",
        slug: "aod",
        variations: [
          { strength: "5mg", moq: 10 },
        ],
        description: "AOD is commonly referenced as an hGH-derived fragment concept (often tied to the 176–191 region) developed to study adipose metabolism signaling without the full spectrum of growth-hormone anabolic actions. Research framing focuses on lipolysis and fat-mass regulation pathways.",
        scientificPurpose: "Designed to study adipocyte lipid mobilization, lipolysis signaling, and fat-mass reduction mechanisms in experimental contexts.",
        studiesFindings: "Influences lipolysis-associated signaling in research models (context dependent). Supports fat-mass reduction endpoints in some experimental designs. Helps study GH-fragment–linked metabolic signaling separation from full GH activity. Used to explore adipocyte metabolism and lipid mobilization mechanisms. Provides a tool framework for fragment-based metabolic peptide research.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=human+growth+hormone+fragment+176-191+lipolysis"
      },
      {
        name: "BPC-157 + TB500",
        displayName: "BPC-157 + TB500",
        slug: "bpc-157-tb500",
        variations: [
          { strength: "10mg", moq: 10 },
          { strength: "20mg", moq: 10 },
        ],
        description: "BPC-157 + TB500 is a combined research formulation pairing two peptides studied for complementary tissue repair mechanisms. BPC-157 contributes cytoprotective and angiogenic signaling, while TB500 (thymosin beta-4) adds cell migration and actin-regulation pathways. The combination is used to study multi-input repair biology and whether coordinated peptide signaling produces synergistic tissue remodeling outcomes.",
        scientificPurpose: "Designed to study combined repair biology: angiogenesis, cell migration, cytoprotective signaling, and coordinated tissue remodeling across multiple pathway inputs.",
        studiesFindings: "BPC-157 literature reports enhanced repair signaling and angiogenesis markers. TB500 literature reports increased cell migration and wound repair signaling. Combination concept supports systems-level modeling of tissue repair programs. Enables study of whether multi-peptide inputs produce synergistic repair outcomes. Provides a framework for coordinated tissue remodeling pathway exploration. Supports investigation of soft tissue recovery across multiple signaling axes.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/27349193/"
      },
    ]
  },
  {
    name: "Cognitive & Neuro",
    slug: "cognitive-neuro",
    products: [
      {
        name: "SEMAX",
        displayName: "SEMAX",
        slug: "semax",
        variations: [
          { strength: "5mg", moq: 10 },
          { strength: "10mg", moq: 10 },
        ],
        description: "Semax is a synthetic neuroactive peptide derived from an ACTH fragment (ACTH(4–10)) engineered to modulate neuronal signaling and neurotrophic pathways. Research literature often frames it as influencing cognitive and neuroprotective signaling networks.",
        scientificPurpose: "Designed to study neurotrophic modulation (e.g., BDNF-linked signaling), cognitive performance endpoints, stress-response neurobiology, and neuroprotection in experimental contexts.",
        studiesFindings: "Modulates neurotrophic signaling pathways (study dependent). Supports cognitive performance endpoints in certain research settings. Influences stress-response neurochemistry in experimental models. Demonstrates neuroprotective signaling patterns in preclinical literature. Used as a probe for peptide-based CNS modulation.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=Semax+peptide+BDNF+neuroprotective"
      },
      {
        name: "SELANK",
        displayName: "SELANK",
        slug: "selank",
        variations: [
          { strength: "5mg", moq: 10 },
          { strength: "10mg", moq: 10 },
        ],
        description: "Selank is a synthetic tuftsin-analogue neuropeptide designed to modulate CNS signaling associated with anxiety and stress physiology. It is investigated as a peptide neuromodulator with effects on neurotransmission-related gene expression.",
        scientificPurpose: "Designed to study anxiolytic-like neuropeptide mechanisms, GABAergic modulation, stress adaptation signaling, and cognitive/behavioral endpoints in experimental contexts.",
        studiesFindings: "Modulates anxiety-related behavioral endpoints in study settings (model dependent). Influences neurotransmission-associated gene expression patterns. Interacts with GABA-related signaling frameworks in experimental literature. Supports stress adaptation signaling in some models. Used as a tool compound for peptide-based anxiolytic pathway research.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=Selank+peptide+anxiolytic+GABA"
      },
      {
        name: "CEREBROLYSIN",
        displayName: "CEREBROLYSIN",
        slug: "cerebrolysin",
        variations: [
          { strength: "60mg", moq: 6 },
        ],
        description: "Cerebrolysin is a porcine brain–derived peptide mixture used in neurobiology research and some clinical programs as a neurotrophic-like intervention. It is studied for its effects on neuroplasticity, neuronal survival signaling, and recovery pathways after injury or neurodegenerative stress.",
        scientificPurpose: "Designed to study neurotrophic-like signaling, neuronal resilience, neurorecovery after insult, and cognitive/functional outcome endpoints.",
        studiesFindings: "Supports neuroplasticity-associated signaling in experimental contexts. Improves functional recovery endpoints in some stroke/TBI studies (study dependent). Modulates neuronal survival pathways in preclinical research. Influences neuroinflammation-related signaling markers (context dependent). Used as a complex-peptide tool for neurorepair research frameworks.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=Cerebrolysin+neurotrophic+stroke+traumatic+brain+injury"
      },
      {
        name: "DSIP",
        displayName: "DSIP",
        slug: "dsip",
        variations: [
          { strength: "5mg", moq: 10 },
          { strength: "15mg", moq: 10 },
        ],
        description: "DSIP (delta sleep-inducing peptide) is a neuropeptide historically studied in sleep physiology and stress-response neurobiology. Research interest includes its interactions with neuroendocrine signaling and sleep architecture markers in experimental contexts.",
        scientificPurpose: "Designed to study sleep regulation biology, stress adaptation signaling, and neuroendocrine responses associated with sleep states.",
        studiesFindings: "Influences sleep-related endpoints in some experimental designs (model dependent). Modulates stress-response signaling markers in neuroendocrine contexts. Provides a tool for studying peptide regulation of sleep architecture hypotheses. Demonstrates neurochemical modulation in CNS models (study dependent). Supports research into peptide-mediated sleep–stress coupling mechanisms.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=delta+sleep+inducing+peptide+DSIP"
      },
      {
        name: "PINEALON",
        displayName: "PINEALON",
        slug: "pinealon",
        variations: [
          { strength: "5mg", moq: 10 },
          { strength: "10mg", moq: 10 },
          { strength: "20mg", moq: 10 },
        ],
        description: "Pinealon is a short synthetic tripeptide (commonly referenced as Glu-Asp-Arg, EDR) studied in neurobiology and aging-related research traditions. It is discussed as a peptide that may influence neuronal resilience, oxidative stress resistance, and cognitive-performance-associated endpoints in experimental contexts. Research often emphasizes its role as a minimal peptide motif capable of shifting stress-response signaling and functional neurophysiology readouts.",
        scientificPurpose: "Designed to study neuroprotective signaling, oxidative stress adaptation in CNS models, peptide-driven modulation of cognitive endpoints, and neuronal resilience mechanisms.",
        studiesFindings: "Improves cognitive/behavioral endpoints in select experimental models (study dependent). Increases neuronal resistance to oxidative stress in preclinical systems (context dependent). Modulates stress-response signaling markers in CNS-related experimental frameworks. Influences neurochemical signaling profiles in some models. Provides a minimal peptide tool for studying neuroprotection and stress resilience hypotheses.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=Pinealon+Glu-Asp-Arg+EDR+peptide+neuroprotective"
      },
    ]
  },
  {
    name: "Growth / Hormone & Peptides",
    slug: "growth-hormone-peptides",
    products: [
      {
        name: "TESAMORELIN",
        displayName: "TESAMORELIN",
        slug: "tesamorelin",
        variations: [
          { strength: "5mg", moq: 10 },
          { strength: "10mg", moq: 10 },
        ],
        description: "Tesamorelin is a synthetic analogue of growth hormone–releasing hormone (GHRH) engineered to stimulate endogenous pulsatile growth hormone secretion from the pituitary. Its biology is used to study downstream GH/IGF-1 axis signaling and adipose distribution effects.",
        scientificPurpose: "Designed to study GHRH receptor activation, GH pulsatility, IGF-1 axis modulation, and visceral adipose regulation endpoints.",
        studiesFindings: "Increases endogenous GH secretion patterns (pulsatile). Elevates IGF-1 axis signaling (context dependent). Reduces visceral adipose tissue endpoints in clinical contexts. Improves some metabolic risk markers linked to visceral fat (study dependent). Enables mechanistic study of GH-axis modulation without exogenous GH.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=tesamorelin+GHRH+visceral+adipose+tissue"
      },
      {
        name: "CJC-1295 WITHOUT DAC + IPA",
        displayName: "CJC-1295 WITHOUT DAC + IPA",
        slug: "cjc-1295-ipa",
        variations: [
          { strength: "10mg (5mg + 5mg)", moq: 10 },
        ],
        description: "CJC-1295 (without DAC) is a GHRH/GRF analogue designed to stimulate pituitary GH release via GHRH receptor activation, typically with shorter activity than DAC-linked variants. \"IPA\" commonly refers to ipamorelin, a GHSR (ghrelin receptor) agonist; the combination is used to probe complementary GH-axis stimulation routes.",
        scientificPurpose: "Designed to study coordinated GH-axis stimulation by combining GHRH receptor activation (CJC) with ghrelin receptor agonism (ipamorelin) to evaluate GH pulsatility and downstream IGF-1 signaling.",
        studiesFindings: "Increases GH release signaling via GHRH receptor activation (CJC component). Stimulates GH secretion via GHSR activation (ipamorelin component). Supports investigation of pulsatile GH biology and endocrine dynamics. Used to study GH/IGF-1 axis downstream transcriptional and metabolic effects. Provides a model for dual-pathway GH-axis stimulation research.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=CJC-1295+no+DAC+GHRH+analog"
      },
      {
        name: "CJC-1295 NO DAC",
        displayName: "CJC-1295 NO DAC",
        slug: "cjc-1295-no-dac",
        variations: [
          { strength: "5mg", moq: 10 },
          { strength: "10mg", moq: 10 },
        ],
        description: "CJC-1295 No DAC is a GHRH/GRF analogue engineered to activate the GHRH receptor and stimulate pituitary GH release, generally with shorter duration than DAC-conjugated variants. It is used to study GH pulsatility and downstream IGF-axis signaling responses.",
        scientificPurpose: "Designed to study endogenous GH stimulation via GHRH receptor activation and downstream endocrine/metabolic signaling patterns.",
        studiesFindings: "Stimulates GH release through GHRH receptor signaling. Supports pulsatile GH dynamics research frameworks. Influences downstream IGF-1 axis signaling (context dependent). Used for mapping endocrine regulation and feedback mechanisms. Provides a tool for GH-axis exploration without exogenous GH administration.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=CJC-1295+no+DAC+GHRH+analog"
      },
      {
        name: "SERMORELIN",
        displayName: "SERMORELIN",
        slug: "sermorelin",
        variations: [
          { strength: "5mg", moq: 10 },
          { strength: "10mg", moq: 10 },
        ],
        description: "Sermorelin is a GHRH (growth hormone–releasing hormone) analogue (GRF 1–29) designed to stimulate endogenous pituitary growth hormone release through GHRH receptor activation. Research uses sermorelin as a tool compound to examine GH-axis pulsatility, endocrine feedback control, and downstream GH/IGF-axis signaling outcomes. It is best understood as a physiologic stimulation approach to GH-axis study rather than direct GH replacement.",
        scientificPurpose: "Designed to study pituitary GH release mechanisms via GHRH receptor activation, endocrine pulsatility, and downstream GH/IGF-axis signaling and feedback biology.",
        studiesFindings: "Stimulates endogenous GH secretion via GHRH receptor signaling (context dependent). Supports evaluation of pulsatile GH dynamics and endocrine rhythm biology. Influences downstream IGF-axis signaling endpoints in controlled contexts (study dependent). Enables mechanistic study of endocrine feedback loops that regulate GH release. Provides a framework for GH-axis modulation studies without exogenous GH administration.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=sermorelin+GRF+1-29+GHRH+growth+hormone+release"
      },
      {
        name: "IPAMORELIN",
        displayName: "IPAMORELIN",
        slug: "ipamorelin",
        variations: [
          { strength: "5mg", moq: 10 },
          { strength: "10mg", moq: 10 },
        ],
        description: "Ipamorelin is a synthetic growth hormone secretagogue designed to activate the ghrelin receptor (GHSR-1a), stimulating pituitary GH release. It is frequently used as a mechanistic probe of ghrelin/GHSR biology and GH-axis modulation.",
        scientificPurpose: "Designed to study GHSR-mediated GH release, endocrine pulsatility, and downstream GH/IGF-axis signaling dynamics.",
        studiesFindings: "Stimulates GH secretion via GHSR activation (context dependent). Supports investigation of pituitary hormone release mechanisms. Enables study of pulsatile endocrine signaling patterns. Provides a tool for mapping ghrelin-receptor downstream signaling pathways. Used in GH-axis research designs evaluating metabolic and anabolic signaling endpoints.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=ipamorelin+GHSR+growth+hormone+secretagogue"
      },
      {
        name: "HEXARELIN",
        displayName: "HEXARELIN",
        slug: "hexarelin",
        variations: [
          { strength: "5mg", moq: 10 },
          { strength: "10mg", moq: 10 },
        ],
        description: "Hexarelin is a potent synthetic growth hormone secretagogue designed to activate the ghrelin receptor (GHSR) and stimulate pituitary GH release. It is used as a mechanistic probe of endocrine secretion dynamics, receptor-driven GH release patterns, and downstream GH/IGF-axis signaling outcomes. In research contexts it often serves as a reference compound for comparing secretagogue potency and endocrine response profiles.",
        scientificPurpose: "Designed to study GHSR-driven GH secretion, endocrine pulsatility patterns, pituitary signaling biology, and downstream GH/IGF-axis pathway effects.",
        studiesFindings: "Stimulates GH release via ghrelin receptor activation (context dependent). Supports study of pituitary secretion dynamics and endocrine rhythm control. Enables mechanistic mapping of GHSR downstream signaling in endocrine tissues. Used in studies exploring GH-axis modulation and metabolic/anabolic signaling outcomes. Provides a reference point for secretagogue class potency and response profiling.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=hexarelin+GHSR+ghrelin+receptor+growth+hormone+secretagogue"
      },
      {
        name: "GHRP-6 ACETATE",
        displayName: "GHRP-6 ACETATE",
        slug: "ghrp-6-acetate",
        variations: [
          { strength: "5mg", moq: 10 },
          { strength: "10mg", moq: 10 },
        ],
        description: "GHRP-6 is a synthetic growth hormone–releasing peptide that activates the ghrelin receptor (GHSR), historically used to stimulate GH secretion and study GH-axis regulation. It is also used to probe appetite-related ghrelin-pathway signaling in some contexts.",
        scientificPurpose: "Designed to study GHSR-driven GH release, endocrine feedback loops, and ghrelin-pathway signaling interactions.",
        studiesFindings: "Stimulates GH secretion via GHSR activation (context dependent). Supports endocrine pulsatility and pituitary signaling research. Enables mechanistic mapping of ghrelin-receptor downstream pathways. Used as a tool for studying hormone release dynamics and feedback regulation. Provides a model compound for GH secretagogue class biology.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=GHRP-6+acetate+ghrelin+receptor+GHSR+growth+hormone"
      },
      {
        name: "HGH (Somatropin 191AA)",
        displayName: "HGH (Somatropin 191AA)",
        slug: "hgh-somatropin",
        variations: [
          { strength: "10 IU", moq: 10 },
          { strength: "15 IU", moq: 10 },
        ],
        description: "Recombinant human growth hormone (191 amino acid somatropin) is identical in sequence to endogenous pituitary-derived GH. It is used to study GH receptor activation, somatotropic axis signaling, and downstream anabolic/metabolic pathway regulation. Research applications span growth biology, body composition, and metabolic endpoint investigation.",
        scientificPurpose: "Designed to study GH receptor activation, somatotropic axis biology, IGF-1 pathway signaling, and anabolic/metabolic downstream effects.",
        studiesFindings: "Activates GH receptors with identical bioactivity to endogenous GH. Stimulates IGF-1 axis signaling downstream of GH receptor activation. Influences body composition and metabolic endpoints (context dependent). Supports study of anabolic signaling in growth and repair contexts. Enables mechanistic mapping of GH receptor downstream pathways. Provides a reference standard for GH biology research.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/11701431/"
      },
      {
        name: "HGH FRAGMENT 176-191",
        displayName: "HGH FRAGMENT 176-191",
        slug: "hgh-fragment",
        variations: [
          { strength: "5mg", moq: 10 },
        ],
        description: "HGH Fragment 176–191 is a peptide fragment derived from the C-terminal region of human growth hormone, developed to study fat-metabolism signaling properties that may be partially separable from full growth hormone's broad anabolic/growth effects. Research interest centers on adipocyte lipid mobilization, lipolysis-associated signaling, and fat-mass regulation endpoints in experimental models. It is frequently used as a \"fragment-based\" tool to explore whether specific GH motifs preferentially influence adipose metabolism programs.",
        scientificPurpose: "Designed to study lipolysis mechanisms, adipocyte fat mobilization signaling, fat-mass regulation endpoints, and GH fragment separation-of-function concepts in metabolic research.",
        studiesFindings: "Influences lipolysis-associated signaling in adipose models (context dependent). Supports reductions in fat-mass endpoints in some experimental designs (study dependent). Provides a model to study adipose metabolism effects distinct from full GH endocrine actions. Supports mechanistic mapping of fragment-derived endocrine peptide signaling. Enables investigation of adipocyte energy storage vs mobilization pathways under peptide regulation.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=growth+hormone+fragment+176-191+lipolysis+adipose+fat+mass"
      },
      {
        name: "IGF-1 LR3",
        displayName: "IGF-1 LR3",
        slug: "igf-1-lr3",
        variations: [
          { strength: "0.1mg", moq: 10 },
          { strength: "1mg", moq: 10 },
        ],
        description: "IGF-1 LR3 is an engineered IGF-1 analogue designed to extend half-life and enhance receptor signaling persistence relative to native IGF-1. Research applications focus on IGF-1 receptor signaling, anabolic pathway activation, and growth/repair biology.",
        scientificPurpose: "Designed to study IGF-1R downstream signaling (PI3K/Akt, MAPK), cellular growth responses, protein synthesis pathways, and tissue repair biology.",
        studiesFindings: "Activates IGF-1 receptor signaling cascades (PI3K/Akt, MAPK; context dependent). Supports anabolic signaling and protein synthesis endpoints in experimental models. Influences cell survival and growth-associated pathways. Provides prolonged IGF-related signaling relative to native IGF-1 (design rationale). Used as a tool for studying growth-factor signaling intensity and duration.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=IGF-1+LR3+insulin-like+growth+factor+analog"
      },
      {
        name: "IGF-DES",
        displayName: "IGF-DES",
        slug: "igf-des",
        variations: [
          { strength: "2mg", moq: 10 },
        ],
        description: "IGF-DES is a truncated IGF-1 analogue engineered to alter receptor interaction dynamics and is often discussed as having strong localized IGF-1 receptor signaling properties in experimental contexts. It is primarily used as a tool to study IGF signaling potency and tissue-level growth pathways.",
        scientificPurpose: "Designed to study IGF-1 receptor signaling cascades, localized anabolic pathways, cellular growth responses, and repair biology.",
        studiesFindings: "Activates IGF-1 receptor signaling pathways (PI3K/Akt, MAPK; context dependent). Supports localized growth and repair signaling in experimental systems. Influences protein synthesis/anabolic signaling endpoints (study dependent). Used for probing IGF pathway potency and tissue-specific responses. Provides a tool for mapping growth-factor signaling kinetics.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=IGF-1+DES+truncated+analog+IGF-1+receptor"
      },
      {
        name: "HCG",
        displayName: "HCG",
        slug: "hcg",
        variations: [
          { strength: "5000 IU", moq: 10 },
          { strength: "10000 IU", moq: 10 },
        ],
        description: "Human Chorionic Gonadotropin (HCG) is a glycoprotein hormone that mimics luteinizing hormone (LH) signaling through the LH/CG receptor. It is used in reproductive endocrinology research to study gonadal function, steroidogenesis, and reproductive axis regulation. Research applications include Leydig cell stimulation, ovarian function, and gonadotropin signaling pathway investigation.",
        scientificPurpose: "Designed to study LH/CG receptor activation, gonadal steroidogenesis, reproductive axis regulation, and gonadotropin signaling mechanisms.",
        studiesFindings: "Activates LH/CG receptors with LH-like signaling activity. Stimulates gonadal steroidogenesis in reproductive tissue models. Supports study of Leydig cell and ovarian function (context dependent). Enables investigation of reproductive endocrine axis regulation. Provides a tool for gonadotropin receptor signaling research. Used in fertility and reproductive biology research contexts.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/10580854/"
      },
      {
        name: "KISSPEPTIN-10",
        displayName: "KISSPEPTIN-10",
        slug: "kisspeptin-10",
        variations: [
          { strength: "5mg", moq: 10 },
          { strength: "10mg", moq: 10 },
        ],
        description: "Kisspeptin-10 is a biologically active peptide fragment that activates the KISS1 receptor (KISS1R), a key upstream control node for GnRH pulse generation in the hypothalamus. Because GnRH pulsatility drives downstream LH/FSH release, kisspeptin-10 is widely used as a tool to study reproductive-axis activation, endocrine pulse architecture, and neuroendocrine feedback control. Its value in research is that it provides a direct handle on the hypothalamic \"switch\" that initiates reproductive endocrine signaling.",
        scientificPurpose: "Designed to study KISS1R-mediated GnRH regulation, reproductive endocrine-axis pulsatility, and downstream gonadotropin release mechanisms.",
        studiesFindings: "Activates KISS1R signaling and stimulates GnRH release pathways (context dependent). Increases LH (and sometimes FSH) release endpoints in controlled research contexts. Enables mechanistic analysis of reproductive-axis pulse generation and timing. Supports mapping of neuroendocrine feedback loops controlling gonadotropin signaling. Serves as a core tool compound in fertility signaling and hypothalamic control research.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=kisspeptin-10+KISS1R+GnRH+pulsatility+LH+FSH"
      },
      {
        name: "MOTS-c",
        displayName: "MOTS-c",
        slug: "mots-c",
        variations: [
          { strength: "10mg", moq: 10 },
          { strength: "40mg", moq: 10 },
        ],
        description: "MOTS-c is a mitochondria-encoded peptide studied as a metabolic signaling molecule that interfaces with cellular stress responses and glucose utilization pathways. It is used to explore mito-nuclear communication and adaptive metabolic programming.",
        scientificPurpose: "Designed to study mitochondrial-derived peptide signaling, insulin sensitivity pathways, metabolic stress adaptation, and energy homeostasis regulation.",
        studiesFindings: "Improves insulin sensitivity and glucose handling in experimental models (context dependent). Modulates metabolic stress-response pathways. Influences AMPK-related and energy-sensing signaling frameworks (study dependent). Supports research into mito-nuclear communication biology. Demonstrates protective metabolic effects under metabolic stress in some models.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=MOTS-c+mitochondrial+derived+peptide+insulin+sensitivity"
      },
      {
        name: "EPO-53000",
        displayName: "EPO-53000",
        slug: "epo-53000",
        variations: [
          { strength: "3000 IU", moq: 10 },
        ],
        description: "Erythropoietin (EPO) is a glycoprotein hormone that activates the erythropoietin receptor to stimulate erythropoiesis and red blood cell production. It is used in hematology research to study erythroid progenitor cell differentiation, oxygen-carrying capacity, and hematopoietic signaling pathways. Research applications include anemia modeling and erythropoietic pathway investigation.",
        scientificPurpose: "Designed to study erythropoietin receptor signaling, erythroid differentiation, red blood cell production, and hematopoietic pathway regulation.",
        studiesFindings: "Activates erythropoietin receptor signaling in hematopoietic tissues. Stimulates erythroid progenitor cell differentiation and maturation. Increases red blood cell production endpoints (context dependent). Supports investigation of oxygen-carrying capacity regulation. Enables study of hematopoietic growth factor signaling. Provides a reference for erythropoiesis pathway research.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/15001466/"
      },
      {
        name: "PT-141",
        displayName: "PT-141",
        slug: "pt-141",
        variations: [
          { strength: "10mg", moq: 10 },
        ],
        description: "PT-141 (bremelanotide) is a melanocortin receptor agonist developed to modulate CNS circuits involved in sexual desire and arousal. It is studied as a neuropeptide-like intervention acting through melanocortin signaling rather than vascular mechanisms.",
        scientificPurpose: "Designed to study melanocortin receptor signaling in CNS arousal/desire circuitry and associated behavioral endpoints.",
        studiesFindings: "Activates central melanocortin pathways involved in sexual motivation (context dependent). Improves sexual desire endpoints in clinical research contexts. Demonstrates CNS-mediated arousal signaling distinct from peripheral vasodilatory mechanisms. Supports mechanistic mapping of melanocortin receptor behavioral biology. Used to study peptide modulation of motivation/reward neurocircuits (study dependent).",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=bremelanotide+PT-141+melanocortin+receptor+sexual+desire"
      },
      {
        name: "VIP",
        displayName: "VIP",
        slug: "vip",
        variations: [
          { strength: "5mg", moq: 10 },
          { strength: "10mg", moq: 10 },
        ],
        description: "VIP (vasoactive intestinal peptide) is an endogenous neuropeptide hormone that signals through VPAC receptors and regulates vascular tone, smooth muscle relaxation, and immune modulation. It functions as a neuroimmune communicator linking nervous system signaling to inflammatory regulation. Research interest includes how VIP shifts cytokine profiles and tissue physiology via receptor-mediated signaling.",
        scientificPurpose: "Designed to study VPAC receptor biology, vascular and smooth muscle signaling, and immunomodulatory pathway regulation.",
        studiesFindings: "Produces vasodilation through smooth muscle relaxation signaling. Modulates immune-cell activity and cytokine signaling patterns (context dependent). Influences neuroimmune communication pathways in inflammatory models. Demonstrates protective signaling profiles in select inflammation contexts (study dependent). Supports mechanistic mapping of peptide regulation of vascular-immune homeostasis. Used to study receptor-driven coordination between vascular tone and immune signaling.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/15109742/"
      },
    ]
  },
  {
    name: "Aesthetic / Cosmetic + Supplies + Stacks",
    slug: "aesthetic-cosmetic-supplies-stacks",
    products: [
      {
        name: "GHK-CU",
        displayName: "GHK-CU",
        slug: "ghk-cu",
        variations: [
          { strength: "50mg", moq: 10 },
          { strength: "100mg", moq: 10 },
        ],
        description: "GHK-Cu is a copper-binding tripeptide complex found in human plasma and extracellular matrix, studied as a regenerative signaling molecule. It is often associated with extracellular matrix remodeling and repair-related gene expression programs.",
        scientificPurpose: "Designed to study collagen/elastin remodeling, wound repair signaling, antioxidant gene networks, and tissue regeneration pathways.",
        studiesFindings: "Stimulates collagen-associated remodeling pathways (context dependent). Enhances wound healing signaling in experimental models. Modulates gene expression patterns linked to tissue repair. Supports antioxidant defense signaling in cellular models. Influences skin/tissue remodeling endpoints in research contexts.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=GHK-Cu+copper+peptide+collagen+gene+expression"
      },
      {
        name: "GLUTATHIONE",
        displayName: "GLUTATHIONE",
        slug: "glutathione",
        variations: [
          { strength: "1500mg", moq: 10 },
        ],
        description: "Glutathione (GSH) is the dominant intracellular thiol antioxidant and redox buffer, integral to detoxification chemistry and oxidative stress control. It participates in enzymatic antioxidant systems and conjugation reactions that protect cellular structures.",
        scientificPurpose: "Designed to study oxidative stress mitigation, detoxification signaling, mitochondrial protection, and immune redox regulation.",
        studiesFindings: "Reduces oxidative stress markers in cellular/physiologic models. Maintains redox balance and thiol homeostasis. Supports detoxification conjugation pathways (GST-linked). Protects mitochondrial function under oxidative challenge (context dependent). Supports immune-cell redox signaling in experimental contexts.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=glutathione+GSH+redox+mitochondria+oxidative+stress"
      },
      {
        name: "SNAP-8",
        displayName: "SNAP-8",
        slug: "snap-8",
        variations: [
          { strength: "10mg", moq: 10 },
        ],
        description: "SNAP-8 (acetyl octapeptide-3) is a synthetic peptide developed in cosmetic research to influence neuromuscular communication by targeting SNARE-complex–associated neurotransmitter release mechanics. It is commonly positioned as a topical \"signal-relaxing\" peptide concept.",
        scientificPurpose: "Designed to study SNARE-mediated neurotransmitter release modulation and downstream effects on contraction-associated skin dynamics.",
        studiesFindings: "Reduces SNARE-complex efficiency in experimental frameworks (context dependent). Decreases neurotransmitter release intensity in model systems. Reduces contraction-associated signaling relevant to dynamic wrinkle appearance. Supports cosmetic research endpoints for skin smoothing (study dependent). Provides a mechanistic analogue model for neuromodulatory topical peptides.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=acetyl+octapeptide-3+SNAP-8+SNARE+neurotransmitter"
      },
      {
        name: "LL-37",
        displayName: "LL-37",
        slug: "ll-37",
        variations: [
          { strength: "10mg", moq: 10 },
        ],
        description: "LL-37 is a synthetic form of the human cathelicidin antimicrobial peptide, a key component of innate immunity. Beyond antimicrobial effects, it is studied for immunomodulatory signaling and tissue-repair interactions.",
        scientificPurpose: "Developed to investigate antimicrobial activity, immune signaling modulation, biofilm disruption, and wound-repair pathways.",
        studiesFindings: "Broad antimicrobial activity against diverse organisms (model dependent). Disrupts or inhibits biofilm formation in experimental systems. Modulates innate immune cell recruitment/signaling. Supports wound repair processes in some models. Influences inflammatory pathway signaling (context dependent).",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=LL-37+cathelicidin+antimicrobial+peptide+biofilm"
      },
      {
        name: "NAD",
        displayName: "NAD",
        slug: "nad",
        variations: [
          { strength: "100mg", moq: 10 },
          { strength: "500mg", moq: 10 },
        ],
        description: "NAD (nicotinamide adenine dinucleotide) is a central metabolic cofactor governing redox reactions and mitochondrial energy transfer. It also serves as a substrate for NAD+-dependent enzymes involved in DNA repair and stress-response signaling.",
        scientificPurpose: "Designed to study mitochondrial bioenergetics, redox homeostasis, NAD+-dependent signaling (sirtuins/PARPs), and cellular stress adaptation.",
        studiesFindings: "Supports mitochondrial ATP production via redox coupling. Enables NAD+-dependent signaling linked to stress-response pathways. Supports DNA repair-associated enzyme activity (context dependent). Enhances cellular redox resilience in experimental models. Influences metabolic homeostasis pathways in research settings.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=NAD%2B+mitochondrial+metabolism+sirtuins+PARP"
      },
      {
        name: "LEMON BOTTLE",
        displayName: "LEMON BOTTLE",
        slug: "lemon-bottle",
        variations: [
          { strength: "10mg", moq: 10 },
        ],
        description: "\"Lemon Bottle\" is a branded aesthetic product marketed for localized fat reduction; however, scientific literature and NIH indexing typically track evidence by active ingredient rather than brand names. For scientific matching, NIH-referenced research is most directly associated with established injectable adipocytolytic agents (e.g., deoxycholic acid) rather than the brand itself.",
        scientificPurpose: "Marketed purpose: study/target localized adipose reduction concepts. Evidence-based scientific alignment on NIH is best mapped to deoxycholic acid–based adipocytolysis research rather than brand-level validation.",
        studiesFindings: "NIH does not consistently index controlled research under the \"Lemon Bottle\" brand name (brand ≠ standardized molecule). Injectable adipocytolytic research (active-ingredient level, e.g., deoxycholic acid) has shown: Reduction of localized subcutaneous fat volume in controlled settings. Adipocyte disruption/adipocytolysis mechanisms in targeted tissue. Measurable changes in treated-area contour endpoints (study dependent).",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=deoxycholic+acid+injection+submental+fat+adipocytolysis"
      },
      {
        name: "BOTULINUM TOXIN",
        displayName: "BOTULINUM TOXIN",
        slug: "botulinum-toxin",
        variations: [
          { strength: "100 IU", moq: 10 },
        ],
        description: "Botulinum toxin is a neurotoxin that inhibits acetylcholine release at neuromuscular junctions by cleaving SNARE complex proteins. It is studied for effects on muscle contraction, neurotransmitter release mechanisms, and therapeutic applications in movement disorders. Research focuses on SNARE-mediated vesicle fusion and neuromuscular signaling pathway regulation.",
        scientificPurpose: "Designed to study SNARE complex cleavage, neuromuscular junction signaling, acetylcholine release inhibition, and muscle relaxation mechanisms.",
        studiesFindings: "Inhibits acetylcholine release through SNARE complex cleavage. Produces muscle relaxation via neuromuscular junction blockade. Demonstrates dose-dependent duration of effect (context dependent). Supports investigation of neurotransmitter release mechanisms. Enables study of SNARE protein biology and vesicle fusion. Provides a reference for neuromuscular signaling pathway research.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/17706675/"
      },
      {
        name: "L-CARNITINE",
        displayName: "L-CARNITINE",
        slug: "l-carnitine",
        variations: [
          { strength: "10 mL", moq: 10 },
        ],
        description: "L-Carnitine is a quaternary amine central to mitochondrial fatty-acid transport via the carnitine shuttle, enabling long-chain fatty acids to enter mitochondria for β-oxidation. It is used extensively to study lipid utilization, mitochondrial energetics, and metabolic flexibility.",
        scientificPurpose: "Designed to study fatty-acid oxidation capacity, mitochondrial substrate transport, energy metabolism, and exercise/metabolic stress physiology.",
        studiesFindings: "Supports transport of long-chain fatty acids into mitochondria. Enhances fatty-acid oxidation capacity in metabolic models (context dependent). Influences metabolic flexibility and substrate partitioning endpoints. Supports mitochondrial energetics under increased demand (study dependent). Used to study lipid metabolism and cellular energy regulation.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=L-carnitine+mitochondrial+fatty+acid+transport+beta+oxidation"
      },
      {
        name: "MT-1",
        displayName: "MT-1",
        slug: "mt-1",
        variations: [
          { strength: "10mg", moq: 10 },
        ],
        description: "MT-1 commonly refers to melanotan I–related melanocortin signaling peptides; the clinically developed analogue afamelanotide is the best-defined NIH-indexed reference for melanocortin-1 receptor (MC1R) activation and melanogenesis/photoprotection research.",
        scientificPurpose: "Designed to study melanocortin receptor signaling (MC1R), melanogenesis pathways, and UV/photoprotection biology in controlled contexts.",
        studiesFindings: "Activates MC1R signaling and increases melanogenesis (context dependent). Enhances pigmentation-related photoprotective endpoints in clinical contexts (afamelanotide literature). Provides a tool for studying melanocortin signaling in skin biology. Modulates oxidative stress responses to UV exposure in some studies (study dependent). Enables mechanistic research on melanogenesis and pigmentation regulation.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=afamelanotide+melanocortin+1+receptor+MC1R+melanogenesis"
      },
      {
        name: "MT-2 (Melanotan II)",
        displayName: "MT-2 (Melanotan II)",
        slug: "mt-2",
        variations: [
          { strength: "10mg", moq: 10 },
        ],
        description: "MT-2 (melanotan II) is a melanocortin receptor agonist developed in pigmentation research and also studied for CNS melanocortin pathway effects. Research commonly focuses on melanogenesis signaling and broader melanocortin-mediated behavioral/metabolic endpoints.",
        scientificPurpose: "Designed to study melanocortin receptor biology (including pigmentation and CNS pathway signaling) and downstream melanogenesis mechanisms.",
        studiesFindings: "Activates melanocortin signaling pathways relevant to pigmentation (context dependent). Increases melanogenesis-related markers in experimental contexts. Provides a tool for studying melanocortin receptor signaling cross-tissue effects. Supports research into melanocortin pathway roles in appetite/arousal circuitry (study dependent). Enables mechanistic mapping of melanocortin receptor activation profiles.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=melanotan+II+melanocortin+receptor+agonist"
      },
      {
        name: "5-AMINO-1MQ",
        displayName: "5-AMINO-1MQ",
        slug: "5-amino-1mq",
        variations: [
          { strength: "5mg", moq: 10 },
        ],
        description: "5-Amino-1MQ is a small-molecule research compound commonly described as an inhibitor of NNMT (nicotinamide N-methyltransferase), an enzyme implicated in nicotinamide metabolism and broader NAD-associated metabolic regulation. In metabolic research, NNMT inhibition is explored as a strategy to shift cellular energy-handling programs, adipose tissue metabolism, and metabolic phenotype endpoints. It is used as a mechanistic tool to test how NNMT activity influences obesity-associated metabolic networks.",
        scientificPurpose: "Designed to study NNMT biology, nicotinamide/NAD-linked metabolic regulation, adipose energetic programming, and downstream metabolic phenotype shifts in experimental systems.",
        studiesFindings: "Inhibits NNMT activity in experimental contexts (mechanism-based). Alters metabolic programming linked to nicotinamide metabolism (context dependent). Improves metabolic phenotype endpoints in select preclinical studies (study dependent). Supports adipose tissue metabolic remodeling hypotheses in obesity research frameworks. Enables mechanistic mapping of NNMT's role in energy homeostasis and metabolic flexibility.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=5-Amino-1MQ+NNMT+inhibitor+metabolic+remodeling"
      },
      {
        name: "SLU-PP-322",
        displayName: "SLU-PP-322",
        slug: "slu-pp-322",
        variations: [
          { strength: "5mg", moq: 10 },
        ],
        description: "SLU-PP-322 appears to be a catalog-style small-molecule code within the SLU-PP series of estrogen-related receptor (ERR) agonists discussed in exercise-mimetic metabolism research (closely related series compounds include SLU-PP-332). These agents are studied for transcriptional activation of mitochondrial and oxidative metabolism gene programs.",
        scientificPurpose: "Designed to study ERR (ERRα/β/γ) activation and downstream transcriptional programs controlling mitochondrial biogenesis, fatty-acid oxidation, and exercise-mimetic metabolic remodeling.",
        studiesFindings: "Activates ERR-regulated metabolic gene expression programs (series-dependent). Increases oxidative metabolism signatures in skeletal muscle models (context dependent). Enhances mitochondrial function and cellular respiration markers in experimental systems. Improves metabolic syndrome/obesity-related outcomes in animal models (series-dependent literature). Provides a tool for mapping ERR-driven endurance/exercise transcriptional responses.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=SLU-PP-332+ERR+agonist+exercise+mimetic"
      },
      {
        name: "BAC WATER",
        displayName: "BAC WATER",
        slug: "bac-water",
        variations: [
          { strength: "3mg", moq: 10 },
          { strength: "10mg", moq: 10 },
        ],
        description: "BAC Water refers to bacteriostatic water, a sterile aqueous diluent commonly formulated to resist microbial growth after repeated vial entry. In scientific handling terms, it is used as a reconstitution/solvent medium to maintain sterility characteristics during multi-use workflows.",
        scientificPurpose: "Designed for sterile dilution/reconstitution workflows and to study stability/compatibility of reconstituted materials under bacteriostatic conditions.",
        studiesFindings: "Supports sterile preparation workflows where multiple accesses may occur (context dependent). Maintains bacteriostatic characteristics based on formulation standards. Enables repeat-access handling models for laboratory/compounding contexts. Used to preserve preparation integrity in controlled settings. Supports standardized reconstitution protocols in research operations.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=bacteriostatic+water+benzyl+alcohol+sterile+diluent"
      },
      {
        name: "INSULIN",
        displayName: "INSULIN",
        slug: "insulin",
        variations: [
          { strength: "3 mL", moq: 1 },
        ],
        description: "Insulin is a peptide hormone and master regulator of systemic energy storage, acting through the insulin receptor to control glucose uptake, glycogen synthesis, lipid storage, and protein synthesis. At the cellular level, insulin receptor activation initiates canonical signaling cascades including PI3K/Akt pathways that regulate glucose transporter trafficking and metabolic enzyme activity. In research, insulin is foundational for studying metabolic homeostasis, anabolic signaling, and disease models of insulin resistance.",
        scientificPurpose: "Designed to study insulin receptor signaling, glucose transport regulation, anabolic nutrient storage pathways, metabolic substrate partitioning, and insulin resistance mechanisms.",
        studiesFindings: "Activates insulin receptor signaling cascades (PI3K/Akt; context dependent). Increases cellular glucose uptake via transporter regulation mechanisms. Promotes glycogen synthesis and nutrient storage signaling programs. Modulates lipid metabolism and protein synthesis pathways in metabolic tissues. Serves as a reference standard for modeling insulin resistance and metabolic disease signaling. Supports mechanistic mapping of endocrine control over systemic energy distribution.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=insulin+receptor+signaling+PI3K+Akt+glucose+uptake+GLUT4"
      },
      {
        name: "HYALURONIC ACID",
        displayName: "HYALURONIC ACID",
        slug: "hyaluronic-acid",
        variations: [
          { strength: "5mg", moq: 1 },
        ],
        description: "Hyaluronic acid (HA) is a naturally occurring glycosaminoglycan polymer that contributes to extracellular matrix hydration, viscoelasticity, and tissue lubrication. Because of its strong water-binding capacity and mechanical properties, HA is extensively used in biomaterials research, wound microenvironment modeling, tissue engineering, and extracellular matrix remodeling studies. Its effects are commonly evaluated through rheologic behavior, hydration dynamics, and cell–matrix interaction endpoints.",
        scientificPurpose: "Designed to study extracellular matrix hydration mechanics, viscoelastic biomaterial behavior, tissue lubrication dynamics, wound-healing microenvironments, and scaffold-based tissue engineering.",
        studiesFindings: "Enhances tissue hydration and extracellular matrix viscoelastic properties. Supports cell migration and tissue remodeling microenvironments (context dependent). Serves as a scaffold component in tissue engineering models. Improves lubrication mechanics in joint/soft tissue research contexts (study dependent). Modulates wound-healing signaling environments by altering matrix mechanics and hydration. Enables controlled modeling of ECM physical properties and cell–matrix signaling interplay.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=hyaluronic+acid+extracellular+matrix+viscoelastic+biomaterial+wound+healing"
      },
      {
        name: "FOLLISTATIN",
        displayName: "FOLLISTATIN",
        slug: "follistatin",
        variations: [
          { strength: "Single item", moq: 1 },
        ],
        description: "Follistatin is an endogenous binding protein that neutralizes select TGF-β superfamily ligands, most notably myostatin and activins, thereby altering the signaling environment that constrains muscle growth and tissue remodeling. It is heavily studied in skeletal muscle hypertrophy biology, regeneration research, and developmental signaling frameworks due to its role as a powerful upstream modulator of growth-limiting pathways. Research interpretation typically focuses on pathway inhibition effects and downstream muscle/tissue outcomes.",
        scientificPurpose: "Designed to study inhibition of myostatin/activin signaling, regulation of muscle growth constraints, skeletal muscle remodeling, and TGF-β superfamily pathway modulation.",
        studiesFindings: "Binds and inhibits myostatin signaling activity (context dependent). Promotes increased skeletal muscle mass in multiple experimental models when upregulated. Modulates activin signaling pathways involved in tissue remodeling and metabolism. Supports muscle regeneration biology and satellite cell–linked repair processes (study dependent). Enables mechanistic mapping of growth inhibition pathways and hypertrophy signaling programs.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=follistatin+myostatin+activin+muscle+hypertrophy+regeneration"
      },
      {
        name: "GLOW STACK",
        displayName: "GLOW",
        slug: "glow",
        variations: [
          { strength: "70mg", moq: 10 },
        ],
        description: "Glow Stack is a bundled research concept combining three signaling peptides frequently studied for regenerative and tissue-remodeling pathways: BPC-157 (repair/cytoprotection), GHK-Cu (ECM remodeling/gene expression), and thymosin beta-4–related material (migration/angiogenesis). The combined concept is positioned as a multi-pathway approach to repair signaling and matrix remodeling research.",
        scientificPurpose: "Designed to study multi-target repair biology: angiogenesis, extracellular matrix remodeling, wound closure kinetics, and inflammatory modulation through complementary peptide signaling.",
        studiesFindings: "BPC-157 literature: enhanced repair signaling and angiogenesis markers (context dependent). GHK-Cu literature: collagen/ECM remodeling gene expression patterns (study dependent). Thymosin beta-4 literature: cell migration and wound repair signaling. Combination concept: supports multi-pathway modeling of tissue remodeling and repair programs. Useful for studying how repair pathways may be coordinated across tissue compartments.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=BPC-157+tissue+repair"
      },
      {
        name: "KLOW STACK",
        displayName: "KLOW",
        slug: "klow",
        variations: [
          { strength: "80mg", moq: 10 },
        ],
        description: "KLOW Stack is a bundled research concept combining GHK-Cu (copper peptide; extracellular matrix remodeling), BPC-157 (tissue repair/cytoprotection), thymosin beta-4–related material (cell migration/angiogenesis), and KPV (small-peptide inflammation modulation). The rationale for the stack concept is to model tissue recovery as a systems-biology process involving vascular signaling, matrix rebuilding, and inflammatory phase regulation. It is best understood as a multi-input pathway tool used to explore coordinated tissue remodeling programs.",
        scientificPurpose: "Designed to study integrated tissue repair biology: ECM remodeling, angiogenesis and migration signaling, cytoprotection, and inflammation modulation pathways in combined experimental frameworks.",
        studiesFindings: "GHK-Cu: supports collagen/ECM remodeling pathways and repair-associated gene expression programs (context dependent). BPC-157: enhances repair/angiogenesis signaling markers in preclinical literature. Thymosin beta-4: promotes migration and wound repair signaling pathways. KPV: modulates inflammatory cytokine-associated signaling patterns in experimental contexts. Stack concept: supports systems-level modeling of tissue remodeling by combining complementary pathway inputs. Useful for studying how inflammatory control and matrix reconstruction may co-evolve during tissue recovery.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=GHK-Cu+copper+peptide+collagen+gene+expression"
      },
      {
        name: "KPV (Lysine-Proline-Valine)",
        displayName: "KPV (Lysine-Proline-Valine)",
        slug: "kpv",
        variations: [
          { strength: "5mg", moq: 10 },
          { strength: "10mg", moq: 10 },
        ],
        description: "KPV is a short bioactive tripeptide studied in inflammation research as a minimal motif capable of modulating cytokine output and inflammatory cascade amplification. It is frequently discussed in epithelial and mucosal immune contexts where small peptides can influence barrier-associated immune signaling. Research uses it to explore how compact peptide sequences can regulate inflammatory pathway dynamics.",
        scientificPurpose: "Designed to study cytokine modulation, epithelial/mucosal inflammatory regulation, and anti-inflammatory signaling pathway dynamics in experimental systems.",
        studiesFindings: "Reduces inflammatory cytokine signaling in experimental models (context dependent). Modulates immune signaling pathways associated with inflammation resolution. Supports epithelial barrier-associated immune regulation signaling in some studies. Demonstrates anti-inflammatory patterns in peptide research contexts. Provides a minimal-peptide tool for mapping inflammation pathway modulation. Useful for exploring peptide control of mucosal immune signaling networks.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/12820180/"
      },
    ]
  }
];

export const getAllProducts = (): Product[] => {
  return productCategories.flatMap(category => category.products);
};

export const getProductBySlug = (slug: string): Product | undefined => {
  return getAllProducts().find(product => product.slug === slug);
};

export const getCategoryBySlug = (slug: string): ProductCategory | undefined => {
  return productCategories.find(category => category.slug === slug);
};
