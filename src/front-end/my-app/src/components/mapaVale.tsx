import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import "./MapaVale.css";

type Municipio = {
  nome: string;
  codigo: string | null;
};

const geoUrl = "/maps/Vale_Do_Paraiba.geojson";

export default function MapaVale() {
  const [hovered, setHovered] = useState<Municipio | null>(null);
  const [selected, setSelected] = useState<Municipio | null>(null);

  return (
    <section className="mapa-container">
      <h2>Municípios do Vale do Paraíba</h2>

      <p aria-live="polite">
        {hovered
          ? `Município: ${hovered.nome}`
          : selected
            ? `Selecionado: ${selected.nome}`
            : "Passe o cursor ou clique em um município."}
      </p>

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          center: [-45.5, -22.8],
          scale: 10000,
        }}
        style={{ width: "100%", height: "auto" }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const props = geo.properties as Record<string, unknown>;

              const nome = String(
                props["NM_MUN"] ??
                props["name"] ??
                props["nome"] ??
                "Município"
              );

              const codigoRaw =
                props["CD_MUN"] ??
                props["codarea"] ??
                props["codigo"];

              const codigo =
                codigoRaw == null ? null : String(codigoRaw);

              const municipio: Municipio = { nome, codigo };

              const isSelected =
                selected?.nome === nome &&
                selected?.codigo === codigo;

              const isHovered =
                hovered?.nome === nome &&
                hovered?.codigo === codigo;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  aria-label={nome}
                  className={`municipio ${isSelected ? "municipio-selecionado" : ""}`}
                  onMouseEnter={() => setHovered(municipio)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setSelected(municipio)}
                  style={{
                    fill: isSelected ? "#2563eb" : "#dbeafe",
                    stroke: isHovered ? "#1d4ed8" : "#ffffff",
                    strokeWidth: isHovered ? 1.2 : 0.7,
                    outline: "none",
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {selected && (
        <div className="municipio-detalhes">
          <strong>{selected.nome}</strong>

          {selected.codigo && (
            <p>Código IBGE: {selected.codigo}</p>
          )}

          <button onClick={() => setSelected(null)}>
            Limpar seleção
          </button>
        </div>
      )}
    </section>
  );
}
