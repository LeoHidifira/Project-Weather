# Plano de implementação incremental — Clima

Este documento organiza a implementação do PRD em tarefas pequenas e verificáveis, com foco em entregas progressivas para agentes de IA.

Referência principal: [.docs/prd.md](.docs/prd.md)

## Ordem sugerida

As tarefas abaixo devem ser executadas de forma progressiva, uma por vez, e só avançar para a próxima quando a tarefa atual estiver aprovada.

## Tarefas

### 1. Estruturar a base do projeto
- [ ] Criar/ajustar a estrutura inicial de pastas conforme o PRD: `src/services`, `src/utils`, `src/types` e `src/assets`.
- [ ] Garantir que o ponto de entrada principal esteja em `src/main.ts` e que o CSS global esteja em `src/style.css`.
- [ ] Verificar que o projeto rode localmente com Vite e TypeScript.

Critério de aprovação:
- O projeto abre sem erros no navegador e as pastas/arquivos esperados existem.

### 2. Definir modelos TypeScript e helpers de formatação
- [x] Criar interfaces TypeScript para as respostas da API de geocoding, forecast e para o modelo combinado de clima.
- [x] Implementar o mapeamento de códigos WMO para descrição em português.
- [x] Implementar a conversão de graus de vento para direção cardinal.

Critério de aprovação:
- Os tipos existem e as funções de utilidade retornam valores corretos para entradas conhecidas.

### 3. Implementar o serviço de integração com Open-Meteo
- [x] Criar o módulo de serviço em `src/services/openMeteo.ts`.
- [x] Implementar `searchCity(cityName)` com validação de entrada e tratamento de erro.
- [x] Implementar `getWeather(latitude, longitude, timezone)` com validação e tratamento de erro.
- [x] Implementar `searchWeather(cityName)` orquestrando as duas chamadas e retornando `null` em cenários inválidos.

Critério de aprovação:
- O módulo centraliza todas as requisições à API e retorna `null` corretamente quando a cidade não existe ou quando os dados do clima são inválidos.

### 4. Construir a interface base e os estados da aplicação
- [x] Criar o layout da página com campo de busca, card principal e áreas de sidebar/principal.
- [x] Implementar o estado vazio inicial com mensagem convidativa.
- [x] Implementar o estado de carregamento com feedback visual durante a busca.
- [x] Garantir que o campo de busca só dispare a requisição quando não estiver vazio após trim.

Critério de aprovação:
- A interface inicia no empty state, mostra loading durante a busca e não faz requisição com input vazio.

### 5. Integrar a busca e exibir os dados do clima
- [x] Conectar o formulário de busca ao fluxo principal: Enter e clique no botão devem disparar a busca.
- [x] Exibir temperatura, cidade/país, data formatada no fuso da cidade e dia/noite na sidebar.
- [x] Exibir umidade, sensação térmica, precipitação e vento na área principal.
- [x] Aplicar o mapeamento de weather code em português e a direção cardinal do vento.

Critério de aprovação:
- Ao buscar uma cidade válida, a UI exibe todos os campos obrigatórios com os valores formatados conforme o PRD.

### 6. Tratar falhas e garantir comportamento do empty state
- [x] Quando a cidade não for encontrada, retornar ao estado vazio sem mostrar erro técnico.
- [x] Quando o forecast falhar ou vier incompleto, retornar ao estado vazio sem mostrar erro técnico.
- [x] Garantir que a interface não fique parcialmente preenchida em caso de falha.

Critério de aprovação:
- Cenários de falha resultam no mesmo empty state visual definido no PRD.

### 7. Ajustar visual e responsividade
- [x] Aplicar o visual proposto: fundo escuro, card branco arredondado, max-width 800px e contraste adequado.
- [x] Tornar o layout responsivo para mobile, empilhando sidebar e área principal.
- [x] Ajustar espaçamento, tipografia e elementos visuais para uma experiência consistente.

Critério de aprovação:
- O layout fica corretamente centralizado, com boa leitura em desktop e mobile, seguindo o conceito visual do PRD.

### 8. Revisão final da implementação
- [x] Validar que todas as funcionalidades do PRD foram contempladas.
- [x] Confirmar que não há requisições diretas à API fora do módulo de serviço.
- [x] Revisar os critérios de aceite do PRD e marcar o que foi realmente implementado.

Critério de aprovação:
- A aplicação atende aos critérios principais do PRD e não há inconsistências evidentes entre a implementação e a especificação.
