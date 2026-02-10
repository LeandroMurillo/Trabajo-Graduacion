-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS = @@UNIQUE_CHECKS, UNIQUE_CHECKS = 0;

SET
  @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS,
  FOREIGN_KEY_CHECKS = 0;

SET
  @OLD_SQL_MODE = @@SQL_MODE,
    SQL_MODE = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema proyecto
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `proyecto`;

-- -----------------------------------------------------
-- Schema proyecto
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `proyecto` DEFAULT CHARACTER SET utf8;

USE `proyecto`;

-- -----------------------------------------------------
-- Table `proyecto`.`Empresas`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `proyecto`.`Empresas`;

CREATE TABLE IF NOT EXISTS `proyecto`.`Empresas` (
  `idEmpresa` SMALLINT NOT NULL AUTO_INCREMENT,
  `empresa` VARCHAR(100) NOT NULL,
  `url` VARCHAR(100) NOT NULL,
  `estilo` JSON NULL,
  `estado` ENUM('A','I') NOT NULL DEFAULT 'A' COMMENT
    'Estados:\n''I'' Inactiva\n''A'' Activa',
  `esSistema` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '1 si la empresa es la del sistema (ficticia)',
  PRIMARY KEY (`idEmpresa`),
  UNIQUE KEY `uq_empresas_url` (`url`),
  KEY `idx_empresas_url_estado` (`url`, `estado`)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `proyecto`.`Categorias`
--  - PK simple: idCategoria AUTO_INCREMENT
--  - Uniques por empresa: (idEmpresa,categoria) y (idEmpresa,orden)
--  - UNIQUE adicional: (idCategoria,idEmpresa) para permitir FK compuesta desde Vacantes
-- -----------------------------------------------------
DROP TABLE IF EXISTS `proyecto`.`Categorias`;

CREATE TABLE IF NOT EXISTS `proyecto`.`Categorias` (
  `idCategoria` INT NOT NULL AUTO_INCREMENT,
  `idEmpresa` SMALLINT NOT NULL,
  `categoria` VARCHAR(50) NOT NULL,
  `orden` TINYINT NOT NULL,
  `estado` ENUM('A','I') NOT NULL DEFAULT 'A' COMMENT
    'Estados:\n''I'' Inactiva\n''A'' Activa',
  PRIMARY KEY (`idCategoria`),
  CONSTRAINT `FK_Categorias_Empresas`
    FOREIGN KEY (`idEmpresa`) REFERENCES `proyecto`.`Empresas` (`idEmpresa`)
    ON DELETE NO ACTION ON UPDATE NO ACTION,

  UNIQUE KEY `uq_categorias_empresa_categoria` (`idEmpresa`, `categoria`),
  UNIQUE KEY `uq_categorias_empresa_orden` (`idEmpresa`, `orden`),
  UNIQUE KEY `uq_categorias_idCategoria_idEmpresa` (`idCategoria`, `idEmpresa`),

  KEY `idx_categorias_empresa` (`idEmpresa`),
  KEY `idx_categorias_empresa_estado_orden` (`idEmpresa`, `estado`, `orden`)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `proyecto`.`Vacantes`
--  - PK simple: idVacante AUTO_INCREMENT
--  - FK compuesta: (idCategoria,idEmpresa) -> Categorias(idCategoria,idEmpresa)
--  - UNIQUE adicional: (idVacante,idEmpresa) para FK compuesta desde Postulaciones
-- -----------------------------------------------------
DROP TABLE IF EXISTS `proyecto`.`Vacantes`;

CREATE TABLE IF NOT EXISTS `proyecto`.`Vacantes` (
  `idVacante` INT NOT NULL AUTO_INCREMENT,
  `idCategoria` INT NOT NULL,
  `idEmpresa` SMALLINT NOT NULL,

  `vacante` VARCHAR(45) NOT NULL,
  `descripcion` TEXT NOT NULL,
  `tipoTrabajo` ENUM('Sin Especificar','Tiempo Completo','Medio Tiempo','Remoto','Híbrido') NOT NULL,
  `modalidad` ENUM('Sin Especificar','Presencial','Remoto','Híbrido') NOT NULL,
  `fechaCreacion` DATETIME NOT NULL,
  `fechaPublicacion` DATETIME NULL,
  `fechaCierre` DATETIME NULL,
  `localidad` VARCHAR(100) NULL,
  `nivelExperiencia` ENUM('Junior','SemiSenior','Senior') NULL,
  `habilidades` JSON NOT NULL,
  `estado` ENUM('P','B','C') NOT NULL DEFAULT 'B' COMMENT
    'Estados:\n''B'' Borrador\n''P'' Publicada\n''C'' Cerrada',

  PRIMARY KEY (`idVacante`),
  CONSTRAINT `FK_Vacantes_Categorias_Empresa`
    FOREIGN KEY (`idCategoria`, `idEmpresa`)
    REFERENCES `proyecto`.`Categorias` (`idCategoria`, `idEmpresa`)
    ON DELETE NO ACTION ON UPDATE NO ACTION,
  UNIQUE KEY `uq_vacantes_idVacante_idEmpresa` (`idVacante`, `idEmpresa`),

  KEY `idx_vacantes_empresa` (`idEmpresa`),
  KEY `idx_vacantes_categoria` (`idCategoria`),
  KEY `idx_vacantes_empresa_estado_pub` (`idEmpresa`, `estado`, `fechaPublicacion`),
  KEY `idx_vacantes_empresa_categoria_estado_pub` (`idEmpresa`, `idCategoria`, `estado`, `fechaPublicacion`)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `proyecto`.`Postulantes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `proyecto`.`Postulantes`;

CREATE TABLE IF NOT EXISTS `proyecto`.`Postulantes` (
  `idPostulante` CHAR(28) NOT NULL,
  `nombres` VARCHAR(100) NOT NULL,
  `apellidos` VARCHAR(100) NOT NULL,
  `email` VARCHAR(256) NOT NULL,
  `cuil` CHAR(11) NULL,
  `genero` ENUM('M','F','X') NOT NULL,
  `fechaNacimiento` DATE NOT NULL,
  `localidad` VARCHAR(100) NULL,
  `telefono` VARCHAR(15) NULL,
  `observaciones` MEDIUMTEXT NULL,
  `habilidades` JSON NULL,
  `estado` ENUM('P','A','I') NOT NULL DEFAULT 'P',
  PRIMARY KEY (`idPostulante`),
  UNIQUE KEY `uq_postulantes_email` (`email`),
  KEY `idx_postulantes_estado` (`estado`)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `proyecto`.`Curriculums`
--  - PK simple: idCurriculum AUTO_INCREMENT
--  - 0..1 por postulante: UNIQUE(idPostulante)
-- -----------------------------------------------------
DROP TABLE IF EXISTS `proyecto`.`Curriculums`;

CREATE TABLE IF NOT EXISTS `proyecto`.`Curriculums` (
  `idCurriculum` INT NOT NULL AUTO_INCREMENT,
  `idPostulante` CHAR(28) NOT NULL,
  `curriculum` VARCHAR(50) NOT NULL,
  `fecha` DATETIME NOT NULL,
  `hash` CHAR(64) NOT NULL COMMENT 'Hash SHA-256 en hexas',
  `pdf` MEDIUMBLOB NOT NULL,
  `estado` ENUM('A','I') NOT NULL DEFAULT 'A',
  PRIMARY KEY (`idCurriculum`),

  CONSTRAINT `FK_Curriculums_Postulantes`
    FOREIGN KEY (`idPostulante`) REFERENCES `proyecto`.`Postulantes` (`idPostulante`)
    ON DELETE NO ACTION ON UPDATE NO ACTION,

  UNIQUE KEY `uq_curriculums_postulante` (`idPostulante`),
  KEY `idx_curriculums_hash` (`hash`)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `proyecto`.`Postulaciones`
--  - PK simple: idPostulacion AUTO_INCREMENT
--  - FK simple: idCurriculum -> Curriculums(idCurriculum)
--  - FK simple: idPostulante -> Postulantes(idPostulante)
--  - FK compuesta: (idVacante,idEmpresa) -> Vacantes(idVacante,idEmpresa)
--  - UNIQUE: (idPostulante,idVacante) para evitar doble postulación a la misma vacante
-- -----------------------------------------------------
DROP TABLE IF EXISTS `proyecto`.`Postulaciones`;

CREATE TABLE IF NOT EXISTS `proyecto`.`Postulaciones` (
  `idPostulacion` INT NOT NULL AUTO_INCREMENT,
  `idCurriculum` INT NOT NULL,
  `idPostulante` CHAR(28) NOT NULL,
  `idVacante` INT NOT NULL,
  `idEmpresa` SMALLINT NOT NULL,
  `fechaPostulacion` DATETIME NOT NULL,
  `estado` ENUM('F','0','I') NOT NULL DEFAULT '0' COMMENT
    'Estados\n''F'' - Favorito\n''0'' - Default\n''I'' - Ignorar',

  PRIMARY KEY (`idPostulacion`),

  CONSTRAINT `FK_Postulaciones_Curriculums`
    FOREIGN KEY (`idCurriculum`) REFERENCES `proyecto`.`Curriculums` (`idCurriculum`)
    ON DELETE NO ACTION ON UPDATE NO ACTION,

  CONSTRAINT `FK_Postulaciones_Postulantes`
    FOREIGN KEY (`idPostulante`) REFERENCES `proyecto`.`Postulantes` (`idPostulante`)
    ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_Postulaciones_Vacantes_Empresa`
    FOREIGN KEY (`idVacante`, `idEmpresa`) REFERENCES `proyecto`.`Vacantes` (`idVacante`, `idEmpresa`)
    ON DELETE NO ACTION ON UPDATE NO ACTION,

  UNIQUE KEY `uq_postulaciones_postulante_vacante` (`idPostulante`, `idVacante`),

  KEY `idx_postulaciones_vacante_fecha` (`idVacante`, `fechaPostulacion`),
  KEY `idx_postulaciones_postulante_fecha` (`idPostulante`, `fechaPostulacion`),
  KEY `idx_postulaciones_empresa_fecha` (`idEmpresa`, `fechaPostulacion`),
  KEY `idx_postulaciones_vacante_estado_fecha` (`idVacante`, `estado`, `fechaPostulacion`)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `proyecto`.`Cuotas`
--  - PK simple: idCuota AUTO_INCREMENT
-- -----------------------------------------------------
DROP TABLE IF EXISTS `proyecto`.`Cuotas`;

CREATE TABLE IF NOT EXISTS `proyecto`.`Cuotas` (
  `idCuota` INT NOT NULL AUTO_INCREMENT,
  `idEmpresa` SMALLINT NOT NULL,
  `monto` VARCHAR(45) NOT NULL,
  `fechaPago` DATE NOT NULL,
  PRIMARY KEY (`idCuota`),

  CONSTRAINT `FK_Cuotas_Empresas`
    FOREIGN KEY (`idEmpresa`) REFERENCES `proyecto`.`Empresas` (`idEmpresa`)
    ON DELETE NO ACTION ON UPDATE NO ACTION,

  KEY `idx_cuotas_empresa` (`idEmpresa`),
  KEY `idx_cuotas_empresa_fechapago` (`idEmpresa`, `fechaPago`)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `proyecto`.`Administradores`
--  - PK simple: idAdministrador AUTO_INCREMENT
-- -----------------------------------------------------
DROP TABLE IF EXISTS `proyecto`.`Administradores`;

CREATE TABLE IF NOT EXISTS `proyecto`.`Administradores` (
  `idAdministrador` SMALLINT NOT NULL AUTO_INCREMENT,
  `idEmpresa` SMALLINT NOT NULL,
  `email` VARCHAR(256) NOT NULL,
  `clave` VARCHAR(60) NOT NULL,
  `rol` ENUM('SUPERADMIN','ADMIN') NOT NULL COMMENT
    'rol:\n- SUPERADMIN\n- ADMIN',

  PRIMARY KEY (`idAdministrador`),

  CONSTRAINT `FK_Administradores_Empresas`
    FOREIGN KEY (`idEmpresa`) REFERENCES `proyecto`.`Empresas` (`idEmpresa`)
    ON DELETE NO ACTION ON UPDATE NO ACTION,

  UNIQUE KEY `uq_administradores_email` (`email`),
  KEY `idx_administradores_empresa` (`idEmpresa`)
) ENGINE=InnoDB;

SET SQL_MODE = @OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS = @OLD_UNIQUE_CHECKS;