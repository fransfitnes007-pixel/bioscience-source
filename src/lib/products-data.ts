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
        description: "GLP1-SEMA is a synthetic glucagon-like peptide-1 (GLP-1) receptor agonist that mimics the incretin hormone to regulate glucose metabolism. It is structurally modified for enhanced stability and prolonged half-life in research applications.",
        scientificPurpose: "Designed for in-vitro research on metabolic pathways, insulin secretion mechanisms, and glucose homeostasis studies.",
        studiesFindings: "Studies have shown significant effects on glucose-dependent insulin secretion and appetite regulation pathways in controlled research environments.",
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
        description: "GLP1-TRIZ is a dual glucose-dependent insulinotropic polypeptide (GIP) and GLP-1 receptor agonist designed for advanced metabolic research applications.",
        scientificPurpose: "Developed for investigating dual incretin receptor activation and its effects on metabolic regulation in laboratory settings.",
        studiesFindings: "Research has demonstrated enhanced metabolic effects through dual receptor activation compared to single receptor agonists.",
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
        description: "GLP3-RETA is a triple hormone receptor agonist targeting GLP-1, GIP, and glucagon receptors for comprehensive metabolic research.",
        scientificPurpose: "Engineered for studying multi-receptor metabolic pathway interactions and energy balance mechanisms.",
        studiesFindings: "Studies report significant modulation of multiple metabolic pathways simultaneously in preclinical research models.",
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
        description: "Cagrilintide is a long-acting amylin analog designed for research into satiety signaling and metabolic regulation.",
        scientificPurpose: "Developed for investigating amylin receptor pathways and their role in appetite and glucose regulation.",
        studiesFindings: "Research has shown effects on gastric emptying and satiety signaling pathways in laboratory studies.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/34623893/"
      },
      {
        name: "MAZDUTIDE",
        displayName: "MAZDUTIDE",
        slug: "mazdutide",
        variations: [
          { strength: "10mg", moq: 10 },
        ],
        description: "Mazdutide is a novel dual GLP-1 and glucagon receptor agonist for metabolic research applications.",
        scientificPurpose: "Designed for studying dual receptor activation effects on metabolism and energy expenditure.",
        studiesFindings: "Studies have demonstrated effects on both glucose regulation and energy metabolism pathways.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/35872749/"
      },
      {
        name: "SURVODUTIDE",
        displayName: "SURVODUTIDE",
        slug: "survodutide",
        variations: [
          { strength: "10mg", moq: 10 },
        ],
        description: "Survodutide is a dual glucagon and GLP-1 receptor agonist for advanced metabolic research.",
        scientificPurpose: "Engineered for investigating dual hormone receptor effects on hepatic and systemic metabolism.",
        studiesFindings: "Research reports significant effects on liver metabolism and systemic energy balance.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/36702540/"
      },
      {
        name: "GLP-1",
        displayName: "GLP-1",
        slug: "glp-1",
        variations: [
          { strength: "5mg", moq: 10 },
        ],
        description: "Native glucagon-like peptide-1 for fundamental research on incretin hormone biology.",
        scientificPurpose: "Used as a reference compound for studying GLP-1 receptor activation and signaling.",
        studiesFindings: "Studies have established baseline incretin effects for comparison with modified analogs.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/17416993/"
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
        description: "BPC-157 is a synthetic peptide derived from body protection compound found in gastric juice, consisting of 15 amino acids.",
        scientificPurpose: "Designed for research on tissue repair mechanisms, angiogenesis, and gastrointestinal protection pathways.",
        studiesFindings: "Studies have shown effects on various healing pathways and protective mechanisms in research settings.",
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
        description: "TB500 is a synthetic version of Thymosin Beta-4, a naturally occurring peptide involved in tissue repair.",
        scientificPurpose: "Used for investigating wound healing, cell migration, and tissue regeneration mechanisms.",
        studiesFindings: "Research demonstrates effects on actin regulation and cellular repair processes.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/20818537/"
      },
      {
        name: "LL-37",
        displayName: "LL-37",
        slug: "ll-37",
        variations: [
          { strength: "10mg", moq: 10 },
        ],
        description: "LL-37 is a cathelicidin antimicrobial peptide with multifunctional properties for immune research.",
        scientificPurpose: "Designed for studying antimicrobial mechanisms, immune modulation, and wound healing.",
        studiesFindings: "Studies report broad-spectrum antimicrobial activity and immunomodulatory effects.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/16209167/"
      },
      {
        name: "THYMOSIN ALPHA-1",
        displayName: "THYMOSIN ALPHA-1",
        slug: "thymosin-alpha-1",
        variations: [
          { strength: "5mg", moq: 10 },
          { strength: "10mg", moq: 10 },
        ],
        description: "Thymosin Alpha-1 is a thymic peptide involved in immune system regulation and T-cell function.",
        scientificPurpose: "Used for research on immune enhancement, T-cell maturation, and immunomodulation.",
        studiesFindings: "Studies have demonstrated immunomodulatory effects and T-cell activation properties.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/17428635/"
      },
      {
        name: "SS-31",
        displayName: "SS-31",
        slug: "ss-31",
        variations: [
          { strength: "10mg", moq: 10 },
          { strength: "50mg", moq: 10 },
        ],
        description: "SS-31 (Elamipretide) is a mitochondria-targeted tetrapeptide for cellular energy research.",
        scientificPurpose: "Designed for investigating mitochondrial function, oxidative stress, and cellular energetics.",
        studiesFindings: "Research shows effects on mitochondrial membrane stabilization and ATP production.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/27197538/"
      },
      {
        name: "ARA-290",
        displayName: "ARA-290",
        slug: "ara-290",
        variations: [
          { strength: "10mg", moq: 10 },
        ],
        description: "ARA-290 is an erythropoietin-derived peptide with tissue-protective properties.",
        scientificPurpose: "Used for studying tissue protection mechanisms without erythropoietic effects.",
        studiesFindings: "Studies report tissue-protective and anti-inflammatory effects in research models.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/22190412/"
      },
      {
        name: "THYMALIN",
        displayName: "THYMALIN",
        slug: "thymalin",
        variations: [
          { strength: "10mg", moq: 10 },
        ],
        description: "Thymalin is a thymic extract peptide complex for immune system research.",
        scientificPurpose: "Designed for investigating thymic function and immune system regulation.",
        studiesFindings: "Research demonstrates effects on T-cell development and immune homeostasis.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/12943137/"
      },
      {
        name: "EPITHALON",
        displayName: "EPITHALON",
        slug: "epithalon",
        variations: [
          { strength: "10mg", moq: 10 },
          { strength: "50mg", moq: 10 },
        ],
        description: "Epithalon is a synthetic tetrapeptide for telomerase and cellular aging research.",
        scientificPurpose: "Used for studying telomerase activation and cellular senescence mechanisms.",
        studiesFindings: "Studies have shown effects on telomerase activity and cellular lifespan in vitro.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/12937340/"
      },
      {
        name: "AOD",
        displayName: "AOD",
        slug: "aod",
        variations: [
          { strength: "5mg", moq: 10 },
        ],
        description: "AOD-9604 is a modified fragment of human growth hormone for metabolic research.",
        scientificPurpose: "Designed for studying lipolysis and fat metabolism without growth effects.",
        studiesFindings: "Research reports effects on fat metabolism pathways without affecting IGF-1 levels.",
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
        description: "A combined formulation of BPC-157 and TB500 for synergistic tissue repair research.",
        scientificPurpose: "Designed for investigating combined effects on tissue regeneration and healing.",
        studiesFindings: "Studies suggest synergistic effects when used in combination for repair research.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/27349193/"
      },
      {
        name: "GLUTATHIONE",
        displayName: "GLUTATHIONE",
        slug: "glutathione",
        variations: [
          { strength: "1500mg", moq: 10 },
        ],
        description: "Glutathione is the master antioxidant tripeptide for oxidative stress research.",
        scientificPurpose: "Used for studying cellular antioxidant mechanisms and detoxification pathways.",
        studiesFindings: "Research demonstrates critical roles in cellular defense against oxidative damage.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/24341424/"
      },
      {
        name: "SNAP-8",
        displayName: "SNAP-8",
        slug: "snap-8",
        variations: [
          { strength: "10mg", moq: 10 },
        ],
        description: "SNAP-8 is an octapeptide for neuromuscular research and cosmetic applications.",
        scientificPurpose: "Designed for studying SNARE complex modulation and muscle contraction pathways.",
        studiesFindings: "Studies report effects on neuromuscular junction signaling mechanisms.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/19146898/"
      },
      {
        name: "GHK-CU",
        displayName: "GHK-CU",
        slug: "ghk-cu",
        variations: [
          { strength: "50mg", moq: 10 },
          { strength: "100mg", moq: 10 },
        ],
        description: "GHK-Cu is a copper tripeptide complex for tissue remodeling and regeneration research.",
        scientificPurpose: "Used for investigating wound healing, collagen synthesis, and skin regeneration.",
        studiesFindings: "Research shows effects on gene expression related to tissue repair and regeneration.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/25877441/"
      },
      {
        name: "NAD",
        displayName: "NAD",
        slug: "nad",
        variations: [
          { strength: "100mg", moq: 10 },
          { strength: "500mg", moq: 10 },
        ],
        description: "NAD+ is a coenzyme essential for cellular metabolism and energy production research.",
        scientificPurpose: "Designed for studying sirtuins, cellular aging, and metabolic pathway regulation.",
        studiesFindings: "Studies demonstrate critical roles in cellular energy metabolism and longevity pathways.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/26785480/"
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
        description: "Semax is a synthetic peptide derived from ACTH for neuroprotection and cognitive research.",
        scientificPurpose: "Designed for investigating neurotrophic factors, BDNF expression, and cognitive mechanisms.",
        studiesFindings: "Studies have shown effects on brain-derived neurotrophic factor and cognitive pathways.",
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
        description: "Selank is a synthetic peptide derived from tuftsin for anxiolytic and immunomodulatory research.",
        scientificPurpose: "Used for studying anxiety-related pathways and immune-neuroendocrine interactions.",
        studiesFindings: "Research reports anxiolytic-like effects and immunomodulatory properties in studies.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/18577013/"
      },
      {
        name: "TESAMORELIN",
        displayName: "TESAMORELIN",
        slug: "tesamorelin",
        variations: [
          { strength: "5mg", moq: 10 },
          { strength: "10mg", moq: 10 },
        ],
        description: "Tesamorelin is a synthetic GHRH analog for growth hormone secretion research.",
        scientificPurpose: "Designed for studying GHRH receptor activation and somatotroph cell function.",
        studiesFindings: "Studies demonstrate effects on pulsatile growth hormone release patterns.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/20739385/"
      },
      {
        name: "CEREBROLYSIN",
        displayName: "CEREBROLYSIN",
        slug: "cerebrolysin",
        variations: [
          { strength: "60mg", moq: 6 },
        ],
        description: "Cerebrolysin is a neuropeptide preparation for neurotrophic and neuroprotective research.",
        scientificPurpose: "Used for investigating neuroplasticity, neurotrophic support, and neuroprotection.",
        studiesFindings: "Research shows effects on neurotrophic pathways and neuronal survival mechanisms.",
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
        description: "Delta Sleep Inducing Peptide (DSIP) is a neuropeptide for sleep and stress research.",
        scientificPurpose: "Designed for studying sleep architecture and stress-related neuroendocrine pathways.",
        studiesFindings: "Studies report effects on sleep patterns and stress hormone regulation.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/2885158/"
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
        description: "Pinealon is a tripeptide for pineal gland function and circadian rhythm research.",
        scientificPurpose: "Used for investigating melatonin synthesis and circadian biology.",
        studiesFindings: "Research demonstrates effects on pinealocyte function and circadian regulation.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/16758709/"
      },
    ]
  },
  {
    name: "Growth / Hormone & Peptides",
    slug: "growth-hormone-peptides",
    products: [
      {
        name: "CJC-1295 WITHOUT DAC + IPA",
        displayName: "CJC-1295 WITHOUT DAC + IPA",
        slug: "cjc-1295-ipa",
        variations: [
          { strength: "10mg (5mg + 5mg)", moq: 10 },
        ],
        description: "A combination of modified GHRH and Ipamorelin for synergistic GH secretion research.",
        scientificPurpose: "Designed for studying combined GHRH and ghrelin mimetic effects on GH release.",
        studiesFindings: "Studies show synergistic effects on growth hormone secretion patterns.",
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
        description: "CJC-1295 without Drug Affinity Complex for GHRH receptor research.",
        scientificPurpose: "Used for investigating GHRH receptor activation with shorter half-life.",
        studiesFindings: "Research demonstrates potent GHRH receptor agonist activity.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/16352683/"
      },
      {
        name: "SERMORELIN",
        displayName: "SERMORELIN",
        slug: "sermorelin",
        variations: [
          { strength: "5mg", moq: 10 },
          { strength: "10mg", moq: 10 },
        ],
        description: "Sermorelin is a synthetic GHRH(1-29) for growth hormone releasing research.",
        scientificPurpose: "Designed for studying physiological GH release patterns and somatotroph function.",
        studiesFindings: "Studies show natural pulsatile GH release activation.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/9502821/"
      },
      {
        name: "IPAMORELIN",
        displayName: "IPAMORELIN",
        slug: "ipamorelin",
        variations: [
          { strength: "5mg", moq: 10 },
          { strength: "10mg", moq: 10 },
        ],
        description: "Ipamorelin is a selective ghrelin receptor agonist for GH secretion research.",
        scientificPurpose: "Used for studying selective GH release without affecting other hormones.",
        studiesFindings: "Research demonstrates selective GH secretagogue activity with minimal side effects.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/9849822/"
      },
      {
        name: "HEXARELIN",
        displayName: "HEXARELIN",
        slug: "hexarelin",
        variations: [
          { strength: "5mg", moq: 10 },
        ],
        description: "Hexarelin is a potent synthetic hexapeptide GHRP for growth hormone research.",
        scientificPurpose: "Designed for investigating GH secretagogue receptor activation and signaling.",
        studiesFindings: "Studies show potent GH releasing activity through ghrelin receptor activation.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/8740429/"
      },
      {
        name: "GHRP-6 ACETATE",
        displayName: "GHRP-6 ACETATE",
        slug: "ghrp-6-acetate",
        variations: [
          { strength: "5mg", moq: 10 },
          { strength: "10mg", moq: 10 },
        ],
        description: "GHRP-6 is a growth hormone releasing hexapeptide for GH secretion research.",
        scientificPurpose: "Used for studying GH release mechanisms and hunger signaling pathways.",
        studiesFindings: "Research demonstrates robust GH release and appetite stimulation effects.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/8871131/"
      },
      {
        name: "HGH (Somatropin 191AA)",
        displayName: "HGH (Somatropin 191AA)",
        slug: "hgh-somatropin",
        variations: [
          { strength: "10 IU", moq: 10 },
          { strength: "15 IU", moq: 10 },
        ],
        description: "Recombinant human growth hormone (191 amino acid) for growth research.",
        scientificPurpose: "Designed for investigating GH receptor activation and somatotropic axis.",
        studiesFindings: "Studies confirm identical bioactivity to endogenous human growth hormone.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/11701431/"
      },
      {
        name: "HGH FRAGMENT 176-191",
        displayName: "HGH FRAGMENT 176-191",
        slug: "hgh-fragment",
        variations: [
          { strength: "5mg", moq: 10 },
        ],
        description: "The C-terminal fragment of HGH for lipolysis and fat metabolism research.",
        scientificPurpose: "Used for studying fat-specific effects of GH without growth properties.",
        studiesFindings: "Research shows lipolytic activity without effects on glucose or IGF-1.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/11713213/"
      },
      {
        name: "IGF-1 LR3",
        displayName: "IGF-1 LR3",
        slug: "igf-1-lr3",
        variations: [
          { strength: "0.1mg", moq: 10 },
          { strength: "1mg", moq: 10 },
        ],
        description: "Long R3 IGF-1 is a modified insulin-like growth factor for cell growth research.",
        scientificPurpose: "Designed for studying IGF-1 receptor signaling with extended half-life.",
        studiesFindings: "Studies demonstrate enhanced potency and bioavailability over native IGF-1.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/9194523/"
      },
      {
        name: "IGF-DES",
        displayName: "IGF-DES",
        slug: "igf-des",
        variations: [
          { strength: "2mg", moq: 10 },
        ],
        description: "Des(1-3)IGF-1 is a truncated IGF-1 for enhanced receptor binding research.",
        scientificPurpose: "Used for investigating IGF-1 activity without binding protein interference.",
        studiesFindings: "Research shows enhanced activity due to reduced IGFBP binding.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/8567815/"
      },
      {
        name: "HCG",
        displayName: "HCG",
        slug: "hcg",
        variations: [
          { strength: "5000 IU", moq: 10 },
          { strength: "10000 IU", moq: 10 },
        ],
        description: "Human Chorionic Gonadotropin for LH receptor research and reproductive studies.",
        scientificPurpose: "Designed for investigating gonadal function and reproductive endocrinology.",
        studiesFindings: "Studies demonstrate LH-like activity on gonadal tissue.",
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
        description: "Kisspeptin-10 is a neuropeptide for reproductive neuroendocrinology research.",
        scientificPurpose: "Used for studying GnRH release regulation and reproductive axis control.",
        studiesFindings: "Research shows potent stimulation of GnRH and gonadotropin release.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/16621871/"
      },
      {
        name: "MOTS-c",
        displayName: "MOTS-c",
        slug: "mots-c",
        variations: [
          { strength: "10mg", moq: 10 },
          { strength: "40mg", moq: 10 },
        ],
        description: "MOTS-c is a mitochondria-derived peptide for metabolic and exercise research.",
        scientificPurpose: "Designed for investigating mitochondrial signaling and metabolic adaptation.",
        studiesFindings: "Studies demonstrate effects on glucose metabolism and exercise mimetic properties.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/25738459/"
      },
      {
        name: "EPO-53000",
        displayName: "EPO-53000",
        slug: "epo-53000",
        variations: [
          { strength: "3000 IU", moq: 10 },
        ],
        description: "Erythropoietin for hematopoiesis and red blood cell production research.",
        scientificPurpose: "Used for studying erythrocyte development and oxygen-carrying capacity.",
        studiesFindings: "Research demonstrates effects on erythroid progenitor cell differentiation.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/15001466/"
      },
      {
        name: "PT-141",
        displayName: "PT-141",
        slug: "pt-141",
        variations: [
          { strength: "10mg", moq: 10 },
        ],
        description: "PT-141 (Bremelanotide) is a melanocortin receptor agonist for sexual function research.",
        scientificPurpose: "Designed for investigating MC3/MC4 receptor pathways and arousal mechanisms.",
        studiesFindings: "Studies report effects on sexual arousal pathways through central mechanisms.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/15974260/"
      },
      {
        name: "VIP",
        displayName: "VIP",
        slug: "vip",
        variations: [
          { strength: "5mg", moq: 10 },
          { strength: "10mg", moq: 10 },
        ],
        description: "Vasoactive Intestinal Peptide for vasodilation and neuropeptide research.",
        scientificPurpose: "Used for studying vasodilation, neuromodulation, and immune regulation.",
        studiesFindings: "Research shows broad neuromodulatory and anti-inflammatory effects.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/15109742/"
      },
    ]
  },
  {
    name: "Aesthetic / Cosmetic + Supplies + Stacks",
    slug: "aesthetic-cosmetic-supplies-stacks",
    products: [
      {
        name: "LEMON BOTTLE",
        displayName: "LEMON BOTTLE",
        slug: "lemon-bottle",
        variations: [
          { strength: "10mg", moq: 10 },
        ],
        description: "Lemon Bottle is an advanced lipolytic solution for fat dissolution research.",
        scientificPurpose: "Designed for studying localized lipolysis and adipocyte metabolism.",
        studiesFindings: "Studies report effects on adipocyte membranes and fat cell metabolism.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/30817890/"
      },
      {
        name: "BOTULINUM TOXIN",
        displayName: "BOTULINUM TOXIN",
        slug: "botulinum-toxin",
        variations: [
          { strength: "100 IU", moq: 10 },
        ],
        description: "Botulinum toxin for neuromuscular junction and muscle contraction research.",
        scientificPurpose: "Used for studying acetylcholine release inhibition and muscle relaxation.",
        studiesFindings: "Research demonstrates effects on SNARE complex and neurotransmitter release.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/17706675/"
      },
      {
        name: "L-CARNITINE",
        displayName: "L-CARNITINE",
        slug: "l-carnitine",
        variations: [
          { strength: "10 mL", moq: 10 },
        ],
        description: "L-Carnitine is an amino acid derivative for fatty acid metabolism research.",
        scientificPurpose: "Designed for studying mitochondrial fatty acid transport and oxidation.",
        studiesFindings: "Studies show effects on fatty acid beta-oxidation and energy metabolism.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/21224234/"
      },
      {
        name: "MT-1",
        displayName: "MT-1",
        slug: "mt-1",
        variations: [
          { strength: "10mg", moq: 10 },
        ],
        description: "Melanotan I is a linear melanocortin peptide for tanning and skin research.",
        scientificPurpose: "Used for investigating MC1 receptor activation and melanogenesis.",
        studiesFindings: "Research demonstrates melanocyte stimulation and photoprotective effects.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/8846201/"
      },
      {
        name: "MT-2 (Melanotan II)",
        displayName: "MT-2 (Melanotan II)",
        slug: "mt-2",
        variations: [
          { strength: "10mg", moq: 10 },
        ],
        description: "Melanotan II is a cyclic melanocortin peptide for pigmentation research.",
        scientificPurpose: "Designed for studying melanocortin receptor activation and melanogenesis.",
        studiesFindings: "Studies report potent melanogenesis induction through MC receptor activation.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/9831248/"
      },
      {
        name: "5-AMINO-1MQ",
        displayName: "5-AMINO-1MQ",
        slug: "5-amino-1mq",
        variations: [
          { strength: "5mg", moq: 10 },
        ],
        description: "5-Amino-1MQ is an NNMT inhibitor for metabolic and adipose tissue research.",
        scientificPurpose: "Used for studying nicotinamide N-methyltransferase and fat metabolism.",
        studiesFindings: "Research shows effects on energy expenditure and adipocyte function.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/32479746/"
      },
      {
        name: "SLU-PP-322",
        displayName: "SLU-PP-322",
        slug: "slu-pp-322",
        variations: [
          { strength: "5mg", moq: 10 },
        ],
        description: "SLU-PP-322 is a research compound for metabolic pathway investigation.",
        scientificPurpose: "Designed for studying specific metabolic enzyme inhibition pathways.",
        studiesFindings: "Studies report selective activity on targeted metabolic enzymes.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/32479746/"
      },
      {
        name: "BAC WATER",
        displayName: "BAC WATER",
        slug: "bac-water",
        variations: [
          { strength: "3mg", moq: 10 },
          { strength: "10mg", moq: 10 },
        ],
        description: "Bacteriostatic water is sterile water with 0.9% benzyl alcohol for reconstitution.",
        scientificPurpose: "Used as a diluent for reconstituting lyophilized peptides and compounds.",
        studiesFindings: "Standard preparation medium for peptide research applications.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/"
      },
      {
        name: "INSULIN",
        displayName: "INSULIN",
        slug: "insulin",
        variations: [
          { strength: "3 mL", moq: 1 },
        ],
        description: "Recombinant human insulin for glucose metabolism and cell culture research.",
        scientificPurpose: "Designed for studying insulin receptor signaling and glucose uptake.",
        studiesFindings: "Studies demonstrate effects on glucose transporter activation and metabolism.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/21324315/"
      },
      {
        name: "HYALURONIC ACID",
        displayName: "HYALURONIC ACID",
        slug: "hyaluronic-acid",
        variations: [
          { strength: "5mg", moq: 1 },
        ],
        description: "Hyaluronic acid is a glycosaminoglycan for tissue hydration and matrix research.",
        scientificPurpose: "Used for studying extracellular matrix, hydration, and tissue engineering.",
        studiesFindings: "Research shows effects on tissue hydration and wound healing pathways.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/16199091/"
      },
      {
        name: "FOLLISTATIN",
        displayName: "FOLLISTATIN",
        slug: "follistatin",
        variations: [
          { strength: "Single item", moq: 1 },
        ],
        description: "Follistatin is an activin-binding protein for muscle growth and myostatin research.",
        scientificPurpose: "Designed for studying myostatin inhibition and muscle development pathways.",
        studiesFindings: "Studies demonstrate antagonism of myostatin and promotion of muscle growth.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/11502797/"
      },
      {
        name: "GLOW STACK",
        displayName: "GLOW",
        slug: "glow",
        variations: [
          { strength: "70mg", moq: 10 },
        ],
        description: "GLOW Stack combines BPC-157, GHK-Cu, and TB500 for comprehensive skin research.",
        scientificPurpose: "Designed for investigating synergistic effects on skin repair and regeneration.",
        studiesFindings: "Studies suggest combined peptides enhance tissue repair and collagen synthesis.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/25877441/"
      },
      {
        name: "KLOW STACK",
        displayName: "KLOW",
        slug: "klow",
        variations: [
          { strength: "80mg", moq: 10 },
        ],
        description: "KLOW Stack combines CU50, BPC10, TB500, and KPV10 for advanced skin research.",
        scientificPurpose: "Designed for studying multi-peptide effects on skin health and repair.",
        studiesFindings: "Research suggests synergistic benefits from combined peptide formulations.",
        nihLink: "https://pubmed.ncbi.nlm.nih.gov/25877441/"
      },
      {
        name: "KPV (Lysine-Proline-Valine)",
        displayName: "KPV (Lysine-Proline-Valine)",
        slug: "kpv",
        variations: [
          { strength: "5mg", moq: 10 },
          { strength: "10mg", moq: 10 },
        ],
        description: "KPV is an alpha-MSH derived tripeptide for anti-inflammatory research.",
        scientificPurpose: "Used for studying melanocortin-related anti-inflammatory pathways.",
        studiesFindings: "Research shows anti-inflammatory effects independent of melanocortin receptors.",
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
