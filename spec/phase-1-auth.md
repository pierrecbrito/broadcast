# Fase 1 — Autenticação

## Objetivo

Implementar cadastro, login e logout com Firebase Auth, protegendo rotas que exigem autenticação.

---

## Contexto de Negócio

O sistema é SaaS multi-tenant. Cada usuário autenticado é um "cliente" com dados isolados. Sem autenticação, não há como garantir isolamento. O login é a porta de entrada para toda a aplicação.

---

## User Stories

### US-1.1 — Cadastro

**Como** visitante,  
**quero** criar uma conta com email e senha,  
**para** acessar o sistema.

**Critérios de Aceite**:
- [ ] Formulário com campos: email, senha, confirmar senha
- [ ] Validação: email válido, senha mínima 6 caracteres, senhas coincidem
- [ ] Ao submeter, cria usuário no Firebase Auth (`createUserWithEmailAndPassword`)
- [ ] Em caso de sucesso, redireciona para `/`
- [ ] Em caso de erro (email já existe, senha fraca), exibe mensagem amigável
- [ ] Campos usam componentes MUI (`TextField`, `Button`)

---

### US-1.2 — Login

**Como** usuário cadastrado,  
**quero** fazer login com meu email e senha,  
**para** acessar minhas conexões e contatos.

**Critérios de Aceite**:
- [ ] Formulário com campos: email, senha
- [ ] Ao submeter, autentica via `signInWithEmailAndPassword`
- [ ] Em caso de sucesso, redireciona para `/`
- [ ] Em caso de erro (credenciais inválidas), exibe mensagem amigável
- [ ] Link para tela de cadastro

---

### US-1.3 — Logout

**Como** usuário autenticado,  
**quero** fazer logout,  
**para** encerrar minha sessão.

**Critérios de Aceite**:
- [ ] Botão de logout visível no layout principal (AppBar/Header)
- [ ] Ao clicar, executa `signOut` do Firebase Auth
- [ ] Redireciona para `/login`

---

### US-1.4 — Proteção de Rotas

**Como** sistema,  
**quero** impedir acesso a rotas protegidas por usuários não autenticados,  
**para** garantir segurança.

**Critérios de Aceite**:
- [ ] Componente `PrivateRoute` (ou equivalente) que verifica autenticação
- [ ] Se não autenticado, redireciona para `/login`
- [ ] Se autenticado, renderiza o conteúdo da rota
- [ ] Rotas `/login` e `/register` redirecionam para `/` se já autenticado

---

## Implementação Técnica

### Hook `useAuth`

```typescript
// hooks/use-auth.ts
// Retorna: { user, loading, error }
// Usa onAuthStateChanged para manter estado reativo
```

**Contrato**:
```typescript
type AuthState = {
  user: User | null;     // Firebase User
  loading: boolean;      // true durante verificação inicial
  error: string | null;
};
```

### Serviços de Auth

```typescript
// services/auth.ts
// signUp(email, password): Promise<UserCredential>
// signIn(email, password): Promise<UserCredential>
// signOut(): Promise<void>
```

### Componente `PrivateRoute`

```typescript
// components/private-route.tsx
// Se loading → spinner
// Se !user → redirect /login
// Se user → render children
```

---

## Layout

### Tela de Login / Cadastro

```
┌──────────────────────────────────────┐
│            BROADCAST                 │
│                                      │
│    ┌──────────────────────────┐      │
│    │  Email                   │      │
│    └──────────────────────────┘      │
│    ┌──────────────────────────┐      │
│    │  Senha                   │      │
│    └──────────────────────────┘      │
│    ┌──────────────────────────┐      │
│    │  Confirmar Senha (*)     │      │
│    └──────────────────────────┘      │
│                                      │
│    [ Entrar / Cadastrar ]            │
│                                      │
│    Não tem conta? Cadastre-se        │
│    Já tem conta? Faça login          │
└──────────────────────────────────────┘
(*) apenas na tela de cadastro
```

### Layout Autenticado (AppBar)

```
┌──────────────────────────────────────┐
│  BROADCAST     [user@email]  [Sair]  │
├──────────────────────────────────────┤
│                                      │
│         {conteúdo da rota}           │
│                                      │
└──────────────────────────────────────┘
```

---

## Testes

| Teste | Tipo | Descrição |
|-------|------|-----------|
| `use-auth.test.ts` | Unit | Hook retorna `loading: true` inicialmente, depois `user` ou `null` |
| `login-page.test.tsx` | Integration | Formulário submete, chama `signInWithEmailAndPassword` |
| `register-page.test.tsx` | Integration | Valida senhas diferentes, campos obrigatórios |
| `private-route.test.tsx` | Unit | Redireciona não-autenticado, renderiza autenticado |
| `auth-service.test.ts` | Unit | Funções `signUp`, `signIn`, `signOut` chamam Firebase corretamente |

---

## Commits Atômicos

1. `fase-1: implementa serviços de auth (signUp, signIn, signOut)`
2. `fase-1: implementa hook useAuth`
3. `fase-1: implementa tela de cadastro`
4. `fase-1: implementa tela de login`
5. `fase-1: implementa proteção de rotas (PrivateRoute)`
6. `fase-1: implementa layout autenticado com AppBar e logout`
7. `fase-1: adiciona testes de autenticação`
