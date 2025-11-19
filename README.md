# Sistema de Reserva de Salas - Frontend

Interface web moderna desenvolvida em React com TypeScript e Tailwind CSS para gerenciamento de reservas de salas de reunião.

## 🚀 Tecnologias Utilizadas

- **React 18**: Biblioteca JavaScript para construção de interfaces
- **TypeScript**: Superset do JavaScript com tipagem estática
- **Vite**: Build tool moderna e rápida
- **Tailwind CSS**: Framework CSS utility-first para estilização
- **React Router**: Roteamento para aplicações React
- **Axios**: Cliente HTTP para requisições à API
- **React Hook Form**: Biblioteca para gerenciamento de formulários
- **React Hot Toast**: Biblioteca para notificações toast
- **date-fns**: Biblioteca para manipulação de datas

## 📋 Pré-requisitos

- Node.js 18 ou superior
- npm, yarn ou pnpm

## 🔧 Instalação

1. **Navegue até a pasta do frontend**:
```bash
cd frontend
```

2. **Instale as dependências**:
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

## 🏃 Como Executar

1. **Inicie o servidor de desenvolvimento**:
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

2. **Acesse a aplicação**:
- URL: http://localhost:3000

**Nota**: Certifique-se de que o backend está rodando na porta 8000 para que a aplicação funcione corretamente.

## 📚 Estrutura do Projeto

```
frontend/
├── public/                 # Arquivos estáticos
├── src/
│   ├── components/        # Componentes reutilizáveis
│   │   ├── Layout.tsx     # Layout principal com navegação
│   │   └── Modal.tsx      # Modal de confirmação
│   ├── contexts/          # Contextos React
│   │   └── AuthContext.tsx # Contexto de autenticação
│   ├── pages/             # Páginas da aplicação
│   │   ├── ReservasList.tsx    # Listagem de reservas
│   │   ├── ReservaForm.tsx    # Formulário de reserva
│   │   ├── SalasList.tsx      # Listagem de salas
│   │   └── Login.tsx          # Página de login
│   ├── services/          # Serviços e APIs
│   │   └── api.ts         # Cliente HTTP e funções de API
│   ├── types/             # Definições de tipos TypeScript
│   │   └── index.ts       # Tipos compartilhados
│   ├── App.tsx            # Componente raiz
│   ├── main.tsx           # Ponto de entrada
│   └── index.css          # Estilos globais
├── index.html             # HTML principal
├── package.json           # Dependências e scripts
├── tsconfig.json          # Configuração TypeScript
├── tailwind.config.js    # Configuração Tailwind
├── vite.config.ts         # Configuração Vite
└── README.md              # Este arquivo
```

## 🎨 Funcionalidades

### Reservas
- ✅ Listagem de todas as reservas com filtros
- ✅ Criação de nova reserva com validação
- ✅ Edição de reserva existente
- ✅ Exclusão de reserva com modal de confirmação
- ✅ Validação de campos obrigatórios
- ✅ Suporte a opção de café (quantidade e descrição)
- ✅ Formatação de datas em português

### Salas
- ✅ Listagem de todas as salas
- ✅ Criação de nova sala
- ✅ Edição de sala existente
- ✅ Exclusão de sala com modal de confirmação
- ✅ Indicador visual de status (ativa/inativa)

### Autenticação (Opcional)
- ✅ Login de usuário
- ✅ Registro de novo usuário
- ✅ Proteção de rotas (preparado para implementação)
- ✅ Gerenciamento de token JWT

## 🎯 Características da Interface

- **Design Moderno**: Interface limpa e intuitiva usando Tailwind CSS
- **Responsivo**: Funciona bem em desktop, tablet e mobile
- **Feedback Visual**: Notificações toast para ações do usuário
- **Validação em Tempo Real**: Validação de formulários com React Hook Form
- **Modais de Confirmação**: Confirmação antes de ações destrutivas
- **Loading States**: Indicadores de carregamento durante requisições
- **Tratamento de Erros**: Mensagens de erro amigáveis

## 🔗 Integração com Backend

O frontend está configurado para se comunicar com o backend através de:

- **Proxy**: Configurado no `vite.config.ts` para redirecionar `/api/*` para `http://localhost:8000`
- **Interceptors**: Axios interceptors para adicionar token de autenticação e tratar erros
- **TypeScript**: Tipos compartilhados garantem consistência entre frontend e backend

## 📡 Endpoints Utilizados

### Reservas
- `GET /api/reservas/` - Listar reservas
- `GET /api/reservas/{id}` - Obter reserva
- `POST /api/reservas/` - Criar reserva
- `PUT /api/reservas/{id}` - Atualizar reserva
- `DELETE /api/reservas/{id}` - Excluir reserva

### Salas
- `GET /api/salas/` - Listar salas
- `GET /api/salas/{id}` - Obter sala
- `POST /api/salas/` - Criar sala
- `PUT /api/salas/{id}` - Atualizar sala
- `DELETE /api/salas/{id}` - Excluir sala

### Autenticação
- `POST /api/auth/login` - Fazer login
- `POST /api/auth/register` - Registrar usuário
- `GET /api/auth/me` - Obter usuário atual

## 🛠️ Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa o linter

## 🎨 Customização

### Cores
As cores podem ser customizadas no arquivo `tailwind.config.js`:

```javascript
colors: {
  primary: {
    // Suas cores personalizadas
  }
}
```

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto para configurar variáveis:

```env
VITE_API_URL=http://localhost:8000
```

## 📝 Padrões e Boas Práticas

- **TypeScript**: Uso extensivo de tipos para melhor manutenibilidade
- **Componentes Funcionais**: Uso de hooks do React
- **Separação de Responsabilidades**: Componentes, páginas, serviços e contextos separados
- **Reutilização**: Componentes reutilizáveis (Modal, Layout)
- **Validação**: Validação de formulários com React Hook Form
- **Tratamento de Erros**: Tratamento adequado de erros com feedback ao usuário
- **Loading States**: Indicadores de carregamento para melhor UX

## 🐛 Troubleshooting

### Erro de CORS
Se encontrar erros de CORS, verifique se o backend está configurado para aceitar requisições do frontend.

### Erro de Conexão
Certifique-se de que o backend está rodando na porta 8000 antes de iniciar o frontend.

### Erro de Build
Execute `npm install` novamente para garantir que todas as dependências estão instaladas.



# matricial_front
