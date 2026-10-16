import { criarApp } from "./app.js";
import { carregarDados, CSV_PATH } from "./service.js";

const PORT = Number(process.env.PORT ?? 8000);

const df = carregarDados();
console.log(`${df.length} registros carregados de ${CSV_PATH}`);

criarApp(df).listen(PORT, "0.0.0.0", () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
