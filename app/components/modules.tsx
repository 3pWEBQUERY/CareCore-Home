import { moduleCount, moduleGroups } from "@/lib/modules";

export default function Modules() {
  return (
    <section id="module" className="section section-modules" aria-labelledby="modules-title">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">Module</p>
            <h2 id="modules-title">{moduleCount} Module. Eine Oberfläche.</h2>
          </div>
          <p className="section-lead">
            Jedes Modul ist Teil von CareCore – keine Zusatzprodukte, keine Schnittstellen zwischen eigenen Programmen.
            Was eine Person sieht, steuern ihre Rolle und ihre Qualifikation.
          </p>
        </div>

        {moduleGroups.map((group) => (
          <div key={group.id} className="module-group">
            <div className="module-group-head">
              <h3>{group.label}</h3>
              <p>{group.lead}</p>
            </div>
            <ul className="module-grid">
              {group.modules.map(({ code, name, icon: Icon, text, items }) => (
                <li key={code} className="module-card">
                  <div className="module-card-top">
                    <span className="module-icon">
                      <Icon size={22} />
                    </span>
                    <span className="module-code">M{code}</span>
                  </div>
                  <h4>{name}</h4>
                  <p>{text}</p>
                  <ul className="module-items" aria-label={`Bereiche von ${name}`}>
                    {items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
