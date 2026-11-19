import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import type { ItemRanking } from "../api";
import { normalizarNome } from "../api";

type Municipio = {
  nome: string;
  codigo: string | null;
};

type MapaValeProps = {
  municipios: string[];
  dados: ItemRanking[];
  carregando: boolean;
  erro?: string;
  aoAlterar: (municipios: string[]) => void;
};

const geoUrl = "/maps/Vale_Do_Paraiba.geojson";
const FAIXAS = [
  { rotulo: "31 ou mais", cor: "#15803d", min: 31 },
  { rotulo: "21–30", cor: "#22c55e", min: 21 },
  { rotulo: "11–20", cor: "#86efac", min: 11 },
  { rotulo: "0–10", cor: "#dcfce7", min: 0 },
];

function corDaFaixa(valor: number) {
  return FAIXAS.find((faixa) => valor >= faixa.min)?.cor ?? FAIXAS[3].cor;
}

export default function MapaVale({ municipios, dados, carregando, erro, aoAlterar }: MapaValeProps) {
  const [hovered, setHovered] = useState<Municipio | null>(null);
  const selecionado = municipios[0] ?? "";
  const contagens = new Map(dados.map(({ municipio, valor }) => [normalizarNome(municipio), valor]));

  const alternarMunicipio = (nome: string) => {
    aoAlterar(normalizarNome(selecionado) === normalizarNome(nome) ? [] : [nome]);
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
                const ativo = normalizarNome(selecionado) === normalizarNome(nome);
                const total = contagens.get(normalizarNome(nome)) ?? 0;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    aria-label={`${nome}: ${total} perícias. ${ativo ? "Desselecionar" : "Selecionar"} município`}
                    aria-pressed={ativo}
                    role="button"
                    className="cursor-pointer transition-colors duration-150 hover:brightness-90"
                    onMouseEnter={() => setHovered({ nome, codigo })}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => alternarMunicipio(nome)}
                    style={{
                      fill: ativo ? "#094780" : corDaFaixa(total),
                      stroke: hovered?.nome === nome ? "#14532d" : "#FBFBFB",
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
        <div className="bg-[#094780] p-2 text-center font-bold text-white">Estado</div>
        <div className="flex flex-1 flex-col p-4">
          <p className="mb-3 text-center font-medium text-gray-800">Nº Periciados</p>
          <ul className="mb-5 space-y-3">
            {FAIXAS.map((faixa) => (
              <li key={faixa.rotulo} className="flex items-center gap-2 text-sm text-gray-800">
                <span aria-hidden="true" className="h-4 w-4 rounded-full border border-gray-600" style={{ backgroundColor: faixa.cor }} />
                {faixa.rotulo}
              </li>
            ))}
          </ul>

          <div aria-live="polite" className="min-h-12 rounded border border-gray-200 p-3 text-sm text-gray-700">
            {carregando ? "Carregando perícias…" : erro ? `Erro ao carregar perícias: ${erro}` : hovered
              ? `${hovered.nome}: ${contagens.get(normalizarNome(hovered.nome)) ?? 0} perícias`
              : selecionado || "Clique em um município para selecioná-lo."}
          </div>
          <p className="mt-3 text-xs text-gray-500">Clique em um município para selecionar apenas um. A seleção atual fica destacada em azul.</p>
          <button
            type="button"
            onClick={() => aoAlterar([])}
            disabled={!selecionado}
            className="mt-4 w-full rounded border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Desselecionar município
          </button>
        </div>
      </aside>
    </section>
  );
}
