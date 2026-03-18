let tarefaEdicao = null;


// FUNCAO USADA PARA SALVAR AS TAREFAS DO USUARIO
function salvarTarefa() {

    const titulo = document.getElementById('titulo').value.trim();
    const conteudo = document.getElementById('descricao').value.trim();
    const data = document.getElementById('data').value.trim();
    const SLA = document.getElementById('SLA').value.trim();
    const status = document.getElementById('status').value.trim();

    if (!titulo || !conteudo || !data || !SLA || !status) {
        alert("Preencha todos os campos para que possa ser salvo");
        return;
    }

    let tarefas = JSON.parse(localStorage.getItem("salvar-tarefas"));

    if (!Array.isArray(tarefas)) {
        tarefas = [];
    }

    if (tarefaEdicao) {

        tarefas = tarefas.map(t => {
            if (t.id === tarefaEdicao) {
                return { ...t, titulo, conteudo, data, SLA, status };
            }
            return t;
        });

        tarefaEdicao = null;

    } else {

        const novaTarefa = {
            id: Date.now(),
            titulo,
            conteudo,
            data,
            SLA,
            status,
            dataCriacao: new Date().toLocaleDateString("pt-BR")
        };

        tarefas.push(novaTarefa);
    }

    localStorage.setItem("salvar-tarefas", JSON.stringify(tarefas));

    alert("Tarefa salva com sucesso!");

    document.getElementById("titulo").value = "";
    document.getElementById("descricao").value = "";
    document.getElementById("data").value = "";
    document.getElementById("SLA").value = "baixo";
    document.getElementById("status").value = "pendente";

}


// FUNCAO QUE VAI SER USADA PARA LISTAR AS TAREFAS
function listarTarefas() {

    const listaDiv = document.getElementById("lista-tarefas");

    let tarefas = JSON.parse(localStorage.getItem("salvar-tarefas"));

    if (!Array.isArray(tarefas)) {
        tarefas = [];
    }

    if (tarefas.length === 0) {
        listaDiv.innerHTML = "<p style='text-align:center; color: gray;'>Nenhuma tarefa encontrada.</p>";
        return;
    }

    listaDiv.innerHTML = tarefas.map((item) => `

        <div class="tarefas-card">

            <div class="card-header">
                <h3 class="tarefas-titulo">${item.titulo}</h3>
                <span class="badge-${item.SLA}">${item.SLA}</span>
            </div>

            <p class="tarefas-conteudo">${item.conteudo}</p>
            <p class="tarefas-meta">${item.data} | ${item.status}</p>

            <div class="card-actions">
                <button class="btn-edit" onclick="editarTarefa(${item.id})">Editar</button>
                <button class="btn-delete" onclick="excluirTarefa(${item.id})">Excluir</button>
                <button class="btn-concluir" onclick="concluirTarefa(${item.id})">Concluir</button>
            </div>

        </div>

    `).join("");
}



// FUNCAO PARA CARREGAR DADOS DA TAREFA NO FORMULARIO
function editarTarefa(id) {

    let tarefas = JSON.parse(localStorage.getItem("salvar-tarefas"));

    if (!Array.isArray(tarefas)) {
        tarefas = [];
    }

    const tarefa = tarefas.find(t => t.id === id);

    if (!tarefa) return;

    document.getElementById("titulo").value = tarefa.titulo;
    document.getElementById("descricao").value = tarefa.conteudo;
    document.getElementById("data").value = tarefa.data;
    document.getElementById("SLA").value = tarefa.SLA;
    document.getElementById("status").value = tarefa.status;

    tarefaEdicao = id;
}



// FUNCAO PARA EXCLUIR UMA TAREFA
function excluirTarefa(id) {

    let tarefas = JSON.parse(localStorage.getItem("salvar-tarefas"));

    if (!Array.isArray(tarefas)) {
        tarefas = [];
    }

    tarefas = tarefas.filter(t => t.id !== id);

    localStorage.setItem("salvar-tarefas", JSON.stringify(tarefas));

    listarTarefas();
}



// FUNCAO DE BUSCAR TAREFAS
function buscarTarefas() {

    const termo = document.getElementById("txtBusca").value.toLowerCase();

    let tarefas = JSON.parse(localStorage.getItem("salvar-tarefas"));

    if (!Array.isArray(tarefas)) {
        tarefas = [];
    }

    if (tarefas.length === 0) {
        alert("Nenhuma tarefa cadastrada.");
        return;
    }

    const resultado = tarefas.filter(tarefa =>
        tarefa.titulo.toLowerCase().includes(termo)
    );

    const listaDiv = document.getElementById("lista-tarefas");

    if (resultado.length === 0) {
        listaDiv.innerHTML = "<p style='text-align:center'>Nenhuma tarefa encontrada.</p>";
        return;
    }

    listaDiv.innerHTML = resultado.map(item => `

        <div class="tarefas-card">

            <div class="card-header">
                <h3>${item.titulo}</h3>
                <span>${item.SLA}</span>
            </div>

            <p>${item.conteudo}</p>
            <p>${item.data} | ${item.status}</p>

            <button onclick="editarTarefa(${item.id})">Editar</button>
            <button onclick="excluirTarefa(${item.id})">Excluir</button>
            <button onclick="concluirTarefa(${item.id})">Concluir</button>

        </div>

    `).join("");
}



// FUNCAO PARA MARCAR COMO CONCLUIDO
function concluirTarefa(id) {

    let tarefas = JSON.parse(localStorage.getItem("salvar-tarefas"));

    if (!Array.isArray(tarefas)) {
        tarefas = [];
    }

    tarefas = tarefas.map(t => {
        if (t.id === id) {
            return { ...t, status: "concluido" };
        }
        return t;
    });

    localStorage.setItem("salvar-tarefas", JSON.stringify(tarefas));

    listarTarefas();
}