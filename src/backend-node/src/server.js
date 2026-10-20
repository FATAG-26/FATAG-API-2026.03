import { criarApp } from "./app.js";
import { carregarJson, DATA_PATH } from "./service.js";

const PORT = Number(process.env.PORT ?? 8000);

const df = carregarJson();
console.log(`${df.length} registros carregados de ${DATA_PATH}`);

criarApp(df).listen(PORT, "0.0.0.0", () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});