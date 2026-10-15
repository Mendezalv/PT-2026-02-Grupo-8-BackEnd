-- ==============================================================================
-- PROCESSO TRAINEE CJR 2026.2 - GRUPO 8
-- Script DDL: Modelagem do Banco de Dados Relacional (MySQL / MariaDB)
-- Baseado no diagrama conceitual/lógico definido pelo orientador
-- ==============================================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS comentarios_avaliacao;
DROP TABLE IF EXISTS avaliacoes_loja;
DROP TABLE IF EXISTS avaliacoes_produto;
DROP TABLE IF EXISTS imagens_produto;
DROP TABLE IF EXISTS produtos;
DROP TABLE IF EXISTS categorias;
DROP TABLE IF EXISTS lojas;
DROP TABLE IF EXISTS usuarios;
SET FOREIGN_KEY_CHECKS = 1;

-- ==============================================================================
-- 1. TABELA: usuarios
-- ==============================================================================
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    foto_perfil_url VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 2. TABELA: lojas
-- ==============================================================================
CREATE TABLE lojas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT NULL,
    logo_url VARCHAR(255) NULL,
    banner_url VARCHAR(255) NULL,
    sticker_url VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_lojas_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_lojas_usuario_id ON lojas(usuario_id);

-- ==============================================================================
-- 3. TABELA: categorias
-- ==============================================================================
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    categoria_pai_id INT NULL,
    CONSTRAINT fk_categorias_pai
        FOREIGN KEY (categoria_pai_id)
        REFERENCES categorias(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_categorias_categoria_pai_id ON categorias(categoria_pai_id);

-- ==============================================================================
-- 4. TABELA: produtos
-- ==============================================================================
CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    loja_id INT NOT NULL,
    categoria_id INT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    estoque INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_produtos_loja
        FOREIGN KEY (loja_id)
        REFERENCES lojas(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_produtos_categoria
        FOREIGN KEY (categoria_id)
        REFERENCES categorias(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT chk_produtos_preco CHECK (preco >= 0),
    CONSTRAINT chk_produtos_estoque CHECK (estoque >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_produtos_loja_id ON produtos(loja_id);
CREATE INDEX idx_produtos_categoria_id ON produtos(categoria_id);

-- ==============================================================================
-- 5. TABELA: imagens_produto
-- ==============================================================================
CREATE TABLE imagens_produto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produto_id INT NOT NULL,
    url_imagem VARCHAR(255) NOT NULL,
    ordem INT NOT NULL DEFAULT 1,
    CONSTRAINT fk_imagens_produto_produto
        FOREIGN KEY (produto_id)
        REFERENCES produtos(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT chk_imagens_ordem CHECK (ordem >= 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_imagens_produto_produto_id ON imagens_produto(produto_id);

-- ==============================================================================
-- 6. TABELA: avaliacoes_produto
-- ==============================================================================
CREATE TABLE avaliacoes_produto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    produto_id INT NOT NULL,
    nota INT NOT NULL,
    comentario TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_avaliacoes_produto_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_avaliacoes_produto_produto
        FOREIGN KEY (produto_id)
        REFERENCES produtos(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT unq_usuario_produto_avaliacao UNIQUE (usuario_id, produto_id),
    CONSTRAINT chk_nota_produto CHECK (nota BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_avaliacoes_produto_usuario_id ON avaliacoes_produto(usuario_id);
CREATE INDEX idx_avaliacoes_produto_produto_id ON avaliacoes_produto(produto_id);

-- ==============================================================================
-- 7. TABELA: avaliacoes_loja
-- ==============================================================================
CREATE TABLE avaliacoes_loja (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    loja_id INT NOT NULL,
    nota INT NOT NULL,
    comentario TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_avaliacoes_loja_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_avaliacoes_loja_loja
        FOREIGN KEY (loja_id)
        REFERENCES lojas(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT unq_usuario_loja_avaliacao UNIQUE (usuario_id, loja_id),
    CONSTRAINT chk_nota_loja CHECK (nota BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_avaliacoes_loja_usuario_id ON avaliacoes_loja(usuario_id);
CREATE INDEX idx_avaliacoes_loja_loja_id ON avaliacoes_loja(loja_id);

-- ==============================================================================
-- 8. TABELA: comentarios_avaliacao
-- ==============================================================================
CREATE TABLE comentarios_avaliacao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    avaliacao_loja_id INT NULL,
    avaliacao_produto_id INT NULL,
    conteudo TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_comentarios_avaliacao_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_comentarios_avaliacao_loja
        FOREIGN KEY (avaliacao_loja_id)
        REFERENCES avaliacoes_loja(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_comentarios_avaliacao_produto
        FOREIGN KEY (avaliacao_produto_id)
        REFERENCES avaliacoes_produto(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT chk_comentario_origem_exclusiva CHECK (
        (avaliacao_loja_id IS NOT NULL AND avaliacao_produto_id IS NULL)
        OR
        (avaliacao_loja_id IS NULL AND avaliacao_produto_id IS NOT NULL)
    )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_comentarios_avaliacao_usuario_id ON comentarios_avaliacao(usuario_id);
CREATE INDEX idx_comentarios_avaliacao_loja_id ON comentarios_avaliacao(avaliacao_loja_id);
CREATE INDEX idx_comentarios_avaliacao_produto_id ON comentarios_avaliacao(avaliacao_produto_id);
