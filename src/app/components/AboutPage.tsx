import { ArrowUpRight, FileText, Heart, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

const focuses = [
  {
    name: "VIDA",
    description:
      "Trabajamos por la defensa y promoción de los derechos humanos por medio de la prevención de violencias, el incentivo a la participación y el liderazgo juvenil e infantil, incorporando la perspectiva de género de manera transversal en nuestras acciones.",
  },
  {
    name: "LIBRE",
    description:
      "Promovemos el intercambio de saberes y pensamientos, desde el respeto y la equidad, y planteamos alternativas de relación más dignas y justas en busca de una sociedad liberada por medio del acceso al conocimiento.",
  },
  {
    name: "COMUNITARIA",
    description:
      "Trabajamos con comunidades de base y todas aquellas prácticas sociales que buscan el bienestar colectivo mediante la transformación de las propias realidades, de acuerdo a sus sueños y proyecciones, proponiendo la construcción y valoración de lo común.",
  },
];

const focusesEnglish = [
  "We work to defend and promote human rights through violence prevention, encouraging participation and youth and children's leadership, while integrating a gender perspective throughout our actions.",
  "We foster the exchange of knowledge and ideas through respect and equity, proposing more dignified and just ways of relating in pursuit of a society liberated through access to knowledge.",
  "We work with grassroots communities and social practices that pursue collective well-being by transforming their own realities according to their dreams and aspirations, building and valuing what is held in common.",
];

const history = [
  ["2004", "Inicios", "Platohedro nace como un colectivo audiovisual: queríamos darle voz a una ciudad y un país silenciados en el terror de la violencia.", "https://platohedro.org/wp-content/uploads/2022/02/amazon-3.png"],
  ["2005", "Foco Crítico", "Nuestro primer proyecto, semilla del programa D-Formación: una escuela alternativa de cine y audiovisuales para jóvenes.", "https://platohedro.org/wp-content/uploads/2022/02/fococritico.png"],
  ["2006", "Presentación de cortometrajes", "Platohedro se da a conocer a la ciudad en su lanzamiento oficial.", "https://platohedro.org/wp-content/uploads/2022/03/presenta_colombo.jpg"],
  ["2006", "Sede propia", "Adquirimos la actual sede en el barrio Buenos Aires, una casa para la creación colectiva y colaborativa.", "https://platohedro.org/wp-content/uploads/2022/03/Fotografia-09_-Sede-nueva-copy.jpg"],
  ["2007", "Registro oficial de la Corporación", "Entidad sin ánimo de lucro registrada en enero de 2007 como Corporación Platohedro Grupo Audiovisual.", null],
  ["2007", "CasAbierta", "Inauguramos la Casa Platohedro con una semana de celebración, exposiciones, charlas, feria y conciertos.", "https://platohedro.org/wp-content/uploads/2022/03/casabierta.gif"],
  ["2007–2008", "El Matinée", "Espacio alternativo con niñxs para apropiarse del barrio desde sus voces, miradas y complicidades.", "https://platohedro.org/wp-content/uploads/2022/03/matinee.jpg"],
  ["2007–2008", "Armar la podrida", "Participación en escenarios clave para la ciudad que abrieron aprendizajes y expansión de redes.", "https://platohedro.org/wp-content/uploads/2022/03/Armar-la-podrida.jpg"],
  ["2009–2011", "Moción de Claridad", "Primer proyecto de cooperación internacional con formación política y audiovisual alternativa junto a OtraEZcuela.", "https://platohedro.org/wp-content/uploads/2022/03/Mocion-de-claridad.jpg"],
  ["2010–2013", "Co-Inspiraciones", "Encuentros nacionales e internacionales: Seminario de Comunicación Juvenil, Medelab, Comunlab, Plataforma Puente, LabSurLab y más.", "https://platohedro.org/wp-content/uploads/2022/03/labsurlab.webp"],
  ["2013", "Laboratorios Comunes de Creación", "Residencias creativas y trabajo con equipamientos públicos para tejer alianzas y procesos colaborativos.", "https://platohedro.org/wp-content/uploads/2022/03/Laboratorios-comunes-de-creacion.png"],
  ["2013", "Manga Libre", "Proceso comunitario de revitalización social de un terreno baldío, convertido en espacio público de uso colectivo.", "https://platohedro.org/wp-content/uploads/2022/03/mangalibre.jpg"],
  ["2013", "Intromisiones pedagógicas", "Producción audiovisual en 14 instituciones con actividades para niñxs y adolescentes en jornadas escolares complementarias.", "https://platohedro.org/wp-content/uploads/2022/03/inststituciones-educativas.png"],
  ["2014", "La Jaquer EsCool", "Escuelita hacker creada desde el interés de niñxs y jóvenes por tecnologías, cuerpo, naturaleza y experimentación.", "https://platohedro.org/wp-content/uploads/2022/03/la-jaquer.jpg"],
  ["2014–actualidad", "Arts Collaboratory", "Red internacional para conocimiento libre, sostenibilidad y creación y gestión en red, clave para la proyección organizacional.", "https://platohedro.org/wp-content/uploads/2022/03/ARTS.jpg"],
  ["2014–2016", "Ondas expansivas", "Producción audiovisual de CuBOX junto a C3P y AC; publicación y visibilización de jóvenes como artistas hackers.", "https://platohedro.org/wp-content/uploads/2022/03/ondas.jpg"],
  ["2015", "Proyección al 2020", "Actualización de misión, visión, enfoques y estructura: Salvaguardia, D-Formación, Residencias y Comunicación Libre y Compartida.", "https://platohedro.org/wp-content/uploads/2022/03/2020.png"],
  ["2015", "MDE15", "Anfitrionxs del Encuentro Internacional de Arte de Medellín y procesos de creación colaborativa con artistas locales e internacionales.", "https://platohedro.org/wp-content/uploads/2022/03/mde15.jpg"],
  ["2016", "CreAcción", "Reinvención de Foco Crítico hacia apoyo a iniciativas y emprendimientos juveniles desde autoevaluación y aprendizaje colectivo.", "https://platohedro.org/wp-content/uploads/2022/03/Creaccion.jpg"],
  ["2018", "FemArtNet", "Proyecto con perspectiva de género, arte feminista y derechos humanos que llegó a la Bienal de Arte Joven de Moscú.", "https://platohedro.org/wp-content/uploads/2022/03/FANMM-WEB.png"],
  ["2019", "Next-Generation Prince Claus Fund", "Consolidación de una nueva generación de jóvenes con espíritu crítico, autonomía creativa y búsqueda del Buen Vivir Común.", "https://platohedro.org/wp-content/uploads/2022/03/netx-gen.png"],
  ["2019", "Multiversos", "Publicación escrita a muchas manos que recoge historia, aprendizajes y metodologías de los primeros 15 años de Platohedro.", "https://platohedro.org/wp-content/uploads/2022/03/Multiversos.jpg"],
  ["2019", "Platoteca", "Acervo documental digital y físico de consulta abierta para la comunidad, basado en cultura libre.", "https://platohedro.org/wp-content/uploads/2022/03/platoteca.png"],
  ["2020", "Curaduría para el Buen Vivir Común", "Investigación sobre lo común en la cultura, desde contexto local, Sur Global y voces del ecosistema Platohedro.", "https://platohedro.org/wp-content/uploads/2022/03/AP01.jpg"],
  ["2021", "Cypher_Platxs", "Grupo de estudio de intercambio cripto para imaginar economías alternativas y futuros compartidos del Buen Vivir.", "https://platohedro.org/wp-content/uploads/2022/04/cypherplatxs.jpg"],
  ["2022", "Plan Maestro a 2027", "Nuevo plan estratégico para renovación organizacional e infraestructura, impulsado por investigación en sostenibilidad.", "https://platohedro.org/wp-content/uploads/2022/04/220428_125852.png"],
] as const;

const historyEnglish = [
  ["Beginnings", "Platohedro began as an audiovisual collective: we wanted to give voice to a city and country silenced by the terror of violence."],
  ["Foco Crítico", "Our first project and the seed of the D-Formación programme: an alternative film and audiovisual school for young people."],
  ["Short film showcase", "Platohedro introduced itself to the city at its official launch."],
  ["A home of our own", "We acquired our current home in the Buenos Aires neighbourhood: a house for collective and collaborative creation."],
  ["Official registration of the Corporation", "A non-profit entity registered in January 2007 as Corporación Platohedro Grupo Audiovisual."],
  ["CasAbierta", "We opened Casa Platohedro with a week of celebration, exhibitions, talks, a fair and concerts."],
  ["El Matinée", "An alternative space with children to reclaim the neighbourhood through their voices, perspectives and complicities."],
  ["Armar la podrida", "Participation in key spaces for the city that opened up learning and expanded our networks."],
  ["Moción de Claridad", "Our first international cooperation project, with alternative political and audiovisual training alongside OtraEZcuela."],
  ["Co-Inspiraciones", "National and international gatherings: the Youth Communication Seminar, Medelab, Comunlab, Plataforma Puente, LabSurLab and more."],
  ["Shared Creation Laboratories", "Creative residencies and work with public facilities to weave alliances and collaborative processes."],
  ["Manga Libre", "A community process to socially revitalise a vacant lot, turning it into a collective public space."],
  ["Pedagogical interventions", "Audiovisual production in 14 schools, with activities for children and teenagers in complementary school sessions."],
  ["La Jaquer EsCool", "A hacker school created from children and young people's interests in technology, the body, nature and experimentation."],
  ["Arts Collaboratory", "An international network for free knowledge, sustainability and networked creation and management, key to our organisational development."],
  ["Expansive waves", "Production of CuBOX with C3P and AC; publishing and making young people visible as hacker artists."],
  ["Projection towards 2020", "We updated our mission, vision, approaches and structure: Safeguarding, D-Formación, Residencies, and Free and Shared Communication."],
  ["MDE15", "Hosts of Medellín's International Art Encounter and collaborative creation processes with local and international artists."],
  ["CreAcción", "Foco Crítico reinvented to support youth initiatives and ventures through self-assessment and collective learning."],
  ["FemArtNet", "A project with a gender perspective, feminist art and human rights that reached the Moscow Youth Art Biennale."],
  ["Next-Generation Prince Claus Fund", "Consolidating a new generation of young people with a critical spirit, creative autonomy and a search for the Common Good Life."],
  ["Multiversos", "A many-handed publication gathering the history, learning and methodologies from Platohedro's first 15 years."],
  ["Platoteca", "An open digital and physical documentary collection for the community, grounded in free culture."],
  ["Curatorship for the Common Good Life", "Research into what is held in common in culture, from the local context, the Global South and voices from the Platohedro ecosystem."],
  ["Cypher_Platxs", "A crypto exchange study group imagining alternative economies and shared futures for the Good Life."],
  ["Master Plan to 2027", "A new strategic plan for organisational and infrastructure renewal, driven by sustainability research."],
] as const;

const team = [
  ["Cristina Correa", "Administradora", "https://backup.platohedro.org/wp-content/uploads/2025/03/IMG_1561-768x1024.jpg"],
  ["Alexander Correa", "Co-Director", "https://backup.platohedro.org/wp-content/uploads/2025/03/IMG_1522-768x1024.jpg"],
  ["Lina Mejía", "Co-Directora", "https://backup.platohedro.org/wp-content/uploads/2025/03/IMG_1384-768x1024.jpg"],
  ["Yuliana Rodríguez", "Coordinadora de Educación", "https://backup.platohedro.org/wp-content/uploads/2025/03/IMG_1420-768x1024.jpg"],
  ["Shara Castaño", "Coordinadora de Educación", "https://backup.platohedro.org/wp-content/uploads/2025/03/IMG_1458-768x1024.jpg"],
  ["Kenny Paternina", "Comunicador", "https://backup.platohedro.org/wp-content/uploads/2025/03/kenny-768x1024.jpg"],
  ["Juan Jaramillo", "Coordinador de Comunicaciones", "https://backup.platohedro.org/wp-content/uploads/2025/03/IMG_1504-768x1024.jpg"],
] as const;

const teamRolesEnglish = ["Administrator", "Co-Director", "Co-Director", "Education Coordinator", "Education Coordinator", "Communicator", "Communications Coordinator"];

export function AboutPage() {
  const { i18n } = useTranslation();
  const isEnglish = i18n.resolvedLanguage?.startsWith("en");
  const copy = isEnglish ? {
    intro: "We are an organisation that integrates art, technology and education for personal, social and environmental transformation. Through collective intelligence and territorial experimentation, we accompany communities in creating solutions that bridge gaps and promote harmony with their environment. Our work is grounded in listening and care, celebrating difference to build possible futures through empathy.",
    cultivate: "We cultivate", practices: ["Networks and relationships", "Spaces of care and affection", "Collaboration", "Learning by doing", "Errorism", "Sharing knowledge", "Self-reflection", "Critical thinking", "Walking the word"],
    approach: "Our way of working", focuses: "APPROACHES", culture: "Culture", present: "2004 — present", history: "HISTORY", historyLead: "A journey through the projects, networks and learning that have shaped Platohedro.", swipe: "Swipe to explore the timeline.", people: "The people who make it possible", team: "TEAM", teamLead: "Behind Platohedro is a multidisciplinary team working with love, commitment and a deep sensitivity to social issues. These are people who take on challenges, create, research and accompany processes through art, technology and community. A diverse team that not only contributes knowledge and experience, but also builds bonds, opens spaces for encounter and believes in collective transformation as a daily practice.", transparency: "Transparency", reports: "REPORTS", management: "Management reports", managementLead: "Read the 2024 management report.", esael: "ESAEL information", esaelLead: "Access the entity's information.", portrait: "Portrait of",
  } : {
    intro: "Somos una organización que integra arte, tecnología y educación para la transformación personal, social y ambiental. Mediante inteligencia colectiva y experimentación territorial, acompañamos a comunidades en la creación de soluciones que cierran brechas y promueven la armonía con el entorno. Nuestra labor se fundamenta en la escucha y el cuidado, celebrando la diferencia para construir futuros posibles desde la empatía.",
    cultivate: "Cultivamos", practices: ["Redes y relaciones", "Espacios de cuidado y afecto", "Colaboración", "Aprender haciendo", "Errorismo", "Compartir saberes", "Autoreflexión", "Pensamiento crítico", "Caminar la palabra"],
    approach: "Nuestra forma de hacer", focuses: "ENFOQUES", culture: "Cultura", present: "2004 — actualidad", history: "HISTORIA", historyLead: "Un recorrido por los proyectos, redes y aprendizajes que han dado forma a Platohedro.", swipe: "Desliza para recorrer la línea de tiempo.", people: "Personas que lo hacen posible", team: "EQUIPO", teamLead: "Detrás de Platohedro hay un equipo multidisciplinario que trabaja con amor, compromiso y una profunda sensibilidad por lo social. Personas que asumen retos, crean, investigan y acompañan procesos desde el arte, la tecnología y la comunidad. Un equipo diverso que no solo aporta conocimiento y experiencia, sino que construye vínculos, abre espacios de encuentro y cree en la transformación colectiva como una práctica cotidiana.", transparency: "Transparencia", reports: "INFORMES", management: "Informes de gestión", managementLead: "Consulta el informe de gestión 2024.", esael: "Información ESAEL", esaelLead: "Accede a la información de la entidad.", portrait: "Retrato de",
  };
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="px-6 pb-20 pt-24 md:px-10 md:pt-32">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-5 text-xs uppercase tracking-[0.3em] text-primary" style={{ fontFamily: "'DM Mono', monospace" }}>Platohedro</p>
          <h1 className="mb-8 text-5xl font-bold tracking-tight md:text-7xl" style={{ fontFamily: "'DM Serif Display', serif" }}>NOSOTRXS</h1>
          <p className="mx-auto max-w-4xl text-lg leading-relaxed text-muted-foreground md:text-2xl">
            {copy.intro}
          </p>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/35 px-6 py-16 md:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center gap-3"><Heart className="text-primary" size={22} /><h2 className="text-2xl font-bold md:text-3xl">{copy.cultivate}</h2></div>
          <div className="flex flex-wrap gap-3">
            {copy.practices.map((item) => (
              <span key={item} className="rounded-full border border-primary/30 bg-background px-4 py-2 text-sm font-medium">{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 md:px-10">
        <div className="mb-12 text-center"><p className="mb-3 text-xs uppercase tracking-[0.25em] text-primary">{copy.approach}</p><h2 className="text-4xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>{copy.focuses}</h2></div>
        <div className="grid gap-6 md:grid-cols-3">
          {focuses.map((focus, index) => <article key={focus.name} className="border border-border bg-card p-7 md:p-8"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{copy.culture}</p><h3 className="my-3 text-3xl font-bold">{focus.name}</h3><p className="leading-relaxed text-muted-foreground">{isEnglish ? focusesEnglish[index] : focus.description}</p></article>)}
        </div>
      </section>

      <section className="border-y border-border bg-secondary/20 py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="mb-12 max-w-3xl"><p className="mb-3 text-xs uppercase tracking-[0.25em] text-primary">{copy.present}</p><h2 className="text-4xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>{copy.history}</h2><p className="mt-4 leading-relaxed text-muted-foreground">{copy.historyLead}</p></div>
          <div className="-mx-6 flex snap-x gap-5 overflow-x-auto px-6 pb-6 md:-mx-10 md:px-10">
            {history.map(([year, title, description, image], index) => <article key={`${year}-${title}`} className="w-72 shrink-0 snap-start overflow-hidden rounded-xl border border-border bg-background shadow-sm">
              {image ? <img src={image} alt={`${isEnglish ? historyEnglish[index][0] : title}, ${year}`} className="h-36 w-full object-cover" loading="lazy" /> : <div className="flex h-36 items-center justify-center bg-primary/10 text-primary"><FileText size={36} /></div>}
              <div className="p-5"><span className="inline-block rounded-md bg-primary/15 px-2 py-1 text-xs font-bold text-primary">{year}</span><h3 className="mt-3 text-lg font-bold">{isEnglish ? historyEnglish[index][0] : title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{isEnglish ? historyEnglish[index][1] : description}</p></div>
            </article>)}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{copy.swipe}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 md:px-10">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><p className="mb-3 text-xs uppercase tracking-[0.25em] text-primary">{copy.people}</p><h2 className="text-4xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>{copy.team}</h2></div><Users className="text-primary" size={32} /></div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {team.map(([name, role, image], index) => <article key={name} className="group overflow-hidden rounded-xl bg-secondary/40"><img src={image} alt={`${copy.portrait} ${name}`} className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" /><div className="p-4"><h3 className="font-bold">{name}</h3><p className="mt-1 text-sm text-muted-foreground">{isEnglish ? teamRolesEnglish[index] : role}</p></div></article>)}
        </div>
        <p className="mx-auto mt-12 max-w-4xl text-center text-lg leading-relaxed text-muted-foreground">{copy.teamLead}</p>
      </section>

      <section className="border-t border-border bg-secondary/35 px-6 py-20 md:px-10"><div className="mx-auto max-w-4xl"><div className="mb-10 text-center"><p className="mb-3 text-xs uppercase tracking-[0.25em] text-primary">{copy.transparency}</p><h2 className="text-4xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>{copy.reports}</h2></div><div className="grid gap-5 md:grid-cols-2"><a href="https://platohedro.org/wp-content/uploads/2025/07/Informe-de-Gestion-2024.pdf" target="_blank" rel="noreferrer" className="group flex items-center justify-between border border-border bg-background p-6 transition-colors hover:border-primary"><div><h3 className="font-bold">{copy.management}</h3><p className="mt-1 text-sm text-muted-foreground">{copy.managementLead}</p></div><ArrowUpRight className="text-primary transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></a><a href="https://platohedro.org/esael/" target="_blank" rel="noreferrer" className="group flex items-center justify-between border border-border bg-background p-6 transition-colors hover:border-primary"><div><h3 className="font-bold">{copy.esael}</h3><p className="mt-1 text-sm text-muted-foreground">{copy.esaelLead}</p></div><ArrowUpRight className="text-primary transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></a></div></div></section>
    </main>
  );
}
