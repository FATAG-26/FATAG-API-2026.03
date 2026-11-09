import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";

type Municipio = {
  nome: string;
  codigo: string | null;
};

type MapaValeProps = {
  municipios: string[];
  aoAlterar: (municipios: string[]) => void;
};

const geoUrl = "/maps/Vale_Do_Paraiba.geojson";
const LIMITE_MUNICIPIOS = 5;
const normalizar = (valor: string) =>
  valor.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLocaleUpperCase("pt-BR");

export default function MapaVale({ municipios, aoAlterar }: MapaValeProps) {
  const [hovered, setHovered] = useState<Municipio | null>(null);
  const [limiteAtingido, setLimiteAtingido] = useState(false);
  const selecionados = new Set(municipios.map(normalizar));

  const alternarMunicipio = (nome: string) => {
    const chave = normalizar(nome);
    if (selecionados.has(chave)) {
      setLimiteAtingido(false);
      aoAlterar(municipios.filter((municipio) => normalizar(municipio) !== chave));
      return;
    }
    if (municipios.length >= LIMITE_MUNICIPIOS) {
      setLimiteAtingido(true);
      return;
    }
    setLimiteAtingido(false);
    aoAlterar([...municipios, nome]);
  };

  return (
    <section className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-4 md:grid-cols-2 md:gap-6">
      <div className="w-full min-w-0 rounded-md p-2 sm:p-3">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ center: [-45.5, -22.8], scale: 10000 }}
          width={640}
          height={480}
          className="mx-auto block h-auto w-full overflow-visible"
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const props = geo.properties as Record<string, unknown>;
                const nome = String(props["NM_MUN"] ?? props["name"] ?? props["nome"] ?? "Município");
                const codigoRaw = props["CD_MUN"] ?? props["codarea"] ?? props["codigo"];
                const codigo = codigoRaw == null ? null : String(codigoRaw);
                const ativo = selecionados.has(normalizar(nome));

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    aria-label={`${ativo ? "Remover" : "Selecionar"} ${nome}`}
                    aria-pressed={ativo}
                    role="button"
                    className={`cursor-pointer transition-colors duration-150 ${ativo ? "fill-blue-600" : "fill-blue-100 hover:fill-blue-400"}`}
                    onMouseEnter={() => setHovered({ nome, codigo })}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => alternarMunicipio(nome)}
                    style={{
                      stroke: hovered?.nome === nome ? "#1d4ed8" : "#FBFBFB",
                      strokeWidth: hovered?.nome === nome ? 1.2 : 0.7,
                      outline: "none",
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>

      <aside className="flex min-w-0 flex-col overflow-hidden rounded border border-gray-300 bg-[#FBFBFB]">
        <div className="bg-[#094780] p-2 text-center font-bold text-white">Municípios selecionados</div>
        <div className="flex flex-1 flex-col p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm text-gray-600">Selecione até {LIMITE_MUNICIPIOS} municípios no mapa.</p>
            <span className="shrink-0 text-sm font-bold text-gray-800">
              {municipios.length}/{LIMITE_MUNICIPIOS}
            </span>
          </div>

          <div aria-live="polite" className="mb-3 min-h-12 rounded border border-gray-200 p-3 text-sm text-gray-700">
            {limiteAtingido
              ? `Limite de ${LIMITE_MUNICIPIOS} atingido. Remova uma seleção para escolher outro município.`
              : hovered
                ? hovered.nome
                : municipios.at(-1) ?? "Clique em um município para ver o nome aqui."}
          </div>

          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">Selecionados</p>
          {municipios.length ? (
            <ul className="mb-4 flex flex-wrap gap-2">
              {municipios.map((nome) => (
                <li key={normalizar(nome)} className="rounded-md bg-blue-100 px-3 py-2 text-sm text-blue-900">
                  {nome}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mb-4 text-sm text-gray-500">Nenhum município selecionado.</p>
          )}

          <button
            type="button"
            onClick={() => { setLimiteAtingido(false); aoAlterar([]); }}
            disabled={municipios.length === 0}
            className="mt-auto w-full rounded border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Desselecionar todos
          </button>
        </div>
      </aside>
    </section>
  );
}
