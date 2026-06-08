<?php
// ==========================================
// Configuração do E-mail de Destino
// ==========================================
// Substitua o e-mail abaixo pelo e-mail oficial do Rotary Lindóia
$email_destino = 'viltonsilvajr@gmail.com'; 
$assunto_prefixo = '[Site Rotary Lindóia] ';

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Identifica qual formulário foi enviado ("junte_se" ou "contato")
    $form_type = $_POST['form_type'] ?? '';
    
    // Dados comuns
    $nome = htmlspecialchars(trim($_POST['nome'] ?? ''));
    $email = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
    
    // Validação básica
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
    $corpo .= "------------------------------------\n\n";

    if ($form_type === 'junte_se') {
        // Campos específicos do form Junte-se
        $tipo_interesse = htmlspecialchars(trim($_POST['tipo-interesse'] ?? ''));
        $telefone = htmlspecialchars(trim($_POST['telefone'] ?? ''));
        $empresa = htmlspecialchars(trim($_POST['empresa'] ?? ''));
        
        $assunto = $assunto_prefixo . "Novo interesse: " . ucfirst($tipo_interesse);
        
        $corpo .= "Interesse em ser: {$tipo_interesse}\n";
        $corpo .= "Telefone/WhatsApp: {$telefone}\n";
        if(!empty($empresa)) {
            $corpo .= "Empresa: {$empresa}\n";
        }
    } else if ($form_type === 'contato') {
        // Campos específicos do form Contato
        $mensagem = htmlspecialchars(trim($_POST['mensagem'] ?? ''));
        
        $assunto = $assunto_prefixo . "Nova mensagem de contato";
        
        $corpo .= "Mensagem:\n{$mensagem}\n";
    } else {
        echo json_encode(["status" => "error", "message" => "Tipo de formulário inválido."]);
        exit;
    }

    $corpo .= "\n------------------------------------\n";
    $corpo .= "Este e-mail foi enviado a partir do site Rotary Lindóia.";

    // Headers do e-mail
    // Dica: Para evitar cair no SPAM na Hostinger, o header "From" idealmente deve 
    // ser um e-mail do seu próprio domínio (ex: contato@seudominio.com.br).
    // Aqui usamos o email do remetente no From e Reply-To para facilitar a resposta.
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
