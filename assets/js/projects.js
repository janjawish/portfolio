const PROJECTS = [
  { id:'fidal', category:'audiovisuel', cover:'assets/img/fidal.svg', title:'Fidal Recrutement', year:2025, summary:'L\'énorme projet pour le leader des cabinet d\'avocats en Europe et en France : FIDAL. La vidéo devait répondre à une problémtique celle des jeunes diplômés qui préféraient travailler dans les grandes métropoles comme Paris, et pour les attirer en Normandie. Pour montrer que en Normandie nous avons de très grand cabinets d\'avocats !', videoId:'uwGRvy0acEU', stack:['Premiere Pro','After Effects', 'Adobe Audition'], role:'Son, pitch du projet et motion design', context:'Projet Scolaire', links:{ video:'https://youtu.be/uwGRvy0acEU' } },
  { id:'fidal-9:16', category:'audiovisuel', cover:'assets/img/fidal.svg', title:'Fidal Recrutement 9:16', year:2025, summary:'L\'énorme projet pour le leader des cabinet d\'avocats en Europe et en France : FIDAL. La vidéo en version short devait répondre à une problémtique celle des jeunes diplômés qui préféraient travailler dans les grandes métropoles comme Paris, et pour les attirer en Normandie. Pour montrer que en Normandie nous avons de très grand cabinets d\'avocats !', videoId:'FxZGBFN66BY', stack:['Premiere Pro','After Effects', 'Adobe Audition'], role:'Son, pitch du projet et motion design', context:'Projet Scolaire', links:{ video:'https://www.youtube.com/shorts/FxZGBFN66BY' } },
  /* --- Photographie (full-screen gallery trigger as a project) --- */
{
  id:'dossier-comm',
  category:'',
  title:'Curriculum Vitae',
  year:2025,
  summary:'Mon Curriculum Vitae dans le cadre de ma recherche de stage.',
  pdf:'assets/pdfs/cv.pdf',          
  cover:'assets/img/cv.svg',
  stack:['PDF'],
  context:'Projet Scolaire'
},
{ id:'photographie', category:'photo', summary:'Les diffèrentes photos que j\'ai prises lors de mon parcours scolaire ou personnel.', title:'Galerie Photographie', cadre:'L\'ensemble des photos prises sont soumises au droit à l\'auteur et leur republications, modifications, appropriations ne sont pas autorisées sans l\'accord de Jan Jawish<br><br>Ce que j\'essaye de transmettre avec les photos que j\'ai prises c\'est l\'émotion et le regard intense des personnes pour raconter leur histoire via leur regard.',

  cover:'assets/img/photos.svg',
  albums: [
        {
      id:'lunettes', title:'Portraits avec lunettes', year:2024, cadre:'Les photographies sont nées d\’une collaboration avec l\’équipe de Oopticien, dans le but de mettre en valeur leur sélection de lunettes pour leurs supports de communication. Réseaux sociaux, impressions et vitrines. J\’ai pris en charge l\’organisation complète du shooting, de la préparation à la réalisation. Une fois les images capturées, j\’ai assuré la retouche couleur et la correction des imperfections à l\’aide d’Adobe Photoshop et Lightroom.',
      photos:[
        'assets/img/photos/Lunettes/1.jpg',
        'assets/img/photos/Lunettes/2.jpg',
        'assets/img/photos/Lunettes/3.jpg',
        'assets/img/photos/Lunettes/4.jpg',
        'assets/img/photos/Lunettes/5.jpg',
        'assets/img/photos/Lunettes/6.jpg',
        'assets/img/photos/Lunettes/7.jpg',
        'assets/img/photos/Lunettes/8.jpg',
        'assets/img/photos/Lunettes/9.jpg',
        'assets/img/photos/Lunettes/10.jpg',
        'assets/img/photos/Lunettes/11.jpg',
        'assets/img/photos/Lunettes/13.jpg',
        'assets/img/photos/Lunettes/14.jpg',
        'assets/img/photos/Lunettes/15.jpg',
        'assets/img/photos/Lunettes/16.jpg',
        'assets/img/photos/Lunettes/17.jpg',
        'assets/img/photos/Lunettes/18.jpg',
        'assets/img/photos/Lunettes/19.jpg',
        'assets/img/photos/Lunettes/20.jpg',
        'assets/img/photos/Lunettes/21.jpg',
        'assets/img/photos/Lunettes/22.jpg',
        'assets/img/photos/Lunettes/23.jpg',
        'assets/img/photos/Lunettes/24.jpg',
        'assets/img/photos/Lunettes/25.jpg',
        'assets/img/photos/Lunettes/26.jpg',
        'assets/img/photos/Lunettes/27.jpg',
        'assets/img/photos/Lunettes/28.jpg',
        'assets/img/photos/Lunettes/29.jpg',
        'assets/img/photos/Lunettes/30.jpg',
        'assets/img/photos/Lunettes/31.jpg',
        'assets/img/photos/Lunettes/32.jpg',
        'assets/img/photos/Lunettes/33.jpg',
        'assets/img/photos/Lunettes/34.jpg',
        'assets/img/photos/Lunettes/35.jpg',
        'assets/img/photos/Lunettes/36.jpg',
        'assets/img/photos/Lunettes/37.jpg',
        'assets/img/photos/Lunettes/38.jpg',
        'assets/img/photos/Lunettes/39.jpg',
        'assets/img/photos/Lunettes/40.jpg',
        'assets/img/photos/Lunettes/41.jpg',
        'assets/img/photos/Lunettes/42.jpg',
        'assets/img/photos/Lunettes/43.jpg',
        'assets/img/photos/Lunettes/44.jpg',
      ]
    },
    {
      id:'portraits', title:'portraits', year:2023, cadre:'Les portraits ont pour objectif de mettre en valeur les traits uniques de chaque personne et de capturer leurs atouts naturels. L\’intention était également de transmettre les émotions partagées lors de nos échanges.', role:'Mon rôle consistait à instaurer un véritable lien social, à mettre chacun à l\’aise et à favoriser une connexion authentique afin d\’obtenir des portraits sincères et expressifs.',
      photos:[
        'assets/img/photos/portraits/1.jpg',
        'assets/img/photos/portraits/2.jpg',
        'assets/img/photos/portraits/3.jpg',
        'assets/img/photos/portraits/4.jpg',
        'assets/img/photos/portraits/5.jpg',
        'assets/img/photos/portraits/6.jpg',
        'assets/img/photos/portraits/7.jpg',
        'assets/img/photos/portraits/9.jpg',
        'assets/img/photos/portraits/10.jpg',
        'assets/img/photos/portraits/11.jpg',
        'assets/img/photos/portraits/12.jpg',
        'assets/img/photos/portraits/13.jpg',
        'assets/img/photos/portraits/14.jpg',
        'assets/img/photos/portraits/15.jpg'
      ]
    },
    {
      id:'petanque', title:'Pétanque', year:2024, cadre:'Lors de mon passage à l\’Île Aumône à Mantes-la-Jolie, j\’ai rencontré un groupe de personnes en pleine partie de pétanque. Les échanges ont été d\’une grande authenticité, et les photos en sont le reflet. J\’ai pris beaucoup de plaisir à réaliser cette série d\’images.', role:'J\’ai entièrement géré cette série photographique, de la prise de contact spontanée jusqu’à la réalisation et la sélection des images, en veillant à capturer l\’authenticité de la scène et la chaleur des échanges.',
      photos:[
        'assets/img/photos/petanque/1.jpg',
        'assets/img/photos/petanque/2.jpg',
        'assets/img/photos/petanque/3.jpg',
        'assets/img/photos/petanque/4.jpg',
        'assets/img/photos/petanque/5.jpg',
        'assets/img/photos/petanque/6.jpg',
        'assets/img/photos/petanque/7.jpg',
        'assets/img/photos/petanque/8.jpg',
        'assets/img/photos/petanque/9.jpg',
        'assets/img/photos/petanque/10.jpg',
        'assets/img/photos/petanque/11.jpg',
        'assets/img/photos/petanque/12.jpg',
        'assets/img/photos/petanque/13.jpg',
        'assets/img/photos/petanque/14.jpg',
      ]
    },
            {
      id:'pompiers', title:'Entraînements Pompiers', year:2025, cadre:'Lors d\’une balade en bord de Seine, j\’ai aperçu des pompiers en pleine séance d\’entraînement. J\’ai immédiatement saisi mon appareil photo pour immortaliser ce moment intense et captivant.', role:'Toutes les actions réalisées sur ces photos ont été effectuées par des professionnels formés. Il est important de ne pas tenter de les reproduire.',
      photos:[
        'assets/img/photos/pompiers/1.jpg',
        'assets/img/photos/pompiers/2.jpg',
        'assets/img/photos/pompiers/3.jpg',
        'assets/img/photos/pompiers/4.jpg',
        'assets/img/photos/pompiers/5.jpg'
      ]
    },
    {
      id:'nature', title:'Nature', year:2023, cadre:'Une série de photographies que j\’ai réalisées pour mettre en valeur la beauté de la nature et souligner la richesse de notre planète. À travers ces images, j\’ai cherché à capturer des instants authentiques, des paysages marquants et des détails souvent invisibles, afin de rappeler à quel point notre environnement mérite d’être admiré et préservé.', role:'J\’ai exploré différents environnements naturels, observé la lumière, les textures et les ambiances afin de créer des images qui transmettent à la fois calme, émerveillement et respect pour la nature. Mon intention était de valoriser la planète sous ses formes les plus simples comme les plus grandioses.',
      photos:[
        'assets/img/photos/nature/1.jpg',
        'assets/img/photos/nature/2.jpg',
        'assets/img/photos/nature/3.jpg'
      ]
    }

  ]
},

{ id:'mmihub', category:'web', title:'MMI HUB', year:2025, summary:'En BUT MMI, la notation est complexe avec des coefficients, competences et regles de validation difficiles a suivre. Pour simplifier le suivi de la moyenne, des absences et de la vie etudiante, j ai cree MMI HUB, une plateforme web responsive pensee pour les etudiant·e·s MMI.', cover:'assets/img/mmihub.svg', stack:['HTML', 'CSS', 'JS', 'php', 'sql', 'Hugo'], context:'Projet Personnel', pitch:'', links:{ repo:'https://jawisjan.tpweb.univ-rouen.fr/mmihub' } },
{ id:'etukit', category:'web', title:'EtuKit', year:2023, summary:'Un site qui réponds à un probléme réel présent chez les étudiants : LE TEMPS. Le but de EtuKit est de centraliser tous les outils (une grande partie en tout cas) pour faire gagner du temps aux étudiants pour le réinvestir ailleurs', cover:'assets/img/etukit_logo.svg', stack:['React','Tailwind','MySQL','APIs France Travail & Gemini', 'HTML', 'JavaScript', 'CSS'], context:'Projet Personnel', pitch:'', links:{ repo:'https://etukit.fr/' } },
{ id:'ministral', category:'web', title:'Ministral Arcade Cam', year:2025, summary:'La première fois que j\'essaye l\'API de Ministral pour faire une description de ce qui se passe dans le flux vidéo dans un style Arcade', cover:'assets/img/ministral.svg', stack:['HTML', 'CSS', 'JS', 'API'], context:'Projet Personnel', pitch:'Premier test avec l\'outil Ministral 3B qui utilise votre GPU depuis le navigateur', links:{ repo:'https://janjawish.github.io/first-test-ministral-3b/' } },
{ id:'cc', category:'web', title:'Chourak Consulting', year:2025, summary:'Création d\'un site web pour Chourak Consulting avec une mise en page et une identité visuelle sur demande.', cover:'assets/img/CHOURAK.svg', stack:['HTML', 'CSS', 'JS', 'php', 'sql', 'bdd', 'BootsTrap'], context:'Projet Personnel', pitch:'J\'ai été contacté par l\'entreprise pour la création du site web de l\'entreprise', links:{ repo:'https://chourakconsulting.com/' } },
  { id:'abl', category:'web', title:'ABL FRANCE', year:2025, summary:'Création d\'un site web vitrine pour mettre en avant les services proposées par l\'entreprise ABL.', cover:'assets/img/abl.svg', stack:['HTML', 'CSS', 'JS',], context:'Projet Personnel', pitch:'Création d\'un site web vitrine pour mettre en avant les services proposées par l\'entreprise ABL.', links:{ repo:'https://ablfrance.fr/' } },
{ id:'oopticien', category:'web', title:'Oopticien', year:2025, summary:'Création d\'un site web sur la demande du centre optique et après un échange concernant le style, la mise en forme et les différentes technologies utilisées.', cover:'assets/img/logo_oopticien.svg', stack:['HTML','CSS/Bootstrap','JavaScript','SEO local', 'Hébergement', 'Photographie'], context:'Projet Personnel', links:{ demo:'https://oopticien.fr' } },
  { id:'sae203', category:'web', title:'Site de billeterie', year:2024, summary:'Dans le cadre de mes études je devais faire un site de billeterie en ligne avec la possibilité de la création d\'un compte et de la gestion de rôle.', cover:'assets/img/sae203.svg', stack:['HTML','CSS','JavaScript','PHP', 'SQL'], context:'Projet Scolaire', pitch:'', links:{ repo:'https://jawisjan.tpweb.univ-rouen.fr/sae203' } },
  { id:'sae105', category:'web', title:'Site de foodtruck', year:2024, summary:'Dans le cadre de ma premiére année MMI j\'ai dû développer un site web pour un foodtruck. Ce fût mon premier site développé !', cover:'assets/img/sae105.svg', stack:['HTML','CSS','JavaScript'], context:'Projet Scolaire', pitch:'', links:{ repo:'https://janjawish.github.io/foodtruck/' } },
      { id:'sae202-elbeuf', category:'audiovisuel', cover:'assets/img/ex_imm.svg', title:'Elbeuf immersif', year:2025, summary:'Dans le cadre de la SAE202 nous devions faire une vidéo immersive en reprenant l\'intérieur le palais consulaire d\'elbeuf.', videoId:'cBRKd9-zONA', stack:['Premiere Pro','After Effects'], role:'Réalisation vidéo, Acteur', context:'Projet Scolaire', links:{ video:'https://www.youtube.com/watch?v=cBRKd9-zONA' } }, 
    { id:'interview-mss', category:'audiovisuel', cover:'assets/img/mss.svg', title:'Interview — Maison Sport Santé', year:2024, summary:'Dans le cadre de mes études j\'ai dû produire une vidéo pour la Maison Sport Santé d\'Elbeuf pour promouvoir le site et leur accompagnement !', videoId:'WV7ZIN0atWs', stack:['Premiere Pro','After Effects','Audition'], role:'Prises de vues & son, montage', context:'Projet Scolaire', links:{ video:'https://youtu.be/WV7ZIN0atWs' } },
    { id:'crescendo', category:'audiovisuel', cover:'assets/img/crescendo.svg', title:'Vidéo crescendo', year:2024, summary:'Dans ce projet j\'ai dû faire une composition audio à partir de son mp3 fournis par l\'enseignant (la consigne était qu\'on avais pas le droit d\'en prendre autres) ensuite tournage et montage. On devait créer un crescendo, à savoir le rythme qui monte au fur et à mesure.', videoId:'SrOKjRPbOjk', stack:['Premiere Pro','Audition'], role:'Prises de vues & son, montage', context:'Projet Scolaire', links:{ video:'https://www.youtube.com/watch?v=SrOKjRPbOjk' } },
    { id:'autostoppeur', category:'audiovisuel', title:'Auto-stoppeur', year:2024, cover:'assets/img/logo_covoit.svg', summary:'Dans le cadre de #GreenAwards nous devions penser, réaliser et monter une vidéo pour sensibiliser. Alors nous avons eu l\'idée d\'être proche et de le faire sur le ton de l\'humour', videoId:'g33UHsUyc_Y', stack:['Premiere Pro','After Effects', 'Discussion de groupe'], role:'Réalisation, acteur et monteur', context:'Projet Scolaire', links:{ video:'https://youtu.be/g33UHsUyc_Y' } },
  { id:'marlowe', category:'audiovisuel', title:'Marlowe', year:2024, cover:'assets/img/marlowe.svg', summary:'Réalisation d\'une vidéo avec le code du noir. Nous devions respecter le rythme du noir, les codes avec un inspecteur assez malin, c\'est le moins qu\'on puisse dire.', videoId:'UhFMKEPMyN8', stack:['Premiere Pro','After Effects', 'Discussion de groupe', 'Mise en place du décor'], role:'Acteur, décor et montage', context:'Projet Scolaire', links:{ video:'https://youtu.be/UhFMKEPMyN8' } },
  { id:'amv-hxh', category:'audiovisuel', cover:'assets/img/hxh.svg', title:'Vidéo promotionnelle EtuKit', year:2024, summary:'Le but de la vidéo était de reprendre l\'univers de Hunter X Hunter pour les plus grand fans d\'anime.', videoId:'IO0JV4nYZqU', stack:['After Effects', 'Premiere Pro', 'Adobe Audition'], role:'Montage et Bande Son', context:'Projet Personel', links:{ video:'https://youtu.be/IO0JV4nYZqU' } },
  { id:'amv-op', category:'audiovisuel', cover:'assets/img/op.svg', title:'Vidéo promotionnelle EtuKit', year:2024, summary:'Reprise de l\'univers de One Piece (Vidéo et son) pour promouvoir EtuKit avec une voix off.', videoId:'uYjElFgtiZU', stack:['After Effects', 'Premiere Pro', 'Adobe Audition'], role:'Montage et Voix off', context:'Projet Personnel', links:{ video:'https://youtu.be/uYjElFgtiZU' } },


    {
  id:'cvec',
  category:'comm',
  title:'Proposition de projet CVEC',
  year:2025,
  summary:'Proposition d\'un projet au sein de l\'IUT D\'Elbeuf pour améliorer la vie étudiant.',
  pdf:'assets/pdfs/cvec.pdf',          
  cover:'assets/img/cvec.svg',
  stack:['PDF'],
  context:'Projet Scolaire'
},
  {
  id:'sol_agency',
  category:'comm',
  title:'Etude de cas SOL AGENCY',
  year:2025,
  summary:'Dossier de communication et étude de cas',
  pdf:'assets/pdfs/sol_agency.pdf',          
  cover:'assets/img/sol_agency.svg',
  stack:['PDF'],
  context:'Projet Scolaire'
},

{
  id:'vertuose-prop',
  category:'comm',
  title:'Proposition de site web',
  year:2025,
  summary:'Création d\'un devis pour une agence web (fictive) pour la création d\'un site e-commerce complet et prêt à être utilié.',
  pdf:'assets/pdfs/prestashop_proposition.pdf',          
  cover:'assets/img/vertuose.svg',
  stack:['PrestaShop'],
  context:'Projet Scolaire'
},
{
  id:'vertuose-doc',
  category:'web',
  title:'Site e-commerce',
  year:2025,
  summary:'PDF contenant tous les éléments présents dans le site e-commerce. Notamment les extensions utilisées, les droits du client sur le site e-commerce. En tant que développeur du site web nous devions choisir quels sont les éléments dont le client a accés.',
  pdf:'assets/pdfs/prestashop_doc_final.pdf',          
  cover:'assets/img/vertuose.svg',
  stack:['PrestaShop'],
  links:{ repo:'https://firmiped.tpweb.univ-rouen.fr/prestashop/' },
  context:'Projet Scolaire'
},
  /* --- Création graphique (with carousel) --- */
    { id:'mmihub2', category:'graphique', title:'Univers Graphique MMI HUB', year:2025, summary:'Une charte graphique compléte pour MMI HUB.', cover:'assets/img/mmihub2.svg', gallery:[], stack:['Illustrator','PhotoShop'], role:'Création d\'un univers graphique', context:'Projet Personnel', pdf:'assets/pdfs/charte_graphique_mmihub.pdf' },
  { id:'logo-cafe', category:'graphique', title:'Marque de café', year:2023, summary:'Une des premières créations graphiques que j\'ai faite dans le cadre d\'un projet d\'école', cover:'assets/img/feca.svg', gallery:['assets/img/feca.png'], stack:['Illustrator', 'Adobe Photoshop'], context:'Projet Scolaire' },
  { id:'monogramme-jj', category:'graphique', title:'Monogramme « JJ »', year:2025, summary:'Création d\'un logo personnel en m\'inspirant de ce qui se passe sur les réseaux sociaux.', cover:'assets/img/lologo.png', gallery:['assets/img/lologo.png','assets/img/lologo2.png','assets/img/lologo3.png'], stack:['Illustrator'], role:'Logo & variantes', context:'Projet Personnel' },
  { id:'affiche-festival-livre', category:'graphique', title:'Affiche Festival du livre', year:2023, summary:'Grille modulaire, hiérarchie type.', cover:'assets/img/livre.svg', gallery:['assets/img/AFFICHEJan.png'], stack:['Illustrator','PhotoShop'], role:'Design', context:'Projet Scolaire' },
  { id:'logo-etukit', category:'graphique', title:'Logo EtuKit', year:2024, summary:'Création logo pour EtuKit.', cover:'assets/img/etukit_logo.svg', gallery:['assets/img/etukit_logo.svg','assets/img/placeholder.svg'], stack:['Illustrator'], role:'Logo', context:'Projet Personnel' },
  { id:'flyer-labottine', category:'graphique', title:'La Bottine Flyer', year:2024, summary:'Création d\'un flyer pour le menu d\'une pizzeria fictive.', cover:'assets/img/pz.svg', gallery:['assets/img/pz.svg'], stack:['Illustrator','Photoshop'], role:'DA & exécution', context:'Projet Scolaire' },
  { id:'sae103-surftruck', category:'graphique', title:'Surf Truck', year:2024, summary:'Dans le cadre de la sae 103 nous devions créer un logo pour un SurfTruck Fictif', cover:'assets/img/st.svg', gallery:['assets/img/st.svg','assets/img/moodboard.svg'], stack:['Illustrator'], role:'Identité visuelle', context:'Projet Scolaire' },
  { id:'sae202-identite', category:'graphique', title:'Identité pour l\'experience immersive', year:2025, summary:'Logo et variantes, affiches, carte de visite, vidéo', cover:'assets/img/ex_imm.svg', gallery:['assets/img/ex_imm.svg','assets/img/logo.jpg','assets/img/rs_logo.jpg','assets/img/fav_icon.jpg','assets/img/nb_logo.jpg'], stack:['Illustrator','PhotoShop'], role:'Design', context:'Projet Scolaire' },
  { id:'figma', category:'graphique', title:'WireFrame et Maquette', year:2025, summary:'Créer un wireframe et une maquette pour un site de pet-sitting.', cover:'assets/img/icons/figma-logo.svg', gallery:['assets/img/wf1.png','assets/img/wf2.png','assets/img/wf3.png','assets/img/mq1.png','assets/img/mq2.png','assets/img/mq3.png'], stack:['Figma'], role:'WireFrame et Maquette', context:'Projet Scolaire', links:{ demo:'https://www.figma.com/design/EfTAkBm69yxp7On3Ao2o1c/Untitled?node-id=14-808&t=8uREqv7l9PP8gM4x-1' } },




];
