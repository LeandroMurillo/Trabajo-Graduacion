-- ===================================================
-- Script con Stored Procedures para un SuperAdmin
-- Base de Datos: proyecto
-- ===================================================

-- ==========================
-- Configuración inicial
-- ==========================
SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS;
SET FOREIGN_KEY_CHECKS = 0;

-- ==========================
-- Eliminación de SP existentes (si es necesario)
-- ==========================

DROP PROCEDURE IF EXISTS `dameEmpresas`;
DROP PROCEDURE IF EXISTS `dameEmpresa`;
DROP PROCEDURE IF EXISTS `altaEmpresa`;
DROP PROCEDURE IF EXISTS `modificaEmpresa`;
DROP PROCEDURE IF EXISTS `cambiarEstadoEmpresa`;
DROP PROCEDURE IF EXISTS `borraEmpresa`;
DROP PROCEDURE IF EXISTS `dameAdministradores`;
DROP PROCEDURE IF EXISTS `dameAdministrador`;
DROP PROCEDURE IF EXISTS `altaAdministrador`;
DROP PROCEDURE IF EXISTS `modificaAdministrador`;
DROP PROCEDURE IF EXISTS `borraAdministrador`;
DROP PROCEDURE IF EXISTS `dameCuotas`;

-- ==========================
-- Creación de Procedimientos Almacenados (SuperAdmin)
-- ==========================

DELIMITER //
CREATE PROCEDURE dameEmpresas()
BEGIN
	SELECT
		idEmpresa AS id,
		empresa,
		url,
		estado
	FROM Empresas
	WHERE esSistema = 0
	ORDER BY idEmpresa DESC;
END //
DELIMITER ;

CREATE PROCEDURE dameEmpresa(
	IN pIdEmpresa SMALLINT
)
BEGIN
  SELECT
    e.idEmpresa AS id,
    e.empresa,
    e.url,
    e.estado
  FROM Empresas e
  WHERE e.idEmpresa = pIdEmpresa 
  AND e.esSistema = 0
  LIMIT 1;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE altaEmpresa(
  IN pEmpresa VARCHAR(100),
  IN pUrl     VARCHAR(100)
)
BEGIN
  INSERT INTO Empresas (empresa, url)
  VALUES (pEmpresa, pUrl);

  SELECT
    idEmpresa AS id,
    empresa,
    url,
    estado
  FROM Empresas
  WHERE idEmpresa = LAST_INSERT_ID()
    AND esSistema = 0
  LIMIT 1;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE modificaEmpresa(
  IN pIdEmpresa SMALLINT,
  IN pEmpresa   VARCHAR(100),
  IN pUrl       VARCHAR(100)
)
BEGIN
  UPDATE Empresas
  SET
    empresa = pEmpresa,
    url     = pUrl
  WHERE idEmpresa = pIdEmpresa AND esSistema = 0;

  SELECT
    idEmpresa AS id,
    empresa,
    url,
    estado
  FROM Empresas
  WHERE idEmpresa = pIdEmpresa 
  AND esSistema = 0
  LIMIT 1;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE cambiarEstadoEmpresa(
  IN pIdEmpresa SMALLINT,
  IN pEstado CHAR(1)
)
sp:BEGIN
  DECLARE vEstadoActual CHAR(1);

  IF pEstado IS NULL OR pEstado NOT IN ('A','I') THEN
    SELECT 'El estado debe ser A (activa) o I (inactiva).' AS mensaje;
    LEAVE sp;
  END IF;

  SELECT estado
    INTO vEstadoActual
  FROM Empresas
  WHERE idEmpresa = pIdEmpresa
  LIMIT 1;

  IF vEstadoActual IS NULL THEN
    SELECT 'La empresa indicada no existe.' AS mensaje;
    LEAVE sp;
  END IF;

  IF pIdEmpresa = 1 THEN
    SELECT 'No se permite modificar la empresa del sistema.' AS mensaje;
    LEAVE sp;
  END IF;

  IF vEstadoActual = pEstado THEN
    SELECT 'La empresa ya estaba en ese estado.' AS mensaje;
    LEAVE sp;
  END IF;

  UPDATE Empresas
  SET estado = pEstado
  WHERE idEmpresa = pIdEmpresa;

  SELECT 'OK' AS mensaje;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE borraEmpresa(
  IN pIdEmpresa SMALLINT
)
BEGIN
  DECLARE vEstado CHAR(1);
  DECLARE vEsSistema TINYINT;

  -- Si algo falla a mitad de camino, rollback
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;

  START TRANSACTION;

  -- 1) Debe existir + lock de la fila
  SELECT e.estado, e.esSistema
    INTO vEstado, vEsSistema
  FROM Empresas e
  WHERE e.idEmpresa = pIdEmpresa
  FOR UPDATE;

  IF vEstado IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'EMPRESA_NO_ENCONTRADA';
  END IF;

  -- 2) No permitir borrar empresa del sistema
  IF vEsSistema = 1 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'EMPRESA_SISTEMA_NO_BORRABLE';
  END IF;

  -- 3) Debe estar inactiva
  IF vEstado <> 'I' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'EMPRESA_DEBE_ESTAR_INACTIVA';
  END IF;

  -- 4) No debe tener dependencias
  IF EXISTS (SELECT 1 FROM Categorias c WHERE c.idEmpresa = pIdEmpresa LIMIT 1) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'EMPRESA_TIENE_CATEGORIAS';
  END IF;

  IF EXISTS (SELECT 1 FROM Cuotas q WHERE q.idEmpresa = pIdEmpresa LIMIT 1) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'EMPRESA_TIENE_CUOTAS';
  END IF;

  IF EXISTS (SELECT 1 FROM Administradores a WHERE a.idEmpresa = pIdEmpresa LIMIT 1) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'EMPRESA_TIENE_ADMINISTRADORES';
  END IF;

  -- 5) Hard delete
  DELETE FROM Empresas
  WHERE idEmpresa = pIdEmpresa;

  COMMIT;

END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE dameAdministradores()
BEGIN
	SELECT
		a.idAdministrador AS id,
		a.email,
		e.empresa,
		a.rol
	FROM Administradores a
	JOIN Empresas e
		USING (idEmpresa)
	WHERE e.esSistema = 0
	ORDER BY a.idAdministrador DESC;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE dameAdministrador(
  IN pIdAdministrador SMALLINT
)
BEGIN
  DECLARE vExists INT DEFAULT 0;

  SELECT COUNT(*) INTO vExists
  FROM Administradores a
  WHERE a.idAdministrador = pIdAdministrador;

  IF vExists = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ADMIN_NO_EXISTE';
  END IF;

  SELECT
    a.idAdministrador AS id,
    a.email,
    e.empresa,
    a.rol
  FROM Administradores a
  INNER JOIN Empresas e ON e.idEmpresa = a.idEmpresa
  WHERE a.idAdministrador = pIdAdministrador
  LIMIT 1;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE altaAdministrador(
	IN pEmail         VARCHAR(256),
	IN pNombreEmpresa VARCHAR(100),
	IN pClaveHash     VARCHAR(60)
)
proc: BEGIN
	DECLARE vCount INT DEFAULT 0;
	DECLARE vIdEmpresa SMALLINT DEFAULT NULL;
	DECLARE vIdAdministrador SMALLINT DEFAULT NULL;

	-- 1) Resolver idEmpresa por nombre (insensible a mayúsculas/espacios)
  SELECT e.idEmpresa
  INTO vIdEmpresa
  FROM `proyecto`.`Empresas` e
  WHERE
    e.esSistema = 0
    AND LOWER(TRIM(e.empresa)) = LOWER(TRIM(pNombreEmpresa))
  LIMIT 1;


	IF vIdEmpresa IS NULL THEN
		SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = 'EMPRESA_INEXISTENTE';
	END IF;

	-- 2) Empresa activa
	SELECT COUNT(*) INTO vCount
	FROM `proyecto`.`Empresas`
	WHERE idEmpresa = vIdEmpresa
	  AND estado = 'A'
	LIMIT 1;

	IF vCount = 0 THEN
		SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = 'EMPRESA_INACTIVA';
	END IF;

	SELECT COUNT(*) INTO vCount
	FROM `proyecto`.`Administradores`
	WHERE idEmpresa = vIdEmpresa
	  AND email = TRIM(LOWER(pEmail))
	LIMIT 1;

	IF vCount > 0 THEN
		SIGNAL SQLSTATE '23000'
			SET MESSAGE_TEXT = 'EMAIL_DUPLICADO';
	END IF;

	-- 4) Insertar con rol ADMIN
	INSERT INTO `proyecto`.`Administradores`
		(idEmpresa, email, clave, rol)
	VALUES
		(vIdEmpresa, TRIM(LOWER(pEmail)), pClaveHash, 'ADMIN');

	SET vIdAdministrador = LAST_INSERT_ID();

	-- 5) Retornar fila creada
	SELECT
		a.idAdministrador AS id,
		a.email,
		e.empresa,
		a.rol
	FROM `proyecto`.`Administradores` a
	JOIN `proyecto`.`Empresas` e USING (idEmpresa)
	WHERE a.idAdministrador = vIdAdministrador
	LIMIT 1;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE modificaAdministrador(
  IN pIdAdministrador SMALLINT,
  IN pEmail          VARCHAR(256),
  IN pEmpresaNombre  VARCHAR(100),
  IN pClaveHash      VARCHAR(60)
)
proc: BEGIN
  DECLARE vIdEmpresa SMALLINT;
  DECLARE vExists INT DEFAULT 0;

  SELECT COUNT(*)
    INTO vExists
  FROM Administradores a
  WHERE a.idAdministrador = pIdAdministrador;

  IF vExists = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ADMIN_NO_EXISTE';
  END IF;

  SET vIdEmpresa = NULL;

  IF pEmpresaNombre IS NOT NULL AND LOWER(TRIM(pEmpresaNombre)) <> '' THEN
    SELECT e.idEmpresa
      INTO vIdEmpresa
    FROM Empresas e
    WHERE LOWER(TRIM(e.empresa)) = LOWER(TRIM(pEmpresaNombre))
    LIMIT 1;
  END IF;

  UPDATE Administradores a
  SET
    a.email = CASE
      WHEN pEmail IS NULL OR LOWER(TRIM(pEmail)) = '' THEN a.email
      ELSE LOWER(TRIM(pEmail))
    END,
    a.idEmpresa = CASE
      WHEN vIdEmpresa IS NULL THEN a.idEmpresa
      ELSE vIdEmpresa
    END,
    a.clave = CASE
      WHEN pClaveHash IS NULL OR TRIM(pClaveHash) = '' THEN a.clave
      ELSE pClaveHash
    END
  WHERE a.idAdministrador = pIdAdministrador;

  SELECT
    a.idAdministrador AS id,
    a.email           AS email,
    e.empresa         AS empresa,
    a.rol             AS rol
  FROM Administradores a
  INNER JOIN Empresas e ON e.idEmpresa = a.idEmpresa
  WHERE a.idAdministrador = pIdAdministrador
  LIMIT 1;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE borraAdministrador(
  IN pIdAdministrador SMALLINT
)
BEGIN
  DECLARE vIdEmpresa SMALLINT;
  DECLARE vRol ENUM('SUPERADMIN','ADMIN');
  DECLARE vEsSistema TINYINT;

  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;

  START TRANSACTION;

  -- 1) Validar existencia + lock del admin
  SELECT a.idEmpresa, a.rol
    INTO vIdEmpresa, vRol
  FROM Administradores a
  WHERE a.idAdministrador = pIdAdministrador
  FOR UPDATE;

  IF vIdEmpresa IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ADMIN_NO_EXISTE';
  END IF;

  -- 2) Este SP NO borra SUPERADMIN
  IF vRol = 'SUPERADMIN' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'SUPERADMIN_NO_BORRABLE';
  END IF;

  -- 3) Bloquear empresa sistema usando Empresas.esSistema
  SELECT e.esSistema
    INTO vEsSistema
  FROM Empresas e
  WHERE e.idEmpresa = vIdEmpresa
  FOR UPDATE;

  IF vEsSistema = 1 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ADMIN_EMPRESA_SISTEMA_NO_BORRABLE';
  END IF;

  -- 4) Delete físico (permite borrar incluso el último ADMIN)
  DELETE FROM Administradores
  WHERE idAdministrador = pIdAdministrador;

  COMMIT;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE dameCuotas(
  IN pIdEmpresa SMALLINT,   -- NULL = todas
  IN pPage INT,
  IN pPageSize INT,
  IN pSortBy VARCHAR(50),
  IN pSortDir VARCHAR(4)
)
BEGIN
  DECLARE vOffset INT DEFAULT 0;
  DECLARE vPage INT DEFAULT 1;
  DECLARE vPageSize INT DEFAULT 25;
  DECLARE vSortBy VARCHAR(50);
  DECLARE vSortDir VARCHAR(4);

  SET vPage = IFNULL(pPage, 1);
  IF vPage < 1 THEN SET vPage = 1; END IF;

  SET vPageSize = IFNULL(pPageSize, 25);
  IF vPageSize < 1 THEN SET vPageSize = 25; END IF;
  IF vPageSize > 200 THEN SET vPageSize = 200; END IF;

  SET vOffset = (vPage - 1) * vPageSize;

  SET vSortDir = UPPER(IFNULL(pSortDir, 'DESC'));
  IF vSortDir NOT IN ('ASC', 'DESC') THEN
    SET vSortDir = 'DESC';
  END IF;

  SET vSortBy = IFNULL(pSortBy, 'fechaPago');
  IF vSortBy NOT IN ('idCuota', 'idEmpresa', 'empresa', 'monto', 'fechaPago') THEN
    SET vSortBy = 'fechaPago';
  END IF;

  SET @sql = CONCAT(
    'SELECT c.idCuota, c.idEmpresa, e.empresa AS empresa, c.monto, c.fechaPago
     FROM Cuotas c
     JOIN Empresas e ON e.idEmpresa = c.idEmpresa
     WHERE (? IS NULL OR c.idEmpresa = ?)
     ORDER BY ', vSortBy, ' ', vSortDir, ', c.idEmpresa ASC, c.idCuota DESC
     LIMIT ? OFFSET ?'
  );

  PREPARE stmt FROM @sql;
  SET @p1 = pIdEmpresa;
  SET @p2 = pIdEmpresa;
  SET @p3 = vPageSize;
  SET @p4 = vOffset;
  EXECUTE stmt USING @p1, @p2, @p3, @p4;
  DEALLOCATE PREPARE stmt;
END//
DELIMITER ;

