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
        description: "Cagrilintide is a long-acting synthetic analogue designed to reproduce and prolong amylin-pathway satiety signaling, a neuroendocrine system co-regulating appetite and post-meal fullness. It is engineered to sustain receptor engagement so researchers can study extended appetite suppression and nutrient-handling effects. Research frameworks commonly focus on how amylin signaling interacts with brainstem/hypothalamic circuits that govern meal size and feeding drive.",
        scientificPurpose: "Designed to study amylin receptor pathway activation for appetite regulation, reduced energy intake, and obesity-related endpoint modulation, including combination research with incretin signaling.",
        studiesFindings: "Enhances satiety signaling and reduces meal size in controlled settings. Reduces caloric intake through CNS-mediated appetite suppression pathways. Modulates gastric motility/fullness signaling (context dependent). Improves weight-related endpoints in obesity-focused investigational programs. Demonstrates additive weight effects when combined with incretin signaling (study dependent). Supports mapping of amylin→brainstem→hypothalamus feeding circuitry. Improves select metabolic biomarkers in combination research contexts (study dependent). Enables mechanistic study of appetite suppression independent of glucose-dependent insulin pathways.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/34623893/"
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
        description: "BPC-157 is a synthetic pentadecapeptide derived from a protective protein found in gastric juice, engineered to study tissue repair and cytoprotective signaling cascades. It is used in research to investigate angiogenesis, wound healing kinetics, and gastrointestinal mucosal protection pathways. The peptide has become a standard reference compound for studying repair biology across multiple tissue types.",
        scientificPurpose: "Designed to study tissue repair mechanisms, angiogenesis signaling, gastrointestinal protection pathways, and cytoprotective cascades in experimental injury and recovery models.",
        studiesFindings: "Enhances angiogenesis markers in tissue repair studies. Accelerates wound healing kinetics in multiple tissue types. Demonstrates gastroprotective effects in mucosal injury models. Modulates growth factor expression related to tissue repair (context dependent). Supports tendon and ligament healing pathway investigation. Provides a reference standard for cytoprotective peptide research. Enables mapping of repair signaling cascades across tissue compartments.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/27349193/"
      },
      {
        name: "TB500",
        displayName: "TB500 (Thymosin Beta-4)",
        slug: "tb500",
        variations: [
          { strength: "5mg", moq: 10 },
          { strength: "10mg", moq: 10 },
        ],
        description: "TB500 is a synthetic version of thymosin beta-4, a naturally occurring 43-amino-acid peptide involved in cell migration, wound healing, and tissue regeneration. It is used as a mechanistic tool to study actin regulation, angiogenesis, and repair-associated signaling in experimental systems. Research interest centers on its role in coordinating cellular migration and vascular growth during tissue recovery.",
        scientificPurpose: "Designed to study cell migration, angiogenesis, wound healing, and actin cytoskeleton regulation in tissue repair and regeneration research contexts.",
        studiesFindings: "Enhances cell migration in wound healing models. Promotes angiogenesis signaling in tissue repair studies. Regulates actin polymerization dynamics in cellular systems. Accelerates wound closure kinetics in experimental models (context dependent). Supports cardiac and vascular repair pathway investigation (study dependent). Enables mapping of thymosin beta-4 signaling in regenerative contexts. Provides a tool for studying coordinated tissue remodeling programs.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/20818537/"
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
        description: "AOD is commonly described as a growth-hormone fragment–derived metabolic peptide concept, positioned to study adipose regulation and lipid mobilization signaling. Research usage emphasizes whether fragment-level motifs can influence fat metabolism programs without invoking the complete endocrine profile of full growth hormone. It is typically used as a mechanistic tool for adipocyte metabolism pathway exploration.",
        scientificPurpose: "Designed to study adipocyte lipid mobilization, fat-mass regulation signaling, and fragment-based endocrine peptide separation-of-function metabolic mechanisms.",
        studiesFindings: "Influences lipolysis-associated signaling pathways in adipose models (context dependent). Supports fat-mass reduction endpoints in some experimental contexts (study dependent). Helps isolate adipose metabolic effects from broader GH endocrine actions. Provides a tool for studying adipocyte storage vs mobilization dynamics. Enables mechanistic exploration of fragment-derived metabolic peptide signaling frameworks. Supports comparative research with GH fragment literature in adipose metabolism.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/11713213/"
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
        description: "Semax is a synthetic neuroactive peptide derived from an ACTH fragment, engineered to modulate CNS signaling without the full endocrine actions of native ACTH. It is studied as a neuromodulatory and neuroprotective research compound that may influence neurotrophic pathways and synaptic plasticity-related programs. Research often frames Semax around cognition, stress-response signaling, and neurorepair-associated gene expression patterns.",
        scientificPurpose: "Designed to study neurotrophic modulation, cognitive performance endpoints, stress adaptation circuitry, and neuroprotective signaling in experimental contexts.",
        studiesFindings: "Modulates neurotrophic signaling associated with neuronal resilience (study dependent). Improves cognitive/learning endpoints in some experimental models. Alters stress-response neurochemistry markers (context dependent). Demonstrates neuroprotective signaling patterns in preclinical models. Influences neurotransmission-associated gene expression in some studies. Provides a tool for studying peptide-driven modulation of synaptic plasticity frameworks.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/17460624/"
      },
      {
        name: "SELANK",
        displayName: "SELANK",
        slug: "selank",
        variations: [
          { strength: "5mg", moq: 10 },
          { strength: "10mg", moq: 10 },
        ],
        description: "Selank is a synthetic tuftsin-analogue neuropeptide investigated for effects on anxiety-related signaling and stress physiology. It is studied as a peptide neuromodulator that may influence inhibitory neurotransmission networks and stress-adaptation pathways. Experimental literature often centers on behavioral outcomes and neurochemical signaling shifts relevant to emotional regulation circuits.",
        scientificPurpose: "Designed to study peptide-based anxiolytic-like mechanisms, stress adaptation biology, and neurobehavioral endpoints in controlled models.",
        studiesFindings: "Reduces anxiety-like behavioral endpoints in certain experimental settings (model dependent). Modulates stress-response signaling markers (context dependent). Influences inhibitory neurotransmission frameworks (often discussed with GABA-related pathways). Alters neurotransmission-associated gene expression patterns in some studies. Supports attention/cognitive endpoints in select experimental designs (study dependent). Provides a tool for mapping peptide modulation of emotional regulation circuitry.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/18577013/"
      },
      {
        name: "CEREBROLYSIN",
        displayName: "CEREBROLYSIN",
        slug: "cerebrolysin",
        variations: [
          { strength: "60mg", moq: 6 },
        ],
        description: "Cerebrolysin is a porcine brain–derived peptide mixture studied for neurotrophic-like effects on neuronal survival, plasticity, and recovery signaling. Research discussion often focuses on synaptic remodeling, neuroinflammation modulation, and functional recovery endpoints after neurological insult. It is frequently used as a complex peptide tool to probe multi-pathway neurorepair biology rather than a single receptor mechanism.",
        scientificPurpose: "Designed to study neurotrophic-like signaling, neuroplasticity enhancement, neuronal resilience pathways, and neurorecovery endpoints in neurological injury/stress research.",
        studiesFindings: "Supports neuroplasticity-associated signaling in experimental contexts. Improves functional recovery endpoints in some stroke/TBI studies (study dependent). Modulates neuronal survival pathway markers in preclinical research. Influences neuroinflammation-associated signaling parameters (context dependent). Improves neurocognitive performance endpoints in certain studies (model dependent). Provides a complex-peptide framework for neurorepair pathway investigation.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/22036269/"
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
        description: "Tesamorelin is a synthetic GHRH analogue designed to stimulate endogenous pituitary growth hormone release through GHRH receptor activation. It is used to study GH-axis pulsatility, somatotroph cell function, and downstream metabolic signaling associated with physiologic GH secretion. Research often emphasizes visceral adipose reduction and metabolic endpoint improvements in specific clinical contexts.",
        scientificPurpose: "Designed to study GHRH receptor activation, pituitary somatotroph function, GH pulsatility, and downstream metabolic/body composition signaling.",
        studiesFindings: "Stimulates endogenous GH secretion via GHRH receptor signaling. Supports pulsatile GH release pattern investigation. Reduces visceral adipose tissue in clinical research contexts (study dependent). Influences IGF-1 axis signaling downstream of GH release. Enables mechanistic study of GHRH-driven endocrine regulation. Provides a reference for studying physiologic GH stimulation vs exogenous GH.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/20739385/"
      },
      {
        name: "CJC-1295 WITHOUT DAC + IPA",
        displayName: "CJC-1295 WITHOUT DAC + IPA",
        slug: "cjc-1295-ipa",
        variations: [
          { strength: "10mg (5mg + 5mg)", moq: 10 },
        ],
        description: "CJC-1295 (without DAC) is a GHRH/GRF analogue designed to stimulate endogenous growth hormone release through GHRH receptor activation, typically with shorter persistence than DAC-conjugated variants. \"IPA\" commonly refers to ipamorelin, a ghrelin receptor (GHSR-1a) agonist that stimulates GH release through a complementary endocrine pathway. The combination is used to study dual-input stimulation of GH pulsatility and downstream signaling through the GH/IGF axis.",
        scientificPurpose: "Designed to study coordinated GH-axis stimulation using GHRH receptor activation (CJC) plus GHSR activation (ipamorelin), enabling analysis of endocrine pulsatility, feedback regulation, and downstream IGF-axis signaling.",
        studiesFindings: "GHRH analog activation increases GH secretion signaling (context dependent). GHSR agonism stimulates GH release via ghrelin-pathway mechanisms. Supports investigation of pulsatile endocrine secretion dynamics. Enables study of additive/complementary GH-axis stimulation strategies. Supports mapping of downstream IGF signaling changes over time (study dependent). Provides a framework for GH-axis feedback loop and secretion pattern research. Enables comparative profiling of GH secretagogue pathway inputs.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/16352683/"
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
        description: "GHK-Cu is a copper-binding tripeptide studied for effects on extracellular matrix remodeling, wound healing, and repair-associated gene expression. It is used to investigate collagen synthesis, skin regeneration, and tissue remodeling pathways. Research interest centers on how this minimal peptide-metal complex can shift gene expression programs related to tissue repair and aging.",
        scientificPurpose: "Designed to study ECM remodeling, collagen synthesis, wound healing, and repair-associated gene expression in skin and tissue regeneration research.",
        studiesFindings: "Modulates collagen synthesis and ECM remodeling signaling. Influences repair-associated gene expression patterns (context dependent). Supports wound healing pathway investigation in experimental models. Demonstrates antioxidant and anti-inflammatory signaling in some studies. Enables investigation of copper-peptide biology in tissue repair. Provides a tool for studying minimal-peptide regulation of regenerative programs.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/25877441/"
      },
      {
        name: "GLUTATHIONE",
        displayName: "GLUTATHIONE",
        slug: "glutathione",
        variations: [
          { strength: "1500mg", moq: 10 },
        ],
        description: "Glutathione is the master intracellular antioxidant tripeptide (γ-glutamyl-cysteinyl-glycine) that protects cells from oxidative damage and supports detoxification pathways. It is used to study cellular redox balance, phase II detoxification, and oxidative stress resistance mechanisms. Research applications span toxicology, aging, and cellular protection pathway investigation.",
        scientificPurpose: "Designed to study cellular antioxidant mechanisms, redox balance, detoxification pathways, and oxidative stress resistance in experimental systems.",
        studiesFindings: "Provides critical cellular defense against oxidative damage. Supports phase II detoxification enzyme function. Modulates cellular redox balance and thiol status. Demonstrates protective effects in oxidative stress models (context dependent). Enables investigation of antioxidant pathway regulation. Provides a reference for cellular protection and detoxification research.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/24341424/"
      },
      {
        name: "SNAP-8",
        displayName: "SNAP-8",
        slug: "snap-8",
        variations: [
          { strength: "10mg", moq: 10 },
        ],
        description: "SNAP-8 is a synthetic octapeptide designed to modulate SNARE complex formation and neuromuscular junction signaling. It is studied in cosmetic and neurobiology research for effects on muscle contraction patterns and expression line formation. Research focuses on how peptide-mediated SNARE modulation can influence neurotransmitter release and downstream muscle activity.",
        scientificPurpose: "Designed to study SNARE complex modulation, neuromuscular junction signaling, and muscle contraction pathway regulation in cosmetic and neurobiology research.",
        studiesFindings: "Modulates SNARE complex formation in neuromuscular systems. Influences neurotransmitter release signaling (context dependent). Supports investigation of muscle contraction pathway regulation. Demonstrates effects on expression-related muscle activity in cosmetic research. Enables study of peptide-mediated neuromuscular modulation. Provides a tool for SNARE-targeted signaling pathway research.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/19146898/"
      },
      {
        name: "LL-37",
        displayName: "LL-37",
        slug: "ll-37",
        variations: [
          { strength: "10mg", moq: 10 },
        ],
        description: "LL-37 is a human cathelicidin antimicrobial peptide with broad-spectrum antimicrobial activity and immunomodulatory properties. It is studied for effects on microbial membrane disruption, wound healing, and innate immune signaling. Research interest includes how this host defense peptide coordinates antimicrobial activity with tissue repair and immune regulation.",
        scientificPurpose: "Designed to study antimicrobial mechanisms, innate immune signaling, wound healing, and host defense peptide biology in infection and immunity research.",
        studiesFindings: "Demonstrates broad-spectrum antimicrobial activity against bacteria, viruses, and fungi. Modulates innate immune signaling and cytokine patterns. Supports wound healing pathway investigation (context dependent). Influences angiogenesis and tissue repair signaling in some studies. Enables investigation of host defense peptide mechanisms. Provides a tool for studying cathelicidin biology in immunity and repair.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/16209167/"
      },
      {
        name: "NAD",
        displayName: "NAD",
        slug: "nad",
        variations: [
          { strength: "100mg", moq: 10 },
          { strength: "500mg", moq: 10 },
        ],
        description: "NAD+ (nicotinamide adenine dinucleotide) is an essential coenzyme involved in cellular metabolism, energy production, and sirtuin-mediated signaling. It is studied for effects on mitochondrial function, DNA repair pathways, and aging-associated metabolic changes. Research interest centers on how NAD+ availability influences cellular energetics and longevity-associated pathway regulation.",
        scientificPurpose: "Designed to study cellular metabolism, sirtuin signaling, mitochondrial function, and aging-associated pathway regulation in metabolic and longevity research.",
        studiesFindings: "Supports cellular energy metabolism and ATP production. Activates sirtuin-mediated signaling pathways (context dependent). Influences DNA repair and genomic stability mechanisms. Modulates mitochondrial function and bioenergetics. Enables investigation of NAD+-dependent enzyme biology. Provides a tool for studying metabolic and longevity pathway regulation.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/26785480/"
      },
      {
        name: "LEMON BOTTLE",
        displayName: "LEMON BOTTLE",
        slug: "lemon-bottle",
        variations: [
          { strength: "10mg", moq: 10 },
        ],
        description: "\"Lemon Bottle\" is a branded aesthetic product name rather than a standardized chemical identity commonly indexed on NIH/PubMed. Scientific evidence and NIH indexing generally track data by verified active ingredients, not brand formulations. The closest NIH-trackable mechanism for localized injectable fat reduction is ingredient-level adipocytolysis literature (frequently associated with deoxycholic acid), which has defined cellular mechanisms and measurable contour endpoints.",
        scientificPurpose: "Marketed concept: localized adipose reduction. NIH-aligned evaluation is best mapped to ingredient-level adipocytolysis research rather than brand-level claims.",
        studiesFindings: "Ingredient-level adipocytolysis literature demonstrates localized subcutaneous fat reduction endpoints (study dependent). Mechanistic studies show targeted adipocyte disruption in treated tissues (context dependent). Demonstrates measurable changes in treated-area contour/volume in controlled settings. Provides a standardized research framework for localized fat reduction via injectables. Enables study of tissue remodeling following adipocyte disruption (study dependent). Supports evaluation of fat reduction mechanisms at the cellular and tissue levels.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/30817890/"
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
        description: "L-Carnitine is an amino acid derivative essential for mitochondrial fatty acid transport and beta-oxidation. It is studied for effects on lipid metabolism, energy production, and exercise-related metabolic adaptation. Research applications include fatty acid oxidation pathway investigation and metabolic efficiency studies.",
        scientificPurpose: "Designed to study mitochondrial fatty acid transport, beta-oxidation, lipid metabolism, and energy production in metabolic and exercise research.",
        studiesFindings: "Facilitates fatty acid transport into mitochondria for oxidation. Supports energy production through lipid metabolism pathways. Influences exercise-related metabolic endpoints (context dependent). Modulates fatty acid oxidation efficiency in cellular systems. Enables investigation of carnitine shuttle biology. Provides a tool for studying lipid metabolism and cellular energetics.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/21224234/"
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
