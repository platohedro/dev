"use client";

import { useTranslation } from "react-i18next";
import { Users, MapPin, Clock, Heart, Camera, BookOpen, Handshake, Target } from "lucide-react";

export function AboutPage() {
  const { t } = useTranslation(["translation", "about"]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="py-24 px-6 md:px-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs text-primary tracking-widest uppercase block mb-4" style={{ fontFamily: "'DM Mono', monospace" }}>
            {t("about.title", "Get to Know Us")}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ fontFamily: "'DM Serif Display', serif" }}>
            {t("about.subtitle", "Who We Are")}
          </h1>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("about.mission.description", "We promote the integral development of the community through community art, creating spaces for encounter and expression that strengthen cultural identity and foster active citizen participation.")}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <Heart className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Misión</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t("about.mission.description", "We promote the integral development of the community through community art, creating spaces for encounter and expression that strengthen cultural identity and foster active citizen participation.")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <Target className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Visión</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t("about.vision.description", "To be a reference organization in community art in Medellín, recognized for our impact on social transformation and our commitment to cultural innovation and strengthening of the community fabric.")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <MapPin className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Ubicación</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t("about.location.description", "Based in the heart of Medellín, in Commune 11 (El Poblado), and we have workspaces in different parts of the city to facilitate access to all communities.")}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <Clock className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Historia</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t("about.history.description", "Founded in 2004, we have worked tirelessly for over 22 years to transform the reality of our city through community art practices, collaborating with more than 5,000 participants throughout our trajectory.")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <Users className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Equipo</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t("about.team.description", "We have a multidisciplinary team of professionals committed to community development, including artists, educators, psychologists, designers and technicians specialized in digital media.")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <Handshake className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Valores</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t("about.values.description", "Collaboration, inclusion, innovation, transparency and respect for traditional knowledge are the pillars that guide our daily work with communities.")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-20">
          <h2 className="text-3xl font-bold mb-12 text-center">Nuestros Espacios</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group cursor-pointer">
              <div className="aspect-video bg-muted rounded-lg mb-4 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1517457373958-b7bdd4587743?w=800&h=600&fit=crop&auto=format"
                  alt="Nuestro estudio principal en Medellín"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <h3 className="font-bold mb-2">{t("spaces.mainStudio.title", "Main Studio")}</h3>
              <p className="text-sm text-muted-foreground">{t("spaces.mainStudio.description", "Our central space located in El Poblado, with capacity for 40 people simultaneously.")}</p>
            </div>

            <div className="group cursor-pointer">
              <div className="aspect-video bg-muted rounded-lg mb-4 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop&auto=format"
                  alt="Laboratorio digital"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <h3 className="font-bold mb-2">{t("spaces.digitalLab.title", "Digital Lab")}</h3>
              <p className="text-sm text-muted-foreground">{t("spaces.digitalLab.description", "Computers and professional recording equipment available for residents and program participants.")}</p>
            </div>

            <div className="group cursor-pointer">
              <div className="aspect-video bg-muted rounded-lg mb-4 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=600&fit=crop&auto=format"
                  alt="Espacio de residencias"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <h3 className="font-bold mb-2">{t("spaces.residencySpaces.title", "Residency Spaces")}</h3>
              <p className="text-sm text-muted-foreground">{t("spaces.residencySpaces.description", "Four residencies equipped with rehearsal, recording and production studios.")}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-20 mt-20">
          <h2 className="text-3xl font-bold mb-12 text-center">Colaboradores y Aliados</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: "Ministerio de Cultura", full: "Ministerio de Cultura de Colombia" },
              { name: "Alcaldía de Medellín", full: "Alcaldía de Medellín" },
              { name: "Idartes", full: "Instituto Distrital de las Artes" },
              { name: "Colciencias", full: "Ministerio de Ciencia y Tecnología" },
              { name: "Redes", full: "Red Nacional de Cultura" },
              { name: "Open Society", full: "Open Society Foundations" },
            ].map((sponsor) => (
              <div 
                key={sponsor.name}
                className="bg-secondary/50 flex items-center justify-center px-4 py-6 rounded-lg hover:bg-primary/10 transition-colors cursor-pointer group"
                title={sponsor.full}
              >
                <span className="text-foreground group-hover:text-primary text-xs text-center font-semibold transition-colors">
                  {sponsor.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border pt-20 mt-20">
          <div className="bg-secondary/50 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Únete a Nuestra Comunidad</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Si estás interesado en colaborar, ser voluntario o participar en nuestros programas, contáctanos. Estamos siempre abiertos a nuevas ideas y colaboraciones que puedan enriquecer nuestro trabajo comunitario.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors">
                {t("cta.volunteer", "Become a Volunteer")}
              </button>
              <button className="px-8 py-3 border border-border text-foreground font-semibold rounded-lg hover:border-primary hover:text-primary transition-colors">
                {t("cta.contact", "Contact Us")}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}