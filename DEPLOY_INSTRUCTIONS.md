# 🚀 Instruções para Deploy no GitHub e Vercel

## 📋 Passos para criar o repositório no GitHub

### 1. Criar repositório no GitHub
1. Acesse [github.com](https://github.com) e faça login
2. Clique no botão "+" no canto superior direito
3. Selecione "New repository"
4. Preencha os campos:
   - **Repository name**: `fipcar`
   - **Description**: `Sistema de consulta e gerenciamento de valores FIPE de carros`
   - **Visibility**: Public (ou Private, sua escolha)
   - **NÃO** marque "Add a README file" (já temos um)
   - **NÃO** marque "Add .gitignore" (já temos um)
   - **NÃO** marque "Choose a license" (já temos no package.json)
5. Clique em "Create repository"

### 2. Conectar repositório local ao GitHub
Após criar o repositório, o GitHub mostrará comandos. Execute estes comandos no terminal:

```bash
# Adicionar o repositório remoto (substitua SEU_USUARIO pelo seu nome de usuário do GitHub)
git remote add origin https://github.com/SEU_USUARIO/fipcar.git

# Fazer push do código para o GitHub
git branch -M main
git push -u origin main
```

## 🌐 Deploy na Vercel

### 1. Conectar GitHub à Vercel
1. Acesse [vercel.com](https://vercel.com) e faça login (pode usar sua conta do GitHub)
2. Clique em "New Project"
3. Selecione o repositório `fipcar` da lista
4. Clique em "Import"

### 2. Configurar o projeto
1. **Framework Preset**: Deixe como "Other" (será detectado automaticamente)
2. **Root Directory**: Deixe como `./` (padrão)
3. **Build Command**: Deixe vazio (usará o do vercel.json)
4. **Output Directory**: Deixe vazio (usará o do vercel.json)
5. **Install Command**: Deixe vazio (usará o padrão)
6. **Development Command**: Deixe vazio

### 3. Variáveis de Ambiente (se necessário)
- Por enquanto, não precisamos configurar variáveis de ambiente
- O projeto está configurado para funcionar sem elas

### 4. Deploy
1. Clique em "Deploy"
2. Aguarde o processo de build (pode demorar alguns minutos)
3. Quando terminar, você receberá uma URL (ex: `https://fipcar-abc123.vercel.app`)

## 🔄 Deploy Automático

Após a configuração inicial:
- Cada vez que você fizer `git push` para o GitHub
- A Vercel automaticamente fará um novo deploy
- Você pode acompanhar os deploys no dashboard da Vercel

## 📝 Comandos Úteis

### Para desenvolvimento local:
```bash
# Instalar dependências
npm install
cd frontend && npm install && cd ..

# Executar em desenvolvimento
npm run dev
```

### Para fazer alterações e deploy:
```bash
# Fazer alterações no código...

# Adicionar alterações
git add .

# Fazer commit
git commit -m "Descrição das alterações"

# Fazer push (deploy automático na Vercel)
git push origin main
```

## 🐛 Solução de Problemas

### Se o deploy falhar:
1. Verifique os logs na Vercel
2. Certifique-se de que todas as dependências estão no package.json
3. Verifique se o arquivo vercel.json está correto

### Se o frontend não carregar:
1. Verifique se o build do React está sendo gerado
2. Confirme se as rotas no vercel.json estão corretas

### Se a API não funcionar:
1. Verifique se as rotas `/api/*` estão sendo direcionadas corretamente
2. Confirme se o banco de dados está sendo criado

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs na Vercel
2. Consulte a documentação da Vercel
3. Verifique se todos os arquivos estão no repositório

## 🎉 Próximos Passos

Após o deploy bem-sucedido:
1. Teste todas as funcionalidades
2. Configure um domínio personalizado (opcional)
3. Configure monitoramento e analytics (opcional)
4. Compartilhe o link da aplicação! 