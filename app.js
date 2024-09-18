const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Middleware para servir arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para processar dados enviados via formulário (x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));
// Middleware para processar JSON
app.use(express.json());

// Rota para exibir o formulário de cadastro de responsável (responsavel.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Tarefa.html'));
});

// Rota POST para cadastrar um responsável e salvar no arquivo JSON
app.post('/responsavel.html', (req, res) => {
    const { nome, email } = req.body;

    // Verificar se o campo nome está preenchido
    if (!nome) {
        return res.status(400).json({ success: false, message: 'Nome do responsável é obrigatório.' });
    }

    // Ler o arquivo responsaveis.json
    const filePath = path.join(__dirname, 'data', 'responsaveis.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo JSON:', err);
            return res.status(500).json({ success: false, message: 'Erro ao processar o cadastro.' });
        }

        // Parsear o arquivo JSON para obter a lista de responsáveis
        const responsaveis = JSON.parse(data);

        // Criar um novo responsável
        const novoResponsavel = {
            id: responsaveis.length + 1,
            nome: nome,
            email: email || '' // Se o email não for fornecido, será uma string vazia
        };

        // Adicionar o novo responsável à lista
        responsaveis.push(novoResponsavel);

        // Escrever a lista atualizada de volta no arquivo JSON
        fs.writeFile(filePath, JSON.stringify(responsaveis, null, 2), (err) => {
            if (err) {
                console.error('Erro ao escrever no arquivo JSON:', err);
                return res.status(500).json({ success: false, message: 'Erro ao salvar o responsável.' });
            }

            // Retorna uma resposta JSON de sucesso
            return res.status(200).json({ success: true, message: 'Responsável cadastrado com sucesso!' });
        });
    });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://127.0.0.1:${PORT}`);
});