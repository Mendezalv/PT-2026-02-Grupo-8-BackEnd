-- ==============================================================================
-- PROCESSO TRAINEE CJR 2026.2 - GRUPO 8
-- Script DDL: Modelagem do Banco de Dados Relacional (PostgreSQL)
-- Baseado no diagrama conceitual/lógico definido pelo orientador
-- ==============================================================================

-- Habilita extensões úteis se necessário
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Função utilitária para atualização automática de "updatedAt"
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 1. TABELA: usuarios
-- ==============================================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    foto_perfil_url VARCHAR(255),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TRIGGER set_timestamp_usuarios
BEFORE UPDATE ON usuarios
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- ==============================================================================
-- 2. TABELA: lojas
-- ==============================================================================
CREATE TABLE IF NOT EXISTS lojas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    logo_url VARCHAR(255),
    banner_url VARCHAR(255),
    sticker_url VARCHAR(255),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_lojas_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE INDEX idx_lojas_usuario_id ON lojas(usuario_id);

CREATE TRIGGER set_timestamp_lojas
BEFORE UPDATE ON lojas
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- ==============================================================================
-- 3. TABELA: categorias
-- ==============================================================================
CREATE TABLE IF NOT EXISTS categorias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    categoria_pai_id INTEGER,
    CONSTRAINT fk_categorias_pai
        FOREIGN KEY (categoria_pai_id)
        REFERENCES categorias(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE INDEX idx_categorias_categoria_pai_id ON categorias(categoria_pai_id);

-- ==============================================================================
-- 4. TABELA: produtos
-- ==============================================================================
CREATE TABLE IF NOT EXISTS produtos (
    id SERIAL PRIMARY KEY,
    loja_id INTEGER NOT NULL,
    categoria_id INTEGER NOT NULL,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10, 2) NOT NULL CHECK (preco >= 0),
    estoque INTEGER NOT NULL DEFAULT 0 CHECK (estoque >= 0),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_produtos_loja
        FOREIGN KEY (loja_id)
        REFERENCES lojas(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_produtos_categoria
        FOREIGN KEY (categoria_id)
        REFERENCES categorias(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE INDEX idx_produtos_loja_id ON produtos(loja_id);
CREATE INDEX idx_produtos_categoria_id ON produtos(categoria_id);

CREATE TRIGGER set_timestamp_produtos
BEFORE UPDATE ON produtos
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- ==============================================================================
-- 5. TABELA: imagens_produto
-- ==============================================================================
CREATE TABLE IF NOT EXISTS imagens_produto (
    id SERIAL PRIMARY KEY,
    produto_id INTEGER NOT NULL,
    url_imagem VARCHAR(255) NOT NULL,
    ordem INTEGER NOT NULL DEFAULT 1 CHECK (ordem >= 1),
    CONSTRAINT fk_imagens_produto_produto
        FOREIGN KEY (produto_id)
        REFERENCES produtos(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE INDEX idx_imagens_produto_produto_id ON imagens_produto(produto_id);

-- ==============================================================================
-- 6. TABELA: avaliacoes_produto
-- ==============================================================================
CREATE TABLE IF NOT EXISTS avaliacoes_produto (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    produto_id INTEGER NOT NULL,
    nota INTEGER NOT NULL CHECK (nota BETWEEN 1 AND 5),
    comentario TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
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
    CONSTRAINT unq_usuario_produto_avaliacao
        UNIQUE (usuario_id, produto_id)
);

CREATE INDEX idx_avaliacoes_produto_usuario_id ON avaliacoes_produto(usuario_id);
CREATE INDEX idx_avaliacoes_produto_produto_id ON avaliacoes_produto(produto_id);

CREATE TRIGGER set_timestamp_avaliacoes_produto
BEFORE UPDATE ON avaliacoes_produto
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- ==============================================================================
-- 7. TABELA: avaliacoes_loja
-- ==============================================================================
CREATE TABLE IF NOT EXISTS avaliacoes_loja (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    loja_id INTEGER NOT NULL,
    nota INTEGER NOT NULL CHECK (nota BETWEEN 1 AND 5),
    comentario TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
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
    CONSTRAINT unq_usuario_loja_avaliacao
        UNIQUE (usuario_id, loja_id)
);

CREATE INDEX idx_avaliacoes_loja_usuario_id ON avaliacoes_loja(usuario_id);
CREATE INDEX idx_avaliacoes_loja_loja_id ON avaliacoes_loja(loja_id);

CREATE TRIGGER set_timestamp_avaliacoes_loja
BEFORE UPDATE ON avaliacoes_loja
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- ==============================================================================
-- 8. TABELA: comentarios_avaliacao
-- ==============================================================================
CREATE TABLE IF NOT EXISTS comentarios_avaliacao (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    avaliacao_loja_id INTEGER,
    avaliacao_produto_id INTEGER,
    conteudo TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
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
    -- Regra de exclusão mútua: o comentário deve referenciar OU uma avaliação de loja OU de produto
    CONSTRAINT chk_comentario_origem_exclusiva
        CHECK (
            (avaliacao_loja_id IS NOT NULL AND avaliacao_produto_id IS NULL)
            OR
            (avaliacao_loja_id IS NULL AND avaliacao_produto_id IS NOT NULL)
        )
);

CREATE INDEX idx_comentarios_avaliacao_usuario_id ON comentarios_avaliacao(usuario_id);
CREATE INDEX idx_comentarios_avaliacao_loja_id ON comentarios_avaliacao(avaliacao_loja_id);
CREATE INDEX idx_comentarios_avaliacao_produto_id ON comentarios_avaliacao(avaliacao_produto_id);

CREATE TRIGGER set_timestamp_comentarios_avaliacao
BEFORE UPDATE ON comentarios_avaliacao
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();
