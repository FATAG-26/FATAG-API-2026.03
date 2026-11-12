<div align="center">
  <img src="docs/img/logo.png" alt="Logo da Equipe" width="200"/>
</div>

# </FATAG>

<div align="center">

[Desafio](#-desafio) • [Requisitos](docs/requisitos.md) • [Backlog](docs/backlog.md) • [Sprints](#-sprints) • [DoR/DoD](#-dor--dod) • [Equipe](#-equipe) • [Como_Instalar](docs/instalação.md) • [API](docs/api.md) • [Manual_do_Usuário](docs/manual-do-usuario.md) • [Cronograma de Evolução](docs/cronograma.png) • [Pastas_do_Projeto](docs/Pastas_do_projeto.png) • [Padrão_de_Commit_do_Projeto](docs/Padrão%20de%20Commits.md)

</div>

> **Parceiro:** IPEM-SP · **Curso:** 3°ADS · **Período:** 2026-2
>
> **Status do Projeto:** Em desenvolvimento 🚧

---

## 🏭 Desafio

O IPEM-SP publica um grande volume de dados sobre a fiscalização de bombas medidoras de combustível, mas essa informação chega ao público em planilhas brutas, espalhadas entre o Portal de Dados Abertos do IPEM-SP e o PSIE do Inmetro. Os registros trazem inconsistências de nomes de municípios, formatos de data variados e colunas de medição sem padronização.

O resultado é um dado que existe, é público, mas não é consultável: o cidadão não consegue saber se as bombas da sua cidade estão em conformidade, e a própria gestão perde agilidade para identificar regiões críticas e padrões de reprovação.

Nesse contexto, o desafio é transformar essa base dispersa em informação clara, construindo um pipeline de tratamento e análise em Python e um painel web de consulta rápida sobre a conformidade das bombas de combustível fiscalizadas no estado de São Paulo.

---

## ⚙️ Desenvolvimento

O projeto é dividido em três partes:

| Parte | Pasta | O que faz |
| :---- | :---- | :-------- |
| 📓 **Notebook** (Python + Pandas) | [`notebook/`](notebook/testApi_py.ipynb) | Lê os CSVs do IPEM-SP (2018 a 2026), trata e padroniza os dados e exporta a base tratada em JSON. Também tem as análises que deram origem às funções da API. [Documentação](notebook/DOCUMENTACAO_testApi_py.md) · [Google Colab](https://colab.research.google.com/drive/1hZg6B7dlyYgenRo9yUHyZRV7iHlA0LvL?usp=sharing) |
| 🔌 **API** (Node.js + Express) | [`src/backend-node/`](src/backend-node) | Carrega a base tratada (`src/data/verificacoes_bombas_tratado.json`) e oferece as rotas de consulta, filtros, resumo, ranking e evolução por ano. [Documentação da API](docs/api.md) |
| 🖥️ **Dashboard** (React + TypeScript) | [`src/front-end/my-app/`](src/front-end/my-app) | Painel web com tabela, cards de KPI, gráficos interativos, ranking, mapa do Vale do Paraíba, filtros e relatórios em PDF, CSV e JSON. |

Para rodar o projeto, veja o guia de [instalação](docs/instalação.md).

---

## 🌳Estratégia de Branches

### Branch Principal:
- `main`: Branch de produção com código estável e funcional;

### Branch de Desenvolvimento:
- `develop`: Desenvolvimento da API que fornece os dados;
- `front-end`: Desenvolvimento do visual do site;
- `feat/docker`: Implementação do Docker no projeto;
- `feat/filtros`: Funções relacionadas aos filtros;
- `feat/interatividade`: Interatividade dos gráficos e do painel;
- `feat/relatorios`: Geração de relatórios (PDF, CSV e JSON);

### Branch de Correções:
- `fix/correcoes`: Correções e limpeza do código;

### Branch de Documentação:
  - `document`: Atualização da documentação.

---

## 📅 Sprints

| Sprint | Período | Meta | Documentação | Vídeo |
| :----- | :------ | :--- | :----------- | :---- |
| 🏃 **Sprint 1** | 07/09 – 27/09 | Consolidar os dados de fiscalização das bombas medidoras e disponibilizar os indicadores básicos de conformidade | [Docs](docs/sprints/sprint-1.md) | [Assistir](https://youtu.be/t0FCfCGjA-U) |
| 🏃 **Sprint 2** | 05/10 – 25/10 | Consultar os dados por município e região, gerar o ranking de municípios e regiões e comparar a evolução entre os anos | [Docs](docs/sprints/sprint-2/backlog.md) | [Assistir](https://youtu.be/fC_1P6IB1w8) |
| 🏃 **Sprint 3** | 02/11 – 22/11 | Entregar a dashboard interativa, com filtros por município, região e período, gráficos interativos e exportação dos registros tratados em CSV | [Docs](docs/sprints/sprint-3/backlog.md) | [Assistir](#) |

---

## 🚦 DoR & DoD

### 🏃‍ DoR - Definition of Ready

* User Stories com **Critérios de Aceitação**
* Subtarefas divididas **a partir das US**
* Fontes de dados **identificadas** (Portal de Dados Abertos do IPEM-SP e PSIE do Inmetro)
* Dicionário de dados com as **colunas relevantes** mapeadas
* Protótipo das telas no **Figma**
* User Stories **estimadas** e **priorizadas** no Backlog

### 🏆 DoD - Definition of Done

* Critérios de Aceitação **atendidos**
* Pipeline de tratamento dos dados **completo** (limpeza e padronização)
* Indicadores **validados** com a base de dados
* Código completo e **versionado** no GitHub
* Documentação do **Notebook** atualizada
* [Manual de Usuário](docs/manual-do-usuario.md)
* Vídeos de cada etapa de entrega

---

## 🧰 Tecnologias e ferramentas

<div align="left">

**Front-end**  
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind_CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

**Back-end**  
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)

**Tratamento e análise dos dados**  
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Pandas](https://img.shields.io/badge/Pandas-150458?style=for-the-badge&logo=pandas&logoColor=white)
![Google_Colab](https://img.shields.io/badge/Google_Colab-F9AB00?style=for-the-badge&logo=googlecolab&logoColor=white)

**Infraestrutura e colaboração**  
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)
![Figma](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)
![Jira](https://img.shields.io/badge/Jira-0052CC?style=for-the-badge&logo=jira&logoColor=white)

</div>

---

## 👥 Equipe

| Membro | Função | GitHub | LinkedIn |
| :----- | :----- | :----- | :------- |
| João Barreto | Product Owner | [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/JoaoBarreto3) | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/joaobarreto3/) |
| Nicolas Escobar | Scrum Master | [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Niikoto) | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/nicolas-escobar-souza-020162324) |
| Elizabete Baltazar | Desenvolvedor(a) | [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/BeteBaltazar) | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/elizabete-de-sá-flores-baltazar-9a362242b) |
| Heitor Galvão | Desenvolvedor(a) | [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Scareev) | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/heitor-junqueira-a3336a34a) |
| Miguel Duarte | Desenvolvedor(a) | [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Duarte-Biophysics) | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/miguel-duarte-a12181390) |
| Lucas Suzuki | Desenvolvedor(a) | [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/LucaSuzuki) | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/lucas-suzuki-695010380) |
| Kamille Fernandes | Desenvolvedor(a) | [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/KamilleFernandes) | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/kamille-f-da-silva-122a10284) |
| Adler Rocha | Desenvolvedor(a) | [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/AdlerR101) | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/adler-rocha-a98480216) |

---

<div align="center">

FATAG · 3º ADS · Fatec São José dos Campos · 2026-2

</div>
