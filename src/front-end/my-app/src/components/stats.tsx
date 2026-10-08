function Stats() {
    // Valores usados no gráfico de periciados
    const aprovados = 70;
    const reprovados = 18;
    const interditados = 12;
    const raio = 40;
    const circunferencia = 2 * Math.PI * raio;
    const dashAprovados = (aprovados / 100) * circunferencia;
    const dashReprovados = (reprovados / 100) * circunferencia;
    const dashInterditados = (interditados / 100) * circunferencia;

    return (
        // Grafico e Div dos periciados
        <div className="flex h-90 w-full mt-4 mb-4">
            <div className="w-1/3 flex flex-col border border-gray-300 rounded overflow-hidden bg-white mr-1">
                <div className="bg-[#1E1E1E] text-white p-2 font-bold text-center">
                    Periciados
                </div>
                <div className="p-3 flex-1 flex flex-col items-center justify-center">
                    <div className="flex items-center justify-center gap-4">
                        <svg
                            width="120"
                            height="120"
                            viewBox="0 0 100 100"
                            className="shrink-0 -rotate-90"
                            role="img"
                            aria-label="Gráfico donut: 70% aprovados, 18% reprovados e 12% interditados"
                        >
                            <circle cx="50" cy="50" r={raio} fill="none" stroke="#00b040" strokeWidth="15" strokeDasharray={`${dashAprovados} ${circunferencia}`} />
                            <circle cx="50" cy="50" r={raio} fill="none" stroke="#dcab00" strokeWidth="15" strokeDasharray={`${dashInterditados} ${circunferencia}`} strokeDashoffset={-dashAprovados} />
                            <circle cx="50" cy="50" r={raio} fill="none" stroke="#b00000" strokeWidth="15" strokeDasharray={`${dashReprovados} ${circunferencia}`} strokeDashoffset={-(dashAprovados + dashInterditados)} />
                        </svg>
                        <div className="flex flex-col gap-2 text-sm">
                            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[#00b040]" /><span>Nº Aprovados</span></div>
                            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[#b00000]" /><span>Nº Reprovados</span></div>
                            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[#dcab00]" /><span>Nº Interditados</span></div>
                        </div>
                    </div>
                    <div className="mt-3 text-center font-bold">
                        Total Periciado: {aprovados + reprovados + interditados}
                    </div>
                </div>
            </div>

            {/* Div que divide em dois, conformidades e autuações */} 
            <div className="w-1/3 flex flex-col">
                {/* Div das conformidades */} 
                <div className="h-1/2 flex flex-col border border-gray-300 rounded overflow-hidden bg-white">
                    <div className="bg-[#1E1E1E] text-white p-2 font-bold text-center">
                        Total em Conformidade
                    </div>
                    <h1 className="flex items-center justify-center h-screen">
                        <p className="text-[7cqh]">N°: {aprovados}</p>
                    </h1>
                </div>

                {/* Div das conformidades */} 
                <div className="h-1/2 flex flex-col border border-gray-300 rounded overflow-hidden bg-white mt-1">
                    <div className="bg-[#1E1E1E] text-white p-2 font-bold text-center">
                        Total de Autuações
                    </div>
                    <h1 className="flex items-center justify-center h-screen">
                        <p className="text-[7cqh]">N°: {reprovados + interditados}</p>
                    </h1>
                </div>
            </div>

            {/* Div da % das bombas, ainda não funcional */} 
            <div className="w-1/3 flex flex-col border border-gray-300 rounded overflow-hidden bg-white ml-1">
                <div className="bg-[#1E1E1E] text-white p-2 font-bold text-center">
                    % de Bombas
                </div>

                <div className="flex items-center justify-center h-screen">
                    <p className="text-[4cqh]">100%</p>
                    <br/>
                    (esse não é funcional, apenas placeholder)
                </div>

            </div>
        </div>
    );
}

export default Stats;
