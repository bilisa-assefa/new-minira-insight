export interface MapLabelItem {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: 'mineral' | 'city' | 'geology' | 'river';
  typeLabel: string;
  description: string;
  mineralPotential?: string;
  rockType?: string;
}

export const ETHIOPIA_MAP_LABELS: MapLabelItem[] = [
  // ===================== MINERAL DEPOSITS & MINES =====================
  {
    id: 'm-lega-dembi',
    name: 'Lega Dembi Gold Mine',
    lat: 5.717,
    lng: 38.905,
    category: 'mineral',
    typeLabel: 'Gold Mine',
    mineralPotential: 'Gold (Au)',
    rockType: 'Metamorphic (Greenstone)',
    description: "Ethiopia's largest primary hard-rock gold mine, located in the Neoproterozoic Megado shear belt of Adola."
  },
  {
    id: 'm-sakaro',
    name: 'Sakaro Gold Deposit',
    lat: 5.742,
    lng: 38.921,
    category: 'mineral',
    typeLabel: 'Gold Deposit',
    mineralPotential: 'Gold (Au)',
    rockType: 'Metamorphic (Quartz-vein)',
    description: 'High-grade underground quartz-vein gold deposit north of Lega Dembi in the Adola belt.'
  },
  {
    id: 'm-okote',
    name: 'Okote Gold Prospect',
    lat: 5.580,
    lng: 38.830,
    category: 'mineral',
    typeLabel: 'Gold Prospect',
    mineralPotential: 'Gold (Au)',
    rockType: 'Metamorphic (Amphibolite)',
    description: 'Southern extension of the Megado belt with significant gold shear-zone mineralization.'
  },
  {
    id: 'm-tulu-kapi',
    name: 'Tulu Kapi Gold Project',
    lat: 9.015,
    lng: 35.433,
    category: 'mineral',
    typeLabel: 'Gold Mine',
    mineralPotential: 'Gold (Au)',
    rockType: 'Volcanic / Granitoid',
    description: 'Major open-pit and underground gold resource in syenite intrusive within the Western Ethiopian Shield.'
  },
  {
    id: 'm-kenticha',
    name: 'Kenticha Lithium & Tantalum',
    lat: 5.520,
    lng: 39.020,
    category: 'mineral',
    typeLabel: 'Li & Ta Mine',
    mineralPotential: 'Lithium (Spodumene) & Tantalum',
    rockType: 'Metamorphic (Pegmatite)',
    description: 'World-class LCT zoned pegmatite deposit producing columbite-tantalite and high-grade spodumene lithium.'
  },
  {
    id: 'm-dallol',
    name: 'Dallol Potash & Salt',
    lat: 14.242,
    lng: 40.298,
    category: 'mineral',
    typeLabel: 'Potash Basin',
    mineralPotential: 'Potash, Sylvite, Carnallite',
    rockType: 'Sedimentary (Evaporite)',
    description: 'Vast Danakil marine evaporite basin holding one of the largest unmined potash reserves globally.'
  },
  {
    id: 'm-delanta',
    name: 'Delanta / Wegel Tena Opal',
    lat: 11.590,
    lng: 39.220,
    category: 'mineral',
    typeLabel: 'Precious Opal',
    mineralPotential: 'Hydrophane Precious Opal',
    rockType: 'Volcanic (Rhyolitic Ignimbrite)',
    description: 'Famous source of world-renowned Ethiopian hydrophane play-of-color precious opals.'
  },
  {
    id: 'm-mezezo',
    name: 'Mezezo Chocolate Opal',
    lat: 10.330,
    lng: 39.750,
    category: 'mineral',
    typeLabel: 'Nodular Opal',
    mineralPotential: 'Precious & Fire Opal',
    rockType: 'Volcanic (Perlite / Rhyolite)',
    description: 'Historic discovery site of Ethiopian nodular red and chocolate precious opal in Tertiary volcanics.'
  },
  {
    id: 'm-yubdo',
    name: 'Yubdo Platinum & Chromite',
    lat: 8.950,
    lng: 35.450,
    category: 'mineral',
    typeLabel: 'Platinum Field',
    mineralPotential: 'Platinum Group & Chromite',
    rockType: 'Metamorphic (Birbirite / Ultramafic)',
    description: 'Ancient eluvial and alluvial platinum deposit weathered from Dunite-Birbirite ultramafic complex.'
  },
  {
    id: 'm-bikilal',
    name: 'Bikilal Phosphate & Titanium',
    lat: 9.180,
    lng: 35.880,
    category: 'mineral',
    typeLabel: 'Ti & Phosphate',
    mineralPotential: 'Titanium (Ilmenite), Apatite & Iron',
    rockType: 'Metamorphic (Layered Gabbro)',
    description: 'Major apatite-bearing layered gabbroic intrusive with substantial phosphate fertilizer potential.'
  },
  {
    id: 'm-asosa-gold',
    name: 'Asosa Gold Belt',
    lat: 10.060,
    lng: 34.530,
    category: 'mineral',
    typeLabel: 'Gold District',
    mineralPotential: 'Gold (Au)',
    rockType: 'Metamorphic (Greenstone)',
    description: 'Precambrian greenstone-hosted gold veins and extensive placer washings near the Sudanese border.'
  },
  {
    id: 'm-kurmuk',
    name: 'Kurmuk Gold Prospect',
    lat: 10.550,
    lng: 34.280,
    category: 'mineral',
    typeLabel: 'Gold Prospect',
    mineralPotential: 'Gold (Au)',
    rockType: 'Volcanic / Metamorphic',
    description: 'High-prospectivity gold vein systems located along the Ethiopian-Sudanese shear corridor.'
  },
  {
    id: 'm-dul',
    name: 'Dul Placer Gold Deposit',
    lat: 10.370,
    lng: 34.820,
    category: 'mineral',
    typeLabel: 'Alluvial Gold',
    mineralPotential: 'Placer Gold (Au)',
    rockType: 'Sedimentary (Alluvial Gravels)',
    description: 'Extensive quaternary gravels hosting rich placer gold deposits mined for centuries.'
  },
  {
    id: 'm-terakimti',
    name: 'Terakimti VMS Copper-Gold',
    lat: 14.050,
    lng: 38.310,
    category: 'mineral',
    typeLabel: 'VMS Cu-Au-Zn',
    mineralPotential: 'Copper, Zinc, Gold, Silver',
    rockType: 'Volcanic (Felsic Metavolcanics)',
    description: 'Tigray Neoproterozoic Volcanogenic Massive Sulfide (VMS) deposit with gossan gold caps.'
  },
  {
    id: 'm-moyale-gold',
    name: 'Moyale Gold Field',
    lat: 3.530,
    lng: 39.050,
    category: 'mineral',
    typeLabel: 'Gold Field',
    mineralPotential: 'Gold (Au)',
    rockType: 'Metamorphic (Borena Amphibolite)',
    description: 'Southern border greenstone belt shear zones hosting quartz-carbonate gold mineralization.'
  },
  {
    id: 'm-dimma',
    name: 'Dimma Placer Gold Basin',
    lat: 6.780,
    lng: 35.120,
    category: 'mineral',
    typeLabel: 'Placer Gold',
    mineralPotential: 'Gold (Au) & Platinum',
    rockType: 'Sedimentary (River Terrace)',
    description: 'Abundant artisanal gold operations along the Akobo-Baro alluvial terraces in Gambela/SNNPR.'
  },
  {
    id: 'm-calub',
    name: 'Calub Natural Gas Field',
    lat: 6.230,
    lng: 44.500,
    category: 'mineral',
    typeLabel: 'Gas & Condensate',
    mineralPotential: 'Natural Gas & Condensate',
    rockType: 'Sedimentary (Adigrat Sandstone)',
    description: 'Proven multi-trillion cubic feet natural gas discovery in the deep Ogaden basin.'
  },
  {
    id: 'm-hilala',
    name: 'Hilala Hydrocarbon Field',
    lat: 6.550,
    lng: 44.200,
    category: 'mineral',
    typeLabel: 'Hydrocarbon',
    mineralPotential: 'Natural Gas & Crude Oil',
    rockType: 'Sedimentary (Hamanlei Limestone)',
    description: 'Jurassic carbonate petroleum reservoir in the Somali Regional State.'
  },
  {
    id: 'm-babile',
    name: 'Babile Pegmatite Field',
    lat: 9.220,
    lng: 42.330,
    category: 'mineral',
    typeLabel: 'Rare Elements',
    mineralPotential: 'Feldspar, Mica, Quartz & REEs',
    rockType: 'Metamorphic (Granite Pegmatite)',
    description: 'Industrial feldspar and rare-element pegmatites east of Harar in granitic basement rocks.'
  },
  {
    id: 'm-konso',
    name: 'Konso Gemstone Pegmatites',
    lat: 5.340,
    lng: 37.440,
    category: 'mineral',
    typeLabel: 'Gemstones',
    mineralPotential: 'Beryl, Tourmaline & Quartz',
    rockType: 'Metamorphic (Gneiss & Pegmatite)',
    description: 'Abundant colored gemstone and industrial quartz occurrences in Southern Ethiopian gneiss.'
  },
  {
    id: 'm-tendaho',
    name: 'Tendaho Geothermal & Sulfur',
    lat: 11.750,
    lng: 41.000,
    category: 'mineral',
    typeLabel: 'Geothermal & S',
    mineralPotential: 'Native Sulfur & Geothermal Energy',
    rockType: 'Volcanic (Rift Basalts)',
    description: 'Active hydrothermal caldera systems in the Afar rift with elemental sulfur and high enthalpy heat.'
  },
  {
    id: 'm-guraferda',
    name: 'Guraferda Gold Prospect',
    lat: 6.850,
    lng: 35.300,
    category: 'mineral',
    typeLabel: 'Gold Prospect',
    mineralPotential: 'Gold (Au) & Iron',
    rockType: 'Metamorphic / Volcanic',
    description: 'Western virgin mineral exploration frontier with high geochemical gold anomalies.'
  },
  {
    id: 'm-metema-shinfa',
    name: 'Metema / Shinfa Gold Washings',
    lat: 12.960,
    lng: 36.190,
    category: 'mineral',
    typeLabel: 'Placer Gold',
    mineralPotential: 'Placer Gold (Au)',
    rockType: 'Sedimentary (River Washings)',
    description: 'Active alluvial washings along the border rivers draining western basaltic/basement ridges.'
  },
  {
    id: 'm-dubuluk',
    name: 'Dubuluk Ultramafic Nickel-Cr',
    lat: 4.150,
    lng: 38.300,
    category: 'mineral',
    typeLabel: 'Ni & Chromite',
    mineralPotential: 'Nickel, Chromium & Magnesite',
    rockType: 'Metamorphic (Serpentinite)',
    description: 'Ophiolitic suture zone containing serpentinite bodies with nickel-copper-chromite showings.'
  },
  {
    id: 'm-dire-dawa-limestone',
    name: 'Dire Dawa Limestone & Marble',
    lat: 9.600,
    lng: 41.870,
    category: 'mineral',
    typeLabel: 'Industrial Minerals',
    mineralPotential: 'Cement Limestone & Dimension Stone',
    rockType: 'Sedimentary (Jurassic Limestone)',
    description: 'High-purity calcium carbonate formations supporting major industrial mineral extraction.'
  },

  // ===================== REGIONAL CAPITALS & MINING HUBS =====================
  {
    id: 'c-addis-ababa',
    name: 'Addis Ababa',
    lat: 9.030,
    lng: 38.740,
    category: 'city',
    typeLabel: 'Capital City',
    description: 'Federal Capital of Ethiopia; Geological Survey of Ethiopia (GSE) headquarters & mineral registry.'
  },
  {
    id: 'c-shakiso',
    name: 'Shakiso',
    lat: 5.750,
    lng: 38.920,
    category: 'city',
    typeLabel: 'Gold & Tantalum Hub',
    description: 'Main operational hub for Southern Ethiopian gold and columbite-tantalite mining operations.'
  },
  {
    id: 'c-asosa',
    name: 'Asosa',
    lat: 10.070,
    lng: 34.530,
    category: 'city',
    typeLabel: 'Regional Capital',
    description: 'Capital of Benishangul-Gumuz Region; primary administrative base for western gold prospecting.'
  },
  {
    id: 'c-negele-borana',
    name: 'Negele Borana',
    lat: 5.330,
    lng: 39.580,
    category: 'city',
    typeLabel: 'Mining Logistics Hub',
    description: 'Logistics and exploration centre for southern basement terranes and Dawa river basin.'
  },
  {
    id: 'c-moyale',
    name: 'Moyale',
    lat: 3.530,
    lng: 39.050,
    category: 'city',
    typeLabel: 'Border Hub',
    description: 'Commercial and geological hub on the Kenya-Ethiopia border greenstone corridor.'
  },
  {
    id: 'c-hawassa',
    name: 'Hawassa',
    lat: 7.060,
    lng: 38.480,
    category: 'city',
    typeLabel: 'Regional Capital',
    description: 'Capital of Sidama Region; key center situated along the Main Ethiopian Rift corridor.'
  },
  {
    id: 'c-mekelle',
    name: 'Mekelle',
    lat: 13.500,
    lng: 39.470,
    category: 'city',
    typeLabel: 'Regional Capital',
    description: 'Capital of Tigray Region; gateway to the northern Arabian-Nubian VMS belt and Danakil potash.'
  },
  {
    id: 'c-dire-dawa',
    name: 'Dire Dawa',
    lat: 9.590,
    lng: 41.860,
    category: 'city',
    typeLabel: 'Charter City',
    description: 'Major industrial transport hub, cement production center, and eastern mineral processing corridor.'
  },
  {
    id: 'c-harar',
    name: 'Harar',
    lat: 9.310,
    lng: 42.130,
    category: 'city',
    typeLabel: 'Historic City',
    description: 'Eastern upland trading city situated adjacent to the Harar pegmatite and marble belts.'
  },
  {
    id: 'c-bahir-dar',
    name: 'Bahir Dar',
    lat: 11.590,
    lng: 37.390,
    category: 'city',
    typeLabel: 'Regional Capital',
    description: 'Capital of Amhara Region on Lake Tana; gateway to Blue Nile basin and plateau basalt provinces.'
  },
  {
    id: 'c-gondar',
    name: 'Gondar',
    lat: 12.600,
    lng: 37.470,
    category: 'city',
    typeLabel: 'Historic Center',
    description: 'Northern commercial center near the Simien volcanic shields and northwestern exploration districts.'
  },
  {
    id: 'c-jimma',
    name: 'Jimma',
    lat: 7.670,
    lng: 36.830,
    category: 'city',
    typeLabel: 'Zonal Capital',
    description: 'Southwestern economic hub providing staging for Kaffa, Illubabor, and Omo basin exploration.'
  },
  {
    id: 'c-nekemte',
    name: 'Nekemte',
    lat: 9.080,
    lng: 36.550,
    category: 'city',
    typeLabel: 'Western Hub',
    description: 'East Welega capital; transport spine connecting Addis Ababa to Tulu Kapi and Yubdo mineral fields.'
  },
  {
    id: 'c-arba-minch',
    name: 'Arba Minch',
    lat: 6.030,
    lng: 37.550,
    category: 'city',
    typeLabel: 'Southern Hub',
    description: 'Southern Rift city between Lake Abaya and Lake Chamo; base for gemstone & nickel investigations.'
  },
  {
    id: 'c-gambela',
    name: 'Gambela',
    lat: 8.250,
    lng: 34.580,
    category: 'city',
    typeLabel: 'Regional Capital',
    description: 'Capital of Gambela Region along the Baro River; center for alluvial gold and petroleum exploration.'
  },
  {
    id: 'c-jijiga',
    name: 'Jijiga',
    lat: 9.350,
    lng: 42.800,
    category: 'city',
    typeLabel: 'Regional Capital',
    description: 'Capital of Somali Region; administrative centre for the Ogaden sedimentary basin.'
  },
  {
    id: 'c-semera',
    name: 'Semera',
    lat: 11.790,
    lng: 41.010,
    category: 'city',
    typeLabel: 'Regional Capital',
    description: 'Capital of Afar Region; logistical base for Danakil potash, sulfur, and geothermal concessions.'
  },
  {
    id: 'c-adama',
    name: 'Adama (Nazret)',
    lat: 8.540,
    lng: 39.270,
    category: 'city',
    typeLabel: 'Industrial Center',
    description: 'Major transport hub in the Rift Valley connecting the central plateau with the Djibouti corridor.'
  },
  {
    id: 'c-dessie',
    name: 'Dessie',
    lat: 11.130,
    lng: 39.640,
    category: 'city',
    typeLabel: 'Zonal Hub',
    description: 'Eastern Amhara city adjacent to the Rift escarpment and gateway to the Delanta opal fields.'
  },
  {
    id: 'c-debre-markos',
    name: 'Debre Markos',
    lat: 10.330,
    lng: 37.730,
    category: 'city',
    typeLabel: 'Gojjam Center',
    description: 'Highland plateau center overlooking the Abay (Blue Nile) gorge sedimentary and coal exposures.'
  },
  {
    id: 'c-debre-birhan',
    name: 'Debre Birhan',
    lat: 9.680,
    lng: 39.530,
    category: 'city',
    typeLabel: 'Industrial Center',
    description: 'High altitude center in North Shewa; staging area for Mezezo nodular opal and silica sand sites.'
  },
  {
    id: 'c-axum',
    name: 'Axum',
    lat: 14.120,
    lng: 38.720,
    category: 'city',
    typeLabel: 'Historic Center',
    description: 'Historic city located in the northern metavolcanic greenstone belt.'
  },
  {
    id: 'c-shire',
    name: 'Shire (Inda Selassie)',
    lat: 14.100,
    lng: 38.280,
    category: 'city',
    typeLabel: 'Zonal Capital',
    description: 'Northwestern Tigray center near major VMS polymetallic copper-gold exploration tracts.'
  },
  {
    id: 'c-humera',
    name: 'Humera',
    lat: 14.300,
    lng: 36.620,
    category: 'city',
    typeLabel: 'Border Hub',
    description: 'Tri-border agricultural and alluvial exploration district near the Tekeze river.'
  },
  {
    id: 'c-dolo-odo',
    name: 'Dolo Odo',
    lat: 4.180,
    lng: 42.080,
    category: 'city',
    typeLabel: 'Southernmost Hub',
    description: 'Tripoint border town where Dawa and Genale rivers meet; border river placer gold prospecting.'
  },
  {
    id: 'c-gode',
    name: 'Gode',
    lat: 5.900,
    lng: 43.550,
    category: 'city',
    typeLabel: 'Zonal Hub',
    description: 'Key trading town in the central Ogaden basin along the Wabe Shebelle river.'
  },
  {
    id: 'c-kebri-dehar',
    name: 'Kebri Dehar',
    lat: 6.730,
    lng: 44.280,
    category: 'city',
    typeLabel: 'Basin Center',
    description: 'Strategic center in the heart of the Ogaden oil and natural gas concession zones.'
  },
  {
    id: 'c-robe',
    name: 'Robe / Bale',
    lat: 7.120,
    lng: 40.000,
    category: 'city',
    typeLabel: 'Bale Hub',
    description: 'Gateway to the Bale basaltic volcanic shield and southern sedimentary transition zones.'
  },
  {
    id: 'c-bule-hora',
    name: 'Bule Hora',
    lat: 5.630,
    lng: 38.240,
    category: 'city',
    typeLabel: 'West Guji Hub',
    description: 'Key commercial transit center along the southern highway between Addis Ababa and Moyale.'
  },
  {
    id: 'c-sodo',
    name: 'Sodo (Wolaita)',
    lat: 6.860,
    lng: 37.760,
    category: 'city',
    typeLabel: 'Zonal Hub',
    description: 'Southern highlands commercial center near Lake Abaya and rift volcanic pumice fields.'
  },
  {
    id: 'c-jinka',
    name: 'Jinka',
    lat: 5.650,
    lng: 36.570,
    category: 'city',
    typeLabel: 'South Omo Hub',
    description: 'Administrative capital of South Omo; staging base for lower Omo rift basin geological surveys.'
  },
  {
    id: 'c-mizan-teferi',
    name: 'Mizan Teferi',
    lat: 6.990,
    lng: 35.580,
    category: 'city',
    typeLabel: 'Bench Sheko Hub',
    description: 'Southwestern frontier city servicing Dimma and Akobo alluvial mining camps.'
  },

  // ===================== GEOLOGICAL FORMATIONS & FAULT BELTS =====================
  {
    id: 'g-adola-belt',
    name: 'Adola Greenstone Belt',
    lat: 5.650,
    lng: 38.950,
    category: 'geology',
    typeLabel: 'Greenstone Belt',
    mineralPotential: 'Gold & Tantalum-Lithium',
    rockType: 'Precambrian Metamorphic',
    description: 'Prolific Neoproterozoic greenstone-gneiss belt containing major shear-hosted gold and LCT pegmatites.'
  },
  {
    id: 'g-main-rift',
    name: 'Main Ethiopian Rift (MER)',
    lat: 8.200,
    lng: 38.900,
    category: 'geology',
    typeLabel: 'Continental Rift',
    mineralPotential: 'Geothermal, Pumice & Zeolite',
    rockType: 'Cenozoic Volcanics',
    description: 'Active tectonic rift valley characterized by normal faults, caldera volcanoes, and hydrothermal vents.'
  },
  {
    id: 'g-afar-triple-junction',
    name: 'Afar Triple Junction',
    lat: 11.500,
    lng: 41.500,
    category: 'geology',
    typeLabel: 'Triple Junction',
    mineralPotential: 'Sulfur, Geothermal & Salt',
    rockType: 'Rift Basalts & Oceanic Crust',
    description: 'Tectonic intersection where the Red Sea, Gulf of Aden, and East African Rifts meet.'
  },
  {
    id: 'g-danakil-depression',
    name: 'Danakil Depression (-125m)',
    lat: 14.150,
    lng: 40.350,
    category: 'geology',
    typeLabel: 'Rift Sub-Basin',
    mineralPotential: 'Potash, Halite, Gypsum',
    rockType: 'Evaporitic Sediments',
    description: 'Deepest sub-aerial basin in Africa; hyper-saline evaporite sequence exceeding 2,000m in thickness.'
  },
  {
    id: 'g-erta-ale',
    name: 'Erta Ale Volcanic Range',
    lat: 13.600,
    lng: 40.670,
    category: 'geology',
    typeLabel: 'Active Volcanic Shield',
    mineralPotential: 'Basalt, Sulfur & Hydrothermal',
    rockType: 'Active Shield Volcano',
    description: 'Continuously active basaltic lava lake and axial rift volcanic ridge in northern Afar.'
  },
  {
    id: 'g-western-shield',
    name: 'Western Precambrian Shield',
    lat: 9.500,
    lng: 35.000,
    category: 'geology',
    typeLabel: 'Precambrian Craton',
    mineralPotential: 'Gold, Base Metals, Platinum',
    rockType: 'Metavolcanics & Granitoids',
    description: 'Ancient Arabian-Nubian metamorphic basement hosting shear-hosted gold and mafic-ultramafic complexes.'
  },
  {
    id: 'g-tigray-ans',
    name: 'Northern Arabian-Nubian Shield',
    lat: 14.000,
    lng: 38.500,
    category: 'geology',
    typeLabel: 'Orogenic Belt',
    mineralPotential: 'VMS Copper-Zinc-Gold',
    rockType: 'Neoproterozoic Low-grade Metasediments',
    description: 'Volcanic arc assemblage with world-class potential for volcanogenic massive sulfide ore bodies.'
  },
  {
    id: 'g-blue-nile-gorge',
    name: 'Blue Nile (Abay) Gorge',
    lat: 10.050,
    lng: 38.150,
    category: 'geology',
    typeLabel: 'Mesozoic Basin Outlier',
    mineralPotential: 'Limestone, Gypsum, Coal, Iron',
    rockType: 'Mesozoic Sedimentary Strata',
    description: 'Deep canyon cross-section exposing Jurassic limestone, gypsum, and Paleozoic sandstones beneath flood basalts.'
  },
  {
    id: 'g-ogaden-basin',
    name: 'Ogaden Sedimentary Basin',
    lat: 7.000,
    lng: 44.000,
    category: 'geology',
    typeLabel: 'Intracratonic Basin',
    mineralPotential: 'Hydrocarbons, Salt, Gypsum',
    rockType: 'Mesozoic-Cenozoic Sediments',
    description: '350,000 km² petroliferous sedimentary basin containing extensive Jurassic and Cretaceous formations.'
  },
  {
    id: 'g-wonji-fault',
    name: 'Wonji Fault Belt (WFB)',
    lat: 8.400,
    lng: 39.300,
    category: 'geology',
    typeLabel: 'Active Quaternary Faults',
    mineralPotential: 'Fault-controlled Hydrothermal Gold',
    rockType: 'Quaternary Fracture Zone',
    description: 'Right-stepping en-echelon active rift fault swarm controlling volcanism and thermal springs.'
  },
  {
    id: 'g-chew-bahir',
    name: 'Chew Bahir Rift Trough',
    lat: 5.000,
    lng: 36.900,
    category: 'geology',
    typeLabel: 'Tectonic Graben',
    mineralPotential: 'Alluvial Heavy Minerals & Clay',
    rockType: 'Quaternary Lacustrine Fill',
    description: 'Southern rift graben with thick lacustrine sediments and alluvial deposits.'
  },
  {
    id: 'g-yerer-lineament',
    name: 'Yerer-Tullu Wellel Lineament',
    lat: 8.900,
    lng: 36.800,
    category: 'geology',
    typeLabel: 'Tectonic Lineament',
    mineralPotential: 'Alkaline Intrusions & Rare Metals',
    rockType: 'Volcano-Tectonic Zone',
    description: 'Major East-West structural accommodation zone across western and central Ethiopia.'
  },

  // ===================== PLACER GOLD & ALLUVIAL RIVER BASINS =====================
  {
    id: 'r-abay-basin',
    name: 'Abay / Blue Nile Placer Basin',
    lat: 10.500,
    lng: 37.000,
    category: 'river',
    typeLabel: 'Alluvial Gold River',
    mineralPotential: 'Placer Gold (Au)',
    rockType: 'Alluvial River Terraces',
    description: 'High-energy gravel terraces and inside river bends concentrating alluvial placer gold.'
  },
  {
    id: 'r-dawa-river',
    name: 'Dawa River Gold Basin',
    lat: 4.800,
    lng: 40.500,
    category: 'river',
    typeLabel: 'Placer Gold River',
    mineralPotential: 'Placer Gold (Au)',
    rockType: 'Alluvial Gravels & Sands',
    description: 'Renowned placer gold river system draining the Adola and Borena metamorphic shields.'
  },
  {
    id: 'r-genale-river',
    name: 'Genale River Placer Basin',
    lat: 5.500,
    lng: 41.000,
    category: 'river',
    typeLabel: 'Alluvial Basin',
    mineralPotential: 'Heavy Mineral Placers & Gold',
    rockType: 'Alluvial Valleys',
    description: 'Major drainage draining the Bale highlands and Guji basement rocks with placer deposits.'
  },
  {
    id: 'r-baro-akobo',
    name: 'Baro-Akobo Placer Basin',
    lat: 7.800,
    lng: 34.500,
    category: 'river',
    typeLabel: 'Placer Gold & Platinum',
    mineralPotential: 'Placer Gold & Platinum',
    rockType: 'Quaternary Alluvium',
    description: 'Lowland meanders with extensive artisanal gold and platinum panning operations.'
  },
  {
    id: 'r-tekeze-basin',
    name: 'Tekeze River Basin',
    lat: 13.800,
    lng: 37.500,
    category: 'river',
    typeLabel: 'Alluvial Drainage',
    mineralPotential: 'Alluvial Gold & Base Metals',
    rockType: 'River Terraces & Canyons',
    description: 'Deep northern canyon river draining the Arabian-Nubian shield metavolcanics.'
  },
  {
    id: 'r-omo-basin',
    name: 'Omo River Basin',
    lat: 6.500,
    lng: 36.700,
    category: 'river',
    typeLabel: 'Alluvial Basin',
    mineralPotential: 'Placer Gold, Titanium & Zircon',
    rockType: 'Alluvial Floodplains',
    description: 'Extensive alluvial basin with heavy mineral sand concentrates along river meanders.'
  },
  {
    id: 'r-awash-river',
    name: 'Awash River Basin',
    lat: 9.000,
    lng: 40.200,
    category: 'river',
    typeLabel: 'Rift Drainage',
    mineralPotential: 'Industrial Clays & Diatomite',
    rockType: 'Lacustrine & Alluvial Silt',
    description: 'Central rift drainage system terminating in saline lakes with thick clay and bentonite beds.'
  },
  {
    id: 'r-wabe-shebelle',
    name: 'Wabe Shebelle Basin',
    lat: 7.500,
    lng: 42.500,
    category: 'river',
    typeLabel: 'Sedimentary Basin River',
    mineralPotential: 'Gypsum, Salt & Sand Placers',
    rockType: 'Sedimentary Alluvial Sands',
    description: 'Vast southeastern river basin traversing the Mesozoic Ogaden limestone and gypsum belts.'
  }
];
