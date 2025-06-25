# FIPCAR - Sistema de Consulta FIPE

Sistema para consultar e gerenciar valores FIPE de carros, adaptado para hospedagem na Vercel.

## 🚀 Deploy na Vercel

### Pré-requisitos
1. Conta na [Vercel](https://vercel.com)
2. Conta no [Neon Database](https://neon.tech) (gratuito)

### Passos para Deploy

#### 1. Configurar Neon Database
1. Acesse [neon.tech](https://neon.tech) e crie uma conta gratuita
2. Crie um novo projeto
3. Anote a **Connection String** que será fornecida
4. A string será algo como: `postgresql://user:password@host/database`

#### 2. Configurar Variáveis de Ambiente
Na Vercel, vá em Settings → Environment Variables e adicione:
```
DATABASE_URL=sua_connection_string_do_neon
```

#### 3. Fazer Deploy
1. Conecte seu repositório GitHub à Vercel
2. Configure o build:
   - **Framework Preset**: Other
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `frontend/build`
   - **Install Command**: `npm install`

#### 4. Inicializar Banco de Dados
Após o deploy, faça uma requisição POST para `/api/init-db` para criar as tabelas:
```bash
curl -X POST https://seu-dominio.vercel.app/api/init-db
```

## 🛠️ Desenvolvimento Local

### Instalar Dependências
```bash
npm install
cd frontend && npm install
```

### Configurar Banco Local
Para desenvolvimento local, você pode usar:
- SQLite (como estava antes)
- Ou configurar um Postgres local
- Ou usar o Neon Database (recomendado)

### Executar
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd frontend && npm start
```

## 📁 Estrutura do Projeto

```
fipcar_03/
├── api/                    # API Routes da Vercel
│   ├── db.js              # Configuração do Neon
│   ├── marcas.js          # API de marcas
│   ├── modelos.js         # API de modelos
│   ├── anos.js            # API de anos
│   ├── valor.js           # API de valores
│   ├── carros.js          # CRUD de carros
│   ├── listas.js          # CRUD de listas
│   ├── car-images.js      # API de imagens
│   └── init-db.js         # Inicialização do banco
├── frontend/              # Aplicação React
├── public/                # Arquivos estáticos
├── vercel.json           # Configuração da Vercel
└── package.json          # Dependências
```

## 🔄 Migração do SQLite para Neon

As principais mudanças foram:
- Substituição do `sqlite3` por `@neondatabase/serverless`
- Conversão de queries SQLite para PostgreSQL
- Adaptação das API Routes para o formato da Vercel
- Configuração de variáveis de ambiente

## 🌐 URLs da API

- `GET /api/marcas` - Listar marcas
- `POST /api/modelos` - Buscar modelos
- `POST /api/anos` - Buscar anos
- `POST /api/valor` - Buscar valor FIPE
- `GET/POST/PUT/DELETE /api/carros` - CRUD de carros
- `GET/POST/PUT/DELETE /api/listas` - CRUD de listas
- `POST /api/init-db` - Inicializar banco

## 💡 Vantagens do Neon Database

1. **Serverless**: Escala automaticamente
2. **PostgreSQL**: Banco robusto e confiável
3. **Gratuito**: 3GB de armazenamento
4. **Performance**: Otimizado para aplicações serverless
5. **Integração**: Funciona perfeitamente com Vercel
6. **Backup**: Backups automáticos

## 🐛 Troubleshooting

### Erro de Conexão com Banco
- Verifique se a variável `DATABASE_URL` está configurada
- Confirme se o projeto Neon está ativo
- Teste a connection string no console do Neon

### Erro de Build
- Verifique se todas as dependências estão no `package.json`
- Confirme se o comando de build está correto

### API não Funciona
- Verifique se o banco foi inicializado (`/api/init-db`)
- Confirme se as rotas estão corretas
- Verifique os logs na Vercel

## 🔗 Links Úteis

- [Neon Database](https://neon.tech) - Banco de dados serverless
- [Vercel](https://vercel.com) - Plataforma de deploy
- [Documentação Neon](https://neon.tech/docs) - Guias e tutoriais 