# FipCar - Sistema de Consulta FIPE

Sistema web para consulta e gerenciamento de valores FIPE de carros, desenvolvido com Node.js, Express, React e SQLite.

## 🚀 Funcionalidades

- Consulta de valores FIPE em tempo real
- Gerenciamento de listas de carros
- Classificação automática por faixa de preço
- Interface moderna e responsiva
- Logos das marcas de automóveis

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **SQLite** - Banco de dados
- **Axios** - Cliente HTTP
- **CORS** - Middleware para CORS

### Frontend
- **React** - Biblioteca JavaScript
- **Material-UI** - Componentes de interface
- **Axios** - Cliente HTTP

## 📦 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/fipcar.git
cd fipcar
```

2. Instale as dependências do backend:
```bash
npm install
```

3. Instale as dependências do frontend:
```bash
cd frontend
npm install
cd ..
```

## 🚀 Executando o Projeto

### Desenvolvimento

1. Inicie o servidor backend:
```bash
npm run dev
```

2. Em outro terminal, inicie o frontend:
```bash
cd frontend
npm start
```

3. Acesse `http://localhost:3000` no navegador

### Produção

```bash
npm start
```

## 📁 Estrutura do Projeto

```
fipcar/
├── server.js              # Servidor Express
├── carros.db              # Banco de dados SQLite
├── package.json           # Dependências do backend
├── vercel.json           # Configuração do Vercel
├── frontend/             # Aplicação React
│   ├── src/
│   │   ├── components/   # Componentes React
│   │   ├── App.js        # Componente principal
│   │   └── index.js      # Ponto de entrada
│   └── package.json      # Dependências do frontend
└── public/               # Arquivos estáticos
    ├── images/           # Imagens dos carros
    └── logos/            # Logos das marcas
```

## 🔧 API Endpoints

- `GET /api/marcas` - Lista todas as marcas disponíveis
- `POST /api/modelos` - Busca modelos por marca
- `POST /api/anos` - Busca anos por modelo
- `POST /api/valor` - Consulta valor FIPE
- `GET /api/carros` - Lista carros salvos
- `POST /api/carros` - Salva novo carro
- `PUT /api/carros/:id` - Atualiza carro
- `DELETE /api/carros/:id` - Remove carro
- `GET /api/listas` - Lista todas as listas
- `POST /api/listas` - Cria nova lista
- `PUT /api/listas/:id` - Atualiza lista
- `DELETE /api/listas/:id` - Remove lista

## 🌐 Deploy

O projeto está configurado para deploy na Vercel. Para fazer o deploy:

1. Conecte seu repositório GitHub à Vercel
2. A Vercel detectará automaticamente a configuração do `vercel.json`
3. O deploy será feito automaticamente a cada push

## 📝 Licença

Este projeto está sob a licença ISC.

## 👨‍💻 Autor

Desenvolvido por [Seu Nome] 