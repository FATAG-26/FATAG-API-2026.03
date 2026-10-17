import { criarApp } from "./app.js";
import { carregarDados, JSON_PATH } from "./service.js";

const PORT = Number(process.env.PORT ?? 8000);


async function iniciar() {
    const df = await carregarDados();
    console.log(`${df.length} registros carregados de ${JSON_PATH}`);
    criarApp(df).listen(PORT, "0.0.0.0", () => {
      console.log(`API rodando em http://localhost:${PORT}`);
    });
}
iniciar();