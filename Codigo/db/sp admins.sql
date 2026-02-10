-- ===================================================
-- Script con Stored Procedures terminados en "Admin"
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

DROP PROCEDURE IF EXISTS `loginAdmin`;
DROP PROCEDURE IF EXISTS `modificaEstiloEmpresa`;
DROP PROCEDURE IF EXISTS `dameCategorias`;
DROP PROCEDURE IF EXISTS `dameCategoria`;
DROP PROCEDURE IF EXISTS `cambiarEstadoCategoria`;
DROP PROCEDURE IF EXISTS `altaCategoria`;
DROP PROCEDURE IF EXISTS `modificaCategoria`;
DROP PROCEDURE IF EXISTS `borraCategoria`;
DROP PROCEDURE IF EXISTS `dameVacantesAvanzado`;
DROP PROCEDURE IF EXISTS `dameVacante`;
DROP PROCEDURE IF EXISTS `dameVacanteAdmin`;
DROP PROCEDURE IF EXISTS `altaVacante`;
DROP PROCEDURE IF EXISTS `modificaVacante`;
DROP PROCEDURE IF EXISTS `borraVacante`;
DROP PROCEDURE IF EXISTS `damePostulaciones`;
DROP PROCEDURE IF EXISTS `borraPostulaciones`;
DROP PROCEDURE IF EXISTS `damePostulantes`;

-- ==========================
-- Creación de Procedimientos Almacenados (Admin)
-- ==========================

DELIMITER //
CREATE PROCEDURE `loginAdmin`(
	IN pEmail VARCHAR(256)
)
BEGIN
	SELECT
		a.idAdministrador,
		a.idEmpresa,
		a.email,
		a.clave,
		a.rol,
		e.empresa,
		e.url AS empresaSlug,
		e.estado,
		e.esSistema
	FROM Administradores AS a
	INNER JOIN Empresas AS e ON e.idEmpresa = a.idEmpresa
	WHERE
		a.email = pEmail
		AND e.estado = 'A'
	LIMIT 1;
END//
DELIMITER;

DELIMITER //
CREATE PROCEDURE `modificaEstiloEmpresa`(
	IN pIdEmpresa SMALLINT,
	IN pEstilo JSON
)
BEGIN
	-- Verificar que la empresa existe
	IF NOT EXISTS (
		SELECT 1
		FROM Empresas
		WHERE idEmpresa = pIdEmpresa
	) THEN
		SELECT 'ERROR: La empresa especificada no existe.' AS mensaje;
	ELSE
		-- Actualizar el campo estilo
		UPDATE Empresas
		SET estilo = pEstilo
		WHERE idEmpresa = pIdEmpresa;

		-- Confirmar éxito
		SELECT 'OK' AS mensaje;
	END IF;
END //
DELIMITER;

DELIMITER //
CREATE PROCEDURE `dameCategorias`(
	IN pIdEmpresa SMALLINT,
	IN pEstado CHAR(1)
)
BEGIN
	SELECT
		idCategoria AS id,
		categoria,
		estado,
		orden
	FROM Categorias
	WHERE
		idEmpresa = pIdEmpresa
		AND (pEstado IS NULL OR estado = pEstado)
	ORDER BY
		CASE
			WHEN estado = 'I' THEN 1
			ELSE 0
		END ASC,
		orden ASC,
		idCategoria ASC;
END //
DELIMITER;

DELIMITER //
CREATE PROCEDURE `dameCategoria`(
  IN pIdEmpresa   SMALLINT,
  IN pIdCategoria INT
)
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM Categorias
    WHERE idEmpresa = pIdEmpresa
      AND idCategoria = pIdCategoria
    LIMIT 1
  ) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'CATEGORIA_NO_EXISTE';
  END IF;

  SELECT
    idCategoria AS id,
    categoria,
    orden,
    estado
  FROM Categorias
  WHERE idEmpresa = pIdEmpresa
    AND idCategoria = pIdCategoria
  LIMIT 1;

END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE cambiarEstadoCategoria(
  IN pIdEmpresa SMALLINT,
  IN pIdCategoria INT,
  IN pNuevoEstado CHAR(1)
)
proc: BEGIN
  DECLARE vEstadoActual CHAR(1);

  IF pIdEmpresa IS NULL OR pIdEmpresa <= 0 THEN
    SELECT 'idEmpresa inválido.' AS mensaje;
    LEAVE proc;
  END IF;

  IF pIdCategoria IS NULL OR pIdCategoria <= 0 THEN
    SELECT 'idCategoria inválido.' AS mensaje;
    LEAVE proc;
  END IF;

  IF pNuevoEstado NOT IN ('A', 'I') THEN
    SELECT 'Estado inválido. Use A o I.' AS mensaje;
    LEAVE proc;
  END IF;

  SELECT estado
    INTO vEstadoActual
  FROM Categorias
  WHERE idCategoria = pIdCategoria
    AND idEmpresa = pIdEmpresa
  LIMIT 1;

  IF vEstadoActual IS NULL THEN
    SELECT 'Categoría no encontrada para la empresa.' AS mensaje;
    LEAVE proc;
  END IF;

  IF vEstadoActual = pNuevoEstado THEN
    SELECT
      'La categoría ya estaba en ese estado.' AS mensaje;
    LEAVE proc;
  END IF;

  UPDATE Categorias
  SET estado = pNuevoEstado
  WHERE idCategoria = pIdCategoria
    AND idEmpresa = pIdEmpresa;

  SELECT 'Estado de categoría actualizado.' AS mensaje;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE altaCategoria(
  IN pIdEmpresa SMALLINT,
  IN pCategoria VARCHAR(50)
)
BEGIN
  DECLARE vOrden TINYINT;
  DECLARE vIdCategoria INT;

  SELECT CAST(COALESCE(MAX(orden), 0) + 1 AS UNSIGNED)
    INTO vOrden
  FROM Categorias
  WHERE idEmpresa = pIdEmpresa;

  IF vOrden > 255 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'LIMITE_MAXIMO_CATEGORIAS';
  END IF;

  INSERT INTO Categorias (idEmpresa, categoria, orden)
  VALUES (pIdEmpresa, pCategoria, vOrden);

  SET vIdCategoria = LAST_INSERT_ID();

  SELECT
    idCategoria AS id,
    categoria,
    estado,
    orden
  FROM Categorias
  WHERE idCategoria = vIdCategoria;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE modificaCategoria(
  IN pIdEmpresa SMALLINT,
  IN pIdCategoria INT,
  IN pCategoria VARCHAR(100),
  IN pOrden INT
)
BEGIN
  SET pCategoria = TRIM(pCategoria);

  IF pIdEmpresa IS NULL OR pIdEmpresa <= 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'EMPRESA_INVALIDA';
  END IF;

  IF pIdCategoria IS NULL OR pIdCategoria <= 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'CATEGORIA_ID_INVALIDA';
  END IF;

  IF pCategoria IS NULL OR pCategoria = '' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'CATEGORIA_VACIA';
  END IF;

  IF pOrden IS NULL OR pOrden <= 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ORDEN_INVALIDO';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM Categorias
    WHERE idEmpresa = pIdEmpresa
      AND idCategoria = pIdCategoria
  ) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'CATEGORIA_NO_ENCONTRADA';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM Categorias
    WHERE idEmpresa = pIdEmpresa
      AND LOWER(categoria) = LOWER(pCategoria)
      AND idCategoria <> pIdCategoria
  ) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'CATEGORIA_DUPLICADA';
  END IF;

  UPDATE Categorias
  SET
    categoria = pCategoria,
    orden = pOrden
  WHERE idEmpresa = pIdEmpresa
    AND idCategoria = pIdCategoria;

  SELECT
    idCategoria AS id,
    categoria,
    orden,
    estado
  FROM Categorias
  WHERE idEmpresa = pIdEmpresa
    AND idCategoria = pIdCategoria
  LIMIT 1;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE borraCategoria(
  IN pIdEmpresa SMALLINT,
  IN pIdCategoria INT
)
BEGIN
  DECLARE vEstado CHAR(1);
  DECLARE vTieneVacantes INT DEFAULT 0;

  -- 1) Validar existencia y traer estado
  SELECT c.estado
    INTO vEstado
  FROM Categorias c
  WHERE c.idEmpresa = pIdEmpresa
    AND c.idCategoria = pIdCategoria
  LIMIT 1;

  IF vEstado IS NULL THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'La categoría especificada no existe para esta empresa.';
  END IF;

  -- 2) Validar estado "borrador" (en tu modelo sería Inactiva = 'I')
  IF vEstado <> 'I' THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Solo se puede borrar una categoría en estado Inactiva.';
  END IF;

  -- 3) Validar que no tenga vacantes asociadas
  SELECT 1
    INTO vTieneVacantes
  FROM Vacantes v
  WHERE v.idEmpresa = pIdEmpresa
    AND v.idCategoria = pIdCategoria
  LIMIT 1;

  IF vTieneVacantes = 1 THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'No se puede borrar: la categoría tiene vacantes asociadas.';
  END IF;

  -- 4) Borrar
  DELETE FROM Categorias
  WHERE idEmpresa = pIdEmpresa
    AND idCategoria = pIdCategoria;

  -- void (sin SELECT)
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE dameVacantesAvanzado(
  IN pIdEmpresa  SMALLINT,
  IN pCategoria  VARCHAR(50),
  IN pOffset     INT,
  IN pLimit      INT,
  IN pSortField  VARCHAR(32),
  IN pSortDir    VARCHAR(4)
)
BEGIN
  DECLARE vDir VARCHAR(4);
  DECLARE vOrderCol VARCHAR(64);
  DECLARE vCategoria VARCHAR(50);

  SET vCategoria = NULLIF(TRIM(pCategoria), '');
  SET vDir = IF(UPPER(pSortDir) = 'ASC', 'ASC', 'DESC');

  SET vOrderCol = CASE pSortField
    WHEN 'categoria'        THEN 'c.categoria'
    WHEN 'vacante'          THEN 'v.vacante'
    WHEN 'localidad'        THEN 'v.localidad'
    WHEN 'nivelExperiencia' THEN 'v.nivelExperiencia'
    WHEN 'fechaCreacion'    THEN 'v.fechaCreacion'
    WHEN 'fechaPublicacion' THEN 'v.fechaPublicacion'
    WHEN 'fechaCierre'      THEN 'v.fechaCierre'
    WHEN 'estado'           THEN 'v.estado'
    ELSE 'v.fechaCreacion'
  END;

  /* ====== 1) query de items (paginada) ====== */
  SET @sqlItems = CONCAT(
    'SELECT ',
    '  v.idVacante AS id, ',
    '  c.categoria AS categoria, ',
    '  v.vacante   AS vacante, ',
    '  v.descripcion, ',
    '  v.tipoTrabajo, ',
    '  v.modalidad, ',
    '  v.fechaCreacion, ',
    '  v.fechaPublicacion, ',
    '  v.fechaCierre, ',
    '  v.localidad, ',
    '  v.nivelExperiencia, ',
    '  v.habilidades, ',
    '  v.estado ',
    'FROM Vacantes v ',
    'INNER JOIN Categorias c ',
    '  ON c.idEmpresa = v.idEmpresa ',
    ' AND c.idCategoria = v.idCategoria ',
    'WHERE v.idEmpresa = ? ',
    '  AND (? IS NULL OR c.categoria = ?) ',
    'ORDER BY ', vOrderCol, ' ', vDir, ', v.idVacante DESC ',
    'LIMIT ? OFFSET ?'
  );

  PREPARE stmtItems FROM @sqlItems;

  SET @p1 = pIdEmpresa;
  SET @p2 = vCategoria;
  SET @p3 = vCategoria;
  SET @p4 = pLimit;
  SET @p5 = pOffset;

  EXECUTE stmtItems USING @p1, @p2, @p3, @p4, @p5;
  DEALLOCATE PREPARE stmtItems;

  /* ====== 2) query de count (total) ====== */
  SET @sqlCount = CONCAT(
    'SELECT COUNT(*) AS itemCount ',
    'FROM Vacantes v ',
    'INNER JOIN Categorias c ',
    '  ON c.idEmpresa = v.idEmpresa ',
    ' AND c.idCategoria = v.idCategoria ',
    'WHERE v.idEmpresa = ? ',
    '  AND (? IS NULL OR c.categoria = ?) '
  );

  PREPARE stmtCount FROM @sqlCount;

  /* reutilizamos @p1..@p3 */
  EXECUTE stmtCount USING @p1, @p2, @p3;
  DEALLOCATE PREPARE stmtCount;

END//
DELIMITER ;

-- cambiar
DELIMITER //
CREATE PROCEDURE dameVacante(
  IN pIdEmpresa SMALLINT,
  IN pCategoria VARCHAR(50),
  IN pIdVacante SMALLINT,
  IN pEstadoCategoria CHAR(1),  -- NULL = no filtra
  IN pEstadoVacante  CHAR(1)    -- NULL = no filtra (admin), 'P' para usuario
)
BEGIN
  DECLARE vIdCategoria TINYINT DEFAULT NULL;

  SELECT c.idCategoria
    INTO vIdCategoria
    FROM Categorias c
   WHERE c.idEmpresa = pIdEmpresa
     AND c.categoria = pCategoria
     AND (pEstadoCategoria IS NULL OR c.estado = pEstadoCategoria);

  SELECT
    v.idVacante,
    v.idCategoria,
    c.categoria,
    v.vacante,
    v.descripcion,
    v.tipoTrabajo,
    v.modalidad,
    v.fechaCreacion,
    v.fechaPublicacion,
    v.fechaCierre,
    v.localidad,
    v.nivelExperiencia,
    v.habilidades,
    v.estado
  FROM Vacantes v
  JOIN Categorias c
    ON c.idCategoria = v.idCategoria
   AND c.idEmpresa   = v.idEmpresa
  WHERE v.idEmpresa   = pIdEmpresa
    AND v.idVacante   = pIdVacante
    AND v.idCategoria = vIdCategoria
    AND (pEstadoVacante IS NULL OR v.estado = pEstadoVacante)
  LIMIT 1;
END //
DELIMITER;

DELIMITER //
CREATE PROCEDURE dameVacanteAdmin(
  IN pIdEmpresa SMALLINT,
  IN pIdVacante INT
)
BEGIN
  SELECT
    v.idVacante AS id,
    c.categoria,
    v.vacante,
    v.descripcion,
    v.tipoTrabajo,
    v.modalidad,
    v.fechaCreacion,
    v.fechaPublicacion,
    v.fechaCierre,
    v.localidad,
    v.nivelExperiencia,
    v.habilidades,
    v.estado
  FROM Vacantes v
  INNER JOIN Categorias c
    ON c.idCategoria = v.idCategoria
   AND c.idEmpresa   = v.idEmpresa
  WHERE v.idEmpresa = pIdEmpresa
    AND v.idVacante = pIdVacante
  LIMIT 1;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE altaVacante(
  IN pIdEmpresa   SMALLINT,
  IN pCategoria   VARCHAR(50),
  IN pVacante     VARCHAR(45),
  IN pDescripcion TEXT,
  IN pTipoTrabajo VARCHAR(20),
  IN pModalidad   VARCHAR(20),
  IN pLocalidad   VARCHAR(100),
  IN pNivelExperiencia VARCHAR(20),
  IN pHabilidades JSON,
  IN pEstado      ENUM('P','B','C')
)
BEGIN
  DECLARE vIdCategoria INT DEFAULT NULL;
  DECLARE vIdVacante   INT DEFAULT NULL;
  DECLARE vNow         DATETIME DEFAULT NOW();

  SELECT c.idCategoria
    INTO vIdCategoria
  FROM Categorias c
  WHERE c.idEmpresa = pIdEmpresa
    AND c.categoria = pCategoria
    AND c.estado = 'A';

  IF vIdCategoria IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'CATEGORIA_NO_EXISTE';
  END IF;

  INSERT INTO Vacantes(
    idCategoria, idEmpresa, vacante, descripcion,
    tipoTrabajo, modalidad, fechaCreacion, fechaPublicacion, fechaCierre,
    localidad, nivelExperiencia, habilidades, estado
  ) VALUES (
    vIdCategoria, pIdEmpresa, pVacante, pDescripcion,
    pTipoTrabajo, pModalidad,
    vNow,
    IF(pEstado = 'P', vNow, NULL),
    NULL,
    pLocalidad,
    pNivelExperiencia,
    COALESCE(pHabilidades, JSON_ARRAY()),
    pEstado
  );

  SET vIdVacante = LAST_INSERT_ID();

  SELECT
    v.idVacante AS id,
    c.categoria,
    v.vacante,
    v.descripcion,
    v.tipoTrabajo,
    v.modalidad,
    v.fechaCreacion,
    v.fechaPublicacion,
    v.fechaCierre,
    v.localidad,
    v.nivelExperiencia,
    v.habilidades,
    v.estado
  FROM Vacantes v
  JOIN Categorias c
    ON c.idEmpresa = v.idEmpresa
   AND c.idCategoria = v.idCategoria
  WHERE v.idEmpresa = pIdEmpresa
    AND v.idCategoria = vIdCategoria
    AND v.idVacante = vIdVacante
  LIMIT 1;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE modificaVacante(
  IN pIdEmpresa         SMALLINT,
  IN pIdVacante         INT,

  -- categoría destino (NULL -> no mover)
  IN pCategoriaDestino  VARCHAR(50),

  -- Campos editables (NULL -> no cambiar)
  IN pVacante           VARCHAR(45),
  IN pDescripcion       TEXT,
  IN pTipoTrabajo       ENUM('Sin Especificar','Tiempo Completo','Medio Tiempo','Remoto','Híbrido'),
  IN pModalidad         ENUM('Sin Especificar','Presencial','Remoto','Híbrido'),
  IN pLocalidad         VARCHAR(100),
  IN pNivelExperiencia  ENUM('Junior','SemiSenior','Senior'),
  IN pHabilidades       JSON,

  -- Estado destino opcional: NULL = no cambiar, 'P' o 'C' = cambiar (con fechas)
  IN pEstadoDestino     CHAR(1)
)
proc: BEGIN
  DECLARE vEstadoActual       CHAR(1);
  DECLARE vEstadoDestino      CHAR(1);
  DECLARE vIdCategoriaDestino INT DEFAULT NULL;

  -- 0) Existencia + pertenencia
  SELECT v.estado
    INTO vEstadoActual
  FROM Vacantes v
  WHERE v.idEmpresa = pIdEmpresa
    AND v.idVacante = pIdVacante
  LIMIT 1;

  IF vEstadoActual IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'VACANTE_NO_ENCONTRADA';
  END IF;

  -- 0.1) Resolver categoría destino si vino
  IF pCategoriaDestino IS NOT NULL THEN
    SELECT c.idCategoria
      INTO vIdCategoriaDestino
    FROM Categorias c
    WHERE c.idEmpresa = pIdEmpresa
      AND c.categoria = pCategoriaDestino
    LIMIT 1;

    IF vIdCategoriaDestino IS NULL THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'CATEGORIA_NO_EXISTE';
    END IF;
  END IF;

  -- 1) Estado destino efectivo (si no vino, se mantiene)
  SET vEstadoDestino = IFNULL(pEstadoDestino, vEstadoActual);

  -- 2) Validar estado destino si vino (✅ solo P/C)
  IF pEstadoDestino IS NOT NULL AND pEstadoDestino NOT IN ('P','C') THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ESTADO_INVALIDO';
  END IF;

  -- 3) Validar transición SOLO si hay cambio real
  IF pEstadoDestino IS NOT NULL AND vEstadoDestino <> vEstadoActual THEN
    IF NOT (
      (vEstadoActual = 'B' AND vEstadoDestino = 'P') OR -- publicar
      (vEstadoActual = 'P' AND vEstadoDestino = 'C') OR -- cerrar
      (vEstadoActual = 'C' AND vEstadoDestino = 'P')    -- reabrir
    ) THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'TRANSICION_ESTADO_NO_PERMITIDA';
    END IF;
  END IF;

  -- 4) Update de campos + (opcional) mover categoría + (opcional) update de estado/fechas
  UPDATE Vacantes
  SET
    idCategoria      = COALESCE(vIdCategoriaDestino, idCategoria),

    vacante          = COALESCE(pVacante,          vacante),
    descripcion      = COALESCE(pDescripcion,      descripcion),
    tipoTrabajo      = COALESCE(pTipoTrabajo,      tipoTrabajo),
    modalidad        = COALESCE(pModalidad,        modalidad),
    localidad        = COALESCE(pLocalidad,        localidad),
    nivelExperiencia = COALESCE(pNivelExperiencia, nivelExperiencia),
    habilidades      = COALESCE(pHabilidades,      habilidades),

    estado = CASE
      WHEN pEstadoDestino IS NULL THEN estado
      ELSE vEstadoDestino
    END,

    fechaPublicacion = CASE
      WHEN pEstadoDestino IS NULL THEN fechaPublicacion
      WHEN vEstadoDestino = vEstadoActual THEN fechaPublicacion
      WHEN vEstadoDestino = 'P' AND vEstadoActual <> 'P' THEN NOW()
      ELSE fechaPublicacion
    END,

    fechaCierre = CASE
      WHEN pEstadoDestino IS NULL THEN fechaCierre
      WHEN vEstadoDestino = vEstadoActual THEN fechaCierre
      WHEN vEstadoDestino = 'C' AND vEstadoActual <> 'C' THEN NOW()
      WHEN vEstadoDestino = 'P' AND vEstadoActual <> 'P' THEN NULL
      ELSE fechaCierre
    END
  WHERE idEmpresa = pIdEmpresa
    AND idVacante = pIdVacante;

  -- 5) Devolver VacanteAdmin (con categoria actual)
  SELECT
    v.idVacante AS id,
    c.categoria,
    v.vacante,
    v.descripcion,
    v.tipoTrabajo,
    v.modalidad,
    v.fechaCreacion,
    v.fechaPublicacion,
    v.fechaCierre,
    v.localidad,
    v.nivelExperiencia,
    v.habilidades,
    v.estado
  FROM Vacantes v
  INNER JOIN Categorias c
    ON c.idCategoria = v.idCategoria
   AND c.idEmpresa   = v.idEmpresa
  WHERE v.idEmpresa = pIdEmpresa
    AND v.idVacante = pIdVacante
  LIMIT 1;

END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE borraVacante(
  IN pIdEmpresa SMALLINT,
  IN pIdVacante INT
)
BEGIN
  DECLARE vEstado CHAR(1);
  DECLARE vTienePostulaciones INT DEFAULT 0;

  SELECT v.estado
    INTO vEstado
  FROM Vacantes v
  WHERE v.idEmpresa = pIdEmpresa
    AND v.idVacante = pIdVacante
  LIMIT 1;

  IF vEstado IS NULL THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'La vacante no existe para esta empresa.';
  END IF;

  IF vEstado <> 'B' THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Solo se puede borrar una vacante en estado Borrador.';
  END IF;

  SELECT 1
    INTO vTienePostulaciones
  FROM Postulaciones p
  WHERE p.idEmpresa = pIdEmpresa
    AND p.idVacante = pIdVacante
  LIMIT 1;

  IF vTienePostulaciones = 1 THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'No se puede borrar: la vacante tiene postulaciones asociadas.';
  END IF;

  DELETE FROM Vacantes
  WHERE idEmpresa = pIdEmpresa
    AND idVacante = pIdVacante;

END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE damePostulaciones(
  IN pIdEmpresa    SMALLINT,
  IN pIdVacante    INT,
  IN pIdPostulante CHAR(28)
)
proc: BEGIN
  IF (pIdVacante IS NULL AND pIdPostulante IS NULL)
     OR (pIdVacante IS NOT NULL AND pIdPostulante IS NOT NULL) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'FILTRO_INVALIDO_POSTULACIONES';
  END IF;

  -- Caso: por postulante
  IF pIdPostulante IS NOT NULL THEN
    SELECT
      po.idPostulacion AS id,
      po.idPostulante  AS idPostulante,
      v.vacante        AS vacante,
      CONCAT(p.apellidos, ', ', p.nombres) AS postulante,
      po.fechaPostulacion AS fechaPostulacion,
      p.localidad      AS localidadPostulante
    FROM Postulaciones po
    INNER JOIN Vacantes v
      ON v.idEmpresa = po.idEmpresa
     AND v.idVacante = po.idVacante
    INNER JOIN Postulantes p
      ON p.idPostulante = po.idPostulante
    WHERE
      po.idEmpresa = pIdEmpresa
      AND po.idPostulante = pIdPostulante
    ORDER BY
      po.fechaPostulacion DESC,
      po.idPostulacion DESC;

    LEAVE proc;
  END IF;

  -- Caso: por vacante
  SELECT
    po.idPostulacion AS id,
    po.idPostulante  AS idPostulante,
    v.vacante        AS vacante,
    CONCAT(p.apellidos, ', ', p.nombres) AS postulante,
    po.fechaPostulacion AS fechaPostulacion,
    p.localidad      AS localidadPostulante
  FROM Postulaciones po
  INNER JOIN Vacantes v
    ON v.idEmpresa = po.idEmpresa
   AND v.idVacante = po.idVacante
  INNER JOIN Postulantes p
    ON p.idPostulante = po.idPostulante
  WHERE
    po.idEmpresa = pIdEmpresa
    AND po.idVacante = pIdVacante
  ORDER BY
    po.fechaPostulacion DESC,
    po.idPostulacion DESC;
END //
DELIMITER ;

DELIMITER //

CREATE PROCEDURE damePostulantes(
  IN pIdEmpresa SMALLINT
)
BEGIN
  SELECT
    p.idPostulante AS id,
    p.nombres,
    p.apellidos,
    p.email,
    p.cuil,
    p.fechaNacimiento,
    p.genero,
    p.localidad,
    p.telefono,
    p.observaciones,
    p.estado
  FROM Postulantes p
  WHERE EXISTS (
    SELECT 1
    FROM Postulaciones po
    WHERE po.idEmpresa = pIdEmpresa
      AND po.idPostulante = p.idPostulante
  )
  ORDER BY
    p.fechaNacimiento DESC,
    p.idPostulante ASC;
END //

DELIMITER ;

-- ==========================
-- Fin del script de procedimientos "Admin"
-- ==========================
SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;