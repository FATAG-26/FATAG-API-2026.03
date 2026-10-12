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
        <div className="mt-4 mb-4 grid w-full min-w-0 grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">

            {/* Gráfico de periciados */}
            <div className="flex min-w-0 flex-col overflow-hidden rounded border border-gray-300 bg-white">
                <div className="bg-[#1E1E1E] p-2 text-center font-bold text-white">
                    Periciados
                </div>

                <div className="flex flex-1 flex-col items-center justify-center p-3">
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <svg
                            width="120"
                            height="120"
                            viewBox="0 0 100 100"
                            className="shrink-0 -rotate-90"
                            role="img"
                            aria-label="Gráfico donut: 70% aprovados, 18% reprovados e 12% interditados"
                        >
                            <circle
                                cx="50"
                                cy="50"
                                r={raio}
                                fill="none"
                                stroke="#00b040"
                                strokeWidth="15"
                                strokeDasharray={`${dashAprovados} ${circunferencia}`}
                            />
                            <circle
                                cx="50"
                                cy="50"
                                r={raio}
                                fill="none"
                                stroke="#dcab00"
                                strokeWidth="15"
                                strokeDasharray={`${dashInterditados} ${circunferencia}`}
                                strokeDashoffset={-dashAprovados}
                            />
                            <circle
                                cx="50"
                                cy="50"
                                r={raio}
                                fill="none"
                                stroke="#b00000"
                                strokeWidth="15"
                                strokeDasharray={`${dashReprovados} ${circunferencia}`}
                                strokeDashoffset={-(dashAprovados + dashInterditados)}
                            />
                        </svg>

                        <div className="flex flex-col gap-2 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="h-3 w-3 shrink-0 rounded-full bg-[#00b040]" />
                                <span>Nº Aprovados</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="h-3 w-3 shrink-0 rounded-full bg-[#b00000]" />
                                <span>Nº Reprovados</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="h-3 w-3 shrink-0 rounded-full bg-[#dcab00]" />
                                <span>Nº Interditados</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 text-center font-bold">
                        Total Periciado: {aprovados + reprovados + interditados}
                    </div>
                </div>
            </div>

            {/* Indicadores de conformidade e autuações */}
            <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-1">

                {/* Total em conformidade */}
                <div className="flex min-w-0 flex-col overflow-hidden rounded border border-gray-300 bg-white">
                    <div className="bg-[#1E1E1E] p-2 text-center font-bold text-white">
                        Total em Conformidade
                    </div>
                    <div className="flex flex-1 items-center justify-center p-6">
                        <p className="text-3xl font-bold sm:text-4xl">
                            Nº: {aprovados}
                        </p>
                    </div>
                </div>

                {/* Total de autuações */}
                <div className="flex min-w-0 flex-col overflow-hidden rounded border border-gray-300 bg-white">
                    <div className="bg-[#1E1E1E] p-2 text-center font-bold text-white">
                        Total de Autuações
                    </div>
                    <div className="flex flex-1 items-center justify-center p-6">
                        <p className="text-3xl font-bold sm:text-4xl">
                            Nº: {reprovados + interditados}
                        </p>
                    </div>
                </div>

            </div>

            {/* Percentual de bombas — placeholder */}
            <div className="flex min-w-0 flex-col overflow-hidden rounded border border-gray-300 bg-white">
                <div className="bg-[#1E1E1E] p-2 text-center font-bold text-white">
                    % de Bombas
                </div>

                <div className="flex flex-1 flex-col items-center justify-center gap-2 p-4">
                    <p className="text-3xl font-bold sm:text-4xl">100%</p>
                    <p className="text-center text-sm text-gray-500">
                        esse não é funcional, apenas placeholder.
                    </p>
                </div>
            </div>

        </div>
    );
    
}

export default Stats;
