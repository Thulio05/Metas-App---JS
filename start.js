const { select, input, checkbox } = require('@inquirer/prompts');
const fs = require('fs').promises;

let msg = "Bem vindo ao sistema de metas!\n";
let metas = []

const carregarMetas = async () => {
    try {
        const dados = await fs.readFile("metas.json", "utf-8");
        metas = JSON.parse(dados);
    }
    catch (error) {
        console.log("Erro ao carregar as metas: ", error);
        metas = [];
    }
}

const salvarmetas = async () => {
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2));
}

const cadastrarmeta = async () => {
    const metaadd = await input({ message: "Digite a meta: " });
    if(metaadd.length == 0){
        console.log("Meta vazia não é válida. Tente novamente: ");
        return cadastrarmeta();
    } 

    metas.push({
        value: metaadd,
        checked: false
    })
    msg = "Meta cadastrada com sucesso!\n";
};

const realizarmetas = async () => {
    const realizadas = metas.filter((meta) => {
        return meta.checked
    })

    if(realizadas.length == 0){
        console.log("Nenhuma meta realizada.\n")
        return;
    }

    await select({
        message: "Metas Realizadas: ",
        choices: [...realizadas]
    })
}

const listarmetas = async () => {
    if (metas.length == 0){
        console.log("Nenhuma meta cadastrada.\n")
        return;
    }

    for(i = 0; i < metas.length; i++){
        console.log(metas[i].value);
    }
    const resposta = await checkbox({
        message: "\nSelecione as metas a serem marcadas: ",
        choices: [...metas]
        })

        if (resposta.length == 0){
            console.log("Nenhuma meta selecionada.\n")
            return;
        }

        metas.forEach((m) => {
            m.checked = false;
        })

        resposta.forEach((resposta) => {
            const meta = metas.find((m) => {
                return m.value == resposta
            })

            meta.checked = true;
        })
        msg = "Metas marcadas com sucesso!\n";
    }

const metasabertas = async () => {
    const aberta = metas.filter((meta) =>{
        return meta.checked == false
    })

    if(aberta.length == 0){
        console.log("Nenhuma meta aberta.\n")
        return;
    }

    await select({
        message: "Metas Abertas: ",
        choices: [...aberta]
    })
}

const excluirmetas = async () => {
    const metasDesmarcadas = metas.map((meta) => {
        return {value: meta.value, checked: false}
    })

    const deletar = await checkbox({
        message: "\nSelecione as metas a serem deletadas: ",
        choices: [...metasDesmarcadas]
        })

    if (deletar.length == 0){
        console.log("Nenhuma meta selecionada.\n")
        return;
    }

    deletar.forEach((item) => {
        metas = metas.filter((meta)=>{
            return meta.value != item
        })
    })

    msg = ("Metas deletadas com sucesso!\n")
}

const mostrarMensagem = () => {
    console.clear();
    if (msg != "") {
        console.log(msg);
        console.log("");
        msg = "";
    }
}

async function start() {
    console.log("BEM VINDO!\n");

    while (true) {
        mostrarMensagem();
        await salvarmetas();""
        await carregarMetas();

        const opcao = await select({
            message: "\nMenu >",
            choices: [{
                name: "Cadastrar meta",
                value: "Cadastrar"
            },{
                name: "Listar metas",
                value: "Listar"
            },{
                name: "Marcar metas realizadas",
                value: "Realizadas"
            },{
                name: "Listar metas abertas",
                value: "Metas Abertas"
            },{
                name: "Excluir metas",
                value: "Excluir"
            },{
                name: "Sair",
                value: "Sair"
            }]
        });

        switch(opcao){
            case "Cadastrar":
                await cadastrarmeta();
                break;
            case "Listar":
                await listarmetas();
                break;
            case "Realizadas":
                await realizarmetas();
                break;
            case "Metas Abertas":
                await metasabertas();
                break;
            case "Excluir":
                await excluirmetas();
                break;
            case "Sair":
                console.log("Encerrando Programa...");
                return;
            }
        }
    }

start()