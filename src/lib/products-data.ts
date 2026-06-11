export interface ProductVariation {
  strength: string;
  moq: number;
  // Per-vial price (single vial sold to individuals)
  price?: number;
  // Legacy fields (deprecated, kept optional for backward compat)
  price10?: number;
  price20?: number;
  price30?: number;
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
          { strength: "5mg", moq: 1, price: 65 },
          { strength: "10mg", moq: 1, price: 75 },
          { strength: "15mg", moq: 1, price: 80 },
          { strength: "20mg", moq: 1, price: 100 },
          { strength: "30mg", moq: 1, price: 115 },
        ],
        description: "GLP1-SEMA is a long-acting peptide agonist engineered to mimic endogenous glucagon-like peptide-1 (GLP-1), a nutrient-responsive incretin hormone that coordinates glucose handling and appetite regulation. It is structurally modified to resist rapid enzymatic degradation and to sustain systemic exposure, enabling prolonged GLP-1 receptor activation. In research settings, it is used to map how sustained GLP-1R signaling alters pancreatic endocrine output, gastrointestinal motility, and CNS satiety circuitry.",
        scientificPurpose: "Designed to study GLP-1 receptor biology across metabolic tissues, with emphasis on glucose-dependent insulin secretion dynamics, suppression of nutrient-inappropriate glucagon output, gastric emptying control, and hypothalamic/brainstem satiety network activation.",
        studiesFindings: "Increases glucose-dependent insulin secretion signaling. Suppresses glucagon output under nutrient availability (context dependent). Delays gastric emptying kinetics, reducing post-meal glucose excursion magnitude. Enhances satiety signaling and reduces energy intake in controlled settings. Produces sustained reductions in body weight and fat mass in clinical research programs. Improves glycemic endpoints in metabolic disease contexts (study dependent). Improves select cardiometabolic biomarkers in obesity/metabolic studies (context dependent). Enables mechanistic mapping of GLP-1R pathways across peripheral + CNS compartments.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=semaglutide+GLP-1+receptor+mechanism"
      },
      {
        name: "TIRZEPATIDE",
        displayName: "GLP1-TRIZ",
        slug: "glp1-triz",
        variations: [
          { strength: "5mg", moq: 1, price: 60 },
          { strength: "10mg", moq: 1, price: 75 },
          { strength: "15mg", moq: 1, price: 85 },
          { strength: "20mg", moq: 1, price: 110 },
          { strength: "30mg", moq: 1, price: 165 },
          { strength: "40mg", moq: 1, price: 185 },
          { strength: "50mg", moq: 1, price: 200 },
          { strength: "60mg", moq: 1, price: 220 },
        ],
        description: "GLP1-TRIZ is a dual incretin receptor agonist engineered to activate both GLP-1 and GIP receptors, combining two nutrient-sensing endocrine pathways into a single signaling framework. This dual design is used to study \"incretin synergy,\" where parallel receptor engagement can amplify insulinotropic signaling while also modulating appetite and metabolic substrate handling. Research interest centers on how dual-pathway activation alters endocrine output, energy intake, and adiposity outcomes compared with single incretin activation.",
        scientificPurpose: "Designed to study combined GLP-1R/GIPR activation on glucose-dependent insulin secretion, systemic insulin sensitivity, appetite regulation, and fat-mass reduction biology, including downstream transcriptional remodeling in metabolic tissues.",
        studiesFindings: "Amplifies glucose-dependent insulin secretion via dual incretin engagement. Improves insulin sensitivity measures in metabolic studies (context dependent). Reduces appetite drive and caloric intake through CNS satiety signaling. Produces substantial reductions in body weight and fat mass in clinical programs. Improves glycemic endpoints (fasting measures/HbA1c in clinical contexts). Improves lipid-related biomarkers in obesity/metabolic research (study dependent). Supports mechanistic study of dual receptor signaling bias and pathway crosstalk. Demonstrates larger weight-related outcomes than some single-pathway strategies (study dependent).",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=tirzepatide+GIP+GLP-1+dual+agonist"
      },
      {
        name: "RETATRUTIDE",
        displayName: "GLP3-RETA",
        slug: "glp3-reta",
        variations: [
          { strength: "5mg", moq: 1, price: 90 },
          { strength: "10mg", moq: 1, price: 100 },
          { strength: "15mg", moq: 1, price: 140 },
          { strength: "20mg", moq: 1, price: 150 },
          { strength: "30mg", moq: 1, price: 195 },
          { strength: "40mg", moq: 1, price: 250 },
          { strength: "50mg", moq: 1, price: 380 },
          { strength: "60mg", moq: 1, price: 530 },
        ],
        description: "GLP3-RETA is a tri-agonist metabolic peptide designed to activate GLP-1, GIP, and glucagon receptors. The architecture is intended to combine incretin-driven satiety and glycemic control with glucagon-receptor–linked energy expenditure and lipid mobilization signaling. In research, it is used to explore \"balanced polyagonism\" as a strategy to shift weight-loss magnitude and metabolic flexibility beyond incretin-only models.",
        scientificPurpose: "Designed to study multi-receptor coordination of appetite suppression, glycemic regulation, lipid oxidation, and energy expenditure signaling—particularly the contribution of glucagon receptor signaling to weight-loss outcomes.",
        studiesFindings: "Produces large body-weight reductions in investigational clinical research (study dependent). Reduces fat mass and improves adiposity-associated endpoints. Enhances energy expenditure/thermogenic signaling markers (context dependent). Improves glycemic control metrics via incretin pathway activity. Improves lipid metabolism biomarkers in metabolic disease contexts (study dependent). Supports mechanistic evaluation of receptor-balanced polyagonist design. Enables mapping of glucagon receptor effects on substrate utilization in obesity models. Improves composite cardiometabolic endpoints in select programs (context dependent).",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=retatrutide+GLP-1+GIP+glucagon+triple+agonist"
      },
      {
        name: "CAGRILINTIDE",
        displayName: "CAGRILINTIDE",
        slug: "cagrilintide",
        variations: [
          { strength: "5mg", moq: 10, price: 90 },
          { strength: "10mg", moq: 10, price: 105 },
        ],
        description: "Cagrilintide is a long-acting, acylated amylin analogue designed to replicate and extend the satiety signaling associated with the endogenous pancreatic hormone amylin (islet amyloid polypeptide). Mechanistically, amylin is co-secreted with insulin from pancreatic β-cells and signals through calcitonin receptor/RAMP complexes in the CNS to modulate appetite, gastric emptying, and postprandial glucose dynamics. Cagrilintide's extended half-life allows for sustained receptor engagement and intensified appetite-regulating neuroendocrine signaling. It is primarily studied in obesity and metabolic disease research, often in combination with GLP-1 receptor agonists to model additive or synergistic weight-loss effects through complementary satiety pathways.",
        scientificPurpose: "Designed to study amylin-receptor pathway activation, central appetite suppression mechanisms, gastric emptying modulation, postprandial glucose regulation, and additive weight-loss biology when combined with incretin agonist approaches in obesity research frameworks.",
        studiesFindings: "Enhances satiety signaling and significantly reduces energy intake through CNS appetite pathways (context dependent). Produces substantial weight reduction endpoints in obesity-focused clinical research programs. Influences gastric emptying kinetics and nutrient handling signals. Demonstrates additive weight-loss effects when combined with GLP-1 receptor agonist signaling (study dependent). Improves metabolic biomarkers including glycemic control measures in combination studies. Reduces body fat mass with effects on adiposity-related endpoints. Supports investigation of amylin-pathway pharmacology and receptor biology. Enables mechanistic study of dual-pathway appetite suppression combining amylin and incretin signaling. Provides a tool for modeling sustained neuroendocrine satiety interventions.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=cagrilintide+amylin+analog+satiety"
      },
      {
        name: "MAZDUTIDE",
        displayName: "MAZDUTIDE",
        slug: "mazdutide",
        variations: [
          { strength: "10mg", moq: 10, price: 85 },
        ],
        description: "Mazdutide is an investigational dual agonist targeting GLP-1 and glucagon receptors, designed to integrate satiety-driven energy intake reduction with glucagon-linked energy expenditure and lipid utilization signaling. Mechanistically, it is studied to determine how adding glucagon receptor activity can shift substrate partitioning and thermogenic outputs while maintaining incretin-mediated glycemic benefits. It is primarily used as a polyagonist tool for obesity and metabolic disease research.",
        scientificPurpose: "Designed to study GLP-1R/GCGR dual activation for appetite suppression, energy expenditure modulation, lipid oxidation signaling, and metabolic biomarker improvement in obesity research.",
        studiesFindings: "Reduces body weight and adiposity endpoints in investigational programs (study dependent). Suppresses appetite and lowers energy intake via incretin pathway activity. Enhances energy expenditure and lipid oxidation signaling (context dependent). Improves glycemic endpoints through GLP-1 receptor signaling. Improves lipid metabolism biomarkers in obesity/metabolic disease contexts. Supports mechanistic mapping of glucagon receptor contributions to weight-loss magnitude. Improves composite cardiometabolic risk markers in select studies (study dependent). Enables evaluation of receptor balance (satiety vs expenditure) in polyagonist design.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=mazdutide+GLP-1+glucagon+dual+agonist"
      },
      {
        name: "SURVODUTIDE",
        displayName: "SURVODUTIDE",
        slug: "survodutide",
        variations: [
          { strength: "10mg", moq: 10, price: 105 },
        ],
        description: "Survodutide is an investigational dual agonist designed to activate both the GLP-1 receptor and the glucagon receptor, integrating incretin-driven satiety/glycemic signaling with glucagon-linked energy expenditure and lipid utilization programs. In research framing, it is a representative \"poly-agonist metabolic peptide\" used to study how coordinated receptor engagement can shift body weight outcomes and metabolic biomarkers beyond incretin-only approaches.",
        scientificPurpose: "Designed to study GLP-1R/GCGR dual agonism for appetite reduction, energy expenditure signaling, lipid oxidation, and metabolic disease endpoints in obesity-focused research.",
        studiesFindings: "Produces weight reduction endpoints in investigational metabolic programs (study dependent). Suppresses appetite and reduces energy intake via GLP-1 pathway activity (context dependent). Enhances energy expenditure and lipid utilization signaling through glucagon-receptor components (context dependent). Improves glycemic biomarkers via incretin-associated signaling. Improves cardiometabolic biomarkers in obesity/metabolic disease research contexts (study dependent). Provides a tool framework for studying receptor-balanced polyagonism and weight-loss magnitude.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=survodutide+GLP-1+glucagon+dual+agonist"
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
          { strength: "5mg", moq: 1, price: 60 },
          { strength: "10mg", moq: 1, price: 70 },
        ],
        description: "BPC-157 (Body Protection Compound-157) is a synthetic pentadecapeptide derived from a segment of human gastric juice protein, engineered for exceptional stability in acidic environments and studied extensively in tissue-repair and cytoprotective research frameworks. Mechanistically, BPC-157 is associated with multi-pathway signaling involving growth factor modulation (VEGF, EGF), nitric oxide system interactions, and FAK-paxillin pathway activation relevant to cell migration and tissue remodeling. It is frequently studied in models of tendon, ligament, muscle, and gastrointestinal injury for its effects on angiogenesis, inflammatory phase modulation, and accelerated recovery kinetics. Research interest centers on its unusual stability profile and broad tissue-repair signaling effects across multiple organ systems.",
        scientificPurpose: "Designed to study multi-pathway tissue repair biology, including angiogenesis signaling (VEGF-mediated), growth factor modulation, nitric oxide system interactions, inflammatory cascade regulation, mucosal cytoprotection, and connective tissue remodeling in controlled injury/recovery models.",
        studiesFindings: "Accelerates tendon and ligament repair signaling in preclinical injury models (context dependent). Enhances angiogenic signaling and microvascular network recovery markers across multiple tissue types. Supports muscle repair and regeneration signaling programs in experimental musculoskeletal frameworks. Improves mucosal protective signaling and gastric cytoprotection endpoints in GI injury models. Modulates nitric oxide–linked pathway signaling relevant to vascular and tissue repair biology (study dependent). Demonstrates neuroprotective signaling patterns in select CNS injury models. Supports bone healing signaling markers in fracture research contexts (model dependent). Influences inflammatory cytokine profiles during tissue recovery phases. Provides a reference peptide for studying gastric-derived cytoprotective signaling mechanisms.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=BPC-157+pentadecapeptide+tissue+repair"
      },
      {
        name: "TB500",
        displayName: "TB500 (Thymosin Beta-4)",
        slug: "tb500",
        variations: [
          { strength: "5mg", moq: 1, price: 40 },
          { strength: "10mg", moq: 1, price: 55 },
        ],
        description: "TB500 is commonly presented as thymosin beta-4–related material; thymosin beta-4 (Tβ4) is an endogenous 43-amino acid peptide that serves as a major actin-sequestering protein, playing central roles in cytoskeletal dynamics, cell motility, and tissue repair signaling networks. Mechanistically, Tβ4 promotes G-actin sequestration and regulates actin polymerization kinetics, directly influencing cell migration, wound closure, and vascular remodeling programs. It is studied extensively in regenerative biology for effects on angiogenesis, cardiac repair signaling, dermal wound healing, and inflammatory phase modulation. Research literature positions thymosin beta-4 as a key endogenous repair factor with broad tissue-protective and pro-regenerative signaling properties.",
        scientificPurpose: "Designed to study actin-cytoskeleton dynamics, cell migration and motility signaling, angiogenesis pathway activation, wound closure mechanisms, cardiac repair biology, and inflammatory modulation during tissue recovery processes.",
        studiesFindings: "Promotes cell migration and wound closure signaling through actin-cytoskeleton modulation (context dependent). Enhances angiogenic responses and blood vessel formation in wound and ischemia models. Supports cardiac repair signaling and improves functional endpoints in myocardial injury research (study dependent). Accelerates dermal wound healing and re-epithelialization processes in preclinical models. Modulates inflammatory signaling during tissue repair phases. Influences hair follicle biology and regenerative signaling in dermatologic research contexts. Supports corneal repair and epithelial healing in ocular injury models. Demonstrates neuroprotective signaling patterns in select CNS research frameworks (model dependent). Provides a tool for studying endogenous peptide-driven repair and regeneration mechanisms.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=thymosin+beta-4+actin+cell+migration+wound+healing"
      },
      {
        name: "THYMOSIN ALPHA-1",
        displayName: "THYMOSIN ALPHA-1",
        slug: "thymosin-alpha-1",
        variations: [
          { strength: "5mg", moq: 10, price: 50 },
          { strength: "10mg", moq: 10, price: 65 },
        ],
        description: "Thymosin alpha-1 (Tα1, thymalfasin) is a 28-amino acid acetylated peptide originally isolated from thymic tissue that functions as an endogenous immunomodulatory factor. It plays critical roles in T-cell maturation, differentiation, and functional activation, while also modulating dendritic cell function and innate-adaptive immune coordination. Mechanistically, Tα1 activates Toll-like receptor signaling pathways, enhances MHC class I expression, promotes cytokine production (IL-2, IFN-α, IFN-γ), and supports NK cell activity. It is studied extensively in infectious disease research, immunodeficiency modeling, oncology-supportive care, and vaccine adjuvant applications for its ability to restore and enhance immune function.",
        scientificPurpose: "Designed to study T-cell functional restoration and activation, dendritic cell maturation, innate-adaptive immune coordination, Toll-like receptor signaling, antigen presentation enhancement, anti-infective immune responses, and immunomodulation in immunodeficiency or immune dysfunction contexts.",
        studiesFindings: "Enhances T-cell functional signaling and promotes Th1 immune responses in immunology studies (context dependent). Increases dendritic cell maturation and antigen presentation capacity. Improves immune coordination markers and outcomes in infectious disease research programs including viral hepatitis. Activates Toll-like receptor pathways and downstream cytokine signaling (IL-2, interferons). Supports NK cell activity and innate immune surveillance mechanisms (study dependent). Modulates cytokine profiles toward improved anti-infective and anti-tumor immune patterns. Demonstrates synergistic effects with vaccines and other immunotherapies as an adjuvant. Supports immune recovery in immunocompromised research models. Provides a reference peptide for studying thymic-derived immune regulation mechanisms. Used in clinical research exploring immune restoration in chronic infections and malignancies.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=thymosin+alpha-1+immunomodulatory"
      },
      {
        name: "SS-31",
        displayName: "SS-31",
        slug: "ss-31",
        variations: [
          { strength: "10mg", moq: 10, price: 40 },
          { strength: "50mg", moq: 10, price: 115 },
        ],
        description: "SS-31 (elamipretide, Bendavia, MTP-131) is a cell-permeable, mitochondria-targeted tetrapeptide designed to interact with cardiolipin, a phospholipid uniquely concentrated in the inner mitochondrial membrane essential for electron transport chain organization and ATP synthase function. Mechanistically, SS-31 stabilizes cardiolipin-cytochrome c interactions, improves electron transport efficiency, reduces electron leak and reactive oxygen species (ROS) generation, and protects cristae structure under stress conditions. It is studied in bioenergetics research, mitochondrial disease modeling, heart failure, kidney injury, and age-related mitochondrial dysfunction for its ability to restore mitochondrial function and reduce oxidative damage.",
        scientificPurpose: "Designed to study mitochondrial bioenergetics and electron transport chain efficiency, cardiolipin biology and membrane organization, oxidative phosphorylation regulation, mitochondrial ROS production and oxidative stress, cristae structure maintenance, and cellular resilience under metabolic or ischemic stress.",
        studiesFindings: "Improves mitochondrial respiration and ATP production efficiency across multiple tissue types (context dependent). Stabilizes cardiolipin-dependent electron transport chain organization and cristae architecture. Reduces mitochondrial ROS production and oxidative stress markers in experimental models. Improves cardiac function endpoints in heart failure research (study dependent). Demonstrates renoprotective effects in acute kidney injury and ischemia-reperfusion models. Supports neuronal energetics and neuroprotective signaling in CNS research contexts. Improves exercise tolerance and skeletal muscle function in mitochondrial myopathy studies. Reduces ischemia-reperfusion injury across multiple organ systems. Supports cellular survival under metabolic stress conditions. Provides a reference peptide for studying cardiolipin-targeted bioenergetic interventions.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=elamipretide+SS-31+mitochondrial"
      },
      {
        name: "THYMALIN",
        displayName: "THYMALIN",
        slug: "thymalin",
        variations: [
          { strength: "10mg", moq: 10, price: 30 },
        ],
        description: "Thymalin is a polypeptide complex extracted from bovine or porcine thymus gland, studied in Russian and Eastern European pharmacology research traditions as an immunomodulatory agent. It contains a mixture of thymic peptides including thymosin fractions that influence T-cell development, maturation, and functional activity. Mechanistically, thymalin is reported to support thymic function, enhance T-lymphocyte proliferation and differentiation, modulate cytokine production, and restore immune homeostasis in immunodeficiency or immune senescence contexts. It is studied in gerontology research for potential effects on immune aging and in clinical applications supporting immune recovery.",
        scientificPurpose: "Designed to study thymic-peptide immune modulation, T-cell functional restoration and maturation, immune reconstitution in immunodeficiency contexts, cytokine signaling normalization, and thymic function support in aging and immune senescence research.",
        studiesFindings: "Enhances T-lymphocyte functional activity and proliferation in immunology research settings (context dependent). Supports T-cell differentiation and maturation signaling programs. Improves immune function markers in immunocompromised and elderly populations (study dependent). Modulates cytokine production toward normalized immune response profiles. Supports thymic function and delays immune senescence markers in gerontology research. Demonstrates restoration of immune homeostasis in infection and post-treatment recovery contexts. Influences natural killer cell activity and innate immune coordination. Provides a multi-peptide model for studying complex thymic extract immunomodulation. Enables investigation of peptide mixture effects on immune reconstitution biology. Used in research exploring peptide-based interventions for age-related immune decline.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=Thymalin+thymus+extract+immunomodulatory"
      },
      {
        name: "EPITHALON",
        displayName: "EPITHALON",
        slug: "epithalon",
        variations: [
          { strength: "10mg", moq: 10, price: 30 },
          { strength: "50mg", moq: 10, price: 40 },
        ],
        description: "Epithalon (Epitalon) is a synthetic peptide associated with pineal-derived peptide research traditions and aging biology. It is discussed in literature exploring long-term cellular function, circadian-linked neuroendocrine regulation, and telomere-associated hypotheses in aging frameworks. Research interest often centers on how peptide signals might influence aging-related molecular programs, with results varying by model and study lineage.",
        scientificPurpose: "Designed to study aging-related signaling, circadian/neuroendocrine regulation, and possible telomere-length-associated pathways in preclinical research settings.",
        studiesFindings: "Explored for effects on telomere-related biology in some experimental settings (results context dependent). Modulates circadian-related neuroendocrine outputs in select models. Used in life-extension and aging-associated research frameworks.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=Epithalon+epitalon+telomere+aging"
      },
      {
        name: "AOD-9604",
        displayName: "AOD-9604",
        slug: "aod",
        variations: [
          { strength: "5mg", moq: 10, price: 55 },
        ],
        description: "AOD-9604 is a synthetic peptide fragment derived from the C-terminal region of human growth hormone (hGH 177–191), engineered to retain lipolytic signaling activity while lacking the growth-promoting and diabetogenic effects of intact GH. Mechanistically, AOD-9604 activates beta-3-adrenergic receptor signaling pathways in adipose tissue, stimulates lipolysis, and inhibits lipogenesis without influencing IGF-1 levels or glucose homeostasis. It is studied in metabolic research frameworks exploring targeted fat-loss signaling, obesity interventions, and cartilage repair biology.",
        scientificPurpose: "Designed to study GH-derived lipolytic signaling without full-length GH effects, adipose tissue metabolism, beta-3-adrenergic pathway activation, lipogenesis inhibition, and cartilage repair applications.",
        studiesFindings: "Stimulates lipolytic signaling in adipose tissue through beta-3-adrenergic activation (context dependent). Inhibits lipogenesis and reduces fat accumulation in experimental models. Does not significantly alter IGF-1 levels or glucose metabolism (unlike intact GH). Supports fat-loss endpoints in metabolic research contexts (study dependent). Demonstrates cartilage repair and chondroprotective signaling in osteoarthritis models. Lacks significant growth-promoting or diabetogenic effects. Provides a tool for studying targeted GH-fragment metabolic biology. Enables investigation of fat-metabolism interventions without systemic GH effects.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=AOD-9604+growth+hormone+fragment+lipolysis"
      },
      {
        name: "BPC-157 + TB500",
        displayName: "BPC-157 + TB500",
        slug: "bpc-157-tb500",
        variations: [
          { strength: "10mg (5mg+5mg)", moq: 10, price: 60 },
          { strength: "20mg (10mg+10mg)", moq: 10, price: 90 },
        ],
        description: "The BPC-157 + TB500 combo is a bundled research concept combining two peptides frequently discussed in regenerative and tissue remodeling research. BPC-157 is a stable pentadecapeptide derived from a gastric protein fragment and is studied for multi-pathway cytoprotective and repair-associated signaling (often framed around angiogenesis, inflammatory phase modulation, and tissue recovery kinetics). TB500 is commonly presented as thymosin beta-4–related material; thymosin beta-4 is an actin-binding peptide that regulates cytoskeletal dynamics and is studied for its role in cell migration, wound closure programs, and angiogenesis-associated signaling. Together, the combo is used as a systems-style research framework to examine how vascular growth, migration, and repair signaling can be co-modulated during tissue recovery.",
        scientificPurpose: "Designed to study coordinated tissue repair biology, including angiogenesis signaling, cytoskeletal/migration programs, inflammatory signaling modulation, and extracellular remodeling dynamics in controlled injury/repair models.",
        studiesFindings: "BPC-157 research reports enhanced repair signaling and angiogenesis markers in preclinical models (study dependent). TB500/thymosin beta-4 literature supports increased cell migration and wound closure signaling pathways. Combined framework supports modeling of multi-input repair programs (migration + vascular signaling). Improves tissue remodeling endpoints in select musculoskeletal/soft tissue experimental settings (context dependent). Supports investigation of inflammatory phase regulation alongside repair and regeneration signaling (study dependent). Enables mechanistic comparison of \"cytoprotection-driven repair\" (BPC-157) vs \"migration/actin-driven repair\" (TB500) pathways.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=BPC-157+tissue+repair+angiogenesis"
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
          { strength: "5mg", moq: 10, price: 20 },
          { strength: "10mg", moq: 10, price: 25 },
        ],
        description: "Semax is a synthetic heptapeptide derived from the N-terminal fragment of adrenocorticotropic hormone (ACTH(4–10)) with an added Pro-Gly-Pro C-terminal sequence engineered for enhanced stability and CNS activity. It is studied as a nootropic and neuroprotective peptide that modulates neurotrophic factor expression (particularly BDNF and NGF), influences monoaminergic neurotransmission, and affects cognitive-associated signaling networks. Mechanistically, Semax research explores its effects on neuroplasticity, synaptic signaling, stress-response neurobiology, and neuronal survival pathways. It is commonly positioned in research frameworks examining peptide-based cognitive enhancement and neuroprotection strategies.",
        scientificPurpose: "Designed to study neurotrophic factor modulation (BDNF, NGF), cognitive performance and memory-associated endpoints, stress-response neurobiology, neuroplasticity signaling, monoaminergic system interactions, and neuroprotective mechanisms in experimental CNS models.",
        studiesFindings: "Increases BDNF and NGF expression in brain tissue models (context dependent). Modulates dopaminergic and serotonergic neurotransmission signaling. Improves cognitive performance and memory endpoints in preclinical research settings (study dependent). Demonstrates neuroprotective signaling patterns in ischemia and neurodegenerative models. Influences stress-response neurochemistry and HPA axis modulation. Supports attention and learning-associated behavioral endpoints in animal studies. Enhances neuroplasticity markers and synaptic signaling frameworks. Provides a reference peptide for studying ACTH-derived nootropic mechanisms. Used in research exploring peptide-based interventions for cognitive and neurodegenerative conditions.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=Semax+ACTH+neuroprotective+peptide"
      },
      {
        name: "SELANK",
        displayName: "SELANK",
        slug: "selank",
        variations: [
          { strength: "5mg", moq: 10, price: 25 },
          { strength: "10mg", moq: 10, price: 40 },
        ],
        description: "Selank is a synthetic heptapeptide analogue of the immunomodulatory peptide tuftsin, developed in Russian pharmacology research as a neuroactive compound with anxiolytic and nootropic properties. It is engineered with enhanced stability for CNS activity and studied for its effects on GABAergic neurotransmission, monoamine system modulation, and stress-response signaling networks. Mechanistically, Selank influences gene expression patterns related to neurotransmission, neuroplasticity, and immune-neuroendocrine communication. Research interest centers on its dual anxiolytic-nootropic profile, making it a tool for studying peptide-based interventions targeting anxiety, cognitive function, and stress adaptation.",
        scientificPurpose: "Designed to study anxiolytic neuropeptide mechanisms, GABAergic system modulation, serotonergic and dopaminergic neurotransmission, stress adaptation signaling, cognitive and memory-associated endpoints, and immune-neuroendocrine pathway interactions in experimental contexts.",
        studiesFindings: "Reduces anxiety-related behavioral endpoints in preclinical stress models (context dependent). Modulates GABAergic neurotransmission and enhances inhibitory signaling tone. Influences serotonin and dopamine metabolism in CNS models (study dependent). Supports cognitive performance and memory consolidation endpoints in animal research. Affects gene expression patterns related to neuroplasticity and synaptic function. Demonstrates immunomodulatory signaling through tuftsin-related pathways. Supports stress adaptation and HPA axis regulation in experimental frameworks. Enhances attention and reduces stress-induced cognitive impairment in some models. Provides a tool for studying tuftsin-derived neuropeptide pharmacology and CNS signaling.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=Selank+tuftsin+peptide"
      },
      {
        name: "DSIP",
        displayName: "DSIP",
        slug: "dsip",
        variations: [
          { strength: "5mg", moq: 10, price: 25 },
          { strength: "15mg", moq: 10, price: 65 },
        ],
        description: "DSIP (Delta Sleep-Inducing Peptide) is a nonapeptide first isolated from rabbit brain tissue and studied for its effects on sleep physiology, stress-response neurobiology, and neuroendocrine regulation. Mechanistically, DSIP interacts with multiple receptor systems and is reported to modulate sleep architecture, cortisol/stress hormone dynamics, and pain perception pathways. It is studied in chronobiology research for effects on circadian rhythm regulation and sleep quality endpoints. Research interest also extends to its potential antioxidant and cytoprotective signaling properties, as well as interactions with opioid and somatostatin systems.",
        scientificPurpose: "Designed to study sleep regulation biology and architecture, stress adaptation and HPA axis modulation, neuroendocrine responses associated with sleep states, circadian rhythm signaling, analgesic pathway interactions, and peptide-mediated sleep–stress coupling mechanisms.",
        studiesFindings: "Influences sleep architecture and promotes slow-wave sleep patterns in experimental models (context dependent). Modulates stress-response signaling and reduces cortisol/corticosterone levels in some studies. Demonstrates analgesic and anti-nociceptive signaling in pain research models (study dependent). Supports circadian rhythm regulation and sleep-wake cycle normalization. Exhibits antioxidant and cytoprotective properties in select cellular models. Interacts with opioid receptor systems influencing pain and stress signaling. Modulates body temperature regulation associated with sleep states. Provides a tool for studying peptide regulation of sleep architecture and neuroendocrine coupling. Used in research exploring sleep disorder mechanisms and stress-related physiology.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=delta+sleep+inducing+peptide+DSIP"
      },
      {
        name: "PINEALON",
        displayName: "PINEALON",
        slug: "pinealon",
        variations: [
          { strength: "5mg", moq: 10, price: 30 },
          { strength: "10mg", moq: 10, price: 40 },
          { strength: "20mg", moq: 10, price: 55 },
        ],
        description: "Pinealon is a short synthetic tripeptide (commonly referenced as Glu-Asp-Arg, EDR) studied in neurobiology and aging-related research traditions. It is discussed as a peptide that may influence neuronal resilience, oxidative stress resistance, and cognitive-performance-associated endpoints in experimental contexts. Research often emphasizes its role as a minimal peptide motif capable of shifting stress-response signaling and functional neurophysiology readouts.",
        scientificPurpose: "Designed to study neuroprotective signaling, oxidative stress adaptation in CNS models, peptide-driven modulation of cognitive endpoints, and neuronal resilience mechanisms.",
        studiesFindings: "Improves cognitive/behavioral endpoints in select experimental models (study dependent). Increases neuronal resistance to oxidative stress in preclinical systems (context dependent). Modulates stress-response signaling markers in CNS-related experimental frameworks. Influences neurochemical signaling profiles in some models. Provides a minimal peptide tool for studying neuroprotection and stress resilience hypotheses.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=Pinealon+EDR+peptide+neuroprotective"
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
          { strength: "5mg", moq: 10, price: 50 },
          { strength: "10mg", moq: 10, price: 55 },
        ],
        description: "Tesamorelin is a synthetic analogue of growth hormone–releasing hormone (GHRH) engineered to stimulate endogenous pulsatile growth hormone secretion from the pituitary. Its biology is used to study downstream GH/IGF-1 axis signaling and adipose distribution effects.",
        scientificPurpose: "Designed to study GHRH receptor activation, GH pulsatility, IGF-1 axis modulation, and visceral adipose regulation endpoints.",
        studiesFindings: "Increases endogenous GH secretion patterns (pulsatile). Elevates IGF-1 axis signaling (context dependent). Reduces visceral adipose tissue endpoints in clinical contexts. Improves some metabolic risk markers linked to visceral fat (study dependent). Enables mechanistic study of GH-axis modulation without exogenous GH.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=tesamorelin+GHRH+growth+hormone+release"
      },
      {
        name: "CJC-1295 WITHOUT DAC + IPA",
        displayName: "CJC-1295 WITHOUT DAC + IPA",
        slug: "cjc-1295-ipa",
        variations: [
          { strength: "10mg (5mg + 5mg)", moq: 10, price: 50 },
        ],
        description: "CJC-1295 (without DAC) is a GHRH/GRF analogue designed to stimulate pituitary GH release via GHRH receptor activation, typically with shorter activity than DAC-linked variants. \"IPA\" commonly refers to ipamorelin, a GHSR (ghrelin receptor) agonist; the combination is used to probe complementary GH-axis stimulation routes.",
        scientificPurpose: "Designed to study coordinated GH-axis stimulation by combining GHRH receptor activation (CJC) with ghrelin receptor agonism (ipamorelin) to evaluate GH pulsatility and downstream IGF-1 signaling.",
        studiesFindings: "Increases GH release signaling via GHRH receptor activation (CJC component). Stimulates GH secretion via GHSR activation (ipamorelin component). Supports investigation of pulsatile GH biology and endocrine dynamics. Used to study GH/IGF-1 axis downstream transcriptional and metabolic effects. Provides a model for dual-pathway GH-axis stimulation research.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=CJC-1295+ipamorelin+growth+hormone+secretagogue"
      },
      {
        name: "CJC-1295 NO DAC",
        displayName: "CJC-1295 NO DAC",
        slug: "cjc-1295-no-dac",
        variations: [
          { strength: "5mg", moq: 10, price: 40 },
          { strength: "10mg", moq: 10, price: 55 },
        ],
        description: "CJC-1295 No DAC is a GHRH/GRF analogue engineered to activate the GHRH receptor and stimulate pituitary GH release, generally with shorter duration than DAC-conjugated variants. It is used to study GH pulsatility and downstream IGF-axis signaling responses.",
        scientificPurpose: "Designed to study endogenous GH stimulation via GHRH receptor activation and downstream endocrine/metabolic signaling patterns.",
        studiesFindings: "Stimulates GH release through GHRH receptor signaling. Supports pulsatile GH dynamics research frameworks. Influences downstream IGF-1 axis signaling (context dependent). Used for mapping endocrine regulation and feedback mechanisms. Provides a tool for GH-axis exploration without exogenous GH administration.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=CJC-1295+no+DAC+GHRH"
      },
      {
        name: "SERMORELIN",
        displayName: "SERMORELIN",
        slug: "sermorelin",
        variations: [
          { strength: "5mg", moq: 10, price: 40 },
          { strength: "10mg", moq: 10, price: 50 },
        ],
        description: "Sermorelin is a GHRH (growth hormone–releasing hormone) analogue (GRF 1–29) designed to stimulate endogenous pituitary growth hormone release through GHRH receptor activation. Research uses sermorelin as a tool compound to examine GH-axis pulsatility, endocrine feedback control, and downstream GH/IGF-axis signaling outcomes. It is best understood as a physiologic stimulation approach to GH-axis study rather than direct GH replacement.",
        scientificPurpose: "Designed to study pituitary GH release mechanisms via GHRH receptor activation, endocrine pulsatility, and downstream GH/IGF-axis signaling and feedback biology.",
        studiesFindings: "Stimulates endogenous GH secretion via GHRH receptor signaling (context dependent). Supports evaluation of pulsatile GH dynamics and endocrine rhythm biology. Influences downstream IGF-axis signaling endpoints in controlled contexts (study dependent). Enables mechanistic study of endocrine feedback loops that regulate GH release. Provides a framework for GH-axis modulation studies without exogenous GH administration.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=sermorelin+GHRH+growth+hormone"
      },
      {
        name: "IPAMORELIN",
        displayName: "IPAMORELIN",
        slug: "ipamorelin",
        variations: [
          { strength: "5mg", moq: 1, price: 40 },
          { strength: "10mg", moq: 1, price: 45 },
        ],
        description: "Ipamorelin is a synthetic growth hormone secretagogue designed to activate the ghrelin receptor (GHSR-1a), stimulating pituitary GH release. It is frequently used as a mechanistic probe of ghrelin/GHSR biology and GH-axis modulation.",
        scientificPurpose: "Designed to study GHSR-mediated GH release, endocrine pulsatility, and downstream GH/IGF-axis signaling dynamics.",
        studiesFindings: "Stimulates GH secretion via GHSR activation (context dependent). Supports investigation of pituitary hormone release mechanisms. Enables study of pulsatile endocrine signaling patterns. Provides a tool for mapping ghrelin-receptor downstream signaling pathways. Used in GH-axis research designs evaluating metabolic and anabolic signaling endpoints.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=ipamorelin+GHSR+growth+hormone"
      },
      {
        name: "HEXARELIN",
        displayName: "HEXARELIN",
        slug: "hexarelin",
        variations: [
          { strength: "5mg", moq: 10, price: 30 },
        ],
        description: "Hexarelin is a synthetic growth hormone secretagogue peptide that activates the ghrelin receptor (GHSR-1a) to stimulate pituitary GH release. It is studied for its potent GH-releasing effects and potential cardioprotective signaling properties.",
        scientificPurpose: "Designed to study GHSR-mediated GH release, endocrine pulsatility, and cardioprotective signaling pathways.",
        studiesFindings: "Stimulates robust GH secretion via GHSR activation. Demonstrates cardioprotective signaling in some experimental models. Supports investigation of pituitary hormone dynamics. Used in GH-axis and cardiovascular research frameworks.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=hexarelin+GHSR+growth+hormone"
      },
      {
        name: "GHRP-6",
        displayName: "GHRP-6",
        slug: "ghrp-6",
        variations: [
          { strength: "5mg", moq: 10, price: 25 },
          { strength: "10mg", moq: 10, price: 40 },
        ],
        description: "GHRP-6 (Growth Hormone Releasing Peptide-6) is a synthetic hexapeptide that stimulates growth hormone release through ghrelin receptor (GHSR) activation. It is one of the original growth hormone secretagogues used in endocrine research.",
        scientificPurpose: "Designed to study GHSR-mediated GH release, appetite regulation, and downstream IGF-1 axis signaling.",
        studiesFindings: "Stimulates GH secretion via GHSR activation. Increases appetite through ghrelin-like signaling. Supports investigation of pituitary hormone dynamics. Influences IGF-1 axis signaling endpoints. Used in GH-axis research and appetite regulation studies.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=GHRP-6+growth+hormone+releasing+peptide"
      },
      {
        name: "IGF-1 LR3",
        displayName: "IGF-1 LR3",
        slug: "igf-1-lr3",
        variations: [
          { strength: "0.1mg", moq: 10, price: 35 },
          { strength: "1mg", moq: 10, price: 60 },
        ],
        description: "IGF-1 LR3 (Long R3 Insulin-like Growth Factor-1) is a modified form of IGF-1 with an extended half-life due to reduced binding to IGF-binding proteins. It is used to study IGF-1 receptor signaling, anabolic pathways, and cell proliferation.",
        scientificPurpose: "Designed to study IGF-1 receptor signaling, anabolic biology, cell proliferation, and metabolic regulation with extended bioavailability.",
        studiesFindings: "Activates IGF-1 receptor signaling with prolonged activity. Supports anabolic signaling in muscle and other tissues. Influences cell proliferation and survival pathways. Used in growth biology and metabolic research frameworks.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=IGF-1+LR3+insulin-like+growth+factor"
      },
      {
        name: "HGH SOMATROPIN",
        displayName: "HGH SOMATROPIN (191AA)",
        slug: "hgh-somatropin",
        variations: [
          { strength: "10IU", moq: 1, price: 25 },
          { strength: "15IU", moq: 1, price: 30 },
          { strength: "24IU", moq: 1, price: 40 },
        ],
        description: "HGH Somatropin (191AA) is recombinant human growth hormone identical to the endogenous 191-amino acid pituitary hormone. It is used in research to study GH-axis signaling, metabolic regulation, and anabolic biology.",
        scientificPurpose: "Designed to study direct GH receptor signaling, IGF-1 axis activation, metabolic effects, and anabolic biology.",
        studiesFindings: "Activates GH receptor signaling and IGF-1 axis. Influences metabolic regulation and body composition. Supports anabolic signaling in multiple tissues. Used in growth biology and metabolic research frameworks.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=somatropin+human+growth+hormone+191"
      },
      {
        name: "HCG",
        displayName: "HCG",
        slug: "hcg",
        variations: [
          { strength: "5000IU", moq: 10, price: 30 },
          { strength: "10000IU", moq: 10, price: 70 },
        ],
        description: "HCG (Human Chorionic Gonadotropin) is a glycoprotein hormone that mimics luteinizing hormone (LH) activity. It is used in reproductive research, testosterone regulation studies, and fertility applications.",
        scientificPurpose: "Designed to study LH receptor signaling, testosterone production, ovulation induction, and reproductive biology.",
        studiesFindings: "Activates LH receptor signaling in gonadal tissues. Stimulates testosterone production in testicular tissue. Supports ovulation induction research. Used in fertility and reproductive endocrinology studies.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=HCG+human+chorionic+gonadotropin"
      },
      {
        name: "FOLLISTATIN",
        displayName: "FOLLISTATIN",
        slug: "follistatin",
        variations: [
          { strength: "1mg", moq: 10, price10: 0, price20: 0, price30: 0 },
        ],
        description: "Follistatin is an endogenous glycoprotein that binds and neutralizes activin, myostatin, and other TGF-β superfamily members. It is studied for its role in muscle growth regulation, reproductive biology, and metabolic signaling.",
        scientificPurpose: "Designed to study myostatin inhibition, muscle growth signaling, TGF-β pathway modulation, and reproductive biology.",
        studiesFindings: "Neutralizes myostatin and activin signaling. Promotes muscle growth and strength endpoints in preclinical models. Modulates TGF-β superfamily signaling. Used in muscle biology and metabolic research frameworks.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=follistatin+myostatin+muscle"
      },
      {
        name: "KISSPEPTIN-10",
        displayName: "KISSPEPTIN-10",
        slug: "kisspeptin-10",
        variations: [
          { strength: "5mg", moq: 10, price: 40 },
          { strength: "10mg", moq: 10, price: 65 },
        ],
        description: "Kisspeptin-10 is a truncated form of the kisspeptin neuropeptide that activates the GPR54/KISS1R receptor, playing a critical role in regulating the hypothalamic-pituitary-gonadal axis and puberty onset. It is studied for reproductive endocrine signaling.",
        scientificPurpose: "Designed to study KISS1R signaling, GnRH neuron activation, reproductive axis regulation, and puberty/fertility biology.",
        studiesFindings: "Activates KISS1R signaling and stimulates GnRH release. Regulates LH and FSH secretion through hypothalamic signaling. Influences puberty onset and reproductive function. Used in reproductive endocrinology research.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=kisspeptin+KISS1R+reproductive"
      },
    ]
  },
  {
    name: "Aesthetic / Skin",
    slug: "aesthetic-skin",
    products: [
      {
        name: "MT-2",
        displayName: "MT-2 (Melanotan 2)",
        slug: "mt-2",
        variations: [
          { strength: "10mg", moq: 10, price: 35 },
        ],
        description: "MT-2 (Melanotan 2) is a synthetic melanocortin peptide analogue that activates MC1R and MC4R receptors, studied for effects on melanogenesis, tanning response, and appetite/libido-associated signaling pathways.",
        scientificPurpose: "Designed to study melanocortin receptor signaling, melanogenesis, photoprotection, and MC4R-mediated appetite/sexual function pathways.",
        studiesFindings: "Activates MC1R signaling and promotes melanogenesis. Enhances tanning response to UV exposure. Influences appetite and libido through MC4R activation. Used in dermatology and neuroendocrine research.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=melanotan+2+melanocortin"
      },
      {
        name: "MT-1",
        displayName: "MT-1 (Afamelanotide)",
        slug: "mt-1",
        variations: [
          { strength: "10mg", moq: 10, price10: 0, price20: 0, price30: 0 },
        ],
        description: "MT-1 (Afamelanotide) is a synthetic α-MSH analogue that selectively activates the MC1R receptor, studied for melanogenesis, photoprotection, and erythropoietic protoporphyria treatment applications.",
        scientificPurpose: "Designed to study MC1R-selective signaling, melanogenesis, photoprotection mechanisms, and clinical applications in photosensitivity disorders.",
        studiesFindings: "Selectively activates MC1R signaling. Promotes melanogenesis and skin pigmentation. Provides photoprotective effects. Used in photosensitivity disorder research and dermatology.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=afamelanotide+MC1R+melanocortin"
      },
      {
        name: "PT-141",
        displayName: "PT-141",
        slug: "pt-141",
        variations: [
          { strength: "10mg", moq: 10, price: 40 },
        ],
        description: "PT-141 (bremelanotide) is a melanocortin peptide that activates MC3R and MC4R receptors in the CNS, studied for effects on sexual function and libido through central nervous system signaling pathways.",
        scientificPurpose: "Designed to study MC3R/MC4R-mediated CNS signaling, sexual arousal pathways, and libido-associated neuroendocrine mechanisms.",
        studiesFindings: "Activates MC3R/MC4R signaling in the CNS. Enhances sexual arousal and function endpoints. Works through central rather than peripheral mechanisms. Used in sexual dysfunction and neuroendocrine research.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=bremelanotide+PT-141+melanocortin"
      },
      {
        name: "GHK-CU",
        displayName: "GHK-CU",
        slug: "ghk-cu",
        variations: [
          { strength: "50mg", moq: 10, price: 35 },
          { strength: "100mg", moq: 10, price: 60 },
        ],
        description: "GHK-Cu (copper peptide) is a naturally occurring tripeptide-copper complex studied for its roles in wound healing, collagen synthesis, anti-inflammatory signaling, and skin regeneration biology.",
        scientificPurpose: "Designed to study wound healing mechanisms, collagen synthesis, anti-inflammatory signaling, and skin/tissue regeneration pathways.",
        studiesFindings: "Promotes collagen and elastin synthesis. Accelerates wound healing endpoints. Demonstrates anti-inflammatory signaling. Supports skin regeneration and tissue remodeling. Used in dermatology and regenerative research.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=GHK-Cu+copper+peptide+wound+healing"
      },
      {
        name: "SNAP-8",
        displayName: "SNAP-8",
        slug: "snap-8",
        variations: [
          { strength: "10mg", moq: 10, price: 50 },
        ],
        description: "SNAP-8 (acetyl octapeptide-3) is a peptide that modulates SNARE complex formation, studied for its effects on neuromuscular signaling and wrinkle reduction in cosmetic research applications.",
        scientificPurpose: "Designed to study SNARE complex modulation, neuromuscular junction signaling, and cosmetic anti-wrinkle mechanisms.",
        studiesFindings: "Modulates SNARE complex assembly and neurotransmitter release. Reduces muscle contraction signaling. Demonstrates wrinkle-reduction effects in cosmetic studies. Used in anti-aging and cosmetic research.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=SNAP-8+acetyl+octapeptide+wrinkle"
      },
      {
        name: "KPV",
        displayName: "KPV",
        slug: "kpv",
        variations: [
          { strength: "5mg", moq: 10, price: 40 },
          { strength: "10mg", moq: 10, price: 50 },
        ],
        description: "KPV is a tripeptide derived from α-MSH with potent anti-inflammatory properties, studied for its effects on inflammatory signaling, gut health, and skin conditions without melanogenic activity.",
        scientificPurpose: "Designed to study anti-inflammatory mechanisms, NF-κB pathway modulation, gut inflammation, and skin inflammatory conditions.",
        studiesFindings: "Demonstrates potent anti-inflammatory signaling. Modulates NF-κB pathway activity. Supports gut barrier function and reduces inflammatory markers. Used in inflammatory disease and dermatology research.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=KPV+alpha+MSH+anti-inflammatory"
      },
      {
        name: "LL-37",
        displayName: "LL-37",
        slug: "ll-37",
        variations: [
          { strength: "5mg", moq: 10, price: 35 },
        ],
        description: "LL-37 is an endogenous human cathelicidin antimicrobial peptide with broad-spectrum antimicrobial activity and immunomodulatory functions. It is studied for innate immune defense, wound healing, and inflammatory regulation.",
        scientificPurpose: "Designed to study antimicrobial defense mechanisms, innate immunity, wound healing, and immunomodulatory signaling.",
        studiesFindings: "Demonstrates broad-spectrum antimicrobial activity. Modulates innate immune responses. Promotes wound healing and tissue repair. Influences inflammatory signaling pathways. Used in infectious disease and immunology research.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=LL-37+cathelicidin+antimicrobial+peptide"
      },
      {
        name: "LEMON BOTTLE",
        displayName: "LEMON BOTTLE",
        slug: "lemon-bottle",
        variations: [
          { strength: "10ml", moq: 10, price: 30 },
        ],
        description: "Lemon Bottle is a lipolytic solution containing multiple active ingredients designed to target adipose tissue through various mechanisms. It is studied in cosmetic and body contouring research applications.",
        scientificPurpose: "Designed to study lipolytic mechanisms, adipose tissue targeting, and body contouring applications.",
        studiesFindings: "Targets adipose tissue through multiple mechanisms. Supports fat reduction in cosmetic applications. Used in body contouring and aesthetic research.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=lipolytic+injection+fat+reduction"
      },
      {
        name: "L-CARNITINE",
        displayName: "L-CARNITINE",
        slug: "l-carnitine",
        variations: [
          { strength: "10ml", moq: 10, price: 20 },
        ],
        description: "L-Carnitine is an amino acid derivative essential for fatty acid transport into mitochondria for beta-oxidation. It is studied for metabolic function, exercise performance, and lipid metabolism.",
        scientificPurpose: "Designed to study fatty acid transport, mitochondrial function, energy metabolism, and lipid oxidation.",
        studiesFindings: "Facilitates fatty acid transport into mitochondria. Supports energy metabolism and lipid oxidation. Influences exercise performance endpoints. Used in metabolic and exercise physiology research.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=L-carnitine+fatty+acid+transport+mitochondria"
      },
      {
        name: "GLUTATHIONE",
        displayName: "GLUTATHIONE",
        slug: "glutathione",
        variations: [
          { strength: "1500mg", moq: 10, price: 70 },
        ],
        description: "Glutathione is the body's master antioxidant, a tripeptide that plays critical roles in detoxification, immune function, and cellular protection. It is studied for antioxidant defense, skin lightening, and detoxification pathways.",
        scientificPurpose: "Designed to study antioxidant defense mechanisms, detoxification pathways, immune function, and melanogenesis inhibition.",
        studiesFindings: "Provides potent antioxidant protection. Supports detoxification enzyme systems. Modulates immune cell function. Inhibits melanogenesis in skin lightening applications. Used in oxidative stress and dermatology research.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=glutathione+antioxidant+detoxification"
      },
      {
        name: "NAD+",
        displayName: "NAD+",
        slug: "nad",
        variations: [
          { strength: "100mg", moq: 1, price: 60 },
          { strength: "500mg", moq: 1, price: 70 },
          { strength: "1000mg", moq: 1, price: 95 },
        ],
        description: "NAD+ (Nicotinamide Adenine Dinucleotide) is an essential coenzyme in cellular metabolism, studied for its roles in energy production, DNA repair, sirtuin activation, and aging-related biology.",
        scientificPurpose: "Designed to study cellular energetics, sirtuin activation, DNA repair mechanisms, and aging/longevity pathways.",
        studiesFindings: "Essential for cellular energy metabolism. Activates sirtuin enzymes and longevity pathways. Supports DNA repair mechanisms. Influences mitochondrial function. Used in aging, metabolism, and neurodegeneration research.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=NAD+nicotinamide+adenine+dinucleotide+aging"
      },
      {
        name: "5-AMINO-1MQ",
        displayName: "5-AMINO-1MQ",
        slug: "5-amino-1mq",
        variations: [
          { strength: "5mg", moq: 10, price: 45 },
          { strength: "50mg", moq: 10, price: 165 },
        ],
        description: "5-Amino-1MQ is a small molecule inhibitor of NNMT (nicotinamide N-methyltransferase), studied for its effects on metabolism, adipose tissue function, and NAD+ levels in obesity research.",
        scientificPurpose: "Designed to study NNMT inhibition, NAD+ metabolism, adipose tissue function, and metabolic regulation.",
        studiesFindings: "Inhibits NNMT enzyme activity. Increases NAD+ levels in tissues. Modulates adipose tissue metabolism. Supports weight loss endpoints in preclinical models. Used in obesity and metabolic research.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=5-amino-1MQ+NNMT+inhibitor"
      },
      {
        name: "MOTS-C",
        displayName: "MOTS-C",
        slug: "mots-c",
        variations: [
          { strength: "10mg", moq: 10, price: 40 },
          { strength: "40mg", moq: 10, price: 90 },
        ],
        description: "MOTS-c is a mitochondrial-derived peptide encoded within the 12S rRNA gene, studied for its roles in metabolic regulation, exercise mimetic effects, and insulin sensitivity.",
        scientificPurpose: "Designed to study mitochondrial-derived peptide signaling, metabolic regulation, insulin sensitivity, and exercise-mimetic pathways.",
        studiesFindings: "Improves insulin sensitivity and glucose metabolism. Demonstrates exercise-mimetic effects. Modulates AMPK pathway signaling. Influences mitochondrial function and energy homeostasis. Used in metabolic and aging research.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=MOTS-c+mitochondrial+peptide+metabolism"
      },
      {
        name: "SLU-PP-322",
        displayName: "SLU-PP-322",
        slug: "slu-pp-322",
        variations: [
          { strength: "5mg", moq: 10, price: 45 },
        ],
        description: "SLU-PP-322 is a research peptide studied for its potential metabolic and regulatory effects. It is used in investigational research frameworks exploring peptide-based interventions.",
        scientificPurpose: "Designed to study peptide-mediated metabolic signaling and regulatory pathways in experimental contexts.",
        studiesFindings: "Investigated for metabolic signaling effects. Used in exploratory peptide research frameworks. Provides a tool for studying novel peptide biology.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=peptide+metabolic+regulation"
      },
      {
        name: "VIP",
        displayName: "VIP",
        slug: "vip-5mg",
        variations: [
          { strength: "5mg", moq: 10, price: 40 },
          { strength: "10mg", moq: 10, price: 60 },
        ],
        description: "VIP (Vasoactive Intestinal Peptide) is a neuropeptide with diverse physiological effects including vasodilation, immune modulation, and neuroprotection. It is studied in immunology, neuroscience, and inflammatory disease research.",
        scientificPurpose: "Designed to study VIP receptor signaling, vasodilation, immune modulation, neuroprotection, and anti-inflammatory mechanisms.",
        studiesFindings: "Activates VPAC1 and VPAC2 receptor signaling. Promotes vasodilation and blood flow. Demonstrates immunomodulatory and anti-inflammatory effects. Supports neuroprotective signaling. Used in autoimmune, inflammatory, and neuroscience research.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=vasoactive+intestinal+peptide+VIP"
      },
      {
        name: "GLOW STACK",
        displayName: "GLOW STACK",
        slug: "glow-stack",
        variations: [
          { strength: "70mg (BPC10mg+GHK-CU50mg+TB10mg)", moq: 10, price: 115 },
        ],
        description: "The Glow Stack combines BPC-157, GHK-Cu, and TB500 in a single formulation for studying coordinated tissue repair, skin regeneration, and aesthetic improvement applications.",
        scientificPurpose: "Designed to study multi-peptide synergy for tissue repair, collagen synthesis, wound healing, and skin regeneration.",
        studiesFindings: "Combines tissue repair signaling from multiple pathways. Supports collagen and elastin synthesis. Enhances wound healing and skin regeneration. Used in aesthetic and regenerative research.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=BPC-157+GHK-Cu+tissue+repair"
      },
      {
        name: "KLOW STACK",
        displayName: "KLOW STACK",
        slug: "klow-stack",
        variations: [
          { strength: "80mg (GHK-CU50mg+TB10mg+BPC10mg+KPV10mg)", moq: 10, price: 65 },
        ],
        description: "The Klow Stack combines GHK-Cu, TB500, BPC-157, and KPV in a single formulation for studying coordinated tissue repair, anti-inflammatory signaling, and aesthetic applications.",
        scientificPurpose: "Designed to study multi-peptide synergy for tissue repair, anti-inflammatory effects, and skin regeneration.",
        studiesFindings: "Combines tissue repair with anti-inflammatory signaling. Supports collagen synthesis and wound healing. Modulates inflammatory pathways. Used in aesthetic and regenerative research.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=KPV+anti-inflammatory+peptide"
      },
    ]
  },
  {
    name: "Supplies",
    slug: "supplies",
    products: [
      {
        name: "BAC WATER",
        displayName: "BAC WATER (Bacteriostatic Water)",
        slug: "bac-water",
        variations: [
          { strength: "3ml", moq: 1, price: 5 },
          { strength: "10ml", moq: 1, price: 10 },
        ],
        description: "Bacteriostatic Water is sterile water containing 0.9% benzyl alcohol as a bacteriostatic preservative. It is used for reconstituting lyophilized peptides and medications in research and clinical applications.",
        scientificPurpose: "Used as a diluent for reconstituting lyophilized peptides, proteins, and other research compounds requiring sterile, preserved solutions.",
        studiesFindings: "Provides sterile reconstitution medium with preservative. Maintains solution sterility for multiple withdrawals. Standard diluent in peptide research applications.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=bacteriostatic+water+reconstitution"
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

export const getProductsByCategory = (categorySlug: string): Product[] => {
  const category = productCategories.find(c => c.slug === categorySlug);
  return category ? category.products : [];
};

export const getCategoryByProductSlug = (slug: string): ProductCategory | undefined => {
  return productCategories.find(c => c.products.some(p => p.slug === slug));
};

export const getRelatedProducts = (slug: string, limit = 3): Product[] => {
  const category = getCategoryByProductSlug(slug);
  if (!category) return [];
  return category.products.filter(p => p.slug !== slug).slice(0, limit);
};

export const searchProducts = (query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase();
  return getAllProducts().filter(product =>
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.displayName.toLowerCase().includes(lowercaseQuery)
  );
};
