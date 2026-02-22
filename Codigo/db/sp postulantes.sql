-- ===================================================
-- Script con Stored Procedures terminados en "Postulante"
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
DROP PROCEDURE IF EXISTS `dameCurriculum`;
DROP PROCEDURE IF EXISTS `altaCurriculum`;
DROP PROCEDURE IF EXISTS `dameCurriculumPorPostulacion`;
DROP PROCEDURE IF EXISTS `dameMisPostulaciones`;
DROP PROCEDURE IF EXISTS `altaPostulacion`;
DROP PROCEDURE IF EXISTS `borraPostulacion`;
DROP PROCEDURE IF EXISTS `damePostulante`;
DROP PROCEDURE IF EXISTS `modificaPostulante`;

DELIMITER //

CREATE PROCEDURE dameCurriculum(
  IN pIdPostulante CHAR(28)
)
BEGIN
  DECLARE vNombre VARCHAR(50);
  DECLARE vPdf MEDIUMBLOB;

  SELECT c.curriculum, c.pdf
    INTO vNombre, vPdf
  FROM Curriculums c
  WHERE c.idPostulante = pIdPostulante
    AND c.estado = 'A'
  LIMIT 1;

  IF vNombre IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'CURRICULUM_NO_EXISTE';
  END IF;

  SELECT 'OK' AS mensaje, vNombre AS nombre, vPdf AS pdf;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE altaCurriculum(
  IN pIdPostulante CHAR(28),
  IN pCurriculum VARCHAR(50),
  IN pHash CHAR(64),
  IN pPdf MEDIUMBLOB
)
BEGIN
  -- Intentar actualizar primero (si ya existe 0..1 por postulante)
  UPDATE Curriculums
     SET curriculum = pCurriculum,
         fecha      = NOW(),
         estado     = 'A',
         pdf        = IF(hash = pHash, pdf, pPdf),
         hash       = pHash
   WHERE idPostulante = pIdPostulante;

  -- Si no existía, insertar
  IF ROW_COUNT() = 0 THEN
    INSERT INTO Curriculums (idPostulante, curriculum, fecha, hash, pdf, estado)
    VALUES (pIdPostulante, pCurriculum, NOW(), pHash, pPdf, 'A');
  END IF;

  SELECT 'OK' AS mensaje;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE dameCurriculumPorPostulacion(
  IN pIdEmpresa SMALLINT,
  IN pIdPostulacion INT
)
proc: BEGIN
  DECLARE vNombre VARCHAR(50);
  DECLARE vPdf MEDIUMBLOB;

  SELECT c.curriculum, c.pdf
    INTO vNombre, vPdf
  FROM Postulaciones po
  JOIN Curriculums c
    ON c.idCurriculum = po.idCurriculum
  WHERE po.idPostulacion = pIdPostulacion
    AND po.idEmpresa = pIdEmpresa
    AND c.estado = 'A'
  LIMIT 1;

  -- Si no existe, puede ser: (a) postulación no es de esa empresa (b) no existe la postulación
  -- (c) curriculum inactivo/no existe.
  IF vNombre IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'CURRICULUM_NO_EXISTE';
  END IF;

  SELECT 'OK' AS mensaje, vNombre AS nombre, vPdf AS pdf;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE altaPostulacion(
  IN pIdEmpresa SMALLINT,
  IN pIdVacante INT,
  IN pIdPostulante CHAR(28)
)
proc: BEGIN
  DECLARE vIdPostulacion INT;

  START TRANSACTION;

  INSERT INTO Postulaciones (
    idCurriculum, idPostulante, idVacante, idEmpresa, fechaPostulacion, estado
  )
  SELECT
    c.idCurriculum,
    p.idPostulante,
    v.idVacante,
    v.idEmpresa,
    NOW(),
    '0'
  FROM Vacantes v
  JOIN Postulantes p
    ON p.idPostulante = pIdPostulante
  JOIN Curriculums c
    ON c.idPostulante = p.idPostulante
   AND c.estado = 'A'
  WHERE v.idVacante = pIdVacante
    AND v.idEmpresa = pIdEmpresa
    AND v.estado = 'P'
    AND (v.fechaCierre IS NULL OR v.fechaCierre >= NOW())
  LIMIT 1;

  IF ROW_COUNT() = 0 THEN
    ROLLBACK;
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'NO_SE_PUDO_POSTULAR';
  END IF;

  SET vIdPostulacion = LAST_INSERT_ID();
  COMMIT;

  SELECT
    p.idPostulacion        AS id,
    p.idVacante            AS idVacante,
    v.vacante              AS titulo,
    c.categoria            AS categoria,
    DATE_FORMAT(p.fechaPostulacion, '%d/%m/%Y %H:%i:%s') AS fecha,
    v.estado               AS estado
  FROM Postulaciones p
  INNER JOIN Vacantes v
    ON v.idEmpresa = p.idEmpresa
   AND v.idVacante = p.idVacante
  INNER JOIN Categorias c
    ON c.idEmpresa = v.idEmpresa
   AND c.idCategoria = v.idCategoria
  WHERE p.idPostulacion = vIdPostulacion;

END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE dameMisPostulaciones(
  IN pIdEmpresa INT,
  IN pIdPostulante CHAR(28)
)
BEGIN
  SELECT
    p.idPostulacion        AS id,
    p.idVacante            AS idVacante,
    v.vacante              AS titulo,
    c.categoria            AS categoria,
    DATE_FORMAT(p.fechaPostulacion, '%d/%m/%Y %H:%i:%s') AS fecha,
    v.estado               AS estado
  FROM Postulaciones p
  INNER JOIN Vacantes v
    ON v.idEmpresa = p.idEmpresa
   AND v.idVacante = p.idVacante
  INNER JOIN Categorias c
    ON c.idEmpresa = v.idEmpresa
   AND c.idCategoria = v.idCategoria
  WHERE p.idEmpresa = pIdEmpresa
    AND p.idPostulante = pIdPostulante
  ORDER BY p.fechaPostulacion DESC;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE borraPostulacion(
  IN pIdEmpresa SMALLINT,
  IN pIdPostulacion INT,
  IN pIdPostulante CHAR(28)
)
proc: BEGIN
  START TRANSACTION;

  DELETE FROM Postulaciones
  WHERE idEmpresa = pIdEmpresa
    AND idPostulacion = pIdPostulacion
    AND idPostulante = pIdPostulante;

  IF ROW_COUNT() = 0 THEN
    ROLLBACK;
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'POSTULACION_NO_EXISTE';
  END IF;

  COMMIT;
END //

DELIMITER ;

DELIMITER //
CREATE PROCEDURE damePostulante(
  IN pIdPostulante CHAR(28)
)
BEGIN
  SELECT
    idPostulante as id,
    nombres,
    apellidos,
    email,
    cuil,
    genero,
    fechaNacimiento,
    localidad,
    telefono,
    COALESCE(habilidades, JSON_ARRAY()) AS habilidades
  FROM Postulantes
  WHERE idPostulante = pIdPostulante;
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
  IN pTelefono VARCHAR(15),
  IN pHabilidades JSON
)
sp: BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM Postulantes
    WHERE idPostulante = pIdPostulante
      AND estado = 'A'
  ) THEN
    SELECT 'El postulante no existe o no está activo.' AS mensaje;
    LEAVE sp;
  END IF;

  IF pHabilidades IS NOT NULL THEN
    IF JSON_VALID(pHabilidades) = 0 THEN
      SELECT 'HABILIDADES_INVALIDAS' AS mensaje;
      LEAVE sp;
    END IF;

    IF JSON_TYPE(pHabilidades) <> 'ARRAY' THEN
      SELECT 'HABILIDADES_DEBE_SER_ARRAY' AS mensaje;
      LEAVE sp;
    END IF;
  END IF;

  UPDATE Postulantes
  SET
    nombres     = COALESCE(pNombres, nombres),
    apellidos   = COALESCE(pApellidos, apellidos),
    cuil        = COALESCE(pCuil, cuil),
    genero      = COALESCE(pGenero, genero),
    localidad   = COALESCE(pLocalidad, localidad),
    telefono    = COALESCE(pTelefono, telefono),
    habilidades = COALESCE(pHabilidades, habilidades)
  WHERE idPostulante = pIdPostulante
    AND estado = 'A';

  SELECT 'OK' AS mensaje;
END //
DELIMITER ;