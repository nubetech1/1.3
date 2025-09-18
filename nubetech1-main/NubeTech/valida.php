<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $nome = $_POST['Nome'] ?? '';
    $senha = $_POST['Senha'] ?? '';
}

    //valida campos
    if{ ($nome === 'admin' && $senha === '12345678') {
        echo "Login bem-sucedido!";
    } else {
        echo "Nome ou senha incorretos.";
    }
    }
?>