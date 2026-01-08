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
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=semaglutide+GLP-1+receptor+mechanism"
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
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=tirzepatide+GIP+GLP-1+dual+agonist"
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
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=retatrutide+GLP-1+GIP+glucagon+triple+agonist"
      },
      {
        name: "CAGRILINTIDE",
        displayName: "CAGRILINTIDE",
        slug: "cagrilintide",
        variations: [
          { strength: "5mg", moq: 10 },
          { strength: "10mg", moq: 10 },
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
          { strength: "10mg", moq: 10 },
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
          { strength: "10mg", moq: 10 },
        ],
        description: "Survodutide is an investigational dual agonist designed to activate both the GLP-1 receptor and the glucagon receptor, integrating incretin-driven satiety/glycemic signaling with glucagon-linked energy expenditure and lipid utilization programs. In research framing, it is a representative \"poly-agonist metabolic peptide\" used to study how coordinated receptor engagement can shift body weight outcomes and metabolic biomarkers beyond incretin-only approaches.",
        scientificPurpose: "Designed to study GLP-1R/GCGR dual agonism for appetite reduction, energy expenditure signaling, lipid oxidation, and metabolic disease endpoints in obesity-focused research.",
        studiesFindings: "Produces weight reduction endpoints in investigational metabolic programs (study dependent). Suppresses appetite and reduces energy intake via GLP-1 pathway activity (context dependent). Enhances energy expenditure and lipid utilization signaling through glucagon-receptor components (context dependent). Improves glycemic biomarkers via incretin-associated signaling. Improves cardiometabolic biomarkers in obesity/metabolic disease research contexts (study dependent). Provides a tool framework for studying receptor-balanced polyagonism and weight-loss magnitude.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=survodutide+GLP-1+glucagon+dual+agonist"
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
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=glucagon-like+peptide-1+GLP-1+receptor"
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
          { strength: "5mg", moq: 10 },
          { strength: "10mg", moq: 10 },
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
          { strength: "5mg", moq: 10 },
          { strength: "10mg", moq: 10 },
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
          { strength: "10mg", moq: 10 },
          { strength: "50mg", moq: 10 },
        ],
        description: "SS-31 (elamipretide, Bendavia, MTP-131) is a cell-permeable, mitochondria-targeted tetrapeptide designed to interact with cardiolipin, a phospholipid uniquely concentrated in the inner mitochondrial membrane essential for electron transport chain organization and ATP synthase function. Mechanistically, SS-31 stabilizes cardiolipin-cytochrome c interactions, improves electron transport efficiency, reduces electron leak and reactive oxygen species (ROS) generation, and protects cristae structure under stress conditions. It is studied in bioenergetics research, mitochondrial disease modeling, heart failure, kidney injury, and age-related mitochondrial dysfunction for its ability to restore mitochondrial function and reduce oxidative damage.",
        scientificPurpose: "Designed to study mitochondrial bioenergetics and electron transport chain efficiency, cardiolipin biology and membrane organization, oxidative phosphorylation regulation, mitochondrial ROS production and oxidative stress, cristae structure maintenance, and cellular resilience under metabolic or ischemic stress.",
        studiesFindings: "Improves mitochondrial respiration and ATP production efficiency across multiple tissue types (context dependent). Stabilizes cardiolipin-dependent electron transport chain organization and cristae architecture. Reduces mitochondrial ROS production and oxidative stress markers in experimental models. Improves cardiac function endpoints in heart failure research (study dependent). Demonstrates renoprotective effects in acute kidney injury and ischemia-reperfusion models. Supports neuronal energetics and neuroprotective signaling in CNS research contexts. Improves exercise tolerance and skeletal muscle function in mitochondrial myopathy studies. Reduces ischemia-reperfusion injury across multiple organ systems. Supports cellular survival under metabolic stress conditions. Provides a reference peptide for studying cardiolipin-targeted bioenergetic interventions.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=elamipretide+SS-31+mitochondrial"
      },
      {
        name: "ARA-290",
        displayName: "ARA-290",
        slug: "ara-290",
        variations: [
          { strength: "10mg", moq: 10 },
        ],
        description: "ARA-290 (cibinetide) is a synthetic 11-amino acid peptide derived from the erythropoietin (EPO) molecule, specifically engineered to selectively activate tissue-protective signaling through the innate repair receptor (IRR) complex without stimulating erythropoiesis or thrombopoiesis. The IRR is a heteromeric receptor involving EPOR and βcR (CD131) subunits, distinct from the classical hematopoietic EPO receptor. Mechanistically, ARA-290 activates anti-inflammatory, anti-apoptotic, and tissue-protective pathways while avoiding the cardiovascular risks associated with erythropoiesis-stimulating agents. It is studied in neuropathy research, inflammatory conditions, and tissue injury models for its cytoprotective effects.",
        scientificPurpose: "Designed to study non-hematopoietic EPO-pathway signaling through the innate repair receptor, tissue-protective and anti-apoptotic mechanisms, anti-inflammatory pathway modulation, neuropathy and neuroregeneration endpoints, and metabolic tissue protection without erythropoietic stimulation.",
        studiesFindings: "Activates innate repair receptor signaling without increasing red blood cell production (context dependent). Reduces inflammatory signaling markers and pro-inflammatory cytokine levels in experimental contexts. Demonstrates neuroprotective effects and improves functional endpoints in diabetic neuropathy studies (study dependent). Supports tissue-protective signaling in models of cardiac, renal, and neural injury. Improves corneal nerve regeneration in small fiber neuropathy research. Reduces pain-associated endpoints in neuropathic pain models. Demonstrates metabolic protective effects in type 2 diabetes research contexts. Supports wound healing and tissue repair signaling without vascular risk factors. Provides a tool for separating EPO's tissue-protective from hematopoietic effects. Enables investigation of innate repair receptor biology and therapeutic applications.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=ARA-290+cibinetide+innate+repair+receptor"
      },
      {
        name: "THYMALIN",
        displayName: "THYMALIN",
        slug: "thymalin",
        variations: [
          { strength: "10mg", moq: 10 },
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
          { strength: "10mg", moq: 10 },
          { strength: "50mg", moq: 10 },
        ],
        description: "Epithalon (Epitalon) is a synthetic peptide associated with pineal-derived peptide research traditions and aging biology. It is discussed in literature exploring long-term cellular function, circadian-linked neuroendocrine regulation, and telomere-associated hypotheses in aging frameworks. Research interest often centers on how peptide signals might influence aging-related molecular programs, with results varying by model and study lineage.",
        scientificPurpose: "Designed to study aging-associated molecular programs, neuroendocrine/circadian regulation biology, and telomere/telomerase-related hypotheses in experimental aging research.",
        studiesFindings: "Modulates aging-associated biomarkers in certain experimental traditions (context dependent). Influences neuroendocrine and circadian-linked signaling markers (study dependent). Associated with telomere/telomerase pathway hypotheses in some publications. Supports investigation of peptide regulation of long-term cellular stress adaptation programs. Used as a tool for studying peptide–aging pathway interactions in controlled settings. Enables evaluation of peptide-driven molecular aging frameworks in preclinical contexts.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=Epithalon+telomerase+aging+peptide"
      },
      {
        name: "AOD",
        displayName: "AOD",
        slug: "aod",
        variations: [
          { strength: "5mg", moq: 10 },
        ],
        description: "AOD-9604 (Anti-Obesity Drug 9604) is a modified fragment of human growth hormone corresponding to the C-terminal region (amino acids 177-191), engineered to retain lipolytic activity while eliminating the growth-promoting and diabetogenic effects of full-length GH. Mechanistically, AOD-9604 is reported to stimulate lipolysis and inhibit lipogenesis in adipose tissue through pathways that may involve β3-adrenergic receptor signaling, without affecting IGF-1 levels or insulin sensitivity. It is studied in obesity and metabolic research for its potential to reduce fat mass through direct adipocyte signaling rather than systemic anabolic effects.",
        scientificPurpose: "Designed to study GH-fragment–linked lipolysis signaling, adipocyte lipid mobilization, fat-mass reduction mechanisms, lipogenesis inhibition, and the separation of GH metabolic effects from anabolic/growth-promoting actions in experimental obesity contexts.",
        studiesFindings: "Stimulates lipolysis-associated signaling in adipose tissue models (context dependent). Inhibits lipogenesis and reduces de novo fat synthesis in experimental systems. Supports fat-mass reduction endpoints without affecting lean body mass in some studies. Does not significantly alter IGF-1 levels or insulin sensitivity (study dependent). Demonstrates adipose-specific metabolic effects distinct from full GH activity. Influences β3-adrenergic receptor–linked signaling pathways in some research frameworks. Supports investigation of fragment-based metabolic peptide pharmacology. Provides a tool for studying dissociation of GH lipolytic versus anabolic effects. Reduces body fat in preclinical obesity models. Enables mechanistic research on targeted adipose tissue interventions.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=growth+hormone+fragment+lipolysis"
      },
      {
        name: "BPC-157 + TB500",
        displayName: "BPC-157 + TB500",
        slug: "bpc-157-tb500",
        variations: [
          { strength: "10mg", moq: 10 },
          { strength: "20mg", moq: 10 },
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
          { strength: "5mg", moq: 10 },
          { strength: "10mg", moq: 10 },
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
          { strength: "5mg", moq: 10 },
          { strength: "10mg", moq: 10 },
        ],
        description: "Selank is a synthetic heptapeptide analogue of the immunomodulatory peptide tuftsin, developed in Russian pharmacology research as a neuroactive compound with anxiolytic and nootropic properties. It is engineered with enhanced stability for CNS activity and studied for its effects on GABAergic neurotransmission, monoamine system modulation, and stress-response signaling networks. Mechanistically, Selank influences gene expression patterns related to neurotransmission, neuroplasticity, and immune-neuroendocrine communication. Research interest centers on its dual anxiolytic-nootropic profile, making it a tool for studying peptide-based interventions targeting anxiety, cognitive function, and stress adaptation.",
        scientificPurpose: "Designed to study anxiolytic neuropeptide mechanisms, GABAergic system modulation, serotonergic and dopaminergic neurotransmission, stress adaptation signaling, cognitive and memory-associated endpoints, and immune-neuroendocrine pathway interactions in experimental contexts.",
        studiesFindings: "Reduces anxiety-related behavioral endpoints in preclinical stress models (context dependent). Modulates GABAergic neurotransmission and enhances inhibitory signaling tone. Influences serotonin and dopamine metabolism in CNS models (study dependent). Supports cognitive performance and memory consolidation endpoints in animal research. Affects gene expression patterns related to neuroplasticity and synaptic function. Demonstrates immunomodulatory signaling through tuftsin-related pathways. Supports stress adaptation and HPA axis regulation in experimental frameworks. Enhances attention and reduces stress-induced cognitive impairment in some models. Provides a tool for studying tuftsin-derived neuropeptide pharmacology and CNS signaling.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=Selank+tuftsin+peptide"
      },
      {
        name: "CEREBROLYSIN",
        displayName: "CEREBROLYSIN",
        slug: "cerebrolysin",
        variations: [
          { strength: "60mg", moq: 6 },
        ],
        description: "Cerebrolysin is a porcine brain–derived peptide preparation containing a standardized mixture of low-molecular-weight neuropeptides and amino acids with neurotrophic factor–like activity. It is studied extensively in neurobiology research and clinical programs for its effects on neuroplasticity, synaptic remodeling, neuronal survival signaling, and functional recovery after CNS injury or neurodegenerative stress. Mechanistically, Cerebrolysin is reported to mimic endogenous neurotrophic factor signaling (BDNF-like, NGF-like effects), modulate synaptic protein expression, and influence neuroinflammatory and oxidative stress pathways. Research applications span stroke recovery, traumatic brain injury, Alzheimer's disease modeling, and general neuroprotection frameworks.",
        scientificPurpose: "Designed to study neurotrophic-like signaling, neuroplasticity and synaptic remodeling, neuronal survival and anti-apoptotic pathways, functional neurorecovery after ischemic or traumatic insult, neuroinflammation modulation, and cognitive/behavioral outcome endpoints in experimental and clinical neuroscience contexts.",
        studiesFindings: "Supports neuroplasticity-associated signaling and synaptic protein expression in experimental contexts (context dependent). Improves functional recovery and neurological outcome endpoints in stroke and TBI clinical research (study dependent). Modulates neuronal survival pathways and anti-apoptotic signaling in preclinical models. Influences neuroinflammation-related cytokine and oxidative stress markers. Demonstrates cognitive improvement endpoints in Alzheimer's disease research frameworks (context dependent). Supports dendritic branching and synaptogenesis signaling in developmental models. Enhances memory and learning-associated endpoints in animal cognition studies. Provides a complex-peptide tool for studying multi-pathway neurotrophic interventions. Used as a reference preparation for evaluating peptide-based neurorepair strategies.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=Cerebrolysin+neurotrophic+peptide+recovery"
      },
      {
        name: "DSIP",
        displayName: "DSIP",
        slug: "dsip",
        variations: [
          { strength: "5mg", moq: 10 },
          { strength: "15mg", moq: 10 },
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
          { strength: "5mg", moq: 10 },
          { strength: "10mg", moq: 10 },
          { strength: "20mg", moq: 10 },
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
          { strength: "5mg", moq: 10 },
          { strength: "10mg", moq: 10 },
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
          { strength: "10mg (5mg + 5mg)", moq: 10 },
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
          { strength: "5mg", moq: 10 },
          { strength: "10mg", moq: 10 },
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
          { strength: "5mg", moq: 10 },
          { strength: "10mg", moq: 10 },
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
          { strength: "5mg", moq: 10 },
          { strength: "10mg", moq: 10 },
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
          { strength: "5mg", moq: 10 },
          { strength: "10mg", moq: 10 },
        ],
        description: "Hexarelin is a potent synthetic growth hormone secretagogue designed to activate the ghrelin receptor (GHSR) and stimulate pituitary GH release. It is used as a mechanistic probe of endocrine secretion dynamics, receptor-driven GH release patterns, and downstream GH/IGF-axis signaling outcomes. In research contexts it often serves as a reference compound for comparing secretagogue potency and endocrine response profiles.",
        scientificPurpose: "Designed to study GHSR-driven GH secretion, endocrine pulsatility patterns, pituitary signaling biology, and downstream GH/IGF-axis pathway effects.",
        studiesFindings: "Stimulates GH release via ghrelin receptor activation (context dependent). Supports study of pituitary secretion dynamics and endocrine rhythm control. Enables mechanistic mapping of GHSR downstream signaling in endocrine tissues. Used in studies exploring GH-axis modulation and metabolic/anabolic signaling outcomes. Provides a reference point for secretagogue class potency and response profiling.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=hexarelin+GHSR+ghrelin+receptor"
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
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=GHRP-6+ghrelin+receptor"
      },
      {
        name: "HGH (Somatropin 191AA)",
        displayName: "HGH (Somatropin 191AA)",
        slug: "hgh-somatropin",
        variations: [
          { strength: "10 IU", moq: 10 },
          { strength: "15 IU", moq: 10 },
        ],
        description: "Somatropin is recombinant human growth hormone (rhGH), a 191–amino acid polypeptide identical to endogenous pituitary GH. It binds the growth hormone receptor (GHR), leading to receptor dimerization and activation of intracellular signaling networks including JAK2/STAT, as well as cross-talk with MAPK and PI3K/Akt pathways. A major downstream endocrine mediator of GH activity is IGF-1, produced largely in the liver and also locally in tissues, which coordinates anabolic, growth, and metabolic remodeling programs. In research, somatropin is used to model GH-axis physiology, growth factor signaling kinetics, and tissue-level anabolic/metabolic adaptations.",
        scientificPurpose: "Designed to study GHR signaling, GH-axis physiology, IGF-1 induction, anabolic signaling programs (protein synthesis and tissue growth pathways), and systemic metabolic regulation (substrate partitioning, body composition, and tissue remodeling) in controlled endocrine research.",
        studiesFindings: "Activates GHR → JAK2/STAT signaling and associated transcriptional programs (context dependent). Increases IGF-1 production and downstream growth-factor signaling in clinical and experimental settings. Enhances protein synthesis/anabolic signaling markers in muscle and other tissues (study dependent). Supports tissue growth and remodeling signaling frameworks through GH/IGF axis coordination. Modulates substrate utilization and metabolic regulation endpoints in metabolic physiology models (context dependent). Provides a standardized tool for evaluating GH-axis feedback regulation and endocrine kinetics.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=somatropin+recombinant+human+growth+hormone+GHR+JAK2+STAT+IGF-1"
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
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=growth+hormone+fragment+176-191+lipolysis"
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
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=IGF-1+LR3+analog"
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
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=IGF-1+DES+analog"
      },
      {
        name: "HCG",
        displayName: "HCG",
        slug: "hcg",
        variations: [
          { strength: "5000 IU", moq: 10 },
          { strength: "10000 IU", moq: 10 },
        ],
        description: "Human Chorionic Gonadotropin (hCG) is a glycoprotein hormone naturally produced by trophoblastic tissue in pregnancy and is structurally/functionally related to luteinizing hormone (LH). It binds the LH/CG receptor (LHCGR), a G-protein–coupled receptor expressed primarily in gonadal tissue, triggering steroidogenic signaling cascades that regulate gonadal endocrine output. In research, hCG is used as a precise tool to activate LHCGR signaling to model ovulatory/luteal biology in ovaries and Leydig-cell testosterone biosynthesis biology in testes, as well as to interrogate downstream cAMP/PKA-driven steroidogenic gene programs.",
        scientificPurpose: "Designed to study LHCGR receptor activation, gonadal steroidogenesis, reproductive endocrine axis signaling, ovulation/luteal support mechanisms, and gonadal cell signaling responses (cAMP/PKA and steroidogenic pathway transcription networks).",
        studiesFindings: "Activates LHCGR signaling and increases downstream cAMP/PKA pathway activity in gonadal cells. Stimulates steroidogenic enzyme pathway expression involved in gonadal hormone synthesis (context dependent). Drives Leydig-cell steroidogenesis signaling endpoints in experimental endocrine models (study dependent). Induces ovulation-associated signaling and luteal endocrine support pathways in ovarian research settings. Provides a robust endocrine stimulus for mapping hypothalamic–pituitary–gonadal (HPG) axis feedback dynamics (model dependent). Enables controlled evaluation of receptor-mediated gonadal signaling versus upstream pituitary LH inputs.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=human+chorionic+gonadotropin+hCG+LHCGR+cAMP+PKA+steroidogenesis"
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
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=kisspeptin-10+GnRH+LH+FSH"
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
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=MOTS-c+mitochondrial+derived+peptide"
      },
      {
        name: "PT-141",
        displayName: "PT-141",
        slug: "pt-141",
        variations: [
          { strength: "10mg", moq: 10 },
        ],
        description: "PT-141 (bremelanotide) is a cyclic heptapeptide melanocortin receptor agonist derived from the α-MSH derivative Melanotan II, developed to modulate CNS circuits involved in sexual desire and arousal. Unlike phosphodiesterase inhibitors that act peripherally on vascular smooth muscle, PT-141 acts centrally through melanocortin-4 receptor (MC4R) activation in hypothalamic and limbic brain regions to influence sexual motivation and arousal signaling. Mechanistically, MC4R activation triggers downstream signaling cascades affecting dopaminergic and oxytocinergic pathways involved in sexual behavior regulation. It is the first FDA-approved treatment acting through this central mechanism.",
        scientificPurpose: "Designed to study melanocortin receptor signaling in CNS arousal/desire circuitry, hypothalamic sexual behavior regulation, MC4R-mediated behavioral endpoints, dopaminergic and oxytocinergic pathway interactions, and centrally-acting pharmacological approaches to sexual dysfunction.",
        studiesFindings: "Activates MC4R signaling in hypothalamic and limbic brain regions (context dependent). Increases sexual desire and arousal endpoints in clinical research contexts for hypoactive sexual desire disorder. Demonstrates CNS-mediated arousal signaling distinct from peripheral vasodilatory mechanisms. Influences dopaminergic reward and motivation circuitry relevant to sexual behavior (study dependent). Modulates oxytocin release patterns associated with sexual response. Effective in both male and female sexual dysfunction research models. Demonstrates onset of action independent of direct genital vascular effects. Supports mechanistic understanding of melanocortin pathway roles in sexual behavior. Provides a tool for studying central versus peripheral mechanisms in sexual response. Enables investigation of neuropeptide modulation of motivation/reward neurocircuits.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=PT-141+melanocortin+receptor"
      },
      {
        name: "VIP",
        displayName: "VIP",
        slug: "vip",
        variations: [
          { strength: "5mg", moq: 10 },
          { strength: "10mg", moq: 10 },
        ],
        description: "VIP (vasoactive intestinal peptide) is an endogenous neuropeptide hormone with broad receptor-mediated effects across smooth muscle, vasculature, and immune cells. It is studied for its vasodilatory, bronchodilatory, and immunomodulatory signaling roles.",
        scientificPurpose: "Designed to study VPAC receptor signaling, vascular tone regulation, smooth muscle relaxation biology, and immune modulation mechanisms.",
        studiesFindings: "Potent vasodilation via smooth muscle relaxation signaling. Modulates immune responses and inflammatory cytokine patterns (context dependent). Influences airway/smooth muscle physiology in experimental models. Supports investigation of neuroimmune communication pathways. Demonstrates protective signaling roles in certain inflammation models (study dependent).",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=vasoactive+intestinal+peptide+VIP"
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
        description: "GHK-Cu (glycyl-L-histidyl-L-lysine:copper(II)) is an endogenous copper-binding tripeptide complex found in human plasma, saliva, and urine, studied extensively as a regenerative signaling molecule with broad effects on tissue remodeling and repair biology. Mechanistically, GHK-Cu modulates gene expression programs controlling extracellular matrix synthesis (collagen, elastin, glycosaminoglycans), antioxidant enzyme systems, and anti-inflammatory pathways. It is studied in wound healing, skin aging research, hair follicle biology, and tissue regeneration frameworks for its ability to reset gene expression patterns toward regenerative phenotypes. Research positions GHK-Cu as a master regulator of tissue remodeling with effects across multiple organ systems.",
        scientificPurpose: "Designed to study collagen/elastin/glycosaminoglycan synthesis, extracellular matrix remodeling, wound healing signaling, antioxidant gene network activation, anti-inflammatory pathway modulation, skin aging biology, hair follicle regeneration, and tissue repair mechanisms.",
        studiesFindings: "Stimulates collagen and elastin synthesis pathways and ECM remodeling (context dependent). Enhances wound healing signaling and accelerates tissue repair in experimental models. Activates antioxidant gene expression including SOD and promotes cellular stress resistance. Modulates anti-inflammatory signaling by reducing pro-inflammatory cytokine expression. Supports skin thickness, elasticity, and firmness endpoints in aging research. Influences hair follicle biology and supports hair growth signaling in dermatologic models (study dependent). Promotes nerve regeneration signaling in select neurological research contexts. Attracts immune cells to sites of injury supporting repair processes. Resets gene expression patterns from inflammatory/destructive to regenerative phenotypes. Provides a reference peptide for studying copper-dependent tissue remodeling mechanisms.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=GHK-Cu+copper+peptide+collagen+gene+expression"
      },
      {
        name: "GLUTATHIONE",
        displayName: "GLUTATHIONE",
        slug: "glutathione",
        variations: [
          { strength: "1500mg", moq: 10 },
        ],
        description: "Glutathione (GSH; γ-L-glutamyl-L-cysteinyl-glycine) is the most abundant intracellular thiol antioxidant and the dominant redox buffer in mammalian cells, playing central roles in oxidative stress control, xenobiotic detoxification, and cellular signaling regulation. Mechanistically, GSH participates in enzymatic antioxidant systems (glutathione peroxidase, glutathione reductase), phase II detoxification conjugation reactions (glutathione S-transferases), and protein thiol regulation that protects cellular structures from oxidative damage. It is essential for mitochondrial integrity, immune cell function, and maintenance of the cellular redox environment. Research applications span oxidative stress biology, toxicology, aging research, and immune function studies.",
        scientificPurpose: "Designed to study oxidative stress mitigation, phase II detoxification pathways, mitochondrial protection and bioenergetics, immune cell redox regulation, thiol homeostasis, xenobiotic metabolism, and cellular aging mechanisms.",
        studiesFindings: "Reduces oxidative stress markers and lipid peroxidation in cellular and physiologic models. Maintains cellular redox balance and thiol homeostasis essential for protein function. Supports glutathione S-transferase-mediated detoxification and xenobiotic conjugation pathways. Protects mitochondrial function and membrane integrity under oxidative challenge (context dependent). Supports immune cell function and lymphocyte proliferation through redox regulation. Influences inflammatory signaling and cytokine production in immune contexts. Demonstrates protective effects in liver function and hepatic detoxification models. Supports skin health endpoints and melanin synthesis regulation in dermatologic research (study dependent). Modulates cellular aging markers and senescence-associated pathways. Provides a reference standard for studying thiol-dependent antioxidant systems.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=glutathione+oxidative+stress+redox"
      },
      {
        name: "SNAP-8",
        displayName: "SNAP-8",
        slug: "snap-8",
        variations: [
          { strength: "10mg", moq: 10 },
        ],
        description: "SNAP-8 (acetyl octapeptide-3) is an elongated synthetic peptide developed in cosmetic research to modulate neuromuscular communication by targeting SNARE-complex–associated neurotransmitter release mechanics. It functions as a competitive inhibitor that interferes with SNARE complex formation, reducing the efficiency of vesicle fusion and acetylcholine release at neuromuscular junctions. SNAP-8 is commonly positioned as a topical \"expression line-relaxing\" peptide concept, representing an extension of the hexapeptide argireline framework with enhanced binding characteristics. Research applications focus on cosmetic anti-aging endpoints and understanding peptide-based neuromodulation in skin physiology.",
        scientificPurpose: "Designed to study SNARE-mediated neurotransmitter release modulation, acetylcholine vesicle fusion mechanics, neuromuscular junction signaling, and downstream effects on contraction-associated skin dynamics and expression line formation.",
        studiesFindings: "Reduces SNARE-complex assembly efficiency in experimental frameworks (context dependent). Decreases acetylcholine release intensity and vesicle fusion kinetics in neuromuscular models. Reduces muscle contraction-associated signaling relevant to dynamic wrinkle formation. Demonstrates depth reduction in expression lines in cosmetic research endpoints (study dependent). Complements other anti-aging peptides in multi-modal cosmetic formulation research. Provides a mechanistic analogue model for understanding peptide-based neuromodulatory approaches. Supports investigation of topical peptide penetration and bioavailability in skin models. Enables comparison studies with botulinum toxin–based neuromuscular modulation mechanisms. Used in cosmetic science research for studying non-invasive muscle relaxation strategies.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=acetyl+octapeptide-3+SNARE+neurotransmitter"
      },
      {
        name: "LL-37",
        displayName: "LL-37",
        slug: "ll-37",
        variations: [
          { strength: "10mg", moq: 10 },
        ],
        description: "LL-37 is the only human cathelicidin-derived antimicrobial peptide, processed from the C-terminal domain of hCAP18 (human cationic antimicrobial protein 18). It is a 37-amino acid amphipathic α-helical peptide that plays central roles in innate immunity, with direct antimicrobial activity and complex immunomodulatory functions. Mechanistically, LL-37 disrupts bacterial membranes, inhibits biofilm formation, modulates inflammatory signaling through multiple receptor interactions (including FPR2, P2X7, EGFR), and influences wound healing processes. It is studied extensively in infectious disease research, innate immunity frameworks, chronic wound biology, and inflammatory condition modeling.",
        scientificPurpose: "Designed to study antimicrobial peptide mechanisms, biofilm disruption, innate immune signaling modulation, inflammatory pathway regulation, wound healing and tissue repair, and host-defense peptide biology in infection and inflammation contexts.",
        studiesFindings: "Demonstrates broad-spectrum antimicrobial activity against gram-positive and gram-negative bacteria, fungi, and enveloped viruses (context dependent). Disrupts and inhibits biofilm formation across multiple bacterial species in experimental systems. Modulates innate immune cell recruitment, activation, and cytokine production. Supports wound healing and re-epithelialization processes through EGFR transactivation pathways. Influences angiogenesis signaling relevant to tissue repair contexts (study dependent). Demonstrates both pro-inflammatory and anti-inflammatory effects depending on concentration and microenvironment. Neutralizes lipopolysaccharide (LPS) and reduces endotoxin-mediated inflammatory responses. Supports investigation of host-defense peptide interactions with adaptive immunity. Provides a reference peptide for studying cathelicidin biology in skin and mucosal immunity.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=LL-37+cathelicidin+antimicrobial+peptide"
      },
      {
        name: "NAD",
        displayName: "NAD",
        slug: "nad",
        variations: [
          { strength: "100mg", moq: 10 },
          { strength: "500mg", moq: 10 },
        ],
        description: "NAD+ (nicotinamide adenine dinucleotide, oxidized form) is an essential metabolic cofactor governing hundreds of redox reactions and serving as a co-substrate for critical regulatory enzymes including sirtuins (SIRT1-7), poly(ADP-ribose) polymerases (PARPs), and CD38/CD157 ectoenzymes. Mechanistically, NAD+ is central to mitochondrial electron transport and ATP production, while also functioning as a signaling molecule that links cellular metabolism to gene expression, DNA repair, circadian rhythms, and stress adaptation. Research on NAD+ biology has expanded dramatically due to connections between declining NAD+ levels and aging, metabolic dysfunction, and neurodegenerative conditions. NAD+ precursor and direct supplementation strategies are studied for their effects on cellular energetics and longevity-associated pathways.",
        scientificPurpose: "Designed to study mitochondrial bioenergetics and oxidative phosphorylation, redox homeostasis, sirtuin-mediated gene regulation and deacetylation, PARP-dependent DNA repair signaling, circadian rhythm regulation, cellular aging mechanisms, and metabolic-epigenetic coupling.",
        studiesFindings: "Supports mitochondrial ATP production and electron transport chain function via redox coupling. Enables sirtuin-mediated signaling linking metabolism to gene expression and longevity pathways (context dependent). Supports PARP-dependent DNA repair and genome stability mechanisms. Enhances cellular resilience to metabolic and oxidative stress in experimental models. Influences circadian rhythm regulation through SIRT1/CLOCK interactions. Declines with age correlating with metabolic dysfunction in aging research models (study dependent). Supports neuronal health and neuroprotective signaling in CNS research contexts. Modulates inflammatory signaling through CD38-dependent pathways. Influences stem cell function and regenerative capacity in some models. Provides a central node for studying metabolic regulation of cellular function and aging.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=NAD+mitochondrial+bioenergetics+sirtuins"
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
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=deoxycholic+acid+adipocytolysis+injection"
      },
      {
        name: "L-CARNITINE",
        displayName: "L-CARNITINE",
        slug: "l-carnitine",
        variations: [
          { strength: "10 mL", moq: 10 },
        ],
        description: "L-Carnitine (β-hydroxy-γ-N-trimethylaminobutyric acid) is a quaternary ammonium compound central to mitochondrial fatty-acid transport via the carnitine shuttle system. It facilitates the translocation of long-chain fatty acids across the inner mitochondrial membrane by forming acylcarnitine esters, enabling β-oxidation and ATP production from lipid substrates. Beyond its transport function, L-carnitine modulates CoA/acyl-CoA ratios, influences cellular acetyl group availability, and supports metabolic flexibility during exercise and fasting states. It is studied extensively in metabolic research, sports physiology, cardiovascular health, and conditions involving mitochondrial dysfunction or fatty acid oxidation disorders.",
        scientificPurpose: "Designed to study fatty-acid oxidation capacity and mitochondrial substrate transport, carnitine shuttle function, metabolic flexibility and substrate partitioning, exercise physiology and endurance performance, cardiac energetics, and mitochondrial function in metabolic disease and aging contexts.",
        studiesFindings: "Supports transport of long-chain fatty acids into mitochondria for β-oxidation (context dependent). Enhances fatty-acid oxidation capacity and energy production from lipid substrates in metabolic models. Influences metabolic flexibility and substrate partitioning between carbohydrates and fats. Improves exercise performance and recovery endpoints in some sports research contexts (study dependent). Supports cardiac muscle energetics and function in cardiovascular research. Reduces markers of exercise-induced muscle damage and oxidative stress. Modulates cellular acetyl group availability affecting multiple metabolic pathways. Supports healthy aging endpoints related to mitochondrial function in gerontology research. Demonstrates protective effects in fatty acid oxidation disorder models. Provides a reference compound for studying mitochondrial bioenergetics and lipid metabolism.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=L-carnitine+mitochondrial+fatty+acid+oxidation"
      },
      {
        name: "MT-1",
        displayName: "MT-1",
        slug: "mt-1",
        variations: [
          { strength: "10mg", moq: 10 },
        ],
        description: "MT-1 (Melanotan I, afamelanotide, CUV1647) refers to a linear α-MSH analogue peptide designed for potent and sustained melanocortin-1 receptor (MC1R) activation to stimulate eumelanin synthesis in melanocytes. Mechanistically, MC1R activation triggers cAMP/PKA signaling, leading to MITF transcription factor activation and upregulation of melanogenic enzyme expression (tyrosinase, TRP-1, TRP-2). The resulting increased eumelanin provides enhanced photoprotection against UV-induced DNA damage. Afamelanotide is the clinically developed version studied for photoprotection in conditions like erythropoietic protoporphyria and as a preventive approach in high-risk populations.",
        scientificPurpose: "Designed to study melanocortin receptor signaling (MC1R), melanogenesis pathway activation, eumelanin synthesis regulation, UV photoprotection biology, cAMP/PKA-MITF signaling cascades, and skin pigmentation mechanisms in dermatology and photobiology research.",
        studiesFindings: "Activates MC1R signaling and increases cAMP-mediated melanogenesis (context dependent). Enhances eumelanin synthesis and skin pigmentation in clinical and experimental contexts. Provides photoprotection against UV-induced DNA damage and erythema (study dependent). Demonstrates significant benefit in erythropoietic protoporphyria, allowing increased light exposure. Reduces UV-induced skin damage markers in photoprotection research. Modulates oxidative stress responses to UV exposure in some studies. Influences vitamin D synthesis through increased sun exposure tolerance. Supports investigation of melanocortin receptor pharmacology and skin biology. Provides a reference compound for studying pigmentation as a photoprotective strategy. Enables research on tanning pathway modulation and skin cancer prevention approaches.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=afamelanotide+melanocortin+MC1R"
      },
      {
        name: "MT-2 (Melanotan II)",
        displayName: "MT-2 (Melanotan II)",
        slug: "mt-2",
        variations: [
          { strength: "10mg", moq: 10 },
        ],
        description: "MT-2 (Melanotan II) is a synthetic cyclic heptapeptide analogue of α-melanocyte-stimulating hormone (α-MSH) that acts as a non-selective agonist at multiple melanocortin receptors (MC1R, MC3R, MC4R, MC5R). Its broader receptor profile compared to MT-1/afamelanotide results in effects beyond pigmentation, including CNS-mediated sexual arousal (MC4R), appetite modulation (MC4R), and lipid metabolism effects (MC3R). Mechanistically, MT-2 activates cAMP signaling across melanocortin receptor subtypes, leading to diverse physiological endpoints. It is studied in pigmentation research, sexual function pharmacology, and metabolic signaling frameworks, though its non-selectivity complicates therapeutic development.",
        scientificPurpose: "Designed to study broad melanocortin receptor biology across multiple subtypes, pigmentation pathway activation, CNS-mediated behavioral effects (sexual arousal, appetite), cross-tissue melanocortin signaling, and multi-receptor agonist pharmacology in experimental contexts.",
        studiesFindings: "Activates MC1R signaling leading to increased melanogenesis and skin pigmentation (context dependent). Stimulates MC4R pathways producing sexual arousal and erectile effects in multiple species. Modulates appetite and food intake through hypothalamic MC4R signaling (study dependent). Influences lipid metabolism through MC3R-mediated pathways. Increases eumelanin synthesis with potential photoprotective effects. Demonstrates complex behavioral effects due to multi-receptor activation. Supports investigation of melanocortin pathway roles in motivation and reward circuitry. Provides a tool for comparing non-selective versus selective melanocortin receptor pharmacology. Influences energy homeostasis through centrally-mediated mechanisms. Enables research mapping melanocortin receptor tissue distribution and functional effects.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=melanotan+II+melanocortin+receptor"
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
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=5-Amino-1MQ+NNMT+inhibitor"
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
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=SLU-PP-322+metabolic+agonist"
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
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=bacteriostatic+water+benzyl+alcohol"
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
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=insulin+receptor+PI3K+Akt+GLUT4"
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
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=hyaluronic+acid+extracellular+matrix"
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
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=follistatin+myostatin+activin+muscle+hypertrophy"
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
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=BPC-157+GHK-Cu+thymosin+beta-4"
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
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=GHK-Cu+BPC-157+thymosin+beta-4+KPV"
      },
      {
        name: "KPV (Lysine-Proline-Valine)",
        displayName: "KPV (Lysine-Proline-Valine)",
        slug: "kpv",
        variations: [
          { strength: "5mg", moq: 10 },
          { strength: "10mg", moq: 10 },
        ],
        description: "KPV (Lysine-Proline-Valine) is a tripeptide derived from the C-terminal sequence of alpha-melanocyte stimulating hormone (α-MSH), studied for its anti-inflammatory and immunomodulatory properties independent of melanocortin receptor activation. Mechanistically, KPV is reported to inhibit NF-κB signaling, reduce pro-inflammatory cytokine production (IL-1β, IL-6, TNF-α), and modulate inflammatory cell function without typical melanocortin receptor-mediated effects like pigmentation changes. It is studied particularly in epithelial and mucosal inflammation models, including inflammatory bowel disease research, where it may influence intestinal barrier function and mucosal immune responses.",
        scientificPurpose: "Designed to study inflammation-regulating pathways independent of classical melanocortin receptors, NF-κB signaling inhibition, cytokine modulation, mucosal and epithelial immune signaling, intestinal barrier function, and anti-inflammatory peptide mechanisms in experimental inflammation models.",
        studiesFindings: "Reduces inflammatory signaling markers including NF-κB activation in experimental settings (context dependent). Decreases pro-inflammatory cytokine production (IL-1β, IL-6, TNF-α) in cellular and tissue models. Demonstrates anti-inflammatory patterns without melanocortin receptor-mediated pigmentation effects. Supports epithelial barrier function and reduces intestinal permeability in IBD research models (study dependent). Modulates mucosal immune cell function and inflammatory responses. Shows protective effects in colitis and other mucosal inflammation models. Influences inflammatory signaling cascades distinct from α-MSH full-length peptide. Supports wound healing in inflamed tissue contexts. Provides a minimal peptide tool for studying α-MSH-derived anti-inflammatory mechanisms. Enables research on non-receptor-mediated peptide immunomodulation.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/?term=KPV+Lys-Pro-Val+anti-inflammatory"
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
