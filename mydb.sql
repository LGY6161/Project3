-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`professor_tbl`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`professor_tbl` ;

CREATE TABLE IF NOT EXISTS `mydb`.`professor_tbl` (
  `p_no` INT NOT NULL,
  `p_name` VARCHAR(45) NULL DEFAULT NULL,
  `p_psw` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`p_no`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`student_tbl`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`student_tbl` ;

CREATE TABLE IF NOT EXISTS `mydb`.`student_tbl` (
  `s_no` INT NOT NULL,
  `s_name` VARCHAR(45) NULL DEFAULT NULL,
  `s_pwd` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`s_no`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`attend_tbl`
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS `mydb`.`attend_tbl` (
  `s_no` INT NOT NULL,
  `sub_code` VARCHAR(5) NULL DEFAULT NULL,
  `p_no` INT NOT NULL,
  `att_grade` INT NULL DEFAULT '0',
  PRIMARY KEY (`s_no`, `p_no`),
  INDEX `fk_attend_p_no_idx` (`p_no` ASC) VISIBLE,
  CONSTRAINT `fk_attend_p_no`
    FOREIGN KEY (`p_no`)
    REFERENCES `mydb`.`professor_tbl` (`p_no`),
  CONSTRAINT `fk_attend_s_no`
    FOREIGN KEY (`s_no`)
    REFERENCES `mydb`.`student_tbl` (`s_no`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`lecture_tbl`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`lecture_tbl` ;

CREATE TABLE IF NOT EXISTS `mydb`.`lecture_tbl` (
  `l_id` INT NOT NULL,
  `l_name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`l_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`board_tbl`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`board_tbl` ;

CREATE TABLE IF NOT EXISTS `mydb`.`board_tbl` (
  `b_id` INT NOT NULL AUTO_INCREMENT,
  `lecture_id` INT NULL,
  `crator_id` INT NOT NULL,
  `b_title` VARCHAR(150) NOT NULL,
  `content` TEXT NOT NULL,
  PRIMARY KEY (`b_id`),
  INDEX `fd_board_crator_id_idx` (`crator_id` ASC) VISIBLE,
  INDEX `fkl_board_lecture_id_idx` (`lecture_id` ASC) VISIBLE,
  CONSTRAINT `fk_board_crator_id`
    FOREIGN KEY (`crator_id`)
    REFERENCES `mydb`.`professor_tbl` (`p_no`),
  CONSTRAINT `fkl_board_lecture_id`
    FOREIGN KEY (`lecture_id`)
    REFERENCES `mydb`.`lecture_tbl` (`l_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`score_tbl`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`score_tbl` ;

CREATE TABLE IF NOT EXISTS `mydb`.`score_tbl` (
  `s_no` INT NOT NULL,
  PRIMARY KEY (`s_no`),
  CONSTRAINT `fk_score_s_no`
    FOREIGN KEY (`s_no`)
    REFERENCES `mydb`.`student_tbl` (`s_no`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
