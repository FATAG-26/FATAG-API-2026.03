
import { Chart } from "react-google-charts";
function Comparison() {
    const data = [
        ["ano", "APROVADO", "REPROVADO"],
        ["2018", 11, 123],
        ["2019", 22, 121],
        ["2020", 333, 625],
        ["2021", 444, 51],
        ["2022", 454, 43],
        ["2023", 22, 62],
        ["2024", 324, 131],
        ["2025", 264, 44],
        ["2026", 622, 134]
    ]

    const options = {
        title: "Comparação entre 2018 - 2026",
        curveType: "function",
        legend: "button"
    }


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