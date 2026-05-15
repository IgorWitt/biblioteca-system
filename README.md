# Sistema de Biblioteca Simplificada

Trabalho pratico da disciplina de Desenvolvimento Web.

## Tecnologias

- **Backend:** Node.js + Express
- **Views:** EJS (server-side rendering)
- **Banco de dados:** SQLite (via better-sqlite3)
- **Autenticacao:** bcryptjs + express-session

## Arquitetura

O projeto segue a separacao **Controller → Service → Repository**:

```
src/
├── controllers/   # Recebe requisicoes HTTP, chama services, renderiza views
├── services/      # Regras de negocio e validacoes
├── repositories/  # Acesso ao banco de dados (queries SQL)
├── middlewares/    # Autenticacao e controle de acesso
└── database/      # Conexao e seed do banco
```

## Como rodar

```bash
npm install          # Instala dependencias
npm run seed         # Cria banco + dados iniciais
npm start            # Inicia servidor em http://localhost:3000
```

## Usuarios padrao (seed)

| Perfil | Email | Senha |
|--------|-------|-------|
| Admin (Bibliotecario) | admin@biblioteca.com | admin123 |
| Leitor | leitor@biblioteca.com | leitor123 |

## Funcionalidades

### Autenticacao
- Login e cadastro com email/senha
- Senhas armazenadas com hash bcrypt
- Sessao com cookie de 2h

### Perfis de usuario
- **Admin:** CRUD completo de livros, visualiza todos os emprestimos
- **Leitor:** Consulta acervo, solicita e devolve seus emprestimos

### CRUD de Livros (Admin)
- Criar, listar, editar e excluir livros
- Controle de quantidade total e disponivel

### Emprestimos
- Qualquer usuario autenticado pode solicitar emprestimo
- Prazo automatico de 14 dias
- Devolucao atualiza disponibilidade do livro

### Regras de negocio
1. **Sem emprestimo duplicado** — nao pode emprestar o mesmo livro que ja esta ativo
2. **Controle de disponibilidade** — livro com estoque zerado nao pode ser emprestado
3. **Limite por leitor** — maximo de 3 emprestimos ativos simultaneamente
4. **Protecao de exclusao** — livro com emprestimo ativo nao pode ser excluido
5. **Permissionamento** — apenas admin pode criar/editar/excluir livros
