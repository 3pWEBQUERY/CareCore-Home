import { EnvelopeSimple, MapPin, Phone } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/lib/site";
import ContactForm from "./contact-form";

export default function Contact() {
  const { company } = site;
  return (
    <section id="kontakt" className="section section-contact" aria-labelledby="contact-title">
      <div className="container">
        <div className="contact-card">
          <div className="contact-copy">
            <p className="eyebrow eyebrow-light">Demo vereinbaren</p>
            <h2 id="contact-title">Sehen Sie CareCore an Ihren eigenen Abläufen.</h2>
            <p>
              In der Demo zeigen wir Medikamentenrunde, Übergabe, Wunddokumentation und Dienstplan so, wie Ihr Team sie
              nutzen würde – und beantworten Fragen zu Datenschutz, Betrieb und Einführung.
            </p>
            <ul className="contact-lines">
              <li>
                <EnvelopeSimple size={18} />
                <a href={`mailto:${company.email}`}>{company.email}</a>
              </li>
              <li>
                <Phone size={18} />
                <span>
                  {company.phone} <small>· {company.hours}</small>
                </span>
              </li>
              <li>
                <MapPin size={18} />
                <span>
                  {company.name}, {company.street}, {company.city}
                </span>
              </li>
            </ul>
          </div>
          <ContactForm email={company.email} />
        </div>
      </div>
    </section>
  );
}
