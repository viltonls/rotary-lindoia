<?php
// ==========================================
// Configuração do E-mail de Destino
// ==========================================
// Substitua o e-mail abaixo pelo e-mail oficial do Rotary Lindóia
$email_destino = 'viltonsilvajr@gmail.com'; 
$assunto_prefixo = '[Site Rotary Lindóia] ';

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Identifica qual formulário foi enviado
    $form_type = $_POST['form_type'] ?? '';
    
    // Dados comuns
    $nome = htmlspecialchars(trim($_POST['nome'] ?? ''));
    $email = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
    
    // Validação básica de campos comuns
    if(empty($nome) || empty($email) || empty($form_type)) {
        echo json_encode(["status" => "error", "message" => "Dados obrigatórios faltando."]);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["status" => "error", "message" => "E-mail inválido."]);
        exit;
    }

    $assunto = '';
    $corpo = "";
    $corpo .= "Nome: {$nome}\n";
    $corpo .= "E-mail: {$email}\n";
    
    // Captura telefone se enviado
    if (isset($_POST['telefone'])) {
        $telefone = htmlspecialchars(trim($_POST['telefone']));
        $corpo .= "Telefone/WhatsApp: {$telefone}\n";
    }
    
    $corpo .= "------------------------------------\n\n";

    if ($form_type === 'junte_se') {
        $tipo_interesse = htmlspecialchars(trim($_POST['tipo-interesse'] ?? ''));
        $empresa = htmlspecialchars(trim($_POST['empresa'] ?? ''));
        
        $assunto = $assunto_prefixo . "Interesse de Adesão: " . ucfirst($tipo_interesse);
        $corpo .= "Tipo de interesse: Ser {$tipo_interesse}\n";
        if (!empty($empresa)) {
            $corpo .= "Empresa vinculada: {$empresa}\n";
        }
    } else if ($form_type === 'doe_agora') {
        $projeto_doacao = htmlspecialchars(trim($_POST['projeto-doacao'] ?? ''));
        $mensagem = htmlspecialchars(trim($_POST['mensagem'] ?? ''));
        
        $assunto = $assunto_prefixo . "Novo interesse em Doação: " . ucfirst($projeto_doacao);
        $corpo .= "Projeto selecionado para doação: " . ucfirst($projeto_doacao) . "\n";
        $corpo .= "Mensagem/Detalhes da doação:\n{$mensagem}\n";
    } else if ($form_type === 'ser_rotariano') {
        $profissao = htmlspecialchars(trim($_POST['profissao'] ?? ''));
        $mensagem = htmlspecialchars(trim($_POST['mensagem'] ?? ''));
        
        $assunto = $assunto_prefixo . "Candidatura a Membro Rotariano";
        $corpo .= "Profissão / Área de atuação: {$profissao}\n";
        $corpo .= "Por que deseja ser Rotariano:\n{$mensagem}\n";
    } else if ($form_type === 'como_participar') {
        $mensagem = htmlspecialchars(trim($_POST['mensagem'] ?? ''));
        
        $assunto = $assunto_prefixo . "Interesse em Participar (Seção 9)";
        $corpo .= "Motivação/Mensagem:\n{$mensagem}\n";
    } else if ($form_type === 'contato') {
        $mensagem = htmlspecialchars(trim($_POST['mensagem'] ?? ''));
        
        $assunto = $assunto_prefixo . "Nova mensagem de contato";
        $corpo .= "Mensagem de contato:\n{$mensagem}\n";
    } else {
        echo json_encode(["status" => "error", "message" => "Tipo de formulário inválido."]);
        exit;
    }

    $corpo .= "\n------------------------------------\n";
    $corpo .= "Este e-mail foi enviado a partir do site Rotary Lindóia.";

    // Headers do e-mail
    // Dica da Hostinger: usar From e Reply-To adequados.
    $headers = "From: {$email}\r\n"; 
    $headers .= "Reply-To: {$email}\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // Enviar e-mail usando a função nativa do PHP
    if(mail($email_destino, $assunto, $corpo, $headers)) {
        echo json_encode(["status" => "success", "message" => "E-mail enviado com sucesso!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Falha ao enviar o e-mail pelo servidor."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Método inválido. Somente POST é aceito."]);
}
?>
