import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

type DropdownProps = { acao: ReactNode }

function Dropdown({ acao }: DropdownProps) {
    const [aberto, setAberto] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!aberto) return

        function fecharAoInteragirFora(evento: PointerEvent) {
            if (!dropdownRef.current?.contains(evento.target as Node)) setAberto(false)
        }

        function fecharComEscape(evento: KeyboardEvent) {
            if (evento.key === 'Escape') setAberto(false)
        }

        document.addEventListener('pointerdown', fecharAoInteragirFora)
        document.addEventListener('keydown', fecharComEscape)
        return () => {
            document.removeEventListener('pointerdown', fecharAoInteragirFora)
            document.removeEventListener('keydown', fecharComEscape)
        }
    }, [aberto])

    return (
        <div ref={dropdownRef} className="relative inline-block">
            <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={aberto}
                onClick={() => setAberto((valor) => !valor)}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-white hover:bg-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00275a]"
            >
                Relatórios <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true" className="size-5 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>

            </button>

            {aberto && (
                <div
                    role="menu"
                    className="absolute right-0 z-50 mt-2 flex w-max flex-col items-stretch gap-2 whitespace-nowrap rounded-lg border border-gray-200 bg-white p-2 text-gray-900 shadow-lg [&>button]:inline-flex [&>button]:items-center [&>button]:gap-2"
                    onClick={() => setAberto(false)}
                >
                    {acao}
                    <a className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-white px-4 py-2 font-semibold text-[#00275a] shadow hover:bg-blue-50">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true" className="size-6 shrink-0">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
                        </svg>

                        CSV
                    </a>
                </div>
            )}
        </div>
    )
}

export default Dropdown
