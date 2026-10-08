# Instalação e execução

Este guia prepara o ambiente para executar o FATAG localmente usando Docker Compose. O Docker inicia o front-end e a API; não é necessário instalar Node.js ou Python na máquina.

## Requisitos

- Git, caso ainda precise baixar o projeto.
- Docker instalado e em execução.
- Conexão com a internet na primeira execução, para baixar as imagens e dependências.

## Windows

### 1. Verifique a virtualização

Abra o **Gerenciador de Tarefas** (`Ctrl` + `Shift` + `Esc`), acesse **Desempenho > CPU** e confirme que **Virtualização** está habilitada. Se estiver desabilitada, ative Intel VT-x ou AMD-V nas configurações UEFI/BIOS do computador.

### 2. Habilite o WSL 2

Abra o **PowerShell como administrador** e execute:

```powershell
wsl --install
```

Reinicie o computador se o Windows solicitar. Se o WSL já estiver instalado, confirme que está atualizado com `wsl --update`.

### 3. Instale o Docker Desktop

Baixe e instale o [Docker Desktop para Windows](https://www.docker.com/products/docker-desktop/). Escolha a arquitetura compatível com o computador (normalmente **AMD64/x86_64**; escolha **ARM64** em dispositivos Windows com processador ARM) e use o backend **WSL 2** quando solicitado. Abra o Docker Desktop e aguarde até ele indicar que está em execução.

### 4. Inicie o projeto

Abra o PowerShell ou o Prompt de Comando e navegue até a pasta `src` do projeto. Por exemplo, se o projeto estiver na Área de Trabalho:

```powershell
cd "$HOME\OneDrive\Desktop\FATAG-API-2026.03\src"
docker compose up --build
```

Se o projeto estiver em outro local, ajuste o caminho do comando `cd`. Mantenha essa janela aberta enquanto estiver usando a aplicação.

## Linux

### 1. Verifique os requisitos

Use uma distribuição Linux de 64 bits. Se o computador usa Docker Desktop para Linux, também é necessário suporte à virtualização KVM; consulte os [requisitos oficiais](https://docs.docker.com/desktop/setup/install/linux/). Com Docker Engine, não é necessário instalar a interface gráfica do Docker Desktop.

### 2. Instale o Docker Engine e o Compose

Instale o **Docker Engine**, o **Docker CLI** e o **plugin Docker Compose** seguindo as instruções oficiais para sua distribuição na página [Instalação do Docker Engine](https://docs.docker.com/engine/install/). No Ubuntu, por exemplo, o pacote `docker-compose-plugin` disponibiliza o comando `docker compose`.

Após a instalação, inicie o serviço Docker caso ele ainda não esteja ativo. No Ubuntu e em sistemas com systemd, use:

```bash
sudo systemctl enable --now docker
```

Se o comando Docker exigir privilégios de administrador, execute os comandos Docker com `sudo` (por exemplo, `sudo docker compose up --build`) ou configure o acesso sem `sudo` conforme a [documentação oficial](https://docs.docker.com/engine/install/linux-postinstall/).

### 3. Inicie o projeto

No terminal, navegue até a pasta `src` do projeto e inicie os serviços:

```bash
cd /caminho/para/FATAG-API-2026.03/src
docker compose up --build
```

Substitua `/caminho/para/` pelo local onde o projeto foi salvo. Mantenha o terminal aberto enquanto estiver usando a aplicação.

## Acessar a aplicação

Quando os serviços terminarem de iniciar, abra no navegador:

- **Aplicação web:** [http://localhost:5173/](http://localhost:5173/)
- **API:** [http://localhost:8000/](http://localhost:8000/)

Na primeira execução, a criação das imagens pode levar alguns minutos. Se a porta 5173 ou 8000 já estiver em uso, encerre o programa que a utiliza e execute novamente.

Para parar os serviços, pressione `Ctrl` + `C` no terminal. Para removê-los, execute `docker compose down` dentro da pasta `src`.
