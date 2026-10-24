import { Chart } from "react-google-charts";
import type { InfoLine } from "../api";

type Props = {dados?: InfoLine[]}//aqui tá a extrutura de dados aceitas, só olhar o InfoLine em api.ts

const cabecario = ["Ano", "Aprovados", "Reprovados", "Interditados"]

/* configurações do google charts: aqui contem o titulo, se ele vai possuir alguma curva nas linhas ou não (se sim só colocar function no curveType)  */
const options = {
    title: "Comparação entre 2018 - 2026",
    curveType: "none",
    legend: "button",
    hAxis: {
        format: "####"//isso aqui tá formatando o ano no eixo x
    },
}

function Comparison({dados = []}:Props) {
    const data =[
        cabecario,...dados.map((item) => [
        item.ano,
        item.aprovados,
        item.reprovados,
        item.interditados
    ])
    ]

    return (
        <>
            <Chart
                chartType="LineChart"
                width="100%"
                height="100%"
                data={data}
                options={options}
                legendToggle
            />
        </>
    )
}

export default Comparison;