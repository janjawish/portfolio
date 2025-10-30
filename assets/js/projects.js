const PROJECTS = [
  { id:'oopticien', category:'web', title:'Oopticien', year:2025, summary:'Création d\'un site web sur la demande du centre optique et après un échange concernant le style, la mise en forme et les différentes technologies utilisées.', cover:'assets/img/logo_oopticien.svg', stack:['HTML','CSS/Bootstrap','JavaScript','SEO local', 'Hébergement', 'Photographie'], context:'Projet Personnel', links:{ demo:'https://oopticien.fr' } },
  { id:'etukit', category:'web', title:'EtuKit', year:2023, summary:'Un site qui réponds à un probléme réel présent chez les étudiants : LE TEMPS. Le but de EtuKit est de centraliser tous les outils (une grande partie en tout cas) pour faire gagner du temps aux étudiants pour le réinvestir ailleurs/', cover:'assets/img/etukit_logo.svg', stack:['React','Tailwind','MySQL','APIs France Travail & Gemini', 'HTML', 'JavaScript', 'CSS'], context:'Projet Personnel', pitch:'', links:{ repo:'https://etukit.fr/' } },
  { id:'cc', category:'web', title:'Chourak Consulting', year:2025, summary:'Création d\'un site web pour Chourak Consulting avec une mise en page et une identité visuelle sur demande.', cover:'assets/img/CHOURAK.svg', stack:['HTML', 'CSS', 'JS', 'php', 'sql', 'bdd', 'BootsTrap'], context:'Projet Personnel', pitch:'J\'ai été contacté par l\'entreprise pour la création du site web de l\'entreprise', links:{ repo:'https://chourakconsulting.com/' } },
  { id:'autostoppeur', category:'audiovisuel', title:'Auto-stoppeur', year:2024, cover:'assets/img/logo_covoit.svg', summary:'Dans le cadre de #GreenAwards nous devions penser, réaliser et monter une vidéo pour sensibiliser. Alors nous avons eu l\'idée d\'être proche et de le faire sur le ton de l\'humour', videoId:'g33UHsUyc_Y', stack:['Premiere Pro','After Effects', 'Discussion de groupe'], role:'Réalisation, acteur et monteur', context:'Projet Scolaire', links:{ video:'https://youtu.be/g33UHsUyc_Y' } },
  { id:'marlowe', category:'audiovisuel', title:'Marlowe', year:2024, cover:'assets/img/marlowe.svg', summary:'Réalisation d\'une vidéo avec le code du noir. Nous devions respecter le rythme du noir, les codes avec un inspecteur assez malin, c\'est le moins qu\'on puisse dire.', videoId:'UhFMKEPMyN8', stack:['Premiere Pro','After Effects', 'Discussion de groupe', 'Mise en place du décor'], role:'Acteur, décor et montage', context:'Projet Scolaire', links:{ video:'https://youtu.be/UhFMKEPMyN8' } },
  /* { id:'interview-mss', category:'audiovisuel', cover:'assets/img/mss.svg', title:'Interview — Maison Sport Santé', year:2024, summary:'Sous-titres AE, nettoyage son (Audition).', videoId:'WV7ZIN0atWs', stack:['Premiere Pro','After Effects','Audition'], role:'Prises de vues & son, montage', context:'École', links:{ video:'https://youtu.be/WV7ZIN0atWs' } },*/
  { id:'amv-hxh', category:'audiovisuel', cover:'assets/img/hxh.svg', title:'Vidéo promotionnelle EtuKit', year:2024, summary:'Le but de la vidéo était de reprendre l\'univers de Hunter X Hunter pour les plus grand fans d\'anime.', videoId:'IO0JV4nYZqU', stack:['After Effects', 'Premiere Pro', 'Adobe Audition'], role:'Montage et Bande Son', context:'Projet Personel', links:{ video:'https://youtu.be/IO0JV4nYZqU' } },
  { id:'amv-op', category:'audiovisuel', cover:'assets/img/op.svg', title:'Vidéo promotionnelle EtuKit', year:2024, summary:'Reprise de l\'univers de One Piece (Vidéo et son) pour promouvoir EtuKit avec une voix off.', videoId:'uYjElFgtiZU', stack:['After Effects', 'Premiere Pro', 'Adobe Audition'], role:'Montage et Voix off', context:'Projet Personnel', links:{ video:'https://youtu.be/uYjElFgtiZU' } },
  { id:'sae202-elbeuf', category:'audiovisuel', cover:'assets/img/ex_imm.svg', title:'Elbeuf immersif', year:2025, summary:'Dans le cadre de la SAE202 nous devions faire une vidéo immersive en reprenant l\'intérieur le palais consulaire d\'elbeuf.', videoId:'cBRKd9-zONA', stack:['Premiere Pro','After Effects'], role:'Réalisation vidéo, Acteur', context:'Projet Scolaire', links:{ video:'https://www.youtube.com/watch?v=cBRKd9-zONA' } },
  /* --- Création graphique (with carousel) --- */
  { id:'logo-cafe', category:'graphique', title:'Marque de café', year:2023, summary:'Une des premières créations graphiques que j\'ai faite dans le cadre d\'un projet d\'école', cover:'assets/img/feca.svg', gallery:['assets/img/feca.png'], stack:['Illustrator', 'Adobe Photoshop'], context:'Projet Scolaire' },
  { id:'monogramme-jj', category:'graphique', title:'Monogramme « JJ »', year:2025, summary:'Création d\'un logo personnel en m\'inspirant de ce qui se passe sur les réseaux sociaux.', cover:'assets/img/lologo.png', gallery:['assets/img/lologo.png','assets/img/lologo2.png','assets/img/lologo3.png'], stack:['Illustrator'], role:'Logo & variantes', context:'Projet Personnel' },
  { id:'affiche-festival-livre', category:'graphique', title:'Affiche Festival du livre', year:2023, summary:'Grille modulaire, hiérarchie type.', cover:'assets/img/livre.svg', gallery:['assets/img/livre.svg'], stack:['Illustrator','PhotoShop'], role:'Design', context:'Projet Scolaire' },
  { id:'logo-etukit', category:'graphique', title:'Logo EtuKit', year:2024, summary:'Création logo pour EtuKit.', cover:'assets/img/etukit_logo.svg', gallery:['assets/img/etukit_logo.svg','assets/img/placeholder.svg'], stack:['Illustrator'], role:'Logo', context:'Projet Personnel' },
  { id:'flyer-labottine', category:'graphique', title:'La Bottine Flyer', year:2024, summary:'Création d\'un flyer pour le menu d\'une pizzeria fictive.', cover:'assets/img/pz.svg', gallery:['assets/img/pz.svg'], stack:['Illustrator','Photoshop'], role:'DA & exécution', context:'Projet Scolaire' },
  { id:'sae103-surftruck', category:'graphique', title:'Surf Truck', year:2024, summary:'Dans le cadre de la sae 103 nous devions créer un logo pour un SurfTruck Fictif', cover:'assets/img/st.svg', gallery:['assets/img/st.svg','assets/img/moodboard.svg'], stack:['Illustrator'], role:'Identité visuelle', context:'Projet Scolaire' },
  { id:'sae202-identite', category:'graphique', title:'Identité pour l\'experience immersive', year:2025, summary:'Logo et variantes, affiches, carte de visite, vidéo', cover:'assets/img/ex_imm.svg', gallery:['assets/img/ex_imm.svg'], stack:['Illustrator','PhotoShop'], role:'Design', context:'Projet Scolaire' },
  /* --- Photographie (full-screen gallery trigger as a project) --- */
{ id:'photographie', category:'photo', title:'Galerie Photographie',

  cover:'assets/img/photos.svg',
  albums: [
    {
      id:'petanque', title:'Pétanque', year:2024, cadre:'Portraits de rue', role:'Photographe',
      photos:[
        'assets/img/photos/petanque/couple_mignon_mettre_autour.png',
        'assets/img/photos/petanque/face.png',
        'assets/img/photos/petanque/portrait_2_2.png',
        'assets/img/photos/petanque/portrait_2_1.png',
        'assets/img/photos/petanque/portrait_couple1.png',
        'assets/img/photos/petanque/portrait2.png',
        'assets/img/photos/petanque/portrait2_2.png',
        'assets/img/photos/petanque/portrait2_3.png',
        'assets/img/photos/petanque/tir_1.png',
        'assets/img/photos/petanque/tir_2.png',
        'assets/img/photos/petanque/tir_3.png',
        'assets/img/photos/petanque/tir_4.png',
        'assets/img/photos/petanque/tir_22.png',
        'assets/img/photos/petanque/tir_23.png',
        'assets/img/photos/petanque/tir_stylee.png',
        'assets/img/photos/petanque/tir1.png',
        'assets/img/photos/petanque/tir1_dame.png',
        'assets/img/photos/petanque/tir2_dame.png',
        'assets/img/photos/petanque/tir3_dame.png',
        'assets/img/photos/petanque/tir2.png',
        'assets/img/photos/petanque/tir3.png',
        'assets/img/photos/petanque/vieu1.png',
        'assets/img/photos/petanque/vieu2.png',
        'assets/img/photos/petanque/vieu3.png',
        'assets/img/photos/petanque/vieu4.png',
        'assets/img/photos/petanque/vieu5.png'
      ]
    },
    {
      id:'nature', title:'Nature', year:2023, cadre:'Lignes & volumes', role:'Photographe',
      photos:[
        'assets/img/photos/nature/fleur1.png',
        'assets/img/photos/nature/fleur2.png',
        'assets/img/photos/nature/fleur3.png'
      ]
    },
        {
      id:'pompiers', title:'Entraînements Pompiers', year:2023, cadre:'Lignes & volumes', role:'Photographe',
      photos:[
        'assets/img/photos/pompiers/pompier1.png',
        'assets/img/photos/pompiers/pompier2.png',
        'assets/img/photos/pompiers/pompier3.png',
        'assets/img/photos/pompiers/pompier4.png',
        'assets/img/photos/pompiers/pompier5.png'
      ]
    },
            {
      id:'portraits', title:'portraits', year:2023, cadre:'Lignes & volumes', role:'Photographe',
      photos:[
        'assets/img/photos/portraits/portrait_couple2.png',
        'assets/img/photos/portraits/portrait_couple3.png',
      ]
    }
  ]
},
];
