
/* Data */
const BOOKS = [
  { title:'Ayez le dernier mot !', cover:'assets/img/art/webp', author:'Sylvain Soleil', opinion:'\"Ayez le dernier mot\" de Sylvain Soleil est le premier livre de développement personnel que j\'ai lu, et honnêtement, il m\'a vraiment captivé. Le livre aborde une multitude de sujets liés à la communication : de la présentation à l\'oral aux relations interpersonnelles, en passant par la communication de masse. On y trouve plein d\'exemples concrets, souvent accompagnés d\'illustrations, ce qui rend la lecture très vivante et facile à suivre. Ce que j\'ai particulièrement apprécié, c\'est la façon dont l\'auteur explique chaque concept en détail, sans jamais tomber dans le jargon compliqué. Le ton reste accessible, clair et agréable à lire  pas besoin d\'avoir fait une grande école de communication pour comprendre. En tant que personne passionnée par les relations humaines et toujours en quête de la meilleure interaction possible, ce livre m\'a vraiment parlé. Il m\'a rappelé que la plus grande force de l\'être humain, c\'est sa capacité à communiquer, à créer du lien et à transmettre ses idées. C\'est une force qu\'il faut cultiver chaque jour.\"' },
  { title:'Influence et Persuasion', author:'Robert Cialdini', opinion:'\"Influence et persuasion\" de Robert Cialdini m\'a vraiment aidé à mettre de l\'ordre dans ce que je pressentais sur la manière dont on dit oui. L\'auteur détaille des principes comme la réciprocité, l\'engagement et la cohérence, la preuve sociale, la sympathie, l\'autorité, la rareté, et dans cette édition l\'unité. Tout est expliqué simplement, avec des exemples parlants et des études qui montrent comment ces déclencheurs fonctionnent au quotidien. J\'ai apprécié que le livre donne à la fois des clés pour influencer de façon éthique et des réflexes pour repérer quand on tente de nous influencer. Comme je suis très tourné vers les relations humaines et que je cherche toujours la meilleure interaction, j\'y ai trouvé des outils concrets pour préparer une demande, clarifier un message et créer un vrai climat de confiance. Pas besoin d\'avoir fait de grandes études pour comprendre, le ton est clair et accessible et on peut appliquer les idées tout de suite.' },
  { title:'Convaincre en moins de 2 minutes', author:'Nicholas Boothman', opinion:'\"Convaincre en moins de 2 minutes\" de Nicholas Boothman m\'a beaucoup parlé. L\'auteur montre comment, dès les premières secondes, on peut créer une connexion sincère avec l\'autre. Il insiste sur le langage corporel, l\'attitude ouverte, l\'intonation de la voix et le choix des mots pour donner confiance. Il propose d\'adapter sa communication au profil de l\'interlocuteur, qu\'il soit visuel, auditif ou kinesthésique, pour rendre son message plus percutant. Il y a des exercices concrets à chaque étape, ce qui permet de rendre l\'apprentissage immédiatement utile. Ce que j\'ai aimé, c\'est que tout cela reste simple et accessible, sans jargon compliqué. En tant que personne passionnée par les relations humaines, ce livre m\'a donné des repères forts pour mieux capter l\'attention, être authentique dès l\'échange et établir des ponts solides en peu de temps. C\'est une lecture utile pour quiconque veut communiquer efficacement, rapidement et avec sincérité.' },
  { title:'La parole est un sport de combat', author:'Bertrand Périer', opinion:'\"La parole est un sport de combat\" de Bertrand Périer m\'a vraiment marqué. L\'auteur traite de la parole avec intensité, comme un outil de pouvoir mais aussi de responsabilité. Il aborde l\'art de convaincre, l\'usage de la rhétorique, la préparation mentale avant de parler, et les pièges à éviter. Ce qui m\'a plu, c\'est la façon dont il combine anecdotes personnelles, analyses fines et conseils pratiques. Le ton est percutant mais accessible, il ne s\'adresse pas qu\'aux experts en droit ou communication. En tant que passionné des relations humaines et toujours en quête de la meilleure interaction, ce livre m\'a donné une meilleure conscience de mes mots, de mes silences et de ma posture dans la conversation. Il m\'encourage à être à la fois plus audacieux et plus prudent dans mon expression. Une lecture stimulante pour quiconque veut affiner son discours et défendre ses idées avec force et clarté.' },
  { title:'L\'art d\'avoir toujours raison', author:'Schopenhauer', opinion:'\"L’art d’avoir toujours raison\" d’Arthur Schopenhauer est un livre fascinant qui explore la manière dont on peut gagner une discussion, même sans avoir raison. L’auteur y détaille une trentaine de stratagèmes pour influencer un débat, détourner l’attention ou affaiblir les arguments de l’adversaire. Ce qui rend l’ensemble intéressant, c’est la lucidité avec laquelle il dévoile ces mécanismes que beaucoup utilisent sans s’en rendre compte. À travers ses exemples et ses réflexions, on comprend que connaître ces techniques, ce n’est pas apprendre à manipuler, mais plutôt à se protéger et à mieux argumenter. En tant que personne passionnée par la communication et les relations humaines, ce livre m’a poussé à réfléchir à la manière dont je construis mes échanges, à rester attentif aux mots et aux intentions. C’est une lecture courte mais percutante qui aide à mieux comprendre le jeu du dialogue et l’importance de la clarté dans la parole.' },
];
const ARTISTS = [
  { name:'Jul', born:1990, died:null, opinion:'Jul est le tout premier artiste que j\'ai écouté, et je l\'écoute toujours avec la même passion. Il incarne selon moi un mélange unique de styles : du rap à la mélodie, avec des touches pop, électro, des rythmes dansants, parfois même des influences du raï, tout ça mixé dans une signature qui lui est propre. Son style est reconnu pour être accessible à un large public tout en gardant une identité forte. Son humilité me marque aussi beaucoup : malgré son succès immense, il reste proche de ses fans, simple dans ses paroles, sans artifices excessifs. Pour moi, Jul c’est celui qui m’a fait découvrir la musique, et c’est aussi un modèle de constance, de créativité et de sincérité dans son art.' },
  { name:'Charles Aznavour', born:1924, died:2018, opinion:'Charles Aznavour faisait partie des artistes que j\'écoutais environ une fois par semaine, par goût, pour sa voix, ses mélodies et ses textes profonds. Mais après être allé voir son film au cinéma, je suis devenu un grand fan. Découvrir son histoire, ses combats, ses racines, ses blessures et son parcours m\'a profondément touché. J\'ai compris combien chaque chanson portait une part de lui, une sincérité et une vulnérabilité qui dépassent les mots. Depuis, je revisite ses albums, je m\'intéresse à ses textes avec attention, je mesure combien il savait parler au cœur des gens. Charles Aznavour est pour moi un artiste complet : poète, conteur, homme engagé. Son œuvre me rappelle que la musique est un vecteur d’émotions, de mémoire et de lien humain.' },
  { name:'Ninho', born:1996, died:null, opinion:'Ninho est un artiste que je respecte pour sa constance et sa capacité à toucher un public très large. Ce que j\'entends chez lui, c\'est un mélange de rap technique et de mélodie avec des refrains qui restent en tête. Il a une vraie science du topline et des hooks efficaces, et ça s\'entend autant sur ses gros singles que sur ses albums. Les chiffres parlent d\'eux-mêmes mais au delà des records je retiens surtout sa polyvalence et sa manière d\'alterner couplets posés et passages plus chantés. Certains reprochent une certaine redondance à force d\'enchaîner les succès mais sur la longueur il reste l\'un des artistes les plus influents de sa génération. Personnellement j\'y reviens souvent pour l\'énergie, les images qu\'il pose et cette capacité à livrer des morceaux qui fonctionnent aussi bien dans les écouteurs que sur scène.' },
  { name:'Umm Kulthum', born:1898, died:1975, opinion:'Oum Kalthoum c’est une présence qui m’a accompagné avant même ma naissance, ma mère écoutait ses chansons quand j’étais dans son ventre. En grandissant, ces mélodies sont devenues comme une seconde peau, un héritage musical que je porte en moi. Chaque soir, je replonge dans sa voix, dans la profondeur de ses interprétations, dans cette émotion qui ne vieillit jamais. J’écoute ses morceaux avec attention, non pas par nostalgie, mais parce qu’ils continuent de vibrer et de transmettre quelque chose d’universel. Pour moi, Oum Kalthoum représente la musique dans toute sa pureté, une voix qui traverse le temps et relie les générations.' },
  { name:'Lacrim', born:1985, died:2015, opinion:'Lacrim je le suis depuis très longtemps et ses morceaux m\'accompagnent depuis des années. Je connais ses classiques par cœur et je continue d\'écouter tous ses albums sans exception. Ce que j\'aime chez lui c\'est ce mélange d\'authenticité et de mélancolie, une voix reconnaissable entre mille, des histoires qui sentent le vécu et des refrains qui restent. J\'apprécie la façon dont il a su évoluer tout en gardant sa ligne, avec des sons plus posés parfois et d\'autres plus nerveux, toujours avec cette sincérité qui le caractérise. Pour moi Lacrim c\'est un repère, un artiste que je retrouve quel que soit le moment et qui me parle encore aujourd\'hui autant qu\'à ses débuts.' },
];
const FILMS = [   
  { title:'Il était une fois dans le Bronx', director:'Robert De Niro', writer:'Chazz Palminteri', year:1993, actor:'Chazz Palminteri / Robert De Niro', opinion:'\"Il était une fois dans le Bronx\" est à mes yeux le premier grand film de banditisme de son époque, tourné dans les années où le cinéma américain explorait la criminalité avec profondeur et style. C\'est un film qui mêle habilement l\'amour et le banditisme : les personnages sont engagés dans des choix difficiles, tiraillés entre loyauté, passion et violence. J\'aime ce film parce qu\'il ne glorifie pas le crime mais expose ses contradictions, ses blessures, ses enjeux personnels. Et Robert De Niro est parfait : dans son jeu il incarne cette dualité, la force et la fragilité, la loyauté et la trahison. Ce film m\'a marqué parce qu\'il raconte le monde criminel sans fard, mais avec une humanité rare.' },
{title: 'Un prophète', 
    director: 'Jacques Audiard', 
    writer: 'Abdel Raouf Dafri / Nicolas Peufaillit', 
    year: 2009, 
    actor: 'Tahar Rahim', 
    opinion: 'Un prophète est un film qui m\'a profondément marqué. C\'est le genre de film qui te fait réfléchir longtemps après le générique. L’évolution du personnage principal est captivante, on ressent tout son parcours, ses doutes, sa montée en puissance. L’ambiance est prenante, la voix off renforce ce côté immersif et humain. Pour moi, c’est un chef-d’œuvre moderne, brut et sincère.'
},
  { 
    title: 'Les Affranchis', 
    director: 'Martin Scorsese', 
    writer: 'Martin Scorsese / Nicholas Pileggi', 
    year: 1990, 
    actor: 'Chazz Palminteri / Robert De Niro', 
    opinion: 'Les Affranchis est un monument du cinéma. Ce que j’aime, c’est la manière dont Scorsese nous plonge dans le quotidien des gangsters, avec un rythme, une énergie et une authenticité incroyable. Chaque scène est mémorable, chaque réplique sonne juste. J’adore ce mélange entre violence, élégance et ironie. C’est un film qui respire la passion du cinéma et la puissance des personnages. Robert De Niro y est comme toujours impressionnant.'
  },
  { 
    title: 'Taxi Driver', 
    director: 'Martin Scorsese', 
    writer: 'Paul Schrader', 
    year: 1976, 
    actor: 'Robert De Niro', 
    opinion: 'Taxi Driver est un film à part, une plongée dans la solitude et la folie. Robert De Niro y est exceptionnel, il incarne un homme en rupture totale avec la société, perdu dans une ville qui ne dort jamais. J’aime cette atmosphère sombre, les plans de New York la nuit, la musique hypnotique. C’est un film qui dérange mais qui fascine. Il montre le malaise humain avec une intensité rare. C’est pour moi l’un des rôles les plus marquants du cinéma.'
  },
  { 
    title: 'Scarface', 
    director: 'Brian De Palma', 
    writer: 'Oliver Stone', 
    year: 1984, 
    actor: 'Al Pacino', 
    opinion: 'Scarface est un classique absolu. Al Pacino y livre une performance légendaire, à la fois violente et charismatique. Ce que j’aime, c’est l’évolution du personnage de Tony Montana, son ambition démesurée, son ascension et sa chute inévitable. L’ambiance des années 80, les couleurs, la musique, tout est culte. Au-delà du mythe, c’est un film sur la soif de pouvoir et la solitude. À chaque visionnage, il me captive toujours autant.'
  },
];
const INTERESTS = [
  { 
    name: 'MMA', 
    opinion: 'Le MMA m\'a appris la discipline et le contrôle. J\'aime cette intensité où tout repose sur la précision du geste, la stratégie et la maîtrise de soi. C\'est un sport où l\'on se dépasse, physiquement et mentalement, et qui m\'inspire énormément dans ma manière de penser et d\'agir.' 
  },
  { 
    name: 'Musique', 
    opinion: 'La musique a toujours eu une place essentielle dans ma vie. C\'est ce qui m\'apaise, me motive et me connecte aux autres. J\'aime découvrir de nouveaux sons, des styles différents, et ressentir l\'émotion qui se cache derrière chaque note. C\'est un langage universel que je ne me lasse jamais d\'écouter.' 
  },
  { 
    name: 'Cinéma', 
    opinion: 'Le cinéma me fait voyager sans bouger. J\'aime les films qui racontent des histoires vraies, qui font réfléchir ou qui montrent simplement la beauté du quotidien. Pour moi, un bon film, c\'est une émotion qui reste, un regard sur le monde qui change quelque chose en toi.' 
  },
  { 
    name: 'Développement', 
    opinion: 'Le développement, c\'est pour moi un moyen de créer quelque chose de concret à partir d\'une idée. J\'aime cette logique, cette précision, et le fait de voir un projet prendre forme ligne par ligne. C\'est un mélange de créativité et de rigueur, un équilibre qui me passionne vraiment.' 
  },
  { 
    name: 'Jeux-vidéos', 
    opinion: 'Les jeux vidéo font partie de mon quotidien depuis longtemps. J\'aime leur univers, leur capacité à raconter des histoires tout en te faisant interagir avec elles. C\'est un mélange d\'art, de stratégie et d\'émotion, un espace où l\'on peut se détendre, apprendre et se challenger en même temps.' 
  }
];


/* Build skills cards (icons are inline SVG) */
function buildSkills(){
  const host = document.getElementById('skills-cards'); if(!host) return;
  host.innerHTML = '';
  const cards = [
    { label:'Audiovisuel', svg:`<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" stroke-width="2"/><path d="M8 20h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>` },
    { label:'Création graphique', svg:`<svg viewBox="0 0 24 24" fill="none"><path d="M4 12a8 8 0 1 0 16 0A8 8 0 0 0 4 12Z" stroke="currentColor" stroke-width="2"/><path d="M12 4v8l6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>` },
    { label:'Web', svg:`<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M6 6c4 3 8 3 12 0" stroke="currentColor" stroke-width="2"/></svg>` },
  ];
  cards.forEach(c=>{
    const div = document.createElement('div'); div.className='skill-card';
    const icon = document.createElement('div'); icon.innerHTML = c.svg; icon.style.color='#fff';
    const label = document.createElement('div'); label.textContent = c.label; label.style.fontWeight='600';
    div.append(icon, label); host.appendChild(div);
  });
}

/* Detail windows openers */
function openInfoModal(title, html){
  const backdrop = document.createElement('div'); backdrop.className='modal-backdrop';
  const modal = document.createElement('div'); modal.className='modal glass-window';
  const titlebar = document.createElement('div'); titlebar.className='titlebar';
  const traffic = document.createElement('div'); traffic.className='traffic';
  const closeDot = document.createElement('span'); closeDot.className='dot red'; closeDot.title='Fermer'; closeDot.style.cursor='pointer'; closeDot.addEventListener('click', close);
  traffic.append(closeDot, Object.assign(document.createElement('span'),{className:'dot yellow'}), Object.assign(document.createElement('span'),{className:'dot green'}));
  const t = document.createElement('div'); t.className='title'; t.textContent = title;
  titlebar.append(traffic, t);
  const body = document.createElement('div'); body.className='modal-body';
  const side = document.createElement('div'); side.className='side'; side.innerHTML = html;
  body.appendChild(side);
  modal.append(titlebar, body);
  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);
  const prevOverflow = document.documentElement.style.overflow || '';
  document.documentElement.style.overflow = 'hidden';
  function close(){
    modal.classList.add('closing');
    backdrop.style.animation = 'fade-out .2s ease forwards';
    setTimeout(()=>{
      document.body.removeChild(backdrop);
      document.documentElement.style.overflow = prevOverflow;
    }, 200);
  }
  backdrop.addEventListener('click', (e)=>{ if(e.target===backdrop) close(); });
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') close(); }, { once:true });
}

function buildBooks(){
  const host = document.getElementById('books'); if(!host) return;
  host.innerHTML='';
  BOOKS.forEach(b=>{
    const item = document.createElement('div'); item.className='skill-card'; item.style.cursor='pointer';
    item.innerHTML = `<div style="font-weight:700;">${b.title}</div><div style="color:var(--muted)">${b.author}</div>`;
    item.addEventListener('click', ()=> openInfoModal('Livre', `<h3>${b.title}</h3><p><strong>Auteur :</strong> ${b.author}</p><p style="color:var(--muted)">${b.opinion}</p>`));
    host.appendChild(item);
  });
}
function buildArtists(){
  const host = document.getElementById('artists'); if(!host) return;
  host.innerHTML='';
  ARTISTS.forEach(a=>{
    const item = document.createElement('div'); item.className='skill-card'; item.style.cursor='pointer';
    const life = a.died ? `${a.born}–${a.died}` : `Né en ${a.born}`;
    item.innerHTML = `<div style="font-weight:700;">${a.name}</div><div style="color:var(--muted)">${life}</div>`;
    item.addEventListener('click', ()=> openInfoModal('Artiste', `<h3>${a.name}</h3><p><strong>Années :</strong> ${life}</p><p style="color:var(--muted)">${a.opinion}</p>`));
    host.appendChild(item);
  });
}
function buildFilms(){
  const host = document.getElementById('films'); if(!host) return;
  host.innerHTML='';
  FILMS.forEach(f=>{
    const item = document.createElement('div'); item.className='skill-card'; item.style.cursor='pointer';
    item.innerHTML = `<div style="font-weight:700;">${f.title}</div><div style="color:var(--muted)">${f.year}</div>`;
    item.addEventListener('click', ()=> openInfoModal('Film', `<h3>${f.title} (${f.year})</h3><p><strong>Réalisation :</strong> ${f.director}</p><p><strong>Scénario :</strong> ${f.writer}</p><p><strong>Acteur principal :</strong> ${f.actor}</p><p style="color:var(--muted)">${f.opinion}</p>`));
    host.appendChild(item);
  });
}
function buildInterests(){
  const host = document.getElementById('interests'); if(!host) return;
  host.innerHTML='';
  INTERESTS.forEach(i=>{
    const item = document.createElement('div'); item.className='skill-card'; item.style.cursor='pointer';
    item.innerHTML = `<div style="font-weight:700;">${i.name}</div><div style="color:var(--muted)">Mon avis</div>`;
    item.addEventListener('click', ()=> openInfoModal(i.name, `<p style="color:var(--muted)">${i.opinion}</p>`));
    host.appendChild(item);
  });
}

/* About window open/close animations with red button + "En savoir plus" re-open */
function initAboutWindows(){
  $$('.window').forEach(win=>{
    const red = win.querySelector('.dot.red');
    const reopen = win.nextElementSibling && win.nextElementSibling.classList.contains('reopen') ? win.nextElementSibling : null;
    function closeWin(){
      win.style.animation = 'scale-out .2s ease both';
      setTimeout(()=>{
        win.classList.add('hidden');
        if(reopen) reopen.classList.remove('hidden');
      }, 180);
    }
    if(red) red.addEventListener('click', closeWin);
    if(reopen){
      reopen.addEventListener('click', ()=>{
        win.classList.remove('hidden');
        win.style.animation = 'scale-in .25s ease both';
        reopen.classList.add('hidden');
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  buildSkills();
  buildBooks();
  buildArtists();
  buildFilms();
  buildInterests();
  initAboutWindows();
});
