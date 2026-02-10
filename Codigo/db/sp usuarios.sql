-- ===================================================
-- Script con Stored Procedures terminados en "Usuario"
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
DROP PROCEDURE IF EXISTS `dameEmpresaPorSlug`;
DROP PROCEDURE IF EXISTS `dameEstiloEmpresa`;
DROP PROCEDURE IF EXISTS `dameLogoEmpresaUsuario`;
DROP PROCEDURE IF EXISTS `dameNombreEmpresaUsuario`;
DROP PROCEDURE IF EXISTS `dameFaviconEmpresaUsuario`;
DROP PROCEDURE IF EXISTS `dameVacantePostulante`;
DROP PROCEDURE IF EXISTS `dameVacantes`;
DROP PROCEDURE IF EXISTS `altaPostulacionUsuario`;
DROP PROCEDURE IF EXISTS `modificaPostulante`;
DROP PROCEDURE IF EXISTS `loginUsuario`;
DROP PROCEDURE IF EXISTS `altaPostulante`;
DROP PROCEDURE IF EXISTS `cambiarClaveUsuario`;

-- ==========================
-- Creación de Procedimientos Almacenados (Usuario)
-- ==========================

DELIMITER //
CREATE PROCEDURE dameEmpresaPorSlug(IN pURL VARCHAR(100))
BEGIN
  SELECT
    e.idEmpresa AS idEmpresa,
    e.estado   AS estado
  FROM Empresas e
  WHERE e.url = pURL
  LIMIT 1;
END//
DELIMITER ;


DELIMITER //
CREATE PROCEDURE `dameEstiloEmpresa`(
	IN pIdEmpresa SMALLINT
)
BEGIN
	SELECT estilo FROM Empresas
	WHERE idEmpresa = pIdEmpresa;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE `dameLogoEmpresaUsuario`(
	IN pIdEmpresa SMALLINT
)
BEGIN
	SELECT logo FROM Empresas
	WHERE idEmpresa = pIdEmpresa;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE `dameNombreEmpresaUsuario`(
	IN pIdEmpresa SMALLINT
)
BEGIN
	SELECT empresa
	FROM Empresas
	WHERE idEmpresa = pIdEmpresa;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE `dameFaviconEmpresaUsuario`(
	IN pIdEmpresa SMALLINT
)
BEGIN
	SELECT favicon FROM Empresas
	WHERE idEmpresa = pIdEmpresa;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE dameVacantePostulante(
  IN pIdEmpresa SMALLINT,
  IN pIdVacante INT
)
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM Vacantes v
    INNER JOIN Categorias c
      ON c.idCategoria = v.idCategoria
     AND c.idEmpresa   = v.idEmpresa
    WHERE v.idEmpresa = pIdEmpresa
      AND v.idVacante = pIdVacante
      AND v.estado    = 'P'
      AND c.estado    = 'A'
  ) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'VACANTE_NO_ENCONTRADA';
  END IF;

  SELECT
    v.idVacante AS id,
    c.categoria,
    v.vacante AS titulo,
    v.descripcion,
    v.tipoTrabajo,
    v.modalidad,
    v.fechaPublicacion,
    v.localidad,
    v.nivelExperiencia,
    v.habilidades
  FROM Vacantes v
  INNER JOIN Categorias c
    ON c.idCategoria = v.idCategoria
   AND c.idEmpresa   = v.idEmpresa
  WHERE v.idEmpresa = pIdEmpresa
    AND v.idVacante = pIdVacante
    AND v.estado    = 'P'
    AND c.estado    = 'A'
  LIMIT 1;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE dameVacantes(
  IN pIdEmpresa SMALLINT,
  IN pCategoria VARCHAR(50),
  IN pOffset    INT,
  IN pLimit     INT,
  IN pTitulo    VARCHAR(100)
)
BEGIN
  DECLARE vCategoria VARCHAR(50);
  DECLARE vTituloVac VARCHAR(100);
  DECLARE vOffset INT;
  DECLARE vLimit  INT;

  SET vCategoria = NULLIF(TRIM(pCategoria), '');
  SET vTituloVac = NULLIF(TRIM(pTitulo), '');

  -- offset default 0
  SET vOffset = IFNULL(pOffset, 0);
  IF vOffset < 0 THEN SET vOffset = 0; END IF;

  -- limit default 25, clamp 1..100
  SET vLimit = IFNULL(pLimit, 25);
  IF vLimit < 1 THEN SET vLimit = 25; END IF;
  IF vLimit > 100 THEN SET vLimit = 100; END IF;

  -- 1) items paginados
  SELECT
    v.idVacante AS id,
    c.categoria AS categoria,
    v.vacante   AS titulo,
    v.descripcion,
    v.tipoTrabajo,
    v.modalidad,
    v.fechaPublicacion,
    v.localidad,
    v.nivelExperiencia,
    v.habilidades
  FROM Vacantes v
  INNER JOIN Categorias c USING (idCategoria, idEmpresa)
  WHERE
    v.idEmpresa = pIdEmpresa
    AND v.estado = 'P'
    AND c.estado = 'A'
    AND (vCategoria IS NULL OR c.categoria = vCategoria)
    AND (vTituloVac IS NULL OR v.vacante LIKE CONCAT('%', vTituloVac, '%'))
  ORDER BY
    v.fechaPublicacion DESC,
    v.idVacante        DESC
  LIMIT vLimit OFFSET vOffset;

  -- 2) total
  SELECT COUNT(*) AS itemCount
  FROM Vacantes v
  INNER JOIN Categorias c USING (idCategoria, idEmpresa)
  WHERE
    v.idEmpresa = pIdEmpresa
    AND v.estado = 'P'
    AND c.estado = 'A'
    AND (vCategoria IS NULL OR c.categoria = vCategoria)
    AND (vTituloVac IS NULL OR v.vacante LIKE CONCAT('%', vTituloVac, '%'));
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE `altaPostulacionUsuario`(
	IN pIdCurriculum TINYINT,
	IN pIdPostulante INT,
	IN pIdVacante SMALLINT,
	IN pIdCategoria TINYINT,
	IN pIdEmpresa SMALLINT
)
BEGIN
	DECLARE newIdPostulacion INT;

	IF NOT EXISTS (
		SELECT 1
		FROM vacantess
		WHERE
			idEmpresa = pIdEmpresa
			AND idVacante = pIdVacante
			AND idCategoria = pIdCategoria
			-- me parece que este AND idCategoria debería estar antes, es más probable que tengamos más
			-- pocas categorias y muchas vacantes que al reves.
			AND estado = 'P'
			-- esto también me parece redundante.
			--  El sitio YA muestra las vacantes sólo con estado 'P'
	) THEN
		SIGNAL SQLSTATE '45000'
		SET MESSAGE_TEXT = 'La vacante especificada no existe o no está publicada.';
	END IF;

	IF EXISTS (
		SELECT 1
		FROM Postulaciones
		WHERE
			idEmpresa = pIdEmpresa
			AND idPostulante = pIdPostulante
			AND idVacante = pIdVacante
			AND idCategoria = pIdCategoria
			AND idCurriculum = pIdCurriculum
	) THEN
		SIGNAL SQLSTATE '45000'
		SET MESSAGE_TEXT = 'Ya existe una postulación para esta vacante con el curriculum especificado.';
	END IF;

	SELECT
		COALESCE(MAX(idPostulacion), 0) + 1
	INTO
		newIdPostulacion
	FROM
		Postulaciones
	WHERE
		idEmpresa = pIdEmpresa
		AND idPostulante = pIdPostulante;

	INSERT INTO Postulaciones (
		idPostulacion, idPostulante, idVacante, idCategoria, idEmpresa, idCurriculum, fechaPostulacion
	) VALUES (
		newIdPostulacion, pIdPostulante, pIdVacante, pIdCategoria, pIdEmpresa, pIdCurriculum, CURDATE()
	);

	SELECT 'OK' AS mensaje, newIdPostulacion AS idPostulacion;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE `modificaPostulante`(
  IN pIdPostulante CHAR(28),
  IN pNombres VARCHAR(100),
  IN pApellidos VARCHAR(100),
  IN pCuil CHAR(11),
  IN pGenero ENUM('M','F','X'),
  IN pLocalidad VARCHAR(100),
  IN pTelefono VARCHAR(15)
)
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM Postulantes
    WHERE idPostulante = pIdPostulante
      AND estado = 'A'
  ) THEN
    SELECT 'El postulante no existe o no está activo.' AS mensaje;
  ELSE
    UPDATE Postulantes
    SET
      nombres    = COALESCE(pNombres, nombres),
      apellidos  = COALESCE(pApellidos, apellidos),
      cuil       = COALESCE(pCuil, cuil),
      genero     = COALESCE(pGenero, genero),
      localidad  = COALESCE(pLocalidad, localidad),
      telefono   = COALESCE(pTelefono, telefono)
    WHERE idPostulante = pIdPostulante
      AND estado = 'A';

    SELECT 'OK' AS mensaje;
  END IF;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE `loginUsuario`(
	IN pIdEmpresa SMALLINT,
	IN pEmail VARCHAR(256)
)
BEGIN
	-- Declarar variables locales
	DECLARE pId INT;
	DECLARE pClave CHAR(60);

	-- Intentar recuperar el usuario
	SELECT idPostulante, clave
	INTO pId, pClave
	FROM Postulantes
	WHERE
		idEmpresa = pIdEmpresa
		AND email = pEmail
		AND estado = 'A'
	LIMIT 1;

	-- Verificar si se obtuvo algo
	IF pId IS NULL THEN
		SELECT 'No existe un usuario con ese correo' AS mensaje,
			NULL AS id,
			NULL AS clave;
	ELSE
		SELECT 'OK' AS mensaje,
			pId AS id,
			pClave AS claveHasheada;
	END IF;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE altaPostulante(
  IN pIdPostulante CHAR(28),
  IN pNombres VARCHAR(100),
  IN pApellidos VARCHAR(100),
  IN pEmail VARCHAR(256),
  IN pGenero ENUM('M','F','X'),
  IN pFechaNacimiento DATE
)
BEGIN
  INSERT INTO Postulantes
    (idPostulante, nombres, apellidos, email, genero, fechaNacimiento)
  VALUES
    (pIdPostulante, pNombres, pApellidos, pEmail, pGenero, pFechaNacimiento);

  SELECT 'OK' AS mensaje;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE cambiarClaveUsuario (
	IN pIdEmpresa SMALLINT,
	IN pEmail VARCHAR(256),
	IN pClaveHasheada VARCHAR(60)
)
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM Postulantes
		WHERE
			email = pEmail
			AND idEmpresa = pIdEmpresa
	) THEN
		SELECT 'No se encontró ningún usuario con el email especificado' AS mensaje;
	ELSE
		UPDATE Postulantes
			SET clave = pClaveHasheada
		WHERE
			email = pEmail
			AND idEmpresa = pIdEmpresa;

		SELECT 'Contraseña actualizada correctamente' AS mensaje;
	END IF;
END //
DELIMITER ;

-- ==========================
-- Fin del script de procedimientos "Usuario"
-- ==========================
SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;
