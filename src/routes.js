const express = require("express"); // Importando express para gerenciar as rotas
var mySQL = require("mysql");
const cors = require("cors");

const routes = express.Router();

routes.use(cors({}));

// Instanciando conexão com o mysql
var connection = mySQL.createConnection({
  host: "controlefrota.cgv4ccfvowdy.sa-east-1.rds.amazonaws.com",
  user: "root",
  password: "fleemasys",
  database: "controlefrota"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected to MySQL Server!");
});

// Inserir usuário no banco
routes.post("/authenticate", async function(req, res) {
  const { usuarioLogin, usuarioSenha } = req.body;

  connection.query(
    "select usuarioId, usuarioLogin, usuarioSenha from tbUsuario where usuarioLogin = ?",
    usuarioLogin,
    function(err, rows, fields) {
      if (err) res.status(400).json(err);
      else if (rows.length == 0)
        res.status(400).json({ error: "Usuário não encontrado!" });
      else if (usuarioSenha != rows[0].usuarioSenha)
        res.status(400).json({ error: "Senha inválida!" });
      else {
        res.status(200).send({
          rows
          // token: generateToken({ usuarioId: rows.usuarioId }),
        });
      }
    }
  );
});

routes.post("/usuarios", function(req, res) {
  connection.query("insert tbUsuario set ?", req.body, function(
    err,
    rows,
    fields
  ) {
    if (!err)
      res
        .status(201)
        .json(`Usuário ${req.body.usuarioLogin} cadastrado com sucesso!`);
    else if (err.errno == 1062)
      res.status(400).json(`Usuário ou CPF já cadastrado!`);
    else res.status(400).json(err);
  });
});
// Buscar todos usuários do banco
routes.get("/usuarios", function(req, res) {
  connection.query(
    "select usuarioId, usuarioNome, usuarioCPF, usuarioLogin, usuarioContato, usuarioTipo from tbUsuario",
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});
// Buscar 1 usuário no banco pelo ID
routes.get("/usuarios/:Id", function(req, res) {
  connection.query(
    "select usuarioId, usuarioNome, usuarioCPF, usuarioLogin, usuarioContato, usuarioTipo from tbUsuario where usuarioId = ?",
    [req.params.Id],
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});
// Atualizar 1 usuário no banco pelo seu ID
routes.put("/usuarios/:Id", function(req, res) {
  connection.query(
    "update tbUsuario set ? where usuarioId = ?",
    [req.body, req.params.Id],
    function(err, rows, fields) {
      if (!err)
        res.status(200).json(`Usuário ${req.params.Id} alterado com sucesso!`);
      else res.status(400).json(err);
    }
  );
});
// Deletar usuário do banco pelo ID
routes.delete("/usuarios/:Id", function(req, res) {
  connection.query(
    "delete from tbUsuario where usuarioId = ?",
    [req.params.Id],
    function(err, rows, fields) {
      if (!err)
        res.status(200).json(`Usuário ${req.params.Id} deletado com sucesso!`);
      else res.status(400).json(err);
    }
  );
});

routes.post("/clientes", function(req, res) {
  connection.query("insert tbCliente set ?", req.body, function(
    err,
    rows,
    fields
  ) {
    if (!err) res.status(201).json(rows);
    else res.status(400).json(err);
  });
});

routes.get("/clientes", function(req, res) {
  connection.query(
    "select clienteId, clienteRazaoSocial, clienteNMFantasia, clienteCNPJ, clienteTelComercial, clienteTelCelular, clienteEmail, clienteCep, clienteLogradouro, clienteNumero, clienteComplemento, clienteBairro, clienteCidade, clienteUF, clienteSituacao from tbCliente",
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.get("/clientes/:Id", function(req, res) {
  connection.query(
    "select clienteId, clienteRazaoSocial, clienteNMFantasia, clienteCNPJ, clienteTelComercial, clienteTelCelular, clienteEmail, clienteCep, clienteLogradouro, clienteNumero, clienteComplemento, clienteBairro, clienteCidade, clienteUF, clienteSituacao from tbCliente where clienteId = ?",
    [req.params.Id],
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.put("clientes/:Id", function(req, res) {
  connection.query(
    "update tbCliente set ? where clienteId = ?",
    [req.body, req.params.Id],
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.delete("/clientes/:id", function(req, res) {
  connection.query(
    "delete from tbCliente where clienteId = ?",
    [req.params.id],
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.post("/empresas", function(req, res) {
  connection.query("insert tbEmpresa set ?", req.body, function(
    err,
    rows,
    fields
  ) {
    if (!err) res.status(201).json(rows);
    else res.status(400).json(err);
  });
});

routes.get("/empresas", function(req, res) {
  connection.query(
    "select empresaId, empresaRazaoSocial, empresaNomeFantasia, empresaCNPJ, empresaTelefone, empresaTelefone2, empresaEmail, empresaCep, empresaLogradouro, empresaNumero, empresaComplemento, empresaBairro, empresaCidade, empresaUF, empresaSituacao from tbEmpresa",
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.get("/empresas/:Id", function(req, res) {
  connection.query(
    "select empresaId, empresaRazaoSocial, empresaNomeFantasia, empresaCNPJ, empresaTelefone, empresaTelefone2, empresaEmail, empresaCep, empresaLogradouro, empresaNumero, empresaComplemento, empresaBairro, empresaCidade, empresaUF, empresaSituacao from tbEmpresa where empresaId = ?",
    [req.params.Id],
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.put("/empresas/:Id", function(req, res) {
  connection.query(
    "update tbEmpresa set ? where empresaId = ?",
    [req.body, req.params.Id],
    function(err, rows, fields) {
      if (!err)
        res.status(200).json(`Empresa ${req.params.Id} alterado com sucesso!`);
      else res.status(400).json(err);
    }
  );
});

routes.delete("/empresas/:id", function(req, res) {
  connection.query(
    "delete from tbEmpresa where empresaId = ?",
    [req.params.id],
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.post("/veiculos", function(req, res) {
  connection.query("insert tbVeiculo set ?", req.body, function(
    err,
    rows,
    fields
  ) {
    if (!err) res.status(201).json(rows);
    else res.status(400).json(err);
  });
});

routes.get("/veiculos", function(req, res) {
  connection.query(
    "SELECT veiculoId, veiculoMarca, veiculoModelo, veiculoPlaca, veiculoCNPJCliente, veiculoCor, veiculoChassi, veiculoSinistro, veiculoApolice, veiculoSeguro from tbVeiculo",
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.get("/veiculos/:Id", function(req, res) {
  connection.query(
    "SELECT veiculoId, veiculoMarca, veiculoModelo, veiculoPlaca, veiculoCNPJCliente, veiculoCor, veiculoChassi, veiculoSinistro, veiculoApolice, veiculoSeguro from tbVeiculo where veiculoId = ?",
    [req.params.Id],
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.put("/veiculos/:Id", function(req, res) {
  connection.query(
    "update tbveiculo set ? where veiculoId = ?",
    [req.body, req.params.Id],
    function(err, rows, fields) {
      if (!err)
        res.status(200).json(`Veículo ${req.params.Id} alterado com sucesso!`);
      else res.status(400).json(err);
    }
  );
});

routes.delete("/veiculos/:Id", function(req, res) {
  connection.query(
    "delete from tbveiculo where veiculoId = ?",
    [req.params.Id],
    function(err, rows, fields) {
      if (!err)
        res.status(200).json(`Veículo ${req.params.Id} deletado com sucesso!`);
      else res.status(400).json(err);
    }
  );
});

routes.post("/motoristas", function(req, res) {
  connection.query("insert tbMotorista set ?", req.body, function(
    err,
    rows,
    fields
  ) {
    if (!err) res.status(201).json(rows);
    else res.status(400).json(err);
  });
});

routes.get("/motoristas", function(req, res) {
  connection.query(
    "select motoristaId, motoristaNome, motoristaCPF, motoristaRG, motoristaCNH, motoristaExameMedico, motoristaDataNascimento, motoristaTelResidencial, motoristaTelCelular, motoristaEmail, motoristaCep, motoristaLogradouro, motoristaNumero, motoristaComplemento, motoristaBairro, motoristaCidade, motoristaUF from tbMotorista",
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.get("/motoristas/:Id", function(req, res) {
  connection.query(
    "select motoristaId, motoristaNome, motoristaCPF, motoristaRG, motoristaCNH, motoristaExameMedico, motoristaDataNascimento, motoristaTelResidencial, motoristaTelCelular, motoristaEmail, motoristaCep, motoristaLogradouro, motoristaNumero, motoristaComplemento, motoristaBairro, motoristaCidade, motoristaUF from tbMotorista where motoristaId = ?",
    [req.params.Id],
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.put("/motoristas/:Id", function(req, res) {
  connection.query(
    "update tbMotorista set ? where motoristaId = ?",
    [req.body, req.params.Id],
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.delete("/motoristas/:id", function(req, res) {
  connection.query(
    "delete from tbMotorista where motoristaId = ?",
    [req.params.id],
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.post("/tecnico", function(req, res) {
  connection.query("insert tbTecnico set ?", req.body, function(
    err,
    rows,
    fields
  ) {
    if (!err) res.status(201).json(rows);
    else res.status(400).json(err);
  });
});

routes.get("/tecnico", function(req, res) {
  connection.query(
    "select tecnicoId, tecnicoNome, tecnicoCPF, tecnicoDataNascimento, tecnicoTelResidencial, tecnicoTelCelular, tecnicoCep, tecnicoLogradouro, tecnicoNumero, tecnicoComplemento, tecnicoBairro, tecnicoCidade, tecnicoUF from tbTecnico",
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.get("/tecnico/:Id", function(req, res) {
  connection.query(
    "select tecnicoId, tecnicoNome, tecnicoCPF, tecnicoDataNascimento, tecnicoTelResidencial, tecnicoTelCelular, tecnicoCep, tecnicoLogradouro, tecnicoNumero, tecnicoComplemento, tecnicoBairro, tecnicoCidade, tecnicoUF from tbTecnico where tecnicoId = ?",
    [req.params.Id],
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.put("tecnico/:Id", function(req, res) {
  connection.query(
    "update tbTecnico set ? where tecnicoId = ?",
    [req.body, req.params.Id],
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.delete("/tecnico/:id", function(req, res) {
  connection.query(
    "delete from tbTecnico where tecnicoId = ?",
    [req.params.id],
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.post("/abastecimento", function(req, res) {
  connection.query("insert tbAbastecimento set ?", req.body, function(
    err,
    rows,
    fields
  ) {
    if (!err) res.status(201).json(rows);
    else res.status(400).json(err);
  });
});

routes.get("/abastecimento", function(req, res) {
  connection.query(
    "select abastecimentoId, abastecimentoLitragem, abastecimentoValor, abastecimentoObs, veiculoId, financaId, motoristaId from tbAbastecimento",
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.get("/abastecimento/:Id", function(req, res) {
  connection.query(
    "select abastecimentoId, abastecimentoLitragem, abastecimentoValor, abastecimentoObs, veiculoId, financaId, motoristaId from tbAbastecimento where abastecimentoId = ?",
    [req.params.Id],
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.put("abastecimento/:Id", function(req, res) {
  connection.query(
    "update tbAbastecimento set ? where abastecimentoId = ?",
    [req.body, req.params.Id],
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.delete("/abastecimento/:id", function(req, res) {
  connection.query(
    "delete from tbAbastecimento where abastecimentoId = ?",
    [req.params.id],
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.post("/aluguel", function(req, res) {
  connection.query("insert tbAluguelVeiculo set ?", req.body, function(
    err,
    rows,
    fields
  ) {
    if (!err) res.status(201).json(rows);
    else res.status(400).json(err);
  });
});

routes.get("/aluguel", function(req, res) {
  connection.query(
    "select aluguelVeiculoId, clienteId, veiculoId, empresaId, aluguelVeiculoValor, aluguelVeiculoObs, financaId, aluguelVeiculoData, aluguelVeiculoDataDevolucao from tbAluguelVeiculo",
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.get("/aluguel/:Id", function(req, res) {
  connection.query(
    "select aluguelVeiculoId, clienteId, aluguelValor, veiculoId, empresaId, aluguelVeiculoValor, aluguelVeiculoObs, financaId, aluguelVeiculoData, aluguelVeiculoDataDevolucao from tbAluguelVeiculo where aluguelVeiculoId = ?",
    [req.params.Id],
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.put("aluguel/:Id", function(req, res) {
  connection.query(
    "update tbAluguelVeiculo set ? where aluguelVeiculoId = ?",
    [req.body, req.params.Id],
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.delete("/aluguel/:id", function(req, res) {
  connection.query(
    "delete from tbAluguelVeiculo where aluguelVeiculoId = ?",
    [req.params.id],
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.post("/deslocamento", function(req, res) {
  connection.query("insert tbDeslocamento set ?", req.body, function(
    err,
    rows,
    fields
  ) {
    if (!err) res.status(201).json(rows);
    else res.status(400).json(err);
  });
});

routes.get("/deslocamento", function(req, res) {
  connection.query(
    "select deslocamentoId, veiculoId, motoristaId, deslocamentoRota, deslocamentoEndereco, deslocamentoGastos, deslocamentoQuilometragem, deslocamentoObs, deslocamentoAcidentes, deslocamentoDataInicio from tbDeslocamento",
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.get("/deslocamento/:Id", function(req, res) {
  connection.query(
    "select deslocamentoId, veiculoId, motoristaId, deslocamentoRota, deslocamentoEndereco, deslocamentoGastos, deslocamentoQuilometragem, deslocamentoObs, deslocamentoAcidentes, deslocamentoDataInicio from tbDeslocamento where deslocamentoId = ?",
    [req.params.Id],
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.put("/deslocamento/:Id", function(req, res) {
  connection.query(
    "update tbDeslocamento set ? where deslocamentoId = ?",
    [req.body, req.params.Id],
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.delete("/deslocamento/:id", function(req, res) {
  connection.query(
    "delete from tbDeslocamento where deslocamentoId = ?",
    [req.params.id],
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

//111

routes.post("/viagem", function(req, res) {
  connection.query("insert tbViagem set ?", req.body, function(
    err,
    rows,
    fields
  ) {
    if (!err) res.status(201).json(rows);
    else res.status(400).json(err);
  });
});

routes.get("/viagem", function(req, res) {
  connection.query("select * from tbViagem", function(err, rows, fields) {
    if (!err) res.status(200).json(rows);
    else res.status(400).json(err);
  });
});

routes.get("/viagem/:Id", function(req, res) {
  connection.query(
    "select motoristaNome, veiculoPlaca, viagemEndereco, viagemObs, dataInicio, dataEncerramento, viagemSituacao from tbViagem where viagemId = ?",
    [req.params.Id],
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.put("/viagem/:Id", function(req, res) {
  connection.query(
    "update tbViagem set ? where viagemId = ?",
    [req.body, req.params.Id],
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.put("/viagem/iniciar/:Id", function(req, res) {
  connection.query(
    "update tbViagem set ? where viagemId = ?",
    [req.body, req.params.Id],
    function(err, rows, fields) {
      if (!err) res.status(200).json("Em andamento");
      else res.status(400).json(err);
    }
  );
});

routes.put("/viagem/encerrar/:Id", function(req, res) {
  connection.query(
    "update tbViagem set ? where viagemId = ?",
    [req.body, req.params.Id],
    function(err, rows, fields) {
      if (!err) res.status(200).json("Finalizada");
      else res.status(400).json(err);
    }
  );
});

routes.delete("/viagem/:id", function(req, res) {
  connection.query(
    "delete from tbViagem where viagemId = ?",
    [req.params.id],
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.post("/embarquedesembarque", function(req, res) {
  connection.query("insert tbEmbarqueDesembarque set ?", req.body, function(
    err,
    rows,
    fields
  ) {
    if (!err) res.status(201).json(rows);
    else res.status(400).json(err);
  });
});

routes.get("/embarquedesembarque", function(req, res) {
  connection.query(
    "select edId, motoristaId, veiculoId, edInspecao, edObs, ebDataEntrada, edDataSaida, from tbEmbarqueDesembarque",
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.get("/embarquedesembarque/:Id", function(req, res) {
  connection.query(
    "select edId, motoristaId, veiculoId, edInspecao, edObs, ebDataEntrada, edDataSaida, from tbEmbarqueDesembarque where edId = ?",
    [req.params.Id],
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.put("embarquedesembarque/:Id", function(req, res) {
  connection.query(
    "update tbEmbarqueDesembarque set ? where edId = ?",
    [req.body, req.params.Id],
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.delete("/embarquedesembarque/:id", function(req, res) {
  connection.query(
    "delete from tbEmbarqueDesembarque where edId = ?",
    [req.params.id],
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.post("/empresa", function(req, res) {
  connection.query("insert tbEmpresa set ?", req.body, function(
    err,
    rows,
    fields
  ) {
    if (!err) res.status(201).json(rows);
    else res.status(400).json(err);
  });
});

routes.get("/empresa", function(req, res) {
  connection.query(
    "select empresaId, empresaRazaoSocial, empresaNomeFantasia, empresaCNPJ, empresaTelefone, empresaTelefone2, empresaEmail, empresaCep, empresaLogradouro, empresaNumero, empresaComplemento, empresaBairro, empresaCidade, empresaUF, empresaSituacao from tbEmpresa",
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.get("/empresa/:Id", function(req, res) {
  connection.query(
    "select empresaId, empresaRazaoSocial, empresaNomeFantasia, empresaCNPJ, empresaTelefone, empresaTelefone2, empresaEmail, empresaCep, empresaLogradouro, empresaNumero, empresaComplemento, empresaBairro, empresaCidade, empresaUF, empresaSituacao from tbEmpresa where empresaId = ?",
    [req.params.Id],
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.put("empresa/:Id", function(req, res) {
  connection.query(
    "update tbEmpresa set ? where empresaId = ?",
    [req.body, req.params.Id],
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.delete("/empresa/:id", function(req, res) {
  connection.query(
    "delete from tbEmpresa where empresaId = ?",
    [req.params.id],
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.post("/financas", function(req, res) {
  connection.query("insert tbfinancas set ?", req.body, function(
    err,
    rows,
    fields
  ) {
    if (!err) res.status(201).json(rows);
    else res.status(400).json(err);
  });
});

routes.get("/financas", function(req, res) {
  connection.query(
    "select financaId, financaTitular, financaValor, financaReferencia, TipoFinanca from tbfinancas",
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.get("/financas/:Id", function(req, res) {
  connection.query(
    "select financaId, financaTitular, financaValor, financaReferencia, TipoFinanca from tbfinancas where financaId = ?",
    [req.params.Id],
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.put("financas/:Id", function(req, res) {
  connection.query(
    "update tbfinancas set ? where financaId = ?",
    [req.body, req.params.Id],
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.delete("/financas/:id", function(req, res) {
  connection.query(
    "delete from tbfinancas where financaId = ?",
    [req.params.id],
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.post("/manutencao", function(req, res) {
  connection.query("insert tbManutencao set ?", req.body, function(
    err,
    rows,
    fields
  ) {
    if (!err) res.status(201).json(rows);
    else res.status(400).json(err);
  });
});

routes.get("/manutencao", function(req, res) {
  connection.query(
    "select manutencaoId, veiculoId, manutencaoRevisao, tecnicoId, manutencaoDescricaoPeca, manutencaoObs from tbManutencao",
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.get("/manutencao/:Id", function(req, res) {
  connection.query(
    "select manutencaoId, veiculoId, manutencaoRevisao, tecnicoId, manutencaoDescricaoPeca, manutencaoObs from tbManutencao where manutencaoId = ?",
    [req.params.Id],
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.put("manutencao/:Id", function(req, res) {
  connection.query(
    "update tbManutencao set ? where manutencaoId = ?",
    [req.body, req.params.Id],
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.delete("/manutencao/:id", function(req, res) {
  connection.query(
    "delete from tbManutencao where manutencaoId = ?",
    [req.params.id],
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.post("/multas", function(req, res) {
  connection.query("insert tbMulta set ?", req.body, function(
    err,
    rows,
    fields
  ) {
    if (!err) res.status(201).json(rows);
    else res.status(400).json(err);
  });
});

routes.get("/multas", function(req, res) {
  connection.query(
    "select multaId, multaTitular, multaValor, multaReferencia, financaId, motoristaId, veiculoId from tbMulta",
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.get("/multas/:Id", function(req, res) {
  connection.query(
    "select multaId, multaTitular, multaValor, multaReferencia, financaId, motoristaId, veiculoId from tbMulta tbMulta where multaId = ?",
    [req.params.Id],
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.put("multas/:Id", function(req, res) {
  connection.query(
    "update tbMulta set ? where multaId = ?",
    [req.body, req.params.Id],
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

routes.delete("/multas/:id", function(req, res) {
  connection.query(
    "delete from tbMulta where multaId = ?",
    [req.params.id],
    function(err, rows, fields) {
      if (!err) res.status(200).json(rows);
      else res.status(400).json(err);
    }
  );
});

module.exports = routes;
